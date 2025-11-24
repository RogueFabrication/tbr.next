import React from "react";
import Link from "next/link";
import { getAllTubeBendersWithOverlay, findTubeBenderWithOverlay } from "../../../lib/catalogOverlay";
import { slugOf, titleOf, slugForProduct } from "../../../lib/ids";
import { getProductScore, TOTAL_POINTS } from "../../../lib/scoring";

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
  maxCapacity?: string | number;
  capacity?: string | number;
  max_od?: string | number;
  maxWall?: string | number;
  weight?: string | number;
  dimensions?: string;
  warranty?: string;
  // Legacy flat price (entry setup); we prefer component pricing for UI.
  price?: string | number;
  // Pricing breakdown from admin overlay:
  framePriceMin?: string | number;
  framePriceMax?: string | number;
  diePriceMin?: string | number;
  diePriceMax?: string | number;
  hydraulicPriceMin?: string | number;
  hydraulicPriceMax?: string | number;
  standPriceMin?: string | number;
  standPriceMax?: string | number;
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

// Expose core specs but omit raw "price" – pricing snapshot below shows min/max system totals.
const SAFE_FIELDS: Array<keyof Product> = [
  "brand",
  "model",
  "type",
  "country",
  "capacity",
  "max_od",
  "maxWall",
  "weight",
  "dimensions",
  "warranty",
];

/** Human label for a spec key. */
function labelFor(k: keyof Product): string {
  const map: Record<string,string> = {
    brand: "Brand",
    model: "Model",
    type: "Type",
    // Explicitly disclosed as claimed by the manufacturer, not independently audited.
    country: "Country of manufacture (claimed)",
    capacity: "Capacity",
    max_od: "Max OD",
    maxWall: "Max Wall",
    weight: "Weight",
    dimensions: "Dimensions",
    warranty: "Warranty",
  };
  return map[k] ?? String(k);
}

type PageProps = { params: { slug: string } };
export default function ReviewPage({ params }: PageProps) {
  // Read from the merged catalog so admin overlay edits are reflected.
  const all = getAllTubeBendersWithOverlay() as Product[];
  const lookup = buildLookup(all);
  const product =
    lookup.get(slugOf(params.slug)) ??
    (findTubeBenderWithOverlay((b) => slugOf(b.id) === slugOf(params.slug) || slugOf(b.slug ?? "") === slugOf(params.slug)) as Product | undefined);

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
  const { total: score, breakdown } = getProductScore(product as any);
  const highlights = Array.isArray(product.highlights) ? product.highlights : [];

  // --- Pricing: compute min/max system totals from component fields ----------
  const parseMoney = (raw: unknown): number | null => {
    if (raw === null || raw === undefined || raw === "") return null;
    if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
    const parsed = parseFloat(String(raw).replace(/[^0-9.+-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  };

  const frameMin = parseMoney((product as any).framePriceMin);
  const dieMin = parseMoney((product as any).diePriceMin);
  const hydraulicMin = parseMoney((product as any).hydraulicPriceMin);
  const standMin = parseMoney((product as any).standPriceMin);

  const frameMax = parseMoney((product as any).framePriceMax);
  const dieMax = parseMoney((product as any).diePriceMax);
  const hydraulicMax = parseMoney((product as any).hydraulicPriceMax);
  const standMax = parseMoney((product as any).standPriceMax);

  const hasMinComponents =
    frameMin !== null ||
    dieMin !== null ||
    hydraulicMin !== null ||
    standMin !== null;
  const hasMaxComponents =
    frameMax !== null ||
    dieMax !== null ||
    hydraulicMax !== null ||
    standMax !== null;

  const minSystemTotal =
    hasMinComponents
      ? (frameMin ?? 0) + (dieMin ?? 0) + (hydraulicMin ?? 0) + (standMin ?? 0)
      : parseMoney(product.price);

  const maxSystemTotal =
    hasMaxComponents
      ? (frameMax ?? 0) + (dieMax ?? 0) + (hydraulicMax ?? 0) + (standMax ?? 0)
      : null;
  // ---------------------------------------------------------------------------

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
            Review content is coming soon. In the meantime, you can see how this bender scores and how its specs and pricing compare to other models.
          </p>
        </section>
        <aside className="md:col-span-1">
          <div className="rounded-lg border p-4">
            <h2 className="text-base font-medium mb-2">Specs &amp; score (preview)</h2>

            {score !== null && (
              <div className="mb-3 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-emerald-900">
                    Overall score
                  </span>
                  <span className="font-semibold text-emerald-900">
                    {score} / {TOTAL_POINTS}
                  </span>
                </div>
              </div>
            )}

            {(minSystemTotal || maxSystemTotal) && (
              <div className="mb-3 rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-xs">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-amber-900">
                    Pricing snapshot
                  </span>
                  <span className="text-right text-amber-900">
                    {minSystemTotal && (
                      <span className="block">
                        Min system:{" "}
                        <span className="font-semibold">
                          ${minSystemTotal.toFixed(0)}
                        </span>
                      </span>
                    )}
                    {maxSystemTotal && (
                      <span className="block">
                        Max system:{" "}
                        <span className="font-semibold">
                          ${maxSystemTotal.toFixed(0)}
                        </span>
                      </span>
                    )}
                  </span>
                </div>
                <p className="mt-1 text-[0.7rem] text-amber-900/80">
                  Min system totals are built from the lowest documented prices for frame, dies, hydraulics, and stand/mount that we could verify.{" "}
                  <Link
                    href="/scoring#value-for-money"
                    className="underline"
                  >
                    See how we calculate pricing for scoring
                  </Link>
                  .
                </p>
              </div>
            )}

            {Array.isArray(breakdown) && breakdown.length > 0 && (
              <details className="mb-3 text-xs md:text-sm">
                <summary className="cursor-pointer select-none font-medium">
                  Score breakdown
                </summary>
                <div className="mt-2 space-y-1.5">
                  {breakdown.map((item, idx) => (
                    <div key={`${item.criteria}-${idx}`} className="border-b last:border-b-0 pb-1.5 last:pb-0">
                      <div className="flex justify-between gap-2">
                        <span className="font-medium">{item.criteria}</span>
                        <span>
                          {item.points} / {item.maxPoints}
                        </span>
                      </div>
                      {item.reasoning && (
                        <p className="text-[0.7rem] md:text-xs text-muted-foreground mt-0.5">
                          {item.reasoning}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            )}

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