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

/** True if token is a non-negative integer (e.g., "2"). */
export function isIntToken(t: string): boolean {
  return /^[0-9]+$/.test(t);
}

/**
 * Decide if numeric tokens should be treated as 1-based or 0-based for a given request.
 * - If every int is in [1..listLen] and there is no "0", prefer 1-based.
 * - Otherwise, default to 0-based.
 */
export function chooseIndexScheme(tokens: string[], listLen: number): "one" | "zero" {
  const ints = tokens.filter(isIntToken);
  if (ints.length === 0) return "zero";
  const allOneRange = ints.every(t => { const n = parseInt(t, 10); return n >= 1 && n <= listLen; });
  const hasZero = ints.some(t => t === "0");
  return (allOneRange && !hasZero) ? "one" : "zero";
}

/** Derive a friendly display title from optional name/brand/model/id. */
export function titleOf(p: { id: string; name?: string; brand?: string; model?: string }): string {
  return (p.name && p.name.trim())
    || [p.brand, p.model].filter(Boolean).join(" ").trim()
    || p.id;
}
