"use client";
import { useMemo, useState } from "react";
import type { Bender } from "../../data/benders";

type SortKey = "brand" | "model" | "capacity" | "price" | "score";
type SortDir = "asc" | "desc";

/**
 * Sortable comparison table for benders.
 * - No external deps; purely client-side.
 * - Click a header to sort; click again to toggle direction.
 */
export default function CompareTable({ rows }: { rows: Bender[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function baseCompare(aVal: unknown, bVal: unknown): number {
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return -1;
    if (bVal == null) return 1;
    if (typeof aVal === "number" && typeof bVal === "number") return aVal - bVal;
    return String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: "base" });
  }

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = (a as any)[sortKey];
      const bv = (b as any)[sortKey];
      const cmp = baseCompare(av, bv);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function onSort(k: SortKey) {
    if (k === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  }

  const HeadCell = ({ k, children }: { k: SortKey; children: React.ReactNode }) => {
    const active = sortKey === k;
    return (
      <th className="px-4 py-3">
        <button
          type="button"
          onClick={() => onSort(k)}
          className="flex items-center gap-1 font-medium hover:underline"
          aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
          title={active ? `Sorted ${sortDir}. Click to toggle` : "Click to sort ascending"}
        >
          <span>{children}</span>
          <span className="inline-block tabular-nums text-xs text-gray-500">
            {active ? (sortDir === "asc" ? "▲" : "▼") : ""}
          </span>
        </button>
      </th>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900/40">
          <tr>
            <HeadCell k="brand">Brand</HeadCell>
            <HeadCell k="model">Model</HeadCell>
            <HeadCell k="capacity">Capacity</HeadCell>
            <HeadCell k="price">Price</HeadCell>
            <HeadCell k="score">Score</HeadCell>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const price = typeof r.price === "number" ? `$${r.price.toLocaleString()}` : "—";
            return (
              <tr key={r.brand + r.model} className="border-t">
                <td className="px-4 py-3">{r.brand}</td>
                <td className="px-4 py-3">{r.model}</td>
                <td className="px-4 py-3">{r.capacity}</td>
                <td className="px-4 py-3">{price}</td>
                <td className="px-4 py-3">{r.score ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

