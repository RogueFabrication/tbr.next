// lib/benderOverlayRepo.ts

import { sql } from "./db";

/**
 * Shape of the scoring overlay data we care about.
 * This is camelCase so it's easy to merge into your Product/overlay objects.
 */
export type BenderOverlay = {
  productId: string;

  usaManufacturingTier: number | null;
  originTransparencyTier: number | null;
  singleSourceSystemTier: number | null;
  warrantyTier: number | null;

  portability: string | null;
  wallThicknessCapacity: string | null;
  materials: string | null;
  dieShapes: string | null;
  mandrel: string | null;

  hasPowerUpgradePath: boolean | null;
  lengthStop: boolean | null;
  rotationIndexing: boolean | null;
  angleMeasurement: boolean | null;
  autoStop: boolean | null;
  thickWallUpgrade: boolean | null;
  thinWallUpgrade: boolean | null;
  wiperDieSupport: boolean | null;
  sBendCapability: boolean | null;
};

type OverlayPatch = Partial<Omit<BenderOverlay, "productId">>;

/** Map a raw DB row (snake_case) to our camelCase overlay object. */
function mapRow(row: any): BenderOverlay {
  return {
    productId: String(row.product_id),

    usaManufacturingTier: row.usa_manufacturing_tier ?? null,
    originTransparencyTier: row.origin_transparency_tier ?? null,
    singleSourceSystemTier: row.single_source_system_tier ?? null,
    warrantyTier: row.warranty_tier ?? null,

    portability: row.portability ?? null,
    wallThicknessCapacity: row.wall_thickness_capacity ?? null,
    materials: row.materials ?? null,
    dieShapes: row.die_shapes ?? null,
    mandrel: row.mandrel ?? null,

    hasPowerUpgradePath: row.has_power_upgrade_path ?? null,
    lengthStop: row.length_stop ?? null,
    rotationIndexing: row.rotation_indexing ?? null,
    angleMeasurement: row.angle_measurement ?? null,
    autoStop: row.auto_stop ?? null,
    thickWallUpgrade: row.thick_wall_upgrade ?? null,
    thinWallUpgrade: row.thin_wall_upgrade ?? null,
    wiperDieSupport: row.wiper_die_support ?? null,
    sBendCapability: row.s_bend_capability ?? null,
  };
}

/** Fetch overlay for a single product, or null if none exists yet. */
export async function getBenderOverlay(
  productId: string,
): Promise<BenderOverlay | null> {
  const rows = await sql`
    SELECT
      product_id,
      usa_manufacturing_tier,
      origin_transparency_tier,
      single_source_system_tier,
      warranty_tier,
      portability,
      wall_thickness_capacity,
      materials,
      die_shapes,
      mandrel,
      has_power_upgrade_path,
      length_stop,
      rotation_indexing,
      angle_measurement,
      auto_stop,
      thick_wall_upgrade,
      thin_wall_upgrade,
      wiper_die_support,
      s_bend_capability
    FROM bender_overlays
    WHERE product_id = ${productId}
  `;

  if (!rows || rows.length === 0) return null;
  return mapRow(rows[0]);
}

/**
 * Upsert helper: merges a partial patch into whatever is in the DB
 * and writes the full row back.
 */
export async function upsertBenderOverlay(
  productId: string,
  patch: OverlayPatch,
): Promise<BenderOverlay> {
  // Fetch existing row (if any) so we can do a true partial update.
  const existing = await getBenderOverlay(productId);

  const merged: BenderOverlay = {
    productId,
    usaManufacturingTier:
      patch.usaManufacturingTier ?? existing?.usaManufacturingTier ?? null,
    originTransparencyTier:
      patch.originTransparencyTier ?? existing?.originTransparencyTier ?? null,
    singleSourceSystemTier:
      patch.singleSourceSystemTier ??
      existing?.singleSourceSystemTier ??
      null,
    warrantyTier: patch.warrantyTier ?? existing?.warrantyTier ?? null,

    portability: patch.portability ?? existing?.portability ?? null,
    wallThicknessCapacity:
      patch.wallThicknessCapacity ??
      existing?.wallThicknessCapacity ??
      null,
    materials: patch.materials ?? existing?.materials ?? null,
    dieShapes: patch.dieShapes ?? existing?.dieShapes ?? null,
    mandrel: patch.mandrel ?? existing?.mandrel ?? null,

    hasPowerUpgradePath:
      patch.hasPowerUpgradePath ??
      existing?.hasPowerUpgradePath ??
      null,
    lengthStop: patch.lengthStop ?? existing?.lengthStop ?? null,
    rotationIndexing:
      patch.rotationIndexing ?? existing?.rotationIndexing ?? null,
    angleMeasurement:
      patch.angleMeasurement ?? existing?.angleMeasurement ?? null,
    autoStop: patch.autoStop ?? existing?.autoStop ?? null,
    thickWallUpgrade:
      patch.thickWallUpgrade ?? existing?.thickWallUpgrade ?? null,
    thinWallUpgrade:
      patch.thinWallUpgrade ?? existing?.thinWallUpgrade ?? null,
    wiperDieSupport:
      patch.wiperDieSupport ?? existing?.wiperDieSupport ?? null,
    sBendCapability:
      patch.sBendCapability ?? existing?.sBendCapability ?? null,
  };

  // Write back to Neon (INSERT ... ON CONFLICT DO UPDATE).
  await sql`
    INSERT INTO bender_overlays (
      product_id,
      usa_manufacturing_tier,
      origin_transparency_tier,
      single_source_system_tier,
      warranty_tier,
      portability,
      wall_thickness_capacity,
      materials,
      die_shapes,
      mandrel,
      has_power_upgrade_path,
      length_stop,
      rotation_indexing,
      angle_measurement,
      auto_stop,
      thick_wall_upgrade,
      thin_wall_upgrade,
      wiper_die_support,
      s_bend_capability
    )
    VALUES (
      ${merged.productId},
      ${merged.usaManufacturingTier},
      ${merged.originTransparencyTier},
      ${merged.singleSourceSystemTier},
      ${merged.warrantyTier},
      ${merged.portability},
      ${merged.wallThicknessCapacity},
      ${merged.materials},
      ${merged.dieShapes},
      ${merged.mandrel},
      ${merged.hasPowerUpgradePath},
      ${merged.lengthStop},
      ${merged.rotationIndexing},
      ${merged.angleMeasurement},
      ${merged.autoStop},
      ${merged.thickWallUpgrade},
      ${merged.thinWallUpgrade},
      ${merged.wiperDieSupport},
      ${merged.sBendCapability}
    )
    ON CONFLICT (product_id) DO UPDATE SET
      usa_manufacturing_tier   = EXCLUDED.usa_manufacturing_tier,
      origin_transparency_tier = EXCLUDED.origin_transparency_tier,
      single_source_system_tier= EXCLUDED.single_source_system_tier,
      warranty_tier            = EXCLUDED.warranty_tier,
      portability              = EXCLUDED.portability,
      wall_thickness_capacity  = EXCLUDED.wall_thickness_capacity,
      materials                = EXCLUDED.materials,
      die_shapes               = EXCLUDED.die_shapes,
      mandrel                  = EXCLUDED.mandrel,
      has_power_upgrade_path   = EXCLUDED.has_power_upgrade_path,
      length_stop              = EXCLUDED.length_stop,
      rotation_indexing        = EXCLUDED.rotation_indexing,
      angle_measurement        = EXCLUDED.angle_measurement,
      auto_stop                = EXCLUDED.auto_stop,
      thick_wall_upgrade       = EXCLUDED.thick_wall_upgrade,
      thin_wall_upgrade        = EXCLUDED.thin_wall_upgrade,
      wiper_die_support        = EXCLUDED.wiper_die_support,
      s_bend_capability        = EXCLUDED.s_bend_capability
  `;

  return merged;
}

/**
 * Load all overlays from Neon and return a map keyed by product_id.
 * This is kept for backward compatibility with catalogOverlay.ts
 */
export async function loadAllBenderOverlays(): Promise<
  Record<string, Record<string, unknown>>
> {
  const rows = await sql`
    SELECT
      product_id,
      usa_manufacturing_tier,
      origin_transparency_tier,
      single_source_system_tier,
      warranty_tier,
      portability,
      wall_thickness_capacity,
      materials,
      die_shapes,
      mandrel,
      has_power_upgrade_path,
      length_stop,
      rotation_indexing,
      angle_measurement,
      auto_stop,
      thick_wall_upgrade,
      thin_wall_upgrade,
      wiper_die_support,
      s_bend_capability
    FROM bender_overlays
  `;

  const map: Record<string, Record<string, unknown>> = {};

  for (const row of rows) {
    map[row.product_id] = {
      usaManufacturingTierScore: row.usa_manufacturing_tier,
      originTransparencyTierScore: row.origin_transparency_tier,
      singleSourceSystemTierScore: row.single_source_system_tier,
      warrantyTierScore: row.warranty_tier,
      portability: row.portability,
      wallThicknessCapacity: row.wall_thickness_capacity,
      materials: row.materials,
      dieShapes: row.die_shapes,
      mandrel: row.mandrel,
      hasPowerUpgradePath: row.has_power_upgrade_path,
      lengthStop: row.length_stop,
      rotationIndexing: row.rotation_indexing,
      angleMeasurement: row.angle_measurement,
      autoStop: row.auto_stop,
      thickWallUpgrade: row.thick_wall_upgrade,
      thinWallUpgrade: row.thin_wall_upgrade,
      wiperDieSupport: row.wiper_die_support,
      sBendCapability: row.s_bend_capability,
    };
  }

  return map;
}
