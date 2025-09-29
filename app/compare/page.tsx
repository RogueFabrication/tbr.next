import React from "react";
import Link from "next/link";
import { allTubeBenders } from "../../lib/catalog";
import ShareLink from "../../components/ShareLink";
import { redirect } from "next/navigation";
import { slugOf, parseIds, isIntToken, chooseIndexScheme, titleOf, slugForProduct } from "../../lib/ids";
// NOTE: Small, safe change: accept numeric tokens from Buyer's Guide (?ids=2,1)

type Product = {
  id: string;
  slug?: string;
  name?: string;
  brand?: string;
  model?: string;
};

/** Normalize a free-form token (id/slug/brand+model/name) to slug. */
const normalizeToken = (t: string) => slugOf(t.trim());

function buildLookup(products: Product[]): Map<string, Product> {
  const map = new Map<string, Product>();
  for (const p of products) {
    const cands = new Set<string>();
    if (p.id) cands.add(p.id);
    if (p.slug) cands.add(p.slug);
    if (p.name) cands.add(p.name);
    const bm = [p.brand, p.model].filter(Boolean).join(" ");
    if (bm) cands.add(bm);
    for (const c of Array.from(cands)) map.set(slugOf(c), p);
  }
  return map;
}

function dedupePreserveOrder(items: Product[]): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of items) {
    const key = p.id || p.slug;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

type ComparePageProps = { searchParams?: { ids?: string | string[] } };
export default function ComparePage({ searchParams }: ComparePageProps) {
  const tokens = parseIds(searchParams?.ids);
  const lookup = buildLookup(allTubeBenders as Product[]);
  const normalized = tokens.map(normalizeToken);
  // Resolve tokens with a single index scheme to avoid doubling (bug: 2 tokens → 3+ rows).
  const list = allTubeBenders as Product[];
  const scheme = chooseIndexScheme(normalized, list.length);
  const matched = normalized.flatMap((t) => {
    const byKey = lookup.get(t);
    if (byKey) return [byKey];
    if (!isIntToken(t)) return [];
    const n = parseInt(t, 10);
    const idx = scheme === "one" ? (n - 1) : n;
    const p = (idx >= 0 && idx < list.length) ? list[idx] : undefined;
    return p ? [p] : [];
  }) as Product[];
  const rows = dedupePreserveOrder(matched);

  // --- Canonicalize URL (strict) ---------------------------------------------
  // Redirect if:
  //  - any numeric tokens were used, OR
  //  - raw tokens != resolved canonical IDs (length or order or value differ)
  if (rows.length > 0) {
    const canonicalIds = rows.map((p) => p.id);
    const hadNumeric = tokens.some(isIntToken);
    const needsRedirect =
      hadNumeric ||
      tokens.length !== canonicalIds.length ||
      tokens.some((t, i) => t !== canonicalIds[i]);
    if (needsRedirect) {
      const qp = new URLSearchParams();
      qp.set("ids", canonicalIds.join(","));
      redirect(`/compare?${qp.toString()}`);
    }
  }
  // ---------------------------------------------------------------------------

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Compare</h1>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matches.</p>
      ) : (
        <div className="mb-4 overflow-x-auto">
          <table className="min-w-[640px] w-full text-sm border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left p-2 border-b">Name</th>
                <th className="text-left p-2 border-b">Brand</th>
                <th className="text-left p-2 border-b">Model</th>
                <th className="text-left p-2 border-b">ID</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="odd:bg-background even:bg-muted/10">
                  <td className="p-2 border-b font-medium">
                    <Link href={`/reviews/${slugForProduct(p)}`} className="underline hover:no-underline">
                      {titleOf(p)}
                    </Link>
                  </td>
                  <td className="p-2 border-b">{p.brand ?? ""}</td>
                  <td className="p-2 border-b">{p.model ?? ""}</td>
                  <td className="p-2 border-b text-xs text-muted-foreground">{p.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows.length > 0 && (
        <ShareLink relativeHref={`/compare?ids=${rows.map((p) => p.id).join(",")}`} />
      )}
      <div className="mt-4 text-sm text-muted-foreground">
        <Link className="underline" href="/reviews">Browse reviews</Link>
      </div>
    </main>
  );
}