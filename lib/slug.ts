/**
 * Create a URL-safe slug from free-form text.
 * - Lowercases
 * - Strips diacritics
 * - Replaces non-alphanumerics with single hyphens
 * - Trims leading/trailing hyphens
 */
export function slugOf(input: string): string {
  const s = String(input ?? "");
  // Normalize and drop diacritics
  const decomp = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  return decomp
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Optional: Slug-equality check.
 * Useful if comparing arbitrary tokens against catalog ids/names.
 */
export function slugEquals(a: string, b: string): boolean {
  return slugOf(a) === slugOf(b);
}

// JSDoc kept concise per guardrails; no deps, safe for server/client use.