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
    method: "scaled",
    tagline:
      "Scaled features-per-dollar scoring based on a minimum safe operating system cost (frame, die, hydraulics, and required stand).",
  },
  {
    index: 2,
    key: "easeOfUseSetup",
    name: "Ease of Use & Setup",
    maxPoints: 12,
    method: "scaled",
    tagline:
      "Deterministic scoring from documented power configuration and portability (fixed/portable/rolling) using a published 0–12 point formula.",
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
    tagline:
      "Binary scoring using a strict, FTC-style Made in USA standard: only machines documented as all or virtually all US-made receive points.",
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
    tagline:
      "Scaled scoring based on thickest published 1.75\" OD wall capacity plus a small bonus for documented material coverage (mild, 4130, stainless, aluminum, etc.).",
  },
  {
    index: 7,
    key: "dieSelectionShapes",
    name: "Die Selection & Shapes",
    maxPoints: 8,
    method: "tier",
    tagline:
      "Tier-based scoring on documented tube/pipe die families (round tube, pipe, square, rectangular, EMT, metric, plastic/urethane).",
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
    maxPoints: 8,
    method: "tier",
    tagline:
      "Points for documented power upgrades, LRA control (length stops, rotation indexing, angle readout, auto-stop), and bend-quality tooling (thin/thick wall, wipers).",
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
    maxPoints: 2,
    method: "binary",
    tagline:
      "Binary scoring for true back-to-back S-bends (≤0.125\" straight between bends).",
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
 * - We always attempt to compute a score + breakdown via the legacy scoring
 *   engine, using a best-effort adapter from whatever catalog fields exist.
 * - There are no manual overrides: the total score is always derived from the
 *   algorithm. If we cannot compute anything sane, we return
 *   { total: null, source: "none" }.
 */
export function getProductScore(
  product:
    | {
        id?: string | undefined;
      }
    | null
    | undefined,
): ProductScore {
  if (!product) {
    return { total: null, source: "none" };
  }

  const p: any = product;

  // Derive a system "entry price" from component-level min/max pricing where available.
  const parsePrice = (v: unknown): number =>
    typeof v === "number"
      ? v
      : parseFloat(String(v ?? "").replace(/[^0-9.+-]/g, "")) || 0;

  const minTotal =
    parsePrice(p.framePriceMin) +
    parsePrice(p.diePriceMin) +
    parsePrice(p.hydraulicPriceMin) +
    parsePrice(p.standPriceMin);

  const maxTotal =
    parsePrice(p.framePriceMax) +
    parsePrice(p.diePriceMax) +
    parsePrice(p.hydraulicPriceMax) +
    parsePrice(p.standPriceMax);

  // Entry-level system price used for Value for Money.
  // Prefer the conservative minimum system total; if that is missing, fall back
  // to the max system total, then any existing catalog price/priceRange.
  let entryPrice: number | undefined;
  if (minTotal > 0) {
    entryPrice = minTotal;
  } else if (maxTotal > 0) {
    entryPrice = maxTotal;
  } else if (p.priceRange) {
    entryPrice = parsePrice(p.priceRange);
  } else if (p.price) {
    entryPrice = parsePrice(p.price);
  }

  // Parse bend angle from either number or string.
  let bendAngle: number | undefined;
  if (typeof p.bendAngle === "number") {
    bendAngle = p.bendAngle;
  } else if (typeof p.bendAngle === "string") {
    const parsed = parseFloat(p.bendAngle.replace(/[^0-9.+-]/g, ""));
    if (Number.isFinite(parsed)) {
      bendAngle = parsed;
    }
  }

  // Normalize s-bend capability from boolean or string admin input.
  let sBendCapability: boolean | undefined;
  if (typeof p.sBendCapability === "boolean") {
    sBendCapability = p.sBendCapability;
  } else if (typeof p.sBendCapability === "string") {
    const v = p.sBendCapability.trim().toLowerCase();
    if (v === "yes" || v === "true") sBendCapability = true;
    if (v === "no" || v === "false") sBendCapability = false;
  }

  // Build a best-effort scoring input from whatever fields we have.
  const scoringInput: ScoringInput = {
    id: p.id,
    brand: p.brand,
    model: p.model,
    // IMPORTANT:
    // We intentionally omit / clear priceRange here so the legacy scoring
    // engine effectively treats "Value for Money" as 0. We then compute a
    // proper features-per-dollar score in this wrapper, based on non-price
    // categories and entryPrice.
    priceRange: undefined,
    powerType: p.powerType,
    // Capacity: prefer a dedicated maxCapacity field, then capacity.
    maxCapacity: p.maxCapacity ?? p.capacity,
    // Country of origin often appears as country/countryOfOrigin/madeIn.
    countryOfOrigin: p.countryOfOrigin ?? p.country ?? p.madeIn,
    bendAngle,
    // Wall thickness capability: prefer a dedicated field, then maxWall as a
    // best-effort proxy when that is how the catalog stores it.
    wallThicknessCapacity: p.wallThicknessCapacity ?? p.maxWall,
    features: Array.isArray(p.features) ? p.features : [],
    materials: Array.isArray(p.materials) ? p.materials : [],
    // Die shapes used for "Die Selection & Shapes" scoring (comma-separated)
    dieShapes: (p as any).dieShapes,

    // Mandrel availability in the new admin grid is stored as "mandrel" with
    // values like "Available" / "None". We let this override any legacy
    // "mandrelBender" field so admin edits always win.
    mandrelBender: p.mandrel ?? p.mandrelBender,
    sBendCapability,

    // Upgrade path & modularity flags (YES/NO in admin, normalized in engine)
    hasPowerUpgradePath: (p as any).hasPowerUpgradePath,
    lengthStop: (p as any).lengthStop,
    rotationIndexing: (p as any).rotationIndexing,
    angleMeasurement: (p as any).angleMeasurement,
    autoStop: (p as any).autoStop,
    thickWallUpgrade: (p as any).thickWallUpgrade,
    thinWallUpgrade: (p as any).thinWallUpgrade,
    wiperDieSupport: (p as any).wiperDieSupport,
  };

  try {
    // First pass: compute all non-price categories using the legacy engine.
    // With priceRange omitted, the internal "Value for Money" contribution
    // will always be 0, so totalScore here is effectively "features without
    // cost". We then layer a real Value for Money score on top.
    const scored = calculateTubeBenderScore(scoringInput);
    if (!Number.isFinite(scored.totalScore)) {
      return { total: null, source: "none" };
    }

    const clamp = (value: number): number =>
      Math.max(0, Math.min(TOTAL_POINTS, Math.round(value)));

    const baseBreakdown = Array.isArray(scored.scoreBreakdown)
      ? scored.scoreBreakdown
      : [];

    // Strip out any legacy "Value for Money" entry the engine may have added,
    // then treat the remaining categories as the non-price feature set.
    const nonValueItems = baseBreakdown.filter(
      (item) => item.criteria !== "Value for Money",
    );

    const nonPricePoints = nonValueItems.reduce(
      (sum, item) => sum + (Number.isFinite(item.points) ? item.points : 0),
      0,
    );

    let valueForMoneyItem: ScoreBreakdownItem;
    let totalScore: number;

    if (!entryPrice || entryPrice <= 0 || nonPricePoints <= 0) {
      // If we don't have a defensible entry price or any feature points, we do
      // NOT fabricate a Value for Money score. We leave it at 0/20 with an
      // explicit explanation.
      valueForMoneyItem = {
        criteria: "Value for Money",
        points: 0,
        maxPoints: 20,
        reasoning:
          "Not scored: missing or incomplete price/feature data for a fair features-per-dollar comparison.",
      };
      totalScore = nonPricePoints;
    } else {
      // Features-per-dollar scoring:
      //
      //   F = nonPricePoints / entryPrice   (points per dollar)
      //   V = clamp( (F / SCALE) * maxPoints, 0, maxPoints )
      //
      // SCALE is a tunable constant representing a "strong" features-per-dollar
      // ratio across the market. Machines with exceptionally good F relative to
      // SCALE approach the full 20 points; weaker ratios get proportionally
      // less.
      //
      // This is intentionally conservative: we would rather under-reward than
      // over-reward on Value for Money until we have a larger data set.
      const maxPoints = 20;
      const SCALE = 0.03; // 0.03 pts per dollar ≈ 60 pts @ $2,000 or 40 pts @ $1,333

      const rawRatio = nonPricePoints / entryPrice;
      const fraction = Math.max(0, Math.min(rawRatio / SCALE, 1));
      const valuePoints = Math.round(fraction * maxPoints);

      valueForMoneyItem = {
        criteria: "Value for Money",
        points: valuePoints,
        maxPoints,
        reasoning: `Features-per-dollar scoring based on ${nonPricePoints.toFixed(
          1,
        )} points earned in the other categories (out of 80 possible feature points) and an estimated minimum safe operating system cost of about $${entryPrice.toFixed(
          0,
        )}.`,
      };

      totalScore = nonPricePoints + valuePoints;
    }

    const finalBreakdown: ScoreBreakdownItem[] = [
      valueForMoneyItem,
      ...nonValueItems,
    ];

    return {
      total: clamp(totalScore),
      source: "computed",
      breakdown: finalBreakdown,
    };
  } catch {
    // If anything goes sideways in the scoring engine, fail closed and treat
    // the product as unscored rather than throwing from UI.
    return { total: null, source: "none" };
  }
}

