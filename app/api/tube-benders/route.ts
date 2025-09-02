import { NextResponse } from "next/server";
// Robust relative imports (no alias)
import * as TB from "../../../lib/tube-benders";
import * as CATALOG from "../../../lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnyMod = Record<string, unknown>;
type RowLike = Record<string, unknown>;

/** Return all array exports we can find in a module by checking common shapes. */
function collectArrays(mod: AnyMod): unknown[][] {
  const out: unknown[][] = [];
  if (!mod) return [];
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
  for (const v of named) {
    if (Array.isArray(v)) out.push(v);
  }
  // Also scan enumerable props
  for (const k of Object.keys(mod)) {
    const v = (mod as any)[k];
    if (Array.isArray(v)) out.push(v);
  }
  return out;
}

function firstObjectArray(arrays: unknown[][]): RowLike[] | null {
  for (const arr of arrays) {
    const first = arr[0];
    if (first && typeof first === "object" && !Array.isArray(first)) {
      return arr as RowLike[];
    }
  }
  return null;
}

function firstStringArray(arrays: unknown[][]): string[] | null {
  for (const arr of arrays) {
    const first = arr[0];
    if (typeof first === "string") {
      return arr as string[];
    }
  }
  return null;
}

function findDictionary(mod: AnyMod): Record<string, any> | null {
  const candidates = [
    (mod as any)?.BENDERS,
    (mod as any)?.benders,
    (mod as any)?.BY_SLUG,
    (mod as any)?.bySlug,
    (mod as any)?.catalog,
    (mod as any)?.items,
    (mod as any)?.default, // sometimes the default is a dict
  ];
  for (const d of candidates) {
    if (d && typeof d === "object" && !Array.isArray(d)) return d as Record<string, any>;
  }
  return null;
}

function loadRows():
  { rows: RowLike[]; source: "tube-benders" | "catalog" | "unknown"; keyCount: number; strategy: string } {
  const tbArrays = collectArrays(TB as AnyMod);
  const catArrays = collectArrays(CATALOG as AnyMod);

  // Prefer object arrays
  const tbObj = firstObjectArray(tbArrays);
  if (tbObj && tbObj.length) return { rows: tbObj, source: "tube-benders", keyCount: Object.keys(TB).length, strategy: "tb-object-array" };
  const catObj = firstObjectArray(catArrays);
  if (catObj && catObj.length) return { rows: catObj, source: "catalog", keyCount: Object.keys(CATALOG).length, strategy: "catalog-object-array" };

  // Fall back to string arrays (slugs) -> try to map via dictionary
  const tbStr = firstStringArray(tbArrays);
  if (tbStr && tbStr.length) {
    const dict = findDictionary(TB as AnyMod);
    const rows = tbStr.map(s => ({ id: s, ...(dict?.[s] ?? {}) }));
    return { rows, source: "tube-benders", keyCount: Object.keys(TB).length, strategy: dict ? "tb-slugs+dict" : "tb-slugs" };
  }
  const catStr = firstStringArray(catArrays);
  if (catStr && catStr.length) {
    const dict = findDictionary(CATALOG as AnyMod);
    const rows = catStr.map(s => ({ id: s, ...(dict?.[s] ?? {}) }));
    return { rows, source: "catalog", keyCount: Object.keys(CATALOG).length, strategy: dict ? "catalog-slugs+dict" : "catalog-slugs" };
  }
  return { rows: [], source: "unknown", keyCount: 0, strategy: "none" };
}

export async function GET() {
  const { rows, source, keyCount, strategy } = loadRows();
  return NextResponse.json({ ok: true, source, strategy, keyCount, length: rows.length, data: rows });
}
