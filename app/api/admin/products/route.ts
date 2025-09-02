import { NextResponse } from "next/server";
// Use relative import to avoid alias resolution issues in server bundle
import { getAll } from "../../../../lib/adminStore";

// Keep parity with the dynamic route: Node runtime + no caching
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/products
 * Returns the merged admin dataset (base + overlay).
 * Useful for local debugging and verifying edits from the Admin UI.
 */
export async function GET() {
  const data = getAll();
  return NextResponse.json({ ok: true, data });
}
