import React from "react";
import Link from "next/link";
import { getAllTubeBendersWithOverlay } from "../../lib/catalogOverlay";
import { titleOf, slugForProduct } from "../../lib/ids";
import { getProductScore, TOTAL_POINTS } from "../../lib/scoring";

const fallbackImg = "/images/products/placeholder.png";
type Product = {
  id: string;
  slug?: string;
  name?: string;
  brand?: string;
  model?: string;
  image?: string;
  highlights?: string[];
};

/** Derive slug and title via shared helpers. */
const slugFor = (p: Product) => slugForProduct(p as any);

/** Friendly title from shared helper. */
const displayTitle = (p: Product) => titleOf(p as any);

export default function ReviewsIndexPage() {
  const products = getAllTubeBendersWithOverlay() as Product[];

  const scored = (products as Product[]).map((p) => {
    const { total } = getProductScore(p as any);
    return { product: p, score: total };
  });

  scored.sort((a, b) => {
    // Highest score first; items with no score sink to the bottom.
    const sa = a.score ?? -Infinity;
    const sb = b.score ?? -Infinity;
    return sb - sa;
  });

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-1">Reviews</h1>
      <p className="text-xs text-muted-foreground mb-4">
        Listed by overall score (highest first), using the same 100-point scoring system as the compare page.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scored.map(({ product: p, score }) => {
          const title = displayTitle(p);
          const slug = slugFor(p);
          const img = p.image || fallbackImg;
          return (
            <Link
              key={p.id}
              href={`/reviews/${slug}`}
              className="block rounded-lg border hover:shadow overflow-hidden"
            >
              <div className="aspect-video bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={title}
                     className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <div className="text-base font-medium">{title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {[p.brand, p.model].filter(Boolean).join(" ")}
                </div>
                {score !== null && (
                  <div className="mt-1 text-xs">
                    <span className="font-medium">Score:</span>{" "}
                    <span>
                      {score} / {TOTAL_POINTS}
                    </span>
                  </div>
                )}
                {Array.isArray(p.highlights) && p.highlights.length > 0 && (
                  <ul className="mt-2 text-xs list-disc pl-4">
                    {p.highlights.slice(0,2).map((h) => <li key={h}>{h}</li>)}
                  </ul>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}