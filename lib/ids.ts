/**
 * ID/slug utilities used across pages. Keep this file tiny and dependency-free.
 * All functions are pure and safe to call in Server Components.
 */

/** Slugify a string with ASCII folding, lowercase, and dash separation. */
export function slugOf(input: string): string {
  const s = String(input ?? "");
  const decomp = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  return decomp.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}

/** Parse ids from querystring robustly: supports `%2C`, `;`, `|`, spaces, or an array param. */
export function parseIds(ids: string | string[] | undefined): string[] {
  let input = Array.isArray(ids) ? ids.join(",") : (ids ?? "");
  try { input = decodeURIComponent(input); } catch {}
  input = input.replace(/%2C/gi, ",").replace(/[|;]+/g, ",");
  return input.split(",").map((s) => s.trim()).filter(Boolean);
}


/** Derive a friendly display title from optional name/brand/model/id. */
export function titleOf(p: { id: string; name?: string; brand?: string; model?: string }): string {
  return (p.name && p.name.trim())
    || [p.brand, p.model].filter(Boolean).join(" ").trim()
    || p.id;
}

/** Compute a review slug for a product (prefer explicit slug, else from id/title). */
export function slugForProduct(p: { id: string; slug?: string; name?: string; brand?: string; model?: string }): string {
  if (p.slug && p.slug.length) return p.slug;
  // Fall back to id or derived title to ensure a stable slug
  const basis = p.id || titleOf(p);
  return slugOf(basis);
}
