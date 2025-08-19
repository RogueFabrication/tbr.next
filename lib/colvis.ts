

export const COL_COOKIE = "tbr_cols";

export type ColKey = "model" | "price" | "maxCapacity" | "power" | "origin";

export const ALL_COLS: ColKey[] = ["model", "price", "maxCapacity", "power", "origin"];

export const DEFAULT_VISIBLE: ColKey[] = ["model", "price", "maxCapacity", "power", "origin"];

export function normalizeCols(input: unknown): ColKey[] {
  if (!Array.isArray(input)) return DEFAULT_VISIBLE;
  const set = new Set<ColKey>();
  for (const k of input) {
    if (ALL_COLS.includes(k as ColKey)) set.add(k as ColKey);
  }
  return set.size ? Array.from(set) : DEFAULT_VISIBLE;
}
