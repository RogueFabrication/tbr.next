import { NextResponse } from "next/server";
import { listProductIds } from "../../../../lib/data";
import { mergeWithOverlay, info } from "../../../../lib/adminStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/products
 * Returns an array of products. Shape is { ok: true, data: [...] } to match admin client.
 */
export async function GET() {
  try {
    const base = await listProductIds(); // [{id}]
    const merged = mergeWithOverlay(base);
    return NextResponse.json({ ok: true, data: merged, debug: { baseCount: base.length, ...info() } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg, data: [] }, { status: 500 });
  }
}