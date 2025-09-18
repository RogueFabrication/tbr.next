import React from "react";
import Link from "next/link";
import { allTubeBenders } from "../../../lib/catalog";

type Product = {
  id: string;
  slug?: string;
  name?: string;
  brand?: string;
  model?: string;
  [k: string]: unknown;
};

/** Local slugify helper. */
function slugOf(input: string): string {
  const s = String(input ?? "");
  const decomp = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  return decomp.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}

/** Find product by id/slug/name/brand+model. */
function findProduct(slugParam: string): Product | undefined {
  const norm = slugOf(slugParam);
  for (const p of allTubeBenders) {
    if (p.id === slugParam || p.slug === slugParam || slugOf(p.id) === norm || slugOf(p.slug || "") === norm) {
      return p;
    }
    const name = p.name || [p.brand, p.model].filter(Boolean).join(" ");
    if (name && slugOf(name) === norm) return p;
  }
  return undefined;
}

const SAFE_SPEC_FIELDS = [
  "brand",
  "model",
  "type",
  "country",
  "madeIn",
  "capacity",
  "max_od",
  "maxWall",
  "weight",
  "dimensions",
  "warranty",
  "price",
] as const;

type PageProps = {
  params: { slug: string };
};

export default function ReviewPage({ params }: PageProps) {
  const product = findProduct(params.slug);
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
  const title = product.name || [product.brand, product.model].filter(Boolean).join(" ") || product.id;

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        This is a minimal review shell. We'll expand this soon.
      </p>
      {/* Safe "Specs" block: only show present, primitive fields from SAFE_SPEC_FIELDS */}
      <section className="mb-6">
        <h2 className="text-lg font-medium mb-2">Specs</h2>
        <ul className="list-disc pl-5 text-sm">
          {SAFE_SPEC_FIELDS.map((k) => {
            const v = product[k as keyof typeof product];
            const isPrimitive =
              typeof v === "string" || typeof v === "number" || typeof v === "boolean";
            if (v == null || !isPrimitive) return null;
            return (
              <li key={k}>
                <span className="font-medium">{k}:</span> {String(v)}
              </li>
            );
          })}
        </ul>
      </section>
      <div>
        <Link
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:shadow"
          href={`/compare?ids=${encodeURIComponent(product.id)}`}
        >
          Compare models
        </Link>
      </div>
    </main>
  );
}