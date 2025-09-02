/**
 * Admin in-memory overlay store.
 * Base data is loaded once from lib/tube-benders.ts or lib/catalog.ts.
 * Prefer object arrays; if only slug arrays exist, map via a dictionary export when available.
 */
import * as TB from "./tube-benders";
import * as CATALOG from "./catalog";

export type Row = { id: number | string; [k: string]: unknown };

let base: Row[] | null = null;
let overlay: Record<number | string, Partial<Row>> = {};

const collectArrays = (mod: Record<string, unknown>): unknown[][] => {
  const out: unknown[][] = [];
  if (!mod) return out;
  const named = [
    (mod as any),
    (mod as any)?.default,
    (mod as any)?.rows,
    (mod as any)?.list,
    (mod as any)?.BENDERS,
    (mod as any)?.TUBE_BENDERS,
    (mod as any)?.benders,
    (mod as any)?.tubeBenders,
  ];
  for (const v of named) if (Array.isArray(v)) out.push(v);
  for (const k of Object.keys(mod)) {
    const v = (mod as any)[k];
    if (Array.isArray(v)) out.push(v);
  }
  return out;
};

const firstObjectArray = (arrays: unknown[][]): Row[] | null => {
  for (const arr of arrays) {
    const f = arr[0];
    if (f && typeof f === "object" && !Array.isArray(f)) return arr as Row[];
  }
  return null;
};

const firstStringArray = (arrays: unknown[][]): string[] | null => {
  for (const arr of arrays) {
    const f = arr[0];
    if (typeof f === "string") return arr as string[];
  }
  return null;
};

const findDictionary = (mod: Record<string, unknown>): Record<string, any> | null => {
  const candidates = [
    (mod as any)?.BENDERS,
    (mod as any)?.benders,
    (mod as any)?.BY_SLUG,
    (mod as any)?.bySlug,
    (mod as any)?.catalog,
    (mod as any)?.items,
    (mod as any)?.default,
  ];
  for (const d of candidates) {
    if (d && typeof d === "object" && !Array.isArray(d)) return d as Record<string, any>;
  }
  return null;
};

function ensureBase() {
  if (base) return;
  const tbArrays = collectArrays(TB as any);
  const catArrays = collectArrays(CATALOG as any);

  const tbObj = firstObjectArray(tbArrays);
  if (tbObj) { base = tbObj; return; }
  const catObj = firstObjectArray(catArrays);
  if (catObj) { base = catObj; return; }

  const tbStr = firstStringArray(tbArrays);
  if (tbStr) {
    const dict = findDictionary(TB as any);
    base = tbStr.map(s => ({ id: s, ...(dict?.[s] ?? {}) })) as Row[];
    return;
  }
  const catStr = firstStringArray(catArrays);
  if (catStr) {
    const dict = findDictionary(CATALOG as any);
    base = catStr.map(s => ({ id: s, ...(dict?.[s] ?? {}) })) as Row[];
    return;
  }
  base = [];
}

export function getAll(): Row[] {
  ensureBase();
  return (base as Row[]).map((r) => ({ ...r, ...(overlay[r.id] ?? {}) }));
}

export function update(id: number | string, patch: Record<string, unknown>) {
  ensureBase();
  const existing = overlay[id] ?? {};
  const { id: _drop, ...rest } = patch as any;
  overlay[id] = { ...existing, ...rest };
  return overlay[id];
}

export function clearOverlay() {
  overlay = {};
}
