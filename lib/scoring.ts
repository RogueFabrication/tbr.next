/**
 * Simple, UI-focused description of the tube bender scoring system.
 */

import {
  calculateTubeBenderScore,
  type ScoringInput,
  type ScoreBreakdownItem,
} from "./scoringEngine";

export type ScoringMethod = "tier" | "scaled" | "binary" | "brand";

export type ScoringCategory = {
  /** 1–11 ordering as presented on the scoring page. */
  index: number;
  /** Stable key for future use in scoring/overlays. */
  key: string;
  /** Human-facing label. */
  name: string;
  /** Maximum points contributed to the 100-point total. */
  maxPoints: number;
  /** High-level scoring method (tier, scaled, binary, brand-based). */
  method: ScoringMethod;
  /** Short one-line description used in the UI. */
  tagline: string;
};

/** Total possible score across all categories. */
export const TOTAL_POINTS = 100;

/** 11-category, 100-point scoring framework. */
export const SCORING_CATEGORIES: ScoringCategory[] = [
  {
    index: 1,
    key: "valueForMoney",
    name: "Value for Money",
    maxPoints: 20,
    method: "tier",
    tagline: "Tier-based scoring by complete setup price range.",
  },
  {
    index: 2,
    key: "easeOfUseSetup",
    name: "Ease of Use & Setup",
    maxPoints: 12,
    method: "brand",
    tagline: "Feature-based scoring on documented setup and usability.",
  },
  {
    index: 3,
    key: "maxDiameterRadius",
    name: "Max Diameter & Radius Capacity",
    maxPoints: 12,
    method: "scaled",
    tagline: "Scaled scoring based on maximum tube diameter and CLR range.",
  },
  {
    index: 4,
    key: "usaManufacturing",
    name: "USA Manufacturing",
    maxPoints: 10,
    method: "binary",
    tagline: "Binary scoring based on country of origin.",
  },
  {
    index: 5,
    key: "bendAngleCapability",
    name: "Bend Angle Capability",
    maxPoints: 10,
    method: "scaled",
    tagline: "Scaled scoring based on documented maximum bend angle.",
  },
  {
    index: 6,
    key: "wallThicknessCapability",
    name: "Wall Thickness Capability",
    maxPoints: 9,
    method: "scaled",
    tagline: "Scaled scoring based on thickest published 1.75\" OD wall capacity.",
  },
  {
    index: 7,
    key: "dieSelectionShapes",
    name: "Die Selection & Shapes",
    maxPoints: 8,
    method: "brand",
    tagline: "Brand-based scoring for die variety, shapes, and availability.",
  },
  {
    index: 8,
    key: "yearsInBusiness",
    name: "Years in Business",
    maxPoints: 7,
    method: "tier",
    tagline: "Tier-based scoring on company longevity and market track record.",
  },
  {
    index: 9,
    key: "upgradePathModularity",
    name: "Upgrade Path & Modularity",
    maxPoints: 5,
    method: "brand",
    tagline: "Brand-based scoring on upgrades, modularity, and growth path.",
  },
  {
    index: 10,
    key: "mandrelCompatibility",
    name: "Mandrel Compatibility",
    maxPoints: 4,
    method: "tier",
    tagline: "Tier-based scoring on supported mandrel options and upgrades.",
  },
  {
    index: 11,
    key: "sBendCapability",
    name: "S-Bend Capability",
    maxPoints: 3,
    method: "binary",
    tagline: "Binary scoring based on documented S-bend capability.",
  },
];

/** Source of a product score for transparency. */
export type ProductScoreSource = "manual" | "computed" | "none";

export type ProductScore = {
  /** 0–TOTAL_POINTS when known; null when no score is available. */
  total: number | null;
  /** Whether the score came from an admin override, future algorithm, or is missing. */
  source: ProductScoreSource;
  /** Optional per-category breakdown when using the computed algorithm. */
  breakdown?: ScoreBreakdownItem[];
};

/**
 * Scoring behavior:
 * - If the product has a `totalScore` value (typically from the admin overlay),
 *   we treat that as the truth, clamp it into 0–TOTAL_POINTS, and return it
 *   with source: "manual".
 * - If `totalScore` is missing or unparsable, we fall back to the legacy
 *   algorithm in scoringEngine, adapted to whatever fields exist on the
 *   product, and return source: "computed" when we can derive a score.
 * - If we cannot compute anything sane, we return { total: null, source: "none" }.
 */
export function getProductScore(
  product:
    | {
        id?: string | undefined;
        totalScore?: unknown;
      }
    | null
    | undefined,
): ProductScore {
  if (!product) {
    return { total: null, source: "none" };
  }

  // 1) Manual override from admin overlay (totalScore field)
  const raw = (product as any).totalScore ?? null;
  if (raw !== null && raw !== undefined && raw !== "") {
    const n =
      typeof raw === "number"
        ? raw
        : parseFloat(String(raw).replace(/[^0-9.+-]/g, ""));
    if (Number.isFinite(n)) {
      const clamped = Math.max(0, Math.min(TOTAL_POINTS, Math.round(n)));
      return { total: clamped, source: "manual" };
    }
  }

  // 2) Computed score via scoringEngine when no valid manual override exists.
  const p: any = product;

  const scoringInput: ScoringInput = {
    id: p.id,
    brand: p.brand,
    model: p.model,
    // Prefer an explicit priceRange if present; otherwise fall back to a
    // stringified price so the legacy price-bucket logic has *something*.
    priceRange:
      p.priceRange ??
      (p.price ? String(p.price) : undefined),
    // Power type may be a dedicated field in some catalogs; otherwise we have
    // to leave it blank and accept a slightly degraded "ease of use" score.
    powerType: p.powerType,
    // Capacity: prefer a dedicated maxCapacity field, then capacity.
    maxCapacity: p.maxCapacity ?? p.capacity,
    // Country of origin often appears as country/countryOfOrigin/madeIn.
    countryOfOrigin: p.countryOfOrigin ?? p.country ?? p.madeIn,
    bendAngle: typeof p.bendAngle === "number" ? p.bendAngle : undefined,
    // Wall thickness capability: prefer a dedicated field, then maxWall as a
    // best-effort proxy when that is how the catalog stores it.
    wallThicknessCapacity:
      p.wallThicknessCapacity ?? p.maxWall,
    features: Array.isArray(p.features) ? p.features : [],
    materials: Array.isArray(p.materials) ? p.materials : [],
    // Mandrel availability in the new admin grid is stored as "mandrel" with
    // values like "Available" / "Standard" / "No". The legacy algorithm expects
    // "Available" to award full points.
    mandrelBender: p.mandrelBender ?? p.mandrel,
    sBendCapability: p.sBendCapability,
  };

  try {
    const scored = calculateTubeBenderScore(scoringInput);
    if (!Number.isFinite(scored.totalScore)) {
      return { total: null, source: "none" };
    }
    const clamped = Math.max(
      0,
      Math.min(TOTAL_POINTS, Math.round(scored.totalScore)),
    );
    return {
      total: clamped,
      source: "computed",
      breakdown: scored.scoreBreakdown,
    };
  } catch {
    // If anything goes sideways in the scoring engine, fail closed and treat
    // the product as unscored rather than throwing from UI.
    return { total: null, source: "none" };
  }
}

