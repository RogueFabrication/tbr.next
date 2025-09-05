/**
 * Simple routing sanity check.
 * GET /api/_debug/ping  -> { ok: true, route: "/api/_debug/ping" }
 */
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/_debug/ping",
    ts: Date.now(),
  });
}
