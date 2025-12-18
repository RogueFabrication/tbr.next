export type ProductCitationSourceType =
  | "web-page"
  | "pdf"
  | "manual"
  | "email"
  | "other";

export type ProductCitation = {
  id: string;
  /** Scoring category key (e.g. "valueForMoney") */
  category: string;
  /** Optional: specific field within the category */
  field: string | null;
  sourceType: ProductCitationSourceType;
  /** URL or internal doc reference */
  urlOrRef: string;
  /** Short label for humans */
  title: string | null;
  /** YYYY-MM-DD preferred */
  accessed: string | null;
  /** Page/section/notes */
  note: string | null;
};

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
  /** Public image path under /public (e.g., /images/products/<id>.jpg). */
  image?: string;
  /** Short bullets for the review page and tiles. */
  highlights?: string[];
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
  // Review content fields (admin-editable via overlay)
  pros?: string | null;
  cons?: string | null;
  consSources?: string | null;
  keyFeatures?: string | null;
  materials?: string | null;
};

/**
 * Seed catalog for public compare/review UI.
 * These entries are intentionally simpler than the full DB schema from the old app:
 * we only expose fields the UI actually reads today.
 *
 * NOTE:
 * - The first 4 IDs are kept in sync with the public /api/tube-benders endpoint.
 * - Additional IDs are UI-only for now and can be wired to the API later.
 */
export const allTubeBenders: Product[] = [
  // --- Canonical 4 (match existing public API IDs) -------------------------
  {
    id: "roguefab-m600-series",
    slug: "roguefab-m600-series",
    name: "RogueFab M6xx Series",
    brand: "RogueFab",
    model: "M600/M605/M625",
    image: "/images/products/roguefab-m600-series.jpg",
    country: "USA",
    capacity: '2-3/8" OD',
    warranty: "Lifetime (workmanship & material)",
    price: "$1,895 – $2,695",
    highlights: [
      "High-end shop bender with serious capacity",
      "Extensive upgrade path (air/hydraulic, mandrel, tooling)",
      "Strong value score in long-term ownership",
    ],
  },
  {
    id: "jd2-model-32",
    slug: "jd2-model-32",
    name: "JD2 Model 32",
    brand: "JD2",
    model: "Model 32",
    image: "/images/products/jd2-model-32.jpg",
    country: "USA",
    capacity: '2" OD (typical roll cage sizes)',
    warranty: "Manufacturer standard",
    price: "$1,545 – $1,895",
    highlights: [
      "Well-known manual bender with long track record",
      "Simple, field-proven design with easy maintenance",
      "Huge installed base and community support",
    ],
  },
  {
    id: "pro-tools-105hd",
    slug: "pro-tools-105hd",
    name: "Pro-Tools 105HD",
    brand: "Pro-Tools",
    model: "105HD",
    image: "/images/products/pro-tools-105hd.jpg",
    country: "USA",
    capacity: '2" OD',
    warranty: "Manufacturer standard",
    price: "$1,264 – $1,609",
    highlights: [
      "Heavy-duty main frame with US-built components",
      "Common choice for small fab shops and hobby race teams",
      "Strong aftermarket die and accessory ecosystem",
    ],
  },
  {
    id: "baileigh-rdb-250",
    slug: "baileigh-rdb-250",
    name: "Baileigh RDB-250",
    brand: "Baileigh",
    model: "RDB-250",
    image: "/images/products/baileigh-rdb-250.jpg",
    country: "Imported",
    capacity: '2"–2.5" OD (varies by material)',
    warranty: "1 Year Limited",
    price: "Pro-tier pricing (varies by package)",
    highlights: [
      "Powered rotation with programmable bend angles",
      "Targeted at production/pro shops needing repeatability",
      "Requires commitment in budget and floor space",
    ],
  },

  // --- Additional models from the old seed data ---------------------------
  {
    id: "baileigh-rdb-050",
    slug: "baileigh-rdb-050",
    name: "Baileigh RDB-050",
    brand: "Baileigh",
    model: "RDB-050",
    image: "/images/products/baileigh-rdb-050.jpg",
    country: "Taiwan",
    capacity: '2.5" OD',
    warranty: "1 Year Limited",
    price: "$2,895 – $3,495",
    highlights: [
      "Manual rotary-draw bender with decent capacity",
      "Three-speed operation for flexibility with thicker tube",
      "Includes stand and degree dial in most packages",
    ],
  },
  {
    id: "jd2-model-32-hydraulic",
    slug: "jd2-model-32-hydraulic",
    name: "JD2 Model 32 Hydraulic",
    brand: "JD2",
    model: "Model 32 + Power Pack",
    image: "/images/products/jd2-model-32-hydraulic.jpg",
    country: "USA",
    capacity: '2" OD (hydraulic assist)',
    warranty: "Manufacturer standard",
    price: "$2,045 – $2,395",
    highlights: [
      "Hydraulic power pack upgrade for the Model 32",
      "Proven design with decades of field use",
      "Good bridge between manual and full production benders",
    ],
  },
  {
    id: "woodward-fab-wfb2",
    slug: "woodward-fab-wfb2",
    name: "Woodward Fab WFB2",
    brand: "Woodward Fab",
    model: "WFB2",
    image: "/images/products/woodward-fab-wfb2.jpg",
    country: "Imported",
    capacity: '2" OD (light wall)',
    warranty: "Limited",
    price: "$839 – $1,195",
    highlights: [
      "Very low entry price for a rotary-draw style bender",
      "CNC-machined components and engraved degree dial",
      "Aimed at budget-conscious hobby users",
    ],
  },
  {
    id: "jmr-tbm-250r-raceline",
    slug: "jmr-tbm-250r-raceline",
    name: "JMR TBM-250R RaceLine",
    brand: "JMR Manufacturing",
    model: "TBM-250R",
    image: "/images/products/jmr-tbm-250r-raceline.jpg",
    country: "USA",
    capacity: '2" OD',
    warranty: "Manufacturer standard",
    price: "$780 – $950",
    highlights: [
      "American-made manual bender aimed at race chassis work",
      "Three-speed manual operation for control over bend effort",
      "Heat-treated pins and hardware for long service life",
    ],
  },
  {
    id: "jmr-tbm-250-ultra",
    slug: "jmr-tbm-250-ultra",
    name: "JMR TBM-250 Ultra",
    brand: "JMR Manufacturing",
    model: "TBM-250 Ultra",
    image: "/images/products/jmr-tbm-250-ultra.jpg",
    country: "USA",
    capacity: '2" OD',
    warranty: "Manufacturer standard",
    price: "$1,000 – $1,250",
    highlights: [
      "Up-spec version of the TBM-250 with premium hardware",
      "Bronze bushings and upgraded finish for heavy use",
      "Targeted at serious fab shops needing durability",
    ],
  },
  {
    id: "pro-tools-brute",
    slug: "pro-tools-brute",
    name: "Pro-Tools BRUTE",
    brand: "Pro-Tools",
    model: "BRUTE",
    image: "/images/products/pro-tools-brute.jpg",
    country: "USA",
    capacity: 'Up to ~2.5" tube (by material)',
    warranty: "Manufacturer standard",
    price: "$4,500 – $6,500",
    highlights: [
      "Very high-capacity bender for heavy chassis and industrial work",
      "Hydraulic system with large cylinder and long stroke",
      "Built for pro shops where duty cycle matters",
    ],
  },
  {
    id: "mittler-bros-2500",
    slug: "mittler-bros-2500",
    name: "Mittler Bros 2500",
    brand: "Mittler Bros",
    model: "2500",
    image: "/images/products/mittler-bros-2500.jpg",
    country: "USA",
    capacity: '2.5" class with 25-ton ram (package dependent)',
    warranty: "Manufacturer standard",
    price: "$3,200 – $4,200",
    highlights: [
      "25-ton hydraulic ram with serious forming capability",
      "180° bending with appropriate die sets",
      "Common in circle track and race chassis applications",
    ],
  },
  {
    id: "hossfeld-no2",
    slug: "hossfeld-no2",
    name: "Hossfeld No. 2",
    brand: "Hossfeld",
    model: "No. 2",
    image: "/images/products/hossfeld-no2.jpg",
    country: "USA",
    capacity: 'Broad range depending on tooling',
    warranty: "Limited",
    price: "$1,800 – $2,500",
    highlights: [
      "Classic universal bender with 100+ years of history",
      "Huge tooling ecosystem for flat, bar, and tube",
      "Great for shops needing a general-purpose forming tool",
    ],
  },
  {
    id: "swag-offroad-rev2",
    slug: "swag-offroad-rev2",
    name: "SWAG Off Road REV 2",
    brand: "SWAG Off Road",
    model: "REV 2",
    image: "/images/products/swag-offroad-rev2.jpg",
    country: "USA",
    capacity: '2.0" OD (manual / hydraulic assist)',
    warranty: "1 Year Limited",
    price: "$970 – $1,250",
    highlights: [
      "Well-regarded DIY-friendly bender with tight tolerances",
      "Can be paired with bottle jack or hydraulic setups",
      "Popular in off-road and home-fabricator garages",
    ],
  },
];

/**
 * Canonical IDs list for lightweight imports (e.g., landing page).
 * Kept in sync with `allTubeBenders`.
 */
export const VALID_IDS: string[] = allTubeBenders.map((p) => p.id);