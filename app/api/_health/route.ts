import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/_health
 * Lightweight ping to verify server is up (useful for quick diagnostics).
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
