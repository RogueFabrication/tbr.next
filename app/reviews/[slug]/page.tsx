"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import type { TubeBender } from "../../../lib/tube-benders";
import { getTubeBenders } from "../../../lib/tube-benders";
import { tbToSlug } from "../../../lib/slug";

function num(v: unknown) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v.replace(/[,$\s]/g, ""));
  return NaN;
}
const fmt = (n: number) => `$${n.toLocaleString()}`;
function priceText(tb: TubeBender) {
  const min = num((tb as any).priceMin);
  const max = num((tb as any).priceMax);
  if (Number.isFinite(min) && Number.isFinite(max)) return `${fmt(min)} – ${fmt(max)}`;
  if (Number.isFinite(min)) return fmt(min);
  if (Number.isFinite(max)) return fmt(max);
  return "—";
}

export default function ReviewDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const id = decodeURIComponent(slug);

  // same source as Home
  const tubeBenders = useMemo<TubeBender[]>(() => getTubeBenders(), []);
  const item = tubeBenders.find((tb: any) => tbToSlug(tb) === id);

  return (
    <div className="space-y-4">
      <Link href="/guide" className="text-sm text-blue-600 underline">← Back to Finder</Link>

      {!item ? (
        <div className="rounded-md border p-4">
          <h1 className="text-lg font-semibold mb-1">Unavailable</h1>
          <p className="text-sm text-gray-600">We couldn’t find a review for “{id}”. Check back later.</p>
        </div>
      ) : (
        <div className="rounded-md border p-4 bg-white">
          <h1 className="text-xl font-semibold">{item.brand} {item.model}</h1>
          <p className="text-sm text-gray-600">{item.power} • {item.origin}</p>
          <div className="mt-2 text-sm">Price: {priceText(item)}</div>
          <div className="mt-6 text-sm text-gray-600 italic">
            Full review coming soon. Specs/comparison available from the Finder and Home table.
          </div>
        </div>
      )}
    </div>
  );
}
