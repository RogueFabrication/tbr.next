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
    description: "Available die shapes: round, square, rectangle, EMT, flat bar, hexagon, combination dies",
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
  maxCapacity?: string;
  countryOfOrigin?: string;
  bendAngle?: number;
  wallThicknessCapacity?: string | number;
  features?: string[];
  materials?: string[];
  dieShapes?: string[];
  upgradeFlags?: string[];
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
  let easeScore = 0;
  const brand = String(bender.brand ?? "");
  const powerType = String(bender.powerType ?? "");
  if (brand === "RogueFab") easeScore = 11;
  else if (brand === "SWAG Off Road") easeScore = 10;
  else if (brand === "JD2") easeScore = 9;
  else if (powerType.includes("Manual")) easeScore = 8;
  else if (powerType.includes("Hydraulic")) easeScore = 9;
  else easeScore = 7;

  scoreBreakdown.push({
    criteria: "Ease of Use & Setup",
    points: easeScore,
    maxPoints: 12,
    reasoning: `${powerType || "Unknown power type"} operation with ${
      brand === "RogueFab" ? "vertical space-saving design" : "standard setup"
    }`,
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
  const rawDieShapes = Array.isArray((bender as any).dieShapes)
    ? ((bender as any).dieShapes as unknown[])
    : [];

  // Normalise to lower-case slugs like "round", "square", "emt", etc.
  const dieShapeSlugs = rawDieShapes
    .map((s) => String(s || "").trim().toLowerCase())
    .filter(Boolean);

  // We intentionally omit solid-only coverage: if a machine can run round tube,
  // solids will generally fit; we do not double-count that.
  const DIE_SHAPE_WEIGHTS: Record<string, number> = {
    round: 3, // round tube
    pipe: 1.5, // NPS pipe
    emt: 1, // EMT
    "metric-round": 1, // metric round tube
    square: 1.5,
    "metric-square": 1, // metric square/rect tube
    rectangular: 1.5,
    "flat-bar": 0.5,
    hex: 0.5,
    other: 0.5, // documented specialty shapes not otherwise listed
    "plastic-pressure": 1, // plastic pressure dies for protecting soft alloys
  };

  const DIE_SHAPE_LABELS: Record<string, string> = {
    round: "round tube",
    pipe: "pipe (NPS)",
    emt: "EMT",
    "metric-round": "metric round tube",
    square: "square tube",
    "metric-square": "metric square/rect tube",
    rectangular: "rectangular tube",
    "flat-bar": "flat bar",
    hex: "hex",
    other: "other documented shapes",
    "plastic-pressure": "plastic pressure dies",
  };

  const uniqueShapeSlugs = Array.from(new Set(dieShapeSlugs)).filter(
    (slug) => slug in DIE_SHAPE_WEIGHTS,
  );

  let dieScore = 0;
  let dieReason: string;

  if (uniqueShapeSlugs.length === 0) {
    // No documented die coverage; we do not guess here.
    dieReason =
      "No published die shape/standard coverage; die ecosystem not scored in this category.";
  } else {
    const rawWeight = uniqueShapeSlugs.reduce(
      (sum, slug) => sum + (DIE_SHAPE_WEIGHTS[slug] ?? 0),
      0,
    );
    const maxRawWeight = Object.values(DIE_SHAPE_WEIGHTS).reduce(
      (sum, w) => sum + w,
      0,
    );

    const normalised =
      maxRawWeight > 0 ? (8 * rawWeight) / maxRawWeight : 0;
    dieScore = Math.round(Math.max(0, Math.min(8, normalised)));

    const labelList = uniqueShapeSlugs
      .map((slug) => DIE_SHAPE_LABELS[slug] ?? slug)
      .join(", ");

    dieReason = `Documented die coverage includes: ${labelList}. Scored via a weighted checklist of shapes and standards (round, square/rectangular, EMT, metric tube, pipe, flat bar, hex, and plastic pressure dies).`;
  }

  scoreBreakdown.push({
    criteria: "Die Selection & Shapes",
    points: dieScore,
    maxPoints: 8,
    reasoning: dieReason,
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

