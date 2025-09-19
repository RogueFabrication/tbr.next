"use client";
import React from "react";
import Link from "next/link";
import { SmartTubeBenderFinder } from "../../components/guide/SmartTubeBenderFinder";
import { readIds } from "../../lib/compare";

/** Lightweight slugify (no deps). */
function slugOf(input: string): string {
  const s = String(input ?? "");
  const decomp = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  return decomp
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/** Map mock numeric IDs to canonical product IDs. */
function mapToCanonicalId(mockId: string): string {
  const mapping: Record<string, string> = {
    "1": "baileigh-rdb-250",
    "2": "jd2-model-32", 
    "3": "pro-tools-105hd",
  };
  return mapping[mockId] || mockId;
}

/** GuidePage – renders the route-specific tile grid (with filters) */
export default function GuidePage() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Read initial compare IDs and subscribe to changes
    setSelectedIds(readIds());
    const handleStorageChange = () => setSelectedIds(readIds());
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("compare:changed", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("compare:changed", handleStorageChange);
    };
  }, []);

  // Convert selected IDs to canonical IDs for compare URL
  const canonicalIds = selectedIds.map(mapToCanonicalId).filter(Boolean);
  const compareHref = canonicalIds.length > 0 
    ? `/compare?ids=${encodeURIComponent(canonicalIds.join(","))}` 
    : "/compare";

  return (
    <div>
      <SmartTubeBenderFinder />
      
      {/* Compare CTA - only show when items are selected */}
      {canonicalIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Link
            href={compareHref}
            className="inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Compare {canonicalIds.length} item{canonicalIds.length === 1 ? "" : "s"}
          </Link>
        </div>
      )}
    </div>
  );
}
