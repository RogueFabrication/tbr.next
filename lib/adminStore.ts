/**
 * Overlay-only store (no base loading). Base IDs come from lib/data.
 * Avoids `require()` to keep Next/SWC happy across dev & Vercel.
 */
export type Row = { id: string; [k: string]: unknown };

let overlay: Record<string, Partial<Row>> = {};

/** Update overlay for a given id (id is always string). */
export function update(id: string, patch: Record<string, unknown>) {
  const existing = overlay[id] ?? {};
  const { id: _drop, ...rest } = patch as any;
  overlay[id] = { ...existing, ...rest };
  return overlay[id];
}

/** Merge helper: given base ids, apply overlay. */
export function mergeWithOverlay(ids: { id: string }[]): Row[] {
  return ids.map((r) => ({ ...r, ...(overlay[r.id] ?? {}) }));
}

/** Debug snapshot of overlay size. */
export function info() {
  return { overlayCount: Object.keys(overlay).length };
}

/** Clear overlay (local dev only). */
export function clearOverlay() {
  overlay = {};
}
