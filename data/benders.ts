/**
 * Typed dataset for TubeBenderReviews.
 *
 * IMPORTANT:
 * - This file is **UI-only** and is meant to drive lightweight hero/compare
 *   components. The real scoring system pulls from the main catalog +
 *   admin overlay, not from here.
 * - To add a new machine to the simple comparison lists:
 *     1) Add a new row to `BENDERS` below with the correct `brand` + `model`.
 *     2) Keep `capacity` conservative. If you don't want to publish a real
 *        spec yet, use a clear placeholder string like
 *        `"Specs TBD – see main catalog"`.
 *     3) Place the corresponding product photo at:
 *           /public/images/products/<slug>.jpg
 *        where `<slug>` comes from `toSlug({ brand, model })`.
 * - To remove a machine from the simple lists, just delete its row here. This
 *   does NOT affect the main catalog or scoring engine.
 */
export type Bender = {
  brand: string;
  model: string;
  capacity: string; // human-facing description only
  price?: number;   // optional, for simple UI use only
  score?: number;   // optional, 0–100, NOT wired to the main scoring engine
};

/**
 * Shared list consumed by homepage and /compare.
 *
 * Notes:
 * - Capacities and prices here are intentionally kept as "Specs TBD" style
 *   placeholders unless you explicitly decide to wire in real numbers.
 * - Real spec tables and scores should come from the main catalog +
 *   overlay + scoring engine, not from this file.
 */
export const BENDERS: Bender[] = [
  // RogueFab lineup
  {
    brand: "RogueFab",
    model: "M601",
    capacity: "Specs TBD – see main RogueFab catalog entry",
  },
  {
    brand: "RogueFab",
    model: "M605",
    capacity: "Specs TBD – see main RogueFab catalog entry",
  },
  {
    brand: "RogueFab",
    model: "M625",
    capacity: "Specs TBD – see main RogueFab catalog entry",
  },

  // Baileigh
  {
    brand: "Baileigh",
    model: "RDB-050",
    capacity: "Specs TBD – Baileigh RDB-050 placeholder",
  },
  {
    brand: "Baileigh",
    model: "RDB-250",
    capacity: "Specs TBD – Baileigh RDB-250 placeholder",
  },

  // Hossfeld
  {
    brand: "Hossfeld",
    model: "No. 2",
    capacity: "Specs TBD – Hossfeld No.2 placeholder",
  },

  // JD2
  {
    brand: "JD2",
    model: "Model 32",
    capacity: "Specs TBD – Model 32 (manual) placeholder",
  },
  {
    brand: "JD2",
    model: "Model 32 Hydraulic",
    capacity: "Specs TBD – Model 32 (hydraulic) placeholder",
  },

  // JMR
  {
    brand: "JMR",
    model: "TBM-250 Ultra",
    capacity: "Specs TBD – JMR TBM-250 Ultra placeholder",
  },
  {
    brand: "JMR",
    model: "TBM-250R Raceline",
    capacity: "Specs TBD – JMR TBM-250R Raceline placeholder",
  },

  // Mittler Bros
  {
    brand: "Mittler Bros",
    model: "2500",
    capacity: "Specs TBD – Mittler Bros 2500 placeholder",
  },

  // Pro-Tools
  {
    brand: "Pro-Tools",
    model: "105HD",
    capacity: "Specs TBD – Pro-Tools 105HD placeholder",
  },
  {
    brand: "Pro-Tools",
    model: "Brute",
    capacity: "Specs TBD – Pro-Tools Brute placeholder",
  },

  // SWAG Off Road
  {
    brand: "SWAG Off Road",
    model: "REV 2",
    capacity: "Specs TBD – SWAG Off Road REV 2 placeholder",
  },

  // Woodward Fab
  {
    brand: "Woodward Fab",
    model: "WFB2",
    capacity: "Specs TBD – Woodward Fab WFB2 placeholder",
  },

  // Additional relevant competitors (placeholders; specs to be filled in via admin/catalog)
  {
    brand: "Affordable Bender",
    model: "Tube Bender",
    capacity: "Specs TBD – Affordable Bender placeholder entry",
  },
  {
    brand: "Vevor",
    model: "Hydraulic Tube Bender",
    capacity: "Specs TBD – Vevor bender placeholder entry",
  },
  {
    brand: "Tube Shark",
    model: "Tube Shark",
    capacity: "Specs TBD – Tube Shark bender placeholder entry",
  },
  {
    brand: "PDR",
    model: "PDR Bender (Randy Gabriel)",
    capacity: "Specs TBD – PDR bender placeholder entry",
  },
  {
    brand: "ProBender",
    model: "ProBender Hydraulic",
    capacity: "Specs TBD – ProBender lineup placeholder entry",
  },
];

/**
 * Create a stable slug for matching selections from the URL, e.g.:
 *   brand "RogueFab", model "M625"  -> "roguefab-m625"
 *   brand "Brand B",  model "BX150" -> "brand-b-bx150"
 */
export function toSlug(b: Pick<Bender, "brand" | "model">): string {
  const slug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${slug(b.brand)}-${slug(b.model)}`;
}
