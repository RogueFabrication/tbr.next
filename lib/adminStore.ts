import fs from "fs";
import path from "path";

/**
 * Lightweight JSON-backed overlay store.
 *
 * - Base IDs come from lib/data (see listProductIds).
 * - This module only manages an overlay keyed by product id.
 * - On local Node runtime, overlay is persisted to:
 *     data/admin/products.overlay.json
 * - On Vercel, writes are blocked at the route level; any write
 *   failures here are caught and ignored for safety.
 */

export type Row = { id: string; [k: string]: unknown };

const OVERLAY_FILE = path.join(
  process.cwd(),
  "data",
  "admin",
  "products.overlay.json"
);

let overlay: Record<string, Partial<Row>> = loadOverlayFromDisk();

function loadOverlayFromDisk(): Record<string, Partial<Row>> {
  try {
    const text = fs.readFileSync(OVERLAY_FILE, "utf8");
    const data = JSON.parse(text);
    if (data && typeof data === "object") {
      return data as Record<string, Partial<Row>>;
    }
  } catch (err) {
    // Missing file or invalid JSON: treat as empty overlay.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[adminStore] overlay not loaded, using empty overlay:",
        (err as Error).message
      );
    }
  }
  return {};
}

function persistOverlayToDisk() {
  try {
    const dir = path.dirname(OVERLAY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(OVERLAY_FILE, JSON.stringify(overlay, null, 2), "utf8");
  } catch (err) {
    // On Vercel / read-only FS, writes may fail. Do not crash the app.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[adminStore] failed to persist overlay JSON:",
        (err as Error).message
      );
    }
  }
}

/**
 * Update overlay for a given id (id is always string).
 * Returns the merged overlay entry.
 */
export function update(id: string, patch: Record<string, unknown>) {
  const existing = overlay[id] ?? {};
  const { id: _drop, ...rest } = patch as any;
  overlay[id] = { ...existing, ...rest };
  persistOverlayToDisk();
  return overlay[id];
}

/**
 * Merge helper: given base ids, apply overlay.
 * Base rows must at least contain an `id` field.
 */
export function mergeWithOverlay(ids: { id: string }[]): Row[] {
  return ids.map((r) => ({ ...r, ...(overlay[r.id] ?? {}) }));
}

/** Debug snapshot of overlay size and on-disk path. */
export function info() {
  return {
    overlayCount: Object.keys(overlay).length,
    overlayFile: OVERLAY_FILE,
  };
}

/** Clear overlay (local dev only). Also clears persisted JSON if possible. */
export function clearOverlay() {
  overlay = {};
  persistOverlayToDisk();
}
