// app/api/admin/products/[id]/route.ts
import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../../../lib/http";
import {
  getBenderOverlay,
  upsertBenderOverlay,
  type BenderOverlayInput,
} from "../../../../../lib/benderOverlayRepo";
import {
  getClientId,
  ratelimitAdmin,
  enforceRateLimit,
} from "../../../../../lib/rateLimit";

const ADMIN_COOKIE_NAME = "admin_token";

function isAuthorized(request: NextRequest): boolean {
  const envToken = process.env.ADMIN_TOKEN?.trim();
  if (!envToken) return false;

  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return cookieToken === envToken;
}

export async function GET(
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

  // Next.js App Router can prefetch RSC payloads and call this endpoint multiple times.
  // Bypass rate limiting for prefetch/RSC GETs to avoid self-throttling the admin editor.
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("rsc") === "1";

  const clientId = getClientId(request);
  if (!isPrefetch) {
    // Apply rate limiting (authorized, non-prefetch requests only)
    const rateLimitResult = await enforceRateLimit(ratelimitAdmin, [
      "admin_api",
      clientId,
      request.nextUrl.pathname,
      request.method,
    ]);
    if (!rateLimitResult.ok) {
      return Response.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter ?? 60),
          },
        },
      );
    }
  }

  try {
    const overlay = await getBenderOverlay(productId);
    return ok({ overlay });
  } catch (err) {
    console.error("[bender_overlays] Failed to load overlay:", err);
    return badRequest("Failed to load overlay from Neon");
  }
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
  // Apply rate limiting (authorized requests only)
  const rateLimitResult = await enforceRateLimit(ratelimitAdmin, [
    "admin_api",
    clientId,
    request.nextUrl.pathname,
    request.method,
  ]);
  if (!rateLimitResult.ok) {
    return Response.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.retryAfter ?? 60),
        },
      },
    );
  }

  let body: Partial<BenderOverlayInput>;
  try {
    body = (await request.json()) ?? {};
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Trust the client's shape; we just coerce types where needed.
  const input: BenderOverlayInput = {
    usaManufacturingTier: body.usaManufacturingTier ?? null,
    originTransparencyTier: body.originTransparencyTier ?? null,
    singleSourceSystemTier: body.singleSourceSystemTier ?? null,
    warrantyTier: body.warrantyTier ?? null,
    portability: (body.portability ?? null) as string | null,
    wallThicknessCapacity: (body.wallThicknessCapacity ?? null) as string | null,
    materials: (body.materials ?? null) as string | null,
    dieShapes: (body.dieShapes ?? null) as string | null,
    mandrel: (body.mandrel ?? null) as string | null,
    hasPowerUpgradePath: !!body.hasPowerUpgradePath,
    lengthStop: !!body.lengthStop,
    rotationIndexing: !!body.rotationIndexing,
    angleMeasurement: !!body.angleMeasurement,
    autoStop: !!body.autoStop,
    thickWallUpgrade: !!body.thickWallUpgrade,
    thinWallUpgrade: !!body.thinWallUpgrade,
    wiperDieSupport: !!body.wiperDieSupport,
    sBendCapability: !!body.sBendCapability,
  };

  try {
    const saved = await upsertBenderOverlay(productId, input);
    return ok({ overlay: saved });
  } catch (err) {
    console.error("[bender_overlays] Failed to save overlay:", err);
    return badRequest("Failed to save overlay to Neon");
  }
}
