import { NextRequest } from "next/server";

import { ok, badRequest } from "../../../../../lib/http";

import {
  getBenderOverlay,
  upsertBenderOverlay,
} from "../../../../../lib/benderOverlayRepo";

/**
 * Simple cookie-based admin guard:
 * - Uses ADMIN_TOKEN from env
 * - Expects a cookie named "admin_token" containing that value
 */
function requireAdmin(request: NextRequest) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return badRequest("Admin token not configured");
  }

  const cookie = request.cookies.get("admin_token")?.value;
  if (cookie !== adminToken) {
    return badRequest("Not authorized");
  }

  return null;
}

/**
 * GET /api/admin/products/[id]
 * Returns the current Neon-backed overlay row (if any) for this product.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const productId = params.id;
  if (!productId) {
    return badRequest("Missing product id");
  }

  const overlay = await getBenderOverlay(productId);
  return ok({ productId, overlay });
}

/**
 * POST /api/admin/products/[id]
 *
 * Accepts a partial overlay patch in the body and persists it to Neon.
 * Body shape (all fields optional except product id from the URL):
 *
 *   {
 *     usaManufacturingTier?: number,
 *     originTransparencyTier?: number,
 *     singleSourceSystemTier?: number,
 *     warrantyTier?: number,
 *     portability?: string,
 *     wallThicknessCapacity?: string,
 *     materials?: string,
 *     dieShapes?: string,
 *     mandrel?: string,
 *     hasPowerUpgradePath?: boolean,
 *     lengthStop?: boolean,
 *     rotationIndexing?: boolean,
 *     angleMeasurement?: boolean,
 *     autoStop?: boolean,
 *     thickWallUpgrade?: boolean,
 *     thinWallUpgrade?: boolean,
 *     wiperDieSupport?: boolean,
 *     sBendCapability?: boolean
 *   }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const productId = params.id;
  if (!productId) {
    return badRequest("Missing product id");
  }

  let patch: any;

  try {
    patch = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (!patch || typeof patch !== "object") {
    return badRequest("Body must be a JSON object");
  }

  const {
    usaManufacturingTier,
    originTransparencyTier,
    singleSourceSystemTier,
    warrantyTier,
    portability,
    wallThicknessCapacity,
    materials,
    dieShapes,
    mandrel,
    hasPowerUpgradePath,
    lengthStop,
    rotationIndexing,
    angleMeasurement,
    autoStop,
    thickWallUpgrade,
    thinWallUpgrade,
    wiperDieSupport,
    sBendCapability,
  } = patch;

  const merged = await upsertBenderOverlay(productId, {
    usaManufacturingTier,
    originTransparencyTier,
    singleSourceSystemTier,
    warrantyTier,
    portability,
    wallThicknessCapacity,
    materials,
    dieShapes,
    mandrel,
    hasPowerUpgradePath,
    lengthStop,
    rotationIndexing,
    angleMeasurement,
    autoStop,
    thickWallUpgrade,
    thinWallUpgrade,
    wiperDieSupport,
    sBendCapability,
  });

  return ok({ productId, overlay: merged });
}
