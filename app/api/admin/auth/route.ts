import { NextRequest } from 'next/server';
import { ok, badRequest } from '../../../../lib/http';
import {
  getClientIp,
  getClientId,
  ratelimitAuth,
  enforceRateLimit,
  checkAuthLockout,
  recordAuthFailure,
  clearAuthFailures,
} from '../../../../lib/rateLimit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const clientId = getClientId(request);

  // Check for lockout first
  const lockoutSeconds = await checkAuthLockout(clientId);
  if (lockoutSeconds !== null) {
    return Response.json(
      { error: 'Too many attempts' },
      {
        status: 429,
        headers: {
          'Retry-After': String(lockoutSeconds),
        },
      },
    );
  }

  // Apply rate limiting
  const rateLimitResult = await enforceRateLimit(ratelimitAuth, [
    'admin_auth',
    clientId,
  ]);
  if (!rateLimitResult.ok) {
    return Response.json(
      { error: 'Too many attempts' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitResult.retryAfter ?? 60),
        },
      },
    );
  }

  try {
    const { token } = await request.json();

    if (!token) {
      return badRequest('Token is required');
    }

    const adminToken = process.env.ADMIN_TOKEN;
    if (!adminToken) {
      return badRequest('Admin token not configured');
    }

    if (token !== adminToken) {
      // Record failed attempt
      await recordAuthFailure(clientId);
      return badRequest('Invalid credentials');
    }

    // Clear failure counter on success
    await clearAuthFailures(clientId);

    const response = ok({ message: 'Authentication successful' });
    
    // Set admin token cookie
    response.cookies.set('admin_token', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch {
    await recordAuthFailure(clientId);
    return badRequest('Invalid credentials');
  }
}
