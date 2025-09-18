/**
 * Canonical, minimal catalog for TubeBenderReviews.
 * This file is the single source of truth used by pages and the public API.
 */
export type Product = {
  /** Stable canonical id used in routes and compare. */
  id: string;
  /** Optional route slug; defaults to id. */
  slug?: string;
  /** Human-friendly name; used for tiles/titles. */
  name?: string;
  brand?: string;
  model?: string;
  // Safe optional fields that may be shown on the review page:
  type?: string;
  country?: string;
  madeIn?: string;
  capacity?: string | number;
  max_od?: string | number;
  maxWall?: string | number;
  weight?: string | number;
  dimensions?: string;
  warranty?: string;
  price?: string | number;
};

/** All baseline tube benders (4 known IDs). */
export const allTubeBenders: Product[] = [
  {
    id: "roguefab-m600-series",
    slug: "roguefab-m600-series",
    name: "RogueFab M600 Series",
    brand: "RogueFab",
    model: "M600",
  },
  {
    id: "jd2-model-32",
    slug: "jd2-model-32",
    name: "JD Squared Model 32",
    brand: "JD Squared",
    model: "Model 32",
  },
  {
    id: "pro-tools-105hd",
    slug: "pro-tools-105hd",
    name: "Pro-Tools 105HD",
    brand: "Pro-Tools",
    model: "105HD",
  },
  {
    id: "baileigh-rdb-250",
    slug: "baileigh-rdb-250",
    name: "Baileigh RDB-250",
    brand: "Baileigh",
    model: "RDB-250",
  },
];