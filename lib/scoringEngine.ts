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
    name: "Modular Clamping System",
    maxPoints: 6,
    description: "Advanced modular clamping system for versatile workpiece orientation",
    weight: 0.06,
  },
  {
    name: "Mandrel Availability",
    maxPoints: 4,
    description: "Mandrel bending capability - 4 points if available, 0 if not",
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
  const countryOfOriginRaw = String(bender.countryOfOrigin ?? "");
  const country = countryOfOriginRaw.toLowerCase();
  let usaScore = 0;

  // We only award "USA Manufacturing" points when the data entry explicitly
  // indicates an FTC-unqualified "Made in USA" claim (all or virtually all
  // content). Qualified or assembled-in-USA claims are treated as non-USA for
  // this category today, to stay conservative.
  if (
    country === "usa" ||
    (country.includes("ftc") && country.includes("unqualified") && country.includes("made in usa"))
  ) {
    usaScore = 10;
  } else {
    usaScore = 0;
  }

  scoreBreakdown.push({
    criteria: "USA Manufacturing",
    points: usaScore,
    maxPoints: 10,
    reasoning: countryOfOriginRaw
      ? `Origin/claim: ${countryOfOriginRaw}`
      : "Country of origin not specified",
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
  let wallScore = 0;
  const wallRaw = bender.wallThicknessCapacity;
  if (wallRaw !== undefined && wallRaw !== null && wallRaw !== "") {
    const thickness = parseFloat(String(wallRaw));
    if (Number.isFinite(thickness)) {
      if (thickness >= 0.156) wallScore = 9;
      else if (thickness >= 0.120) wallScore = 7;
      else if (thickness >= 0.095) wallScore = 5;
      else wallScore = 3;
    }
  } else {
    wallScore = 3; // Default for no published data
  }

  scoreBreakdown.push({
    criteria: "Wall Thickness Capability",
    points: wallScore,
    maxPoints: 9,
    reasoning: wallRaw
      ? `${wallRaw}" wall capacity for 1.75" OD DOM`
      : "No published wall thickness data",
  });
  totalScore += wallScore;

  // 7. Die Selection & Shapes (8 points)
  let dieScore = 0;
  if (brand === "Hossfeld") dieScore = 8;
  else if (brand === "RogueFab") dieScore = 7;
  else if (brand === "Pro-Tools") dieScore = 6;
  else if (brand === "JD2") dieScore = 5;
  else if (brand === "SWAG Off Road") dieScore = 4;
  else dieScore = 3;

  scoreBreakdown.push({
    criteria: "Die Selection & Shapes",
    points: dieScore,
    maxPoints: 8,
    reasoning:
      brand === "Hossfeld"
        ? "Extensive universal tooling system"
        : dieScore >= 6
        ? "Good variety of die shapes available"
        : "Basic die selection",
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

  // 9. Modular Clamping System (6 points)
  let clampingScore = 0;
  const model = String(bender.model ?? "");
  if (brand === "RogueFab" && model.includes("M6")) {
    clampingScore = 6;
  }

  scoreBreakdown.push({
    criteria: "Modular Clamping System",
    points: clampingScore,
    maxPoints: 6,
    reasoning:
      clampingScore === 6
        ? "Advanced modular clamping system for versatile workpiece orientation"
        : "Standard clamping system",
  });
  totalScore += clampingScore;

  // 10. Mandrel Availability (4 points)
  let mandrelScore = 0;
  const mandrelBenderRaw = String(bender.mandrelBender ?? "");
  const mandrelNorm = mandrelBenderRaw.trim().toLowerCase();
  // Treat a few legacy labels as "available" so older data still scores correctly.
  if (
    mandrelNorm === "available" ||
    mandrelNorm === "standard" ||
    mandrelNorm === "yes" ||
    mandrelNorm === "y"
  ) {
    mandrelScore = 4;
  }

  scoreBreakdown.push({
    criteria: "Mandrel Availability",
    points: mandrelScore,
    maxPoints: 4,
    reasoning:
      mandrelScore === 4
        ? "Mandrel bending capability available"
        : "No mandrel capability",
  });
  totalScore += mandrelScore;

  // 11. S-Bend Capability (2 points)
  let sBendScore = 0;
  const sBendCapability = bender.sBendCapability;
  if (sBendCapability === true) sBendScore = 2;

  scoreBreakdown.push({
    criteria: "S-Bend Capability",
    points: sBendScore,
    maxPoints: 2,
    reasoning: sBendCapability ? "Documented S-bend capability" : "No S-bend capability",
  });
  totalScore += sBendScore;

  return {
    totalScore,
    scoreBreakdown,
  };
}

