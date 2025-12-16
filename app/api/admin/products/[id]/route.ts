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
  ratelimitAdminRead,
  ratelimitAdminWrite,
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
  // Auth first: never rate-limit unauthenticated requests as "authorized".
  if (!isAuthorized(request)) {
    return badRequest("Not authorized");
  }

  const productId = params?.id;

  if (!productId) {
    return badRequest("Missing product id");
  }

  const clientId = getClientId(request);
  const rateLimitResult = await enforceRateLimit(ratelimitAdminRead, [
    "admin_api_read",
    clientId,
    "product",
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
  // Auth first
  if (!isAuthorized(request)) {
    return badRequest("Not authorized");
  }

  const clientId = getClientId(request);

  // Apply rate limiting
  const rateLimitResult = await enforceRateLimit(ratelimitAdminWrite, [
    "admin_api_write",
    clientId,
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

  const productId = params?.id;

  if (!productId) {
    return badRequest("Missing product id");
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

// The admin UI uses PATCH for per-field updates. Previously this route only
// implemented GET/POST, so PATCH requests never reached the server (and would
// not appear in DevTools as a successful network transaction).
//
// For now, delegate PATCH -> POST so we keep a single update implementation.
// If you later want strict REST semantics, you can move the update logic into
// a shared function and have POST/PATCH call it.
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return POST(request, { params });
}
