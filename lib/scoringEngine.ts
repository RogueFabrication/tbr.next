/**
 * Legacy, but fully transparent, tube-bender scoring engine.
 *
 * This is a direct adaptation of the original Replit-era algorithm, rewritten
 * to be self-contained and defensive. It does NOT depend on any shared schema
 * or database models – it operates on a generic "product-like" shape.
 *
 * Integration into the current catalog happens via adapter code elsewhere.
 */

export interface ScoringCriteria {
  name: string;
  maxPoints: number;
  description: string;
  weight: number;
}

/**
 * Human-readable criteria reference. Not currently used in calculations, but
 * kept for documentation and potential future UI.
 */
export const SCORING_CRITERIA: ScoringCriteria[] = [
  {
    name: "Value for Money",
    maxPoints: 20,
    description: "Price-to-performance ratio based on base/minimum price of the range",
    weight: 0.20,
  },
  {
    name: "Ease of Use & Setup",
    maxPoints: 12,
    description: "Assembly time, portability, operation simplicity",
    weight: 0.12,
  },
  {
    name: "Max Diameter & Radius Capacity",
    maxPoints: 12,
    description: "Maximum tube diameter and minimum bend radius capability",
    weight: 0.12,
  },
  {
    name: "USA Manufacturing",
    maxPoints: 10,
    description: "American-made components and assembly",
    weight: 0.10,
  },
  {
    name: "Bend Angle Capability",
    maxPoints: 10,
    description: "Maximum bend angle achievable (180°+ preferred)",
    weight: 0.10,
  },
  {
    name: "Wall Thickness Capability",
    maxPoints: 9,
    description: "Maximum wall thickness for 1.75\" OD DOM tubing",
    weight: 0.09,
  },
  {
    name: "Die Selection & Shapes",
    maxPoints: 8,
    description:
      "Available die coverage for round tube, pipe, square/rectangular tube, EMT, metric tube, plus optional plastic/urethane pressure dies",
    weight: 0.08,
  },
  {
    name: "Years in Business",
    maxPoints: 7,
    description: "Company longevity and market experience",
    weight: 0.07,
  },
  {
    name: "Upgrade Path & Modularity",
    maxPoints: 8,
    description:
      "Documented upgrade path for power, LRA control (length, rotation, angle), and bend-quality tooling (thin/thick wall, wipers).",
    weight: 0.08,
  },
  {
    name: "Mandrel Compatibility",
    maxPoints: 4,
    description: "Mandrel bending capability – 4 points if a factory-supported option exists, 0 if not",
    weight: 0.04,
  },
  {
    name: "S-Bend Capability",
    maxPoints: 2,
    description: "Ability to create S-bends and complex geometries",
    weight: 0.02,
  },
];

export interface ScoreBreakdownItem {
  criteria: string;
  points: number;
  maxPoints: number;
  reasoning: string;
}

/**
 * Minimal shape that the scoring algorithm expects. All fields are optional and
 * are handled defensively so we can adapt from different catalog shapes.
 */
export interface ScoringInput {
  id?: string;
  brand?: string;
  model?: string;
  priceRange?: string;
  powerType?: string;
  /**
   * Portability / how the machine lives in the shop.
   *
   * Expected normalized values:
   * - "fixed"                        → 0  (must be anchored / immovable for use)
   * - "portable"                     → 1  (self-contained & movable, no rolling option)
   * - "portable_with_rolling_option" → 2  (portable, with a documented cart / rolling upgrade)
   * - "rolling" or "rolling_standard"→ 3  (ships on wheels / designed to roll around the shop)
   *
   * Anything else is treated conservatively as 0 until the admin overlay is wired up.
   */
  portability?: string;
  maxCapacity?: string;
  countryOfOrigin?: string;
  bendAngle?: number;
  wallThicknessCapacity?: string | number;
  features?: string[];
  materials?: string[];
  dieShapes?: string[];
  upgradeFlags?: string[];
  // Upgrade path & modularity flags (YES/NO in admin; normalized in engine)
  hasPowerUpgradePath?: string | boolean;
  lengthStop?: string | boolean;
  rotationIndexing?: string | boolean;
  angleMeasurement?: string | boolean;
  autoStop?: string | boolean;
  thickWallUpgrade?: string | boolean;
  thinWallUpgrade?: string | boolean;
  wiperDieSupport?: string | boolean;
  mandrelBender?: string;
  sBendCapability?: boolean;
  [key: string]: unknown;
}

export interface ScoredResult {
  totalScore: number;
  scoreBreakdown: ScoreBreakdownItem[];
}

/**
 * Core scoring function.
 *
 * This is a direct port of the original calculateTubeBenderScore(bender)
 * implementation, with added null/undefined guards and string coercion so that
 * it is safe to call even when some fields are missing.
 */
export function calculateTubeBenderScore(bender: ScoringInput): ScoredResult {
  const scoreBreakdown: ScoreBreakdownItem[] = [];
  let totalScore = 0;

  // 1. Value for Money (20 points)
  // TODO: Replace this legacy string-matching logic with a data-driven
  // "features per dollar" formula that uses component-level entry pricing
  // (frame + starter die + hydraulics + stand) and normalizes across all
  // products. The scoring page describes this planned behavior explicitly.
  let valueScore = 0;
  const priceRange = String(bender.priceRange ?? "").toLowerCase();
  if (priceRange.includes("$780") || priceRange.includes("$885")) valueScore = 20;
  else if (priceRange.includes("$839") || priceRange.includes("$970")) valueScore = 19;
  else if (priceRange.includes("$1,000") || priceRange.includes("$1,250")) valueScore = 17;
  else if (priceRange.includes("$1,105") || priceRange.includes("$1,755")) valueScore = 16;
  else if (priceRange.includes("$1,609") || priceRange.includes("$1,895")) valueScore = 15;
  else if (priceRange.includes("$2,050") || priceRange.includes("$2,895")) valueScore = 12;
  else if (priceRange.includes("$3,850") || priceRange.includes("$5,000")) valueScore = 8;

  scoreBreakdown.push({
    criteria: "Value for Money",
    points: valueScore,
    maxPoints: 20,
    reasoning: `Price point ${bender.priceRange ?? "N/A"} relative to features and capacity`,
  });
  totalScore += valueScore;

  // 2. Ease of Use & Setup (12 points)
  //
  // NEW: this is fully data-driven from power configuration + portability,
  // not brand names. All inputs come from the catalog / admin:
  //
  //   - powerType (string from admin, e.g. "Manual", "Manual + Air / Hydraulic")
  //   - portability (one of: fixed, portable, portable_with_rolling_option, rolling_standard)
  //
  // Power configuration raw points (0–5):
  //   - Unknown / blank                         → 1
  //   - Manual only                             → 2
  //   - Manual + Hydraulic (upgrade path)       → 4
  //   - Hydraulic only                          → 4
  //   - Electric / Hydraulic                    → 5
  //
  // Portability raw points (0–3):
  //   - fixed                                   → 0
  //   - portable                                → 1
  //   - portable_with_rolling_option            → 2
  //   - rolling_standard                        → 3
  //
  // Raw total: 0–8, rescaled linearly to 0–12 points.
  let easeScore = 0;
  const brand = String(bender.brand ?? "");
  const powerType = String(bender.powerType ?? "");

  const powerLower = powerType.toLowerCase();
  const hasManual = powerLower.includes("manual");
  const hasHydraulic = powerLower.includes("hydraulic");
  const hasElectricHydraulic =
    powerLower.includes("electric / hydraulic") ||
    (powerLower.includes("electric") && powerLower.includes("hydraulic"));

  let powerTier = 0;
  if (!powerType) {
    powerTier = 1; // unknown / unpublished – conservative baseline
  } else if (hasManual && !hasHydraulic) {
    powerTier = 2; // manual only
  } else if (hasManual && hasHydraulic) {
    powerTier = 4; // documented manual + hydraulic path
  } else if (!hasManual && hasHydraulic && !hasElectricHydraulic) {
    powerTier = 4; // hydraulic-only system
  } else if (hasElectricHydraulic) {
    powerTier = 5; // electric / hydraulic pack
  } else {
    powerTier = 2; // fallback, behaves like manual-only
  }

  const portabilityRaw = String((bender as any).portability ?? "")
    .trim()
    .toLowerCase();

  let portabilityTier = 0;
  let portabilityLabel = "fixed base, must be anchored or mounted";

  switch (portabilityRaw) {
    case "portable":
      portabilityTier = 1;
      portabilityLabel =
        "portable base; can be moved but no rolling stand documented";
      break;
    case "portable_with_rolling_option":
      portabilityTier = 2;
      portabilityLabel =
        "portable base with a documented rolling cart/stand option";
      break;
    case "rolling_standard":
      portabilityTier = 3;
      portabilityLabel =
        "rolling stand or cart as a standard configuration";
      break;
    default:
      portabilityTier = 0;
      // keep the fixed-base label
      break;
  }

  const easeRaw = Math.max(0, Math.min(8, powerTier + portabilityTier));
  easeScore = Math.round((easeRaw / 8) * 12);

  scoreBreakdown.push({
    criteria: "Ease of Use & Setup",
    points: easeScore,
    maxPoints: 12,
    reasoning: `${
      powerType || "Unknown power configuration"
    }; portability: ${portabilityLabel}.`,
  });
  totalScore += easeScore;

  // 3. Max Diameter & Radius Capacity (12 points)
  let capacityScore = 0;
  const maxCapacity = String(bender.maxCapacity ?? "").toLowerCase();
  if (maxCapacity.includes("2.5") || maxCapacity.includes("2-1/2")) capacityScore = 12;
  else if (maxCapacity.includes("2-3/8") || maxCapacity.includes("2.375")) capacityScore = 11;
  else if (maxCapacity.includes("2.25") || maxCapacity.includes("2-1/4")) capacityScore = 10;
  else if (maxCapacity.includes("2.0") || maxCapacity.includes('2"')) capacityScore = 9;
  else if (maxCapacity.includes("1.75") || maxCapacity.includes("1-3/4")) capacityScore = 7;
  else if (maxCapacity.includes("1.5") || maxCapacity.includes("1-1/2")) capacityScore = 5;
  else if (maxCapacity) capacityScore = 4;

  scoreBreakdown.push({
    criteria: "Max Diameter & Radius Capacity",
    points: capacityScore,
    maxPoints: 12,
    reasoning: `${bender.maxCapacity ?? "Unknown"} maximum tube diameter capacity`,
  });
  totalScore += capacityScore;

  // 4. USA Manufacturing (10 points)
  // TODO: Upgrade from a simple binary USA vs non-USA rule to FTC-style tiers
  // based on explicit manufacturer origin statements ("Made in USA",
  // "Assembled in USA", etc.) once the catalog/overlay model exposes those
  // origin claims in a structured way.
  const countryClaimRaw = String(bender.countryOfOrigin ?? "").trim();
  let usaScore = 0;
  let usaReason: string;

  if (!countryClaimRaw) {
    usaReason = "Country of origin / FTC claim not specified";
  } else if (countryClaimRaw === 'FTC-unqualified "Made in USA"') {
    // Only unqualified FTC-compliant Made in USA claims receive points
    usaScore = 10;
    usaReason = 'Origin/claim: FTC-unqualified "Made in USA"';
  } else if (countryClaimRaw === "Assembled in USA / qualified USA claim") {
    // Qualified / assembled-in-USA claims are surfaced but do not score here
    usaReason =
      "Origin/claim: Assembled in USA / qualified USA claim (no unqualified Made in USA score)";
  } else {
    // Everything else – including legacy raw country strings – is treated as non-scoring
    usaReason = `Origin/claim: ${countryClaimRaw}`;
  }

  scoreBreakdown.push({
    criteria: "USA Manufacturing",
    points: usaScore,
    maxPoints: 10,
    reasoning: usaReason,
  });
  totalScore += usaScore;

  // 5. Bend Angle Capability (10 points)
  let angleScore = 0;
  const bendAngle = typeof bender.bendAngle === "number" ? bender.bendAngle : NaN;
  if (!Number.isNaN(bendAngle)) {
    if (bendAngle >= 195) angleScore = 10;
    else if (bendAngle >= 180) angleScore = 8;
    else if (bendAngle >= 120) angleScore = 5;
    else angleScore = 3;
  }

  scoreBreakdown.push({
    criteria: "Bend Angle Capability",
    points: angleScore,
    maxPoints: 10,
    reasoning: Number.isNaN(bendAngle) ? "No published bend angle" : `${bendAngle}° maximum bend angle`,
  });
  totalScore += angleScore;

  // 6. Wall Thickness Capability (9 points)
  //
  // This now combines two pieces:
  // - Thickness: 0–6 points based on the thickest published 1.75" OD DOM wall.
  // - Materials: 0–3 points based on documented material compatibility.
  //
  // We do not guess. Missing data gets conservative baseline handling and a
  // clear explanation in the reasoning string.
  let thicknessScore = 0;
  const wallRaw = bender.wallThicknessCapacity;
  let wallReasonPart: string;

  if (wallRaw !== undefined && wallRaw !== null && wallRaw !== "") {
    const thickness = parseFloat(String(wallRaw));
    if (Number.isFinite(thickness)) {
      if (thickness >= 0.156) thicknessScore = 6;
      else if (thickness >= 0.120) thicknessScore = 5;
      else if (thickness >= 0.095) thicknessScore = 4;
      else if (thickness > 0) thicknessScore = 3;
      wallReasonPart = `${wallRaw}" wall capacity for 1.75" OD DOM`;
    } else {
      thicknessScore = 0;
      wallReasonPart = `Unparseable wall thickness value: ${String(wallRaw)}`;
    }
  } else {
    // No published wall data: we assign a very small baseline and say so.
    thicknessScore = 2;
    wallReasonPart =
      "No published wall thickness data; assigned a small conservative baseline instead of guessing.";
  }

  // Materials scoring (0–3 points)
  const rawMaterials = Array.isArray(bender.materials)
    ? (bender.materials as unknown[])
    : [];

  const materialSlugs = rawMaterials
    .map((m) => String(m || "").trim().toLowerCase())
    .filter(Boolean);

  let hasMild = false;
  let has4130 = false;
  let hasStainless = false;
  let hasAluminum = false;
  let hasTitanium = false;
  let hasCopperBrass = false;
  let hasOtherMat = false;

  for (const label of materialSlugs) {
    if (label.includes("mild")) hasMild = true;
    if (label.includes("4130") || label.includes("chromoly")) has4130 = true;
    if (
      label.includes("stainless") ||
      label.includes("304") ||
      label.includes("316")
    )
      hasStainless = true;
    if (label.includes("alum")) hasAluminum = true;
    if (label.includes("titanium") || label === "ti") hasTitanium = true;
    if (
      label.includes("copper") ||
      label.includes("brass") ||
      label.includes("bronze")
    )
      hasCopperBrass = true;
    if (
      !label.includes("mild") &&
      !label.includes("4130") &&
      !label.includes("chromoly") &&
      !label.includes("stainless") &&
      !label.includes("304") &&
      !label.includes("316") &&
      !label.includes("alum") &&
      !label.includes("titanium") &&
      label !== "ti" &&
      !label.includes("copper") &&
      !label.includes("brass") &&
      !label.includes("bronze")
    ) {
      hasOtherMat = true;
    }
  }

  let rawMaterialWeight = 0;
  if (hasMild) rawMaterialWeight += 2;
  if (has4130) rawMaterialWeight += 2;
  if (hasStainless) rawMaterialWeight += 1.5;
  if (hasAluminum) rawMaterialWeight += 1.5;
  if (hasTitanium) rawMaterialWeight += 1;
  if (hasCopperBrass) rawMaterialWeight += 1;
  if (hasOtherMat) rawMaterialWeight += 1;

  let materialScore = 0;
  let materialReasonPart: string;

  if (rawMaterials.length === 0) {
    materialScore = 0;
    materialReasonPart =
      "No published material compatibility list; material coverage not scored.";
  } else {
    const maxRawMaterialWeight = 2 + 2 + 1.5 + 1.5 + 1 + 1 + 1; // 10
    const normalised =
      maxRawMaterialWeight > 0
        ? (3 * rawMaterialWeight) / maxRawMaterialWeight
        : 0;
    materialScore = Math.round(
      Math.max(0, Math.min(3, normalised)),
    );

    const matLabels: string[] = [];
    if (hasMild) matLabels.push("mild steel");
    if (has4130) matLabels.push("4130 chromoly");
    if (hasStainless) matLabels.push("stainless (304/316)");
    if (hasAluminum) matLabels.push("aluminum");
    if (hasTitanium) matLabels.push("titanium");
    if (hasCopperBrass) matLabels.push("copper/brass/bronze");
    if (hasOtherMat) matLabels.push("other documented alloys");

    materialReasonPart =
      matLabels.length > 0
        ? `Documented material coverage includes: ${matLabels.join(", ")}.`
        : "Materials list provided but could not be mapped to known categories.";
  }

  const wallScore = Math.max(
    0,
    Math.min(9, thicknessScore + materialScore),
  );

  scoreBreakdown.push({
    criteria: "Wall Thickness Capability",
    points: wallScore,
    maxPoints: 9,
    reasoning: `${wallReasonPart} ${materialReasonPart}`.trim(),
  });
  totalScore += wallScore;

  // 7. Die Selection & Shapes (8 points)
  //
  // Uses explicit, manufacturer-documented die shape coverage from `dieShapes`.
  // Admin stores this as a comma-separated list of labels. We score ONLY tube/pipe
  // families and EMT/metric/plastic pressure dies. Solid shapes (flat bar, hex, etc.)
  // are effectively assumed when round tube exists and are NOT part of this score.
  //
  // Shape weights (max 8 pts total):
  // - Round tube: 3 pts
  // - Square tube: 1 pt
  // - Rectangular tube: 1 pt
  // - EMT: 1 pt
  // - Metric round / square: 1 pt
  // - Plastic / urethane pressure dies: 1 pt
  //
  // "Other" is allowed in admin for documentation but does not add points.

  const rawDieShapes = (bender as any).dieShapes;
  let dieTokens: string[] = [];

  if (Array.isArray(rawDieShapes)) {
    dieTokens = rawDieShapes
      .map((s: unknown) => String(s ?? "").trim())
      .filter(Boolean);
  } else if (typeof rawDieShapes === "string") {
    dieTokens = rawDieShapes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const dieSet = new Set(dieTokens);

  const hasRound = dieSet.has("Round tube");
  const hasPipe = dieSet.has("Pipe");
  const hasSquare = dieSet.has("Square tube");
  const hasRectangular = dieSet.has("Rectangular tube");
  const hasEmt = dieSet.has("EMT");
  const hasMetric = dieSet.has("Metric round / square");
  const hasPlastic = dieSet.has("Plastic / urethane pressure dies");

  let dieScore = 0;
  if (hasRound) dieScore += 3;
  if (hasPipe) dieScore += 1;
  if (hasSquare) dieScore += 1;
  if (hasRectangular) dieScore += 1;
  if (hasEmt) dieScore += 1;
  if (hasMetric) dieScore += 1;
  if (hasPlastic) dieScore += 1;

  if (dieScore > 8) dieScore = 8;

  const coveredShapes: string[] = [];
  if (hasRound) coveredShapes.push("round tube");
  if (hasPipe) coveredShapes.push("pipe");
  if (hasSquare) coveredShapes.push("square tube");
  if (hasRectangular) coveredShapes.push("rectangular tube");
  if (hasEmt) coveredShapes.push("EMT");
  if (hasMetric) coveredShapes.push("metric round/square");
  if (hasPlastic) coveredShapes.push("plastic/urethane pressure dies");

  scoreBreakdown.push({
    criteria: "Die Selection & Shapes",
    points: dieScore,
    maxPoints: 8,
    reasoning:
      coveredShapes.length === 0
        ? "No documented tube/pipe die families beyond basic or unspecified coverage."
        : `Documented die coverage for: ${coveredShapes.join(", ")}.`,
  });
  totalScore += dieScore;

  // 8. Years in Business (7 points)
  let businessScore = 0;
  if (brand === "Hossfeld") businessScore = 7;
  else if (brand === "JD2") businessScore = 6;
  else if (brand === "Pro-Tools" || brand === "Baileigh") businessScore = 5;
  else if (brand === "RogueFab") businessScore = 4;
  else if (brand === "SWAG Off Road") businessScore = 3;
  else businessScore = 3;

  scoreBreakdown.push({
    criteria: "Years in Business",
    points: businessScore,
    maxPoints: 7,
    reasoning:
      businessScore >= 6
        ? "Established industry veteran (20+ years)"
        : businessScore >= 4
        ? "Proven track record (10+ years)"
        : "Newer market entry",
  });
  totalScore += businessScore;

  // 9. Upgrade Path & Modularity (8 points)
  //
  // This category is driven by explicit yes/no style fields coming from the
  // catalog/overlay, not brand names. Each documented upgrade earns 1 point:
  //
  //   A. Power upgrade path (1)
  //      hasPowerUpgradePath
  //
  //   B. LRA control path (3)
  //      hasLengthStop
  //      hasRotationIndexing
  //      hasAngleMeasurement (+1)
  //      hasAutoStop (+1)
  //
  //   C. Bend-quality tooling upgrades (3)
  //      hasThickWallUpgrade
  //      hasThinWallUpgrade
  //      hasWiperDieSupport
  //
  // Total possible: 8 points.
  const normalizeFlag = (v: unknown): boolean => {
    if (typeof v === "boolean") return v;
    if (typeof v === "string") {
      const s = v.trim().toLowerCase();
      return s === "yes" || s === "y" || s === "true" || s === "1";
    }
    return false;
  };

  const hasPowerUpgradePath = normalizeFlag(
    (bender as any).hasPowerUpgradePath ?? (bender as any).powerUpgradePath,
  );
  const hasLengthStop = normalizeFlag(
    (bender as any).hasLengthStop ?? (bender as any).lengthStop,
  );
  const hasRotationIndexing = normalizeFlag(
    (bender as any).hasRotationIndexing ?? (bender as any).rotationIndexing,
  );
  const hasAngleMeasurement = normalizeFlag(
    (bender as any).hasAngleMeasurement ?? (bender as any).angleMeasurement,
  );
  const hasAutoStop = normalizeFlag(
    (bender as any).hasAutoStop ?? (bender as any).autoStop,
  );
  const hasThickWallUpgrade = normalizeFlag(
    (bender as any).hasThickWallUpgrade ?? (bender as any).thickWallUpgrade,
  );
  const hasThinWallUpgrade = normalizeFlag(
    (bender as any).hasThinWallUpgrade ?? (bender as any).thinWallUpgrade,
  );
  const hasWiperDieSupport = normalizeFlag(
    (bender as any).hasWiperDieSupport ?? (bender as any).wiperDieSupport,
  );

  let upgradeScore = 0;

  // A. Power upgrade path (1)
  if (hasPowerUpgradePath) upgradeScore += 1;

  // B. LRA control path (3)
  if (hasLengthStop) upgradeScore += 1;
  if (hasRotationIndexing) upgradeScore += 1;
  if (hasAngleMeasurement) upgradeScore += 1;
  if (hasAutoStop) upgradeScore += 1;

  // C. Bend-quality tooling upgrades (3)
  if (hasThickWallUpgrade) upgradeScore += 1;
  if (hasThinWallUpgrade) upgradeScore += 1;
  if (hasWiperDieSupport) upgradeScore += 1;

  // Hard clamp to 8 in case multiple legacy fields overlap.
  if (upgradeScore > 8) upgradeScore = 8;

  const upgradePieces: string[] = [];
  if (hasPowerUpgradePath) upgradePieces.push("power upgrade path");
  if (hasLengthStop) upgradePieces.push("length backstop / stop system");
  if (hasRotationIndexing) upgradePieces.push("rotation indexing for bend-to-bend alignment");
  if (hasAngleMeasurement) upgradePieces.push("built-in or machine-mounted angle readout");
  if (hasAutoStop) upgradePieces.push("auto-stop for bend angle");
  if (hasThickWallUpgrade) upgradePieces.push("thick-wall specific tooling or capacity upgrades");
  if (hasThinWallUpgrade) upgradePieces.push("thin-wall / AL / stainless bend-quality upgrades");
  if (hasWiperDieSupport) upgradePieces.push("support for wiper dies");

  scoreBreakdown.push({
    criteria: "Upgrade Path & Modularity",
    points: upgradeScore,
    maxPoints: 8,
    reasoning:
      upgradePieces.length === 0
        ? "No documented upgrade path beyond the base configuration for power, LRA control, or bend-quality tooling."
        : `Documented upgrade path covering: ${upgradePieces.join(", ")}.`,
  });
  totalScore += upgradeScore;

  // 10. Mandrel Availability (4 points)
  let mandrelScore = 0;
  const mandrelRaw = String(
    // Prefer a dedicated "mandrel" field, but fall back to the legacy
    // "mandrelBender" key for any older overlay data.
    (bender as any).mandrel ?? (bender as any).mandrelBender ?? "",
  )
    .trim()
    .toLowerCase();

  if (mandrelRaw === "available") {
    mandrelScore = 4;
  }

  scoreBreakdown.push({
    criteria: "Mandrel Compatibility",
    points: mandrelScore,
    maxPoints: 4,
    reasoning:
      mandrelScore === 4
        ? "Mandrel bending capability documented by the manufacturer"
        : "No documented mandrel capability",
  });
  totalScore += mandrelScore;

  // 11. S-Bend Capability (2 points)
  let sBendScore = 0;
  const rawSBend = (bender as any).sBendCapability;
  const sBendCapability =
    typeof rawSBend === "boolean"
      ? rawSBend
      : typeof rawSBend === "string"
      ? ["yes", "true"].includes(rawSBend.trim().toLowerCase())
      : false;

  if (sBendCapability === true) sBendScore = 2;

  scoreBreakdown.push({
    criteria: "S-Bend Capability",
    points: sBendScore,
    maxPoints: 2,
    reasoning: sBendCapability
      ? "Meets TubeBenderReviews S-bend definition: two opposite-direction bends with ≤0.125\" straight (tangent) between them, verified via specs/photos."
      : "No documented ability to form back-to-back opposite bends with ≤0.125\" tangent; marketing \"S-bend\" claims with several inches of straight between bends do not qualify.",
  });
  totalScore += sBendScore;

  return {
    totalScore,
    scoreBreakdown,
  };
}

