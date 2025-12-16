import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listProductIds } from "../../../../lib/data";
import { mergeWithOverlay, info } from "../../../../lib/adminStore";
import { badRequest } from "../../../../lib/http";
import { getClientId, ratelimitAdminRead, enforceRateLimit } from "../../../../lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_COOKIE_NAME = "admin_token";

function isAuthorized(request: NextRequest): boolean {
  const envToken = process.env.ADMIN_TOKEN?.trim();
  if (!envToken) return false;
  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return cookieToken === envToken;
}

/**
 * GET /api/admin/products
 * Returns an array of products. Shape is { ok: true, data: [...] } to match admin client.
 */
export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return badRequest("Not authorized");
    }

    const clientId = getClientId(request);
    const rateLimitResult = await enforceRateLimit(ratelimitAdminRead, [
      "admin_api_read",
      clientId,
      "products_list",
    ]);
    if (!rateLimitResult.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimitResult.retryAfter ?? 60) },
        },
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