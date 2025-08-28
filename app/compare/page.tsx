// Server component: prefilters rows based on query params, then renders the client wrapper.
// Supports:
//   ?ids=3,1                     -> match by numeric id(s)
//   ?m=roguefab-m625,brand-a-ab200  (alias: ?models=...) -> match by slugs
//   no params                    -> show all rows (current behavior)
//
// No dependency changes. UI unchanged.

import CompareClient from "../../components/compare/CompareClient";
import { BENDERS, toSlug } from "../../data/benders";
import type { Bender } from "../../data/benders";

/** Split a Next.js search param into a normalized list. Accepts comma-delimited values. */
function paramToList(v?: string | string[]): string[] {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr
    .flatMap((s) => String(s).split(","))
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Prefilter rows based on ids or model slugs. */
function prefilter(all: Bender[], searchParams?: Record<string, string | string[] | undefined>): Bender[] {
  if (!searchParams) return all;

  const ids = paramToList(searchParams.ids as any);
  const models = paramToList((searchParams.m ?? searchParams.models) as any);

  if (ids.length > 0) {
    const wanted = new Set(ids.map(String));
    return all.filter((r) => wanted.has(String((r as any).id)));
  }

  if (models.length > 0) {
    const wanted = new Set(models.map((s) => s.toLowerCase()));
    return all.filter((r) => wanted.has(toSlug(r)));
  }

  return all;
}

export default function ComparePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const all = BENDERS as Bender[];
  const rows = prefilter(all, searchParams);

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Compare</h1>
      {/* Render exactly one client wrapper to avoid duplicate Filter blocks */}
      <CompareClient rows={rows} />
    </>
  );
}
