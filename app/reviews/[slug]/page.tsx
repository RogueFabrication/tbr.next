import React from "react";
import Link from "next/link";
import { getAllTubeBendersWithOverlay } from "../../../lib/catalogOverlay";
import { slugOf, titleOf, slugForProduct } from "../../../lib/ids";

const fallbackImg = "/images/products/placeholder.png";
type Product = {
  id: string;
  slug?: string;
  name?: string;
  brand?: string;
  model?: string;
  image?: string;
  highlights?: string[];
  // Safe optional fields that may exist in the catalog:
  type?: string;
  country?: string;
  madeIn?: string;
  maxCapacity?: string | number;
  capacity?: string | number;
  max_od?: string | number;
  maxWall?: string | number;
  weight?: string | number;
  dimensions?: string;
  warranty?: string;
  price?: string | number;
};

/** Build a lookup by multiple keys (id, slug, name, brand+model). */
function buildLookup(products: Product[]): Map<string, Product> {
  const map = new Map<string, Product>();
  for (const p of products) {
    const candidates = new Set<string>();
    if (p.id) candidates.add(p.id);
    if (p.slug) candidates.add(p.slug);
    if (p.name) candidates.add(p.name);
    const bm = [p.brand, p.model].filter(Boolean).join(" ");
    if (bm) candidates.add(bm);
    for (const c of candidates) map.set(slugOf(c), p);
  }
  return map;
}

const SAFE_FIELDS: Array<keyof Product> = [
  "brand","model","type","country","madeIn","capacity","max_od","maxWall","weight","dimensions","warranty","price",
];

/** Human label for a spec key. */
function labelFor(k: keyof Product): string {
  const map: Record<string,string> = {
    brand: "Brand",
    model: "Model",
    type: "Type",
    country: "Country",
    madeIn: "Made In",
    capacity: "Capacity",
    max_od: "Max OD",
    maxWall: "Max Wall",
    weight: "Weight",
    dimensions: "Dimensions",
    warranty: "Warranty",
    price: "Price",
  };
  return map[k] ?? String(k);
}

type PageProps = { params: { slug: string } };
export default function ReviewPage({ params }: PageProps) {
  const all = getAllTubeBendersWithOverlay() as Product[];
  const lookup = buildLookup(all);
  const product = lookup.get(slugOf(params.slug));

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-2">Not found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn't find that review.{" "}
          <Link className="underline" href="/reviews">Back to reviews</Link>
        </p>
      </main>
    );
  }

  const title = titleOf(product);
  const compareHref = `/compare?ids=${encodeURIComponent(product.id)}`;
  const img = product.image || fallbackImg;
  const highlights = Array.isArray(product.highlights) ? product.highlights : [];

  const specs = SAFE_FIELDS
    .map((k) => {
      let value = product[k];

      // Special handling for Capacity:
      // - If admin has provided a maxCapacity value via the overlay,
      //   treat that as the authoritative "Capacity" shown in the specs
      //   card (this mirrors how the admin grid is currently being used).
      if (k === "capacity") {
        const maxCap = product.maxCapacity;
        if (maxCap !== undefined && maxCap !== null && String(maxCap).trim().length > 0) {
          value = maxCap;
        }
      }

      return [k, value] as const;
    })
    .filter(([, v]) => {
      if (v === undefined || v === null) return false;
      return String(v).trim().length > 0;
    });

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-3">{title}</h1>
      {/* Hero image + highlights */}
      <div className="rounded-lg overflow-hidden border mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={title} className="w-full h-64 object-cover" />
      </div>
      {highlights.length > 0 && (
        <ul className="mb-6 list-disc pl-5 text-sm">
          {highlights.map((h) => <li key={h}>{h}</li>)}
        </ul>
      )}
      <div className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2">
          <p className="text-sm text-muted-foreground">
            Review content is coming soon. In the meantime, basic specs are listed on the right.
          </p>
        </section>
        <aside className="md:col-span-1">
          <div className="rounded-lg border p-4">
            <h2 className="text-base font-medium mb-2">Specs (preview)</h2>
            {specs.length === 0 ? (
              <p className="text-xs text-muted-foreground">No specs available yet.</p>
            ) : (
              <dl className="text-sm">
                {specs.map(([k, v]) => (
                  <div key={String(k)} className="flex justify-between gap-3 py-1 border-b last:border-b-0">
                    <dt className="text-muted-foreground">{labelFor(k)}</dt>
                    <dd className="font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-3">
              <Link href={compareHref} className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:shadow">
                Compare models
              </Link>
            </div>
          </div>
        </aside>
      </div>
      <div className="mt-6 text-sm text-muted-foreground">
        <Link className="underline" href="/reviews">Back to all reviews</Link>
      </div>
    </main>
  );
}