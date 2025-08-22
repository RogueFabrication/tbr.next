import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/__debug')) {
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      // Development bypass - allow access
      return NextResponse.next();
    }

    // Production authentication
    const adminToken = process.env.ADMIN_TOKEN;
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check for admin token in cookie
    const adminCookie = request.cookies.get('admin_token');
    if (adminCookie?.value === adminToken) {
      return NextResponse.next();
    }

    // Check for admin token in URL parameter (one-time access)
    const urlToken = request.nextUrl.searchParams.get('admin');
    if (urlToken === adminToken) {
      const response = NextResponse.next();
      // Set cookie for future requests
      response.cookies.set('admin_token', adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      return response;
    }

    // Redirect to login if no valid token
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/__debug/:path*']
};

