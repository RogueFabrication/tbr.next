import { NextResponse } from "next/server";
import { listProductIds } from "../../../../lib/data";
import { mergeWithOverlay, info } from "../../../../lib/adminStore";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_COOKIE_NAME = "admin_token";

function isAuthorized(): boolean {
  const envToken = process.env.ADMIN_TOKEN?.trim();
  if (!envToken) return false;

  const cookieToken = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return cookieToken === envToken;
}

/**
 * GET /api/admin/products
 * Returns an array of products. Shape is { ok: true, data: [...] } to match admin client.
 */
export async function GET() {
  try {
    if (!isAuthorized()) {
      return NextResponse.json(
        { ok: false, error: "Not authorized", data: [] },
        { status: 401 },
      );
    }

    const base = await listProductIds(); // [{id}]
    const merged = mergeWithOverlay(base);
    return NextResponse.json({ ok: true, data: merged, debug: { baseCount: base.length, ...info() } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg, data: [] }, { status: 500 });
  }
}