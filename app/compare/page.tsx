// app/compare/page.tsx
import { BENDERS, toSlug } from "../../data/benders";
import CompareClient from "../../components/compare/CompareClient";

export const metadata = { title: "Compare | TubeBenderReviews" };

type SP = Record<string, string | string[] | undefined>;

/** Collect raw selection tokens from search params (strings only). */
function collectTokens(sp: SP): string[] {
  const raw: string[] = [];
  const push = (v: string | string[] | undefined) => {
    if (!v) return;
    if (Array.isArray(v)) raw.push(...v);
    else raw.push(v);
  };
  // Slug-based params
  push(sp.m);         // /compare?m=roguefab-m625&m=brand-b-bx150
  push(sp.models);    // /compare?models=roguefab-m625,brand-a-ab200
  push(sp.model);     // accept a single 'model' if emitted elsewhere
  // Numeric-based params (what the guide currently emits)
  push(sp.ids);       // /compare?ids=3,1  (either 1-based or 0-based)

  return raw
    .flatMap((s) => s.split(","))
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/** Convert tokens into slugs by:
 *  - If token is a number: map to current BENDERS by index (supports 1-based and 0-based)
 *  - Else: treat the token as a slug already
 */
function tokensToSlugs(tokens: string[]): Set<string> {
  const out = new Set<string>();
  for (const t of tokens) {
    // numeric?
    const n = Number(t);
    if (Number.isFinite(n) && t !== "") {
      // Try 1-based first (ID=1 -> index 0)
      const idx1 = n - 1;
      if (idx1 >= 0 && idx1 < BENDERS.length) {
        out.add(toSlug(BENDERS[idx1]));
        continue;
      }
      // Fallback: 0-based (ID=0 -> index 0)
      const idx0 = n;
      if (idx0 >= 0 && idx0 < BENDERS.length) {
        out.add(toSlug(BENDERS[idx0]));
        continue;
      }
    }
    // assume slug
    out.add(t);
  }
  return out;
}

/** Compare page backed by the shared dataset with optional selection from the URL. */
export default function ComparePage({ searchParams }: { searchParams: SP }) {
  const raw = collectTokens(searchParams);
  const selectedSlugs = tokensToSlugs(raw);
  const rows = selectedSlugs.size ? BENDERS.filter((b) => selectedSlugs.has(toSlug(b))) : BENDERS;

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Compare</h1>
      <CompareClient rows={rows} />
    </div>
  );
}
