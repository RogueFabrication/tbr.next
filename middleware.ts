import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Production guard for Admin API.
 * - Blocks ALL /api/admin/* requests on Vercel/production with 403.
 * - Allows locally (dev server).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Only guard admin routes
  if (!pathname.startsWith("/api/admin")) return NextResponse.next();

  // "Production-like" detection:
  // - Vercel sets VERCEL='1'
  // - NODE_ENV === 'production' for prod/preview builds
  const vercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
  const prod = process.env.NODE_ENV === "production";
  const isProdLike = vercel || prod;

  if (isProdLike) {
    return NextResponse.json(
      { error: "Admin endpoints are disabled in this environment." },
      { status: 403 },
    );
  }
  return NextResponse.next();
}

// Run only for admin API paths
export const config = {
  matcher: ["/api/admin/:path*"],
};
