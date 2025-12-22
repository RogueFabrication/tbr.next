// app/api/admin/products/[id]/publish/route.ts
import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../../../../lib/http";
import {
  getClientId,
  ratelimitAdminWrite,
  enforceRateLimit,
} from "../../../../../../lib/rateLimit";
import { publishCurrentDraft } from "../../../../../../lib/productVersionsRepo";

const ADMIN_COOKIE_NAME = "admin_token";

function isAuthorized(request: NextRequest): boolean {
  const envToken = process.env.ADMIN_TOKEN?.trim();
  if (!envToken) return false;
  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return cookieToken === envToken;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAuthorized(request)) {
    return badRequest("Not authorized");
  }

  const productId = params?.id;
  if (!productId) {
    return badRequest("Missing product id");
  }

  const clientId = getClientId(request);
  const rateLimitResult = await enforceRateLimit(ratelimitAdminWrite, [
    "admin_api_write",
    clientId,
    "product_publish",
    productId,
  ]);
  if (!rateLimitResult.ok) {
    return Response.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimitResult.retryAfter ?? 60) },
      },
    );
  }

  const actor = `admin:${clientId}`;

  try {
    const { publishedVersionId, version } = await publishCurrentDraft({
      productId,
      actor,
    });
    return ok({
      publishedVersionId,
      productId,
      version,
      publishedAt: new Date().toISOString(),
      actor,
    });
  } catch (err: any) {
    if (err?.message === "NO_DRAFT") {
      return badRequest("No draft exists for this product");
    }
    console.error("[product_versions] Failed to publish:", err);
    return badRequest("Failed to publish to Neon");
  }
}

