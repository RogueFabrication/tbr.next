import { NextRequest } from 'next/server';
import { ok, badRequest } from '../../../../lib/http';

export async function POST(request: NextRequest) {
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
      return badRequest('Invalid admin token');
    }

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
    return badRequest('Invalid request');
  }
}
