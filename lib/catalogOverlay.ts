import { allTubeBenders, type Product } from "./catalog";
import { mergeWithOverlay } from "./adminStore";

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
  // We cast the generic here to keep the public surface of this helper strongly
  // typed as `Product[]`, while still allowing the overlay store to supply
  // partial patches of those objects.
  return mergeWithOverlay(allTubeBenders);
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

