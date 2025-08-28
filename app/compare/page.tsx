// Server component: prefilter dataset from query, then render client table
import CompareClient from "../../components/compare/CompareClient";
import { BENDERS, toSlug } from "../../data/benders";
import type { Bender } from "../../data/benders";

/** Parse a comma-separated list from a query value. */
function splitCSV(v?: string | string[]): string[] {
  if (!v) return [];
  const s = Array.isArray(v) ? v.join(",") : v;
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Build filtered rows by ids and/or slugs. Falls back to all rows. */
function filterRows(params?: Record<string, string | string[] | undefined>): Bender[] {
  const p = params ?? {};
  const idTokens = splitCSV(p["ids"]);
  const slugTokens = splitCSV(p["m"] ?? p["models"]).map((s) => s.toLowerCase());

  // Accept ids passed as numbers (dataset ids), strings (dataset ids stored as strings),
  // and 1-based row positions (e.g., ids=3,1 means show 3rd and 1st entries).
  const idNumSet = new Set<number>(
    idTokens
      .map((t) => Number(t))
      .filter((n) => Number.isInteger(n))
  );
  const idStrSet = new Set<string>(idTokens);

  const slugSet = new Set<string>(slugTokens);

  // If no filters provided, return all
  const hasFilter = idNumSet.size > 0 || idStrSet.size > 0 || slugSet.size > 0;
  if (!hasFilter) return BENDERS;

  return BENDERS.filter((b, i) => {
    const slugMatch = slugSet.has(toSlug(b));
    // dataset id can be number or string; also accept 1-based row index
    const idx1 = i + 1;
    const idMatch =
      idNumSet.has(Number((b as any).id)) ||
      idStrSet.has(String((b as any).id)) ||
      idNumSet.has(idx1) ||
      idStrSet.has(String(idx1));
    return slugMatch || idMatch;
  });
}

export default function ComparePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const rows = filterRows(searchParams);
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Compare</h1>
      <CompareClient rows={rows} />
    </div>
  );
}
