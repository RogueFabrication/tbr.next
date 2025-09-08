import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Lightweight ping to verify the server is up.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    ts: new Date().toISOString(),
    env: {
      vercel: process.env.VERCEL === "1" ? "1" : "0",
      node: process.version,
    },
  });
}
