import {
  allTubeBenders,
  type Product,
  type ProductCitation,
  type ProductCitationSourceType,
} from "./catalog";
import { mergeWithOverlay } from "./adminStore";

/**
 * Parse a line-based citations field (as entered in admin) into structured
 * ProductCitation objects.
 *
 * Expected format per line:
 *   category | sourceType | urlOrRef | title | accessed (YYYY-MM-DD) | note
 *
 * - category: scoring category key (e.g. "valueForMoney", "bendAngleCapability").
 * - sourceType: "web-page" | "pdf" | "manual" | "email" | "other" (case-insensitive).
 * - urlOrRef: URL or internal reference.
 * - title: short human label.
 * - accessed: optional date string (YYYY-MM-DD preferred).
 * - note: freeform explanation (page/section / what was used).
 */
function parseCitationLines(raw: unknown): ProductCitation[] {
  if (typeof raw !== "string") return [];

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const allowedTypes: ProductCitationSourceType[] = [
    "web-page",
    "pdf",
    "manual",
    "email",
    "other",
  ];

  const citations: ProductCitation[] = [];

  lines.forEach((line, index) => {
    const parts = line.split("|").map((p) => p.trim());
    if (parts.length < 3) {
      // Require at least category, sourceType, urlOrRef.
      return;
    }

    const [categoryRaw, sourceTypeRaw, urlOrRefRaw, titleRaw, accessedRaw, ...noteParts] =
      parts;

    const category = categoryRaw || "unspecified";
    const urlOrRef = urlOrRefRaw || "";
    if (!urlOrRef) return;

    const normalizedType = (sourceTypeRaw || "other").toLowerCase();
    const sourceType = (allowedTypes.includes(
      normalizedType as ProductCitationSourceType,
    )
      ? normalizedType
      : "other") as ProductCitationSourceType;

    const title = titleRaw || null;
    const accessed = accessedRaw || null;
    const note =
      noteParts.length > 0 ? noteParts.join(" | ").trim() || null : null;

    citations.push({
      id: `${category}-${index + 1}`,
      category,
      field: null,
      sourceType,
      urlOrRef,
      title,
      accessed,
      note,
    });
  });

  return citations;
}

/**
 * Returns all tube benders with any admin overlay applied.
 *
 * This is intended for server-side reads only (pages, layouts, and API routes).
 * It relies on the JSON-backed overlay store at `data/admin/products.overlay.json`
 * via `lib/adminStore`, which uses the Node filesystem and should not be
 * imported into client components.
 *
 * The overlay is keyed by product `id` and can override any subset of fields
 * on the base `Product` objects (e.g. price, weight, marketing highlights).
 */
export function getAllTubeBendersWithOverlay(): Product[] {
  // `mergeWithOverlay` is expected to be generic over rows that at least have
  // an `id` field, and will shallow-merge any overlay values by that id.
  //
  // After merging, we normalize a few fields so that overlay edits stay
  // compatible with how the public UI expects to consume them.
  const merged = mergeWithOverlay(allTubeBenders);

  return merged.map((raw) => {
    const b = { ...raw } as Product & { highlights?: unknown };

    // Normalize highlights:
    // - base catalog uses string[]
    // - admin overlay currently writes a single comma-separated string
    //   (e.g. "foo, bar, baz")
    //
    // If we see a string here, split it into a trimmed string[] so that
    // Array.isArray checks in the public UI continue to work as designed.
    if (typeof b.highlights === "string") {
      const parts = (b.highlights as string)
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      b.highlights = parts as unknown as Product["highlights"];
    }

    // Ensure review content and citations fields are explicitly passed through from overlay.
    const overlayFields = raw as any;

    let parsedCitations: ProductCitation[] | null = null;
    if (Array.isArray(overlayFields.citations)) {
      // If overlay ever writes structured citations directly, trust them but
      // filter to a minimal shape.
      parsedCitations = overlayFields.citations
        .map((c: any, index: number) => {
          if (!c || typeof c !== "object") return null;
          const id = typeof c.id === "string" && c.id.length > 0
            ? c.id
            : `citation-${index + 1}`;
          return {
            id,
            category: String(c.category ?? "unspecified"),
            field: c.field ?? null,
            sourceType: (c.sourceType ??
              "other") as ProductCitationSourceType,
            urlOrRef: String(c.urlOrRef ?? ""),
            title: c.title ?? null,
            accessed: c.accessed ?? null,
            note: c.note ?? null,
          } satisfies ProductCitation;
        })
        .filter(Boolean) as ProductCitation[];
    } else if (typeof overlayFields.citationsRaw === "string") {
      const parsed = parseCitationLines(overlayFields.citationsRaw);
      if (parsed.length > 0) {
        parsedCitations = parsed;
      }
    }

    return {
      ...b,
      pros: overlayFields.pros ?? b.pros ?? null,
      cons: overlayFields.cons ?? b.cons ?? null,
      consSources: overlayFields.consSources ?? b.consSources ?? null,
      keyFeatures: overlayFields.keyFeatures ?? b.keyFeatures ?? null,
      materials: overlayFields.materials ?? b.materials ?? null,
      citationsRaw:
        overlayFields.citationsRaw ?? b.citationsRaw ?? null,
      citations: parsedCitations ?? b.citations ?? null,
    } as Product;
  });
}

/**
 * Convenience helper to retrieve a single tube bender by id or slug with
 * the overlay applied.
 *
 * This keeps callers from needing to understand overlay mechanics and ensures
 * that all public reads of a single product stay consistent with the merged
 * catalog.
 */
export function findTubeBenderWithOverlay(
  predicate: (bender: Product) => boolean,
): Product | undefined {
  return getAllTubeBendersWithOverlay().find(predicate);
}

