import React from "react";
import Link from "next/link";
import { allTubeBenders } from "../../lib/catalog";

type Product = {
  id: string;
  slug?: string;
  name?: string;
  brand?: string;
  model?: string;
};

/** Local slugify to compute slugs if missing. */
function slugOf(input: string): string {
  const s = String(input ?? "");
  const decomp = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  return decomp.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}

const titleOf = (p: Product) =>
  (p.name && p.name.trim()) ||
  [p.brand, p.model].filter(Boolean).join(" ").trim() ||
  p.id;

const slugFor = (p: Product) => (p.slug && p.slug.length ? p.slug : slugOf(p.id || titleOf(p)));

export default function ReviewsIndexPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Reviews</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {allTubeBenders.map((p) => {
          const title = titleOf(p);
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