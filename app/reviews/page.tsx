import React from "react";
import Link from "next/link";
import { allTubeBenders } from "../../lib/catalog";
import { titleOf, slugForProduct } from "../../lib/ids";

type Product = {
  id: string;
  slug?: string;
  name?: string;
  brand?: string;
  model?: string;
};

/** Derive slug and title via shared helpers. */
const slugFor = (p: Product) => slugForProduct(p as any);

/** Friendly title from shared helper. */
const displayTitle = (p: Product) => titleOf(p as any);

export default function ReviewsIndexPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Reviews</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {allTubeBenders.map((p) => {
          const title = displayTitle(p);
          const slug = slugFor(p);
          return (
            <Link
              key={p.id}
              href={`/reviews/${slug}`}
              className="block rounded-lg border p-4 hover:shadow"
            >
              <div className="text-base font-medium">{title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {[p.brand, p.model].filter(Boolean).join(" ")}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}