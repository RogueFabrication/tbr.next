import React from "react";
import Link from "next/link";
import { getAllTubeBendersWithOverlay } from "../../lib/catalogOverlay";
import ShareLink from "../../components/ShareLink";
import { redirect } from "next/navigation";
import { slugOf, parseIds, titleOf, slugForProduct } from "../../lib/ids";
// NOTE: Only accepts canonical product identifiers (id/slug/name/brand+model)

type Product = {
  id: string;
  slug?: string;
  name?: string;
  brand?: string;
  model?: string;
};


function buildLookup(products: Product[]): Map<string, Product> {
  const map = new Map<string, Product>();
  for (const p of products) {
    const keys = new Set<string>();
    // Always index by ID as well (normalized for safety)
    if (p.id) keys.add(p.id);
    if (p.slug) keys.add(p.slug);
    if (p.name) keys.add(p.name);
    const bm = [p.brand, p.model].filter(Boolean).join(" ");
    if (bm) keys.add(bm);
    for (const c of Array.from(keys)) map.set(slugOf(c), p);
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

// Build a lookup map from the overlay-aware product list.
type ComparePageProps = { searchParams?: { ids?: string | string[] } };
export default function ComparePage({ searchParams }: ComparePageProps) {
  const products = getAllTubeBendersWithOverlay() as Product[];
  const tokens = parseIds(searchParams?.ids);          // raw query tokens
  const byId = new Map(products.map((p) => [p.id, p])); // fast direct ID match
  const lookup = buildLookup(products);                 // slug/name/brand+model

  // Resolve by trying raw ID first, then normalized key
  const matched = tokens.map((raw) => {
    const direct = byId.get(raw);
    if (direct) return direct;
    const key = slugOf(raw.trim());
    return lookup.get(key);
  }).filter(Boolean) as Product[];

  const rows = dedupePreserveOrder(matched);

  // --- Canonicalize URL (strict) ---------------------------------------------
  // Redirect if raw tokens != resolved canonical IDs (length/order/value differ).
  if (rows.length > 0) {
    const canonicalIds = rows.map((p) => p.id);
    const needsRedirect =
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