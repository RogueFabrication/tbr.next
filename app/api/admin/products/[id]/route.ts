// app/api/admin/products/[id]/route.ts
import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../../../lib/http";
import {
  getBenderOverlay,
  upsertBenderOverlay,
  type BenderOverlayInput,
} from "../../../../../lib/benderOverlayRepo";

const ADMIN_COOKIE_NAME = "admin_token";

function isAuthorized(request: NextRequest): boolean {
  const envToken = process.env.ADMIN_TOKEN;
  if (!envToken) return false;

  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return cookieToken === envToken;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const productId = params?.id;

  if (!isAuthorized(request)) {
    return badRequest("Not authorized");
  }

  if (!productId) {
    return badRequest("Missing product id");
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
  const productId = params?.id;

  if (!isAuthorized(request)) {
    return badRequest("Not authorized");
  }

  if (!productId) {
    return badRequest("Missing product id");
  }

  let body: Partial<BenderOverlayInput>;
  try {
    body = (await request.json()) ?? {};
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Trust the client’s shape; we just coerce types where needed.
  const input: BenderOverlayInput = {
    usaManufacturingTier:
      body.usaManufacturingTier ?? null,
    originTransparencyTier:
      body.originTransparencyTier ?? null,
    singleSourceSystemTier:
      body.singleSourceSystemTier ?? null,
    warrantyTier: body.warrantyTier ?? null,
    portability:
      (body.portability ?? null) as string | null,
    wallThicknessCapacity:
      (body.wallThicknessCapacity ?? null) as string | null,
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
