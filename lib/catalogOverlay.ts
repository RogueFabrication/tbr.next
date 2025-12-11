import {
  allTubeBenders,
  type Product,
  type ProductCitation,
  type ProductCitationSourceType,
} from "./catalog";
import { mergeWithOverlay } from "./adminStore";
import { getAllBenderOverlaysMap } from "./benderOverlayRepo";

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

export async function getAllTubeBendersWithOverlay(): Promise<Product[]> {
  // 1) Start from base catalog
  const mergedFromJson = mergeWithOverlay(allTubeBenders);

  // 2) Load Neon overlays (scoring-related fields)
  let neonMap: Record<string, any> | null = null;
  try {
    neonMap = await getAllBenderOverlaysMap();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[catalogOverlay] failed to load Neon overlays:",
        (err as Error).message,
      );
    }
  }

  return mergedFromJson.map((raw) => {
    const b = { ...raw } as Product & { highlights?: unknown };
    const overlayFields = raw as any;

    // ---- existing highlight normalization ----
    if (typeof b.highlights === "string") {
      const parts = (b.highlights as string)
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      b.highlights = parts as unknown as Product["highlights"];
    }

    // ---- existing citations handling (unchanged) ----
    let parsedCitations: ProductCitation[] | null = null;
    if (Array.isArray(overlayFields.citations)) {
      parsedCitations = overlayFields.citations
        .map((c: any, index: number) => {
          if (!c || typeof c !== "object") return null;
          const id =
            typeof c.id === "string" && c.id.length > 0
              ? c.id
              : `citation-${index + 1}`;
          return {
            id,
            category: String(c.category ?? "unspecified"),
            field: c.field ?? null,
            sourceType: (c.sourceType ?? "other") as ProductCitationSourceType,
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

    // ---- Apply Neon overlay on top (if present) ----
    const neon = neonMap?.[b.id];

    if (neon) {
      // Only override if Neon has a non-null value
      if (neon.usaManufacturingTier != null) {
        (b as any).usaManufacturingTier = neon.usaManufacturingTier;
      }
      if (neon.originTransparencyTier != null) {
        (b as any).originTransparencyTier = neon.originTransparencyTier;
      }
      if (neon.singleSourceSystemTier != null) {
        (b as any).singleSourceSystemTier = neon.singleSourceSystemTier;
      }
      if (neon.warrantyTier != null) {
        (b as any).warrantyTier = neon.warrantyTier;
      }
      if (neon.portability != null) {
        (b as any).portability = neon.portability;
      }
      if (neon.wallThicknessCapacity != null) {
        (b as any).wallThicknessCapacity = neon.wallThicknessCapacity;
      }
      if (neon.materials != null) {
        (b as any).materials = neon.materials;
      }
      if (neon.dieShapes != null) {
        (b as any).dieShapes = neon.dieShapes;
      }
      if (neon.mandrel != null) {
        (b as any).mandrel = neon.mandrel;
      }

      (b as any).hasPowerUpgradePath = neon.hasPowerUpgradePath;
      (b as any).lengthStop = neon.lengthStop;
      (b as any).rotationIndexing = neon.rotationIndexing;
      (b as any).angleMeasurement = neon.angleMeasurement;
      (b as any).autoStop = neon.autoStop;
      (b as any).thickWallUpgrade = neon.thickWallUpgrade;
      (b as any).thinWallUpgrade = neon.thinWallUpgrade;
      (b as any).wiperDieSupport = neon.wiperDieSupport;
      (b as any).sBendCapability = neon.sBendCapability;
    }

    // ---- final merged product ----
    return {
      ...b,
      pros: overlayFields.pros ?? b.pros ?? null,
      cons: overlayFields.cons ?? b.cons ?? null,
      consSources: overlayFields.consSources ?? b.consSources ?? null,
      keyFeatures: overlayFields.keyFeatures ?? b.keyFeatures ?? null,
      materials: overlayFields.materials ?? b.materials ?? null,
      citationsRaw: overlayFields.citationsRaw ?? b.citationsRaw ?? null,
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
export async function findTubeBenderWithOverlay(
  predicate: (bender: Product) => boolean
): Promise<Product | undefined> {
  const all = await getAllTubeBendersWithOverlay();
  return all.find(predicate);
}

