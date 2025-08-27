/**
 * Typed dataset for TubeBenderReviews.
 * Replace placeholder rows with real data later.
 */
export type Bender = {
  brand: string;
  model: string;
  capacity: string; // e.g. 2" x .120 DOM
  price?: number;   // USD
  score?: number;   // 0–100
};

/** Shared list consumed by homepage and /compare. */
export const BENDERS: Bender[] = [
  { brand: "RogueFab", model: "M625", capacity: `2" x .120 DOM`, price: undefined, score: 95 },
  { brand: "Brand A",  model: "AB200", capacity: `1.75" x .095`,  price: 1599,     score: 82 },
  { brand: "Brand B",  model: "BX150", capacity: `1.5" x .083`,   price: 1299,     score: 78 },
];
