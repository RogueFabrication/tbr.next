/**
 * Simple, UI-focused description of the tube bender scoring system.
 * This is deliberately read-only for now – we are not yet computing
 * per-product scores inside this module.
 */

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

