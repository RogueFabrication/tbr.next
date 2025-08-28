"use client";
import { useMemo, useState } from "react";
import type { Bender } from "../../data/benders";

type SortKey = "brand" | "model" | "capacity" | "price" | "score";
type SortDir = "asc" | "desc";

export default function CompareTable({ rows }: { rows: Bender[] }) {
  // Keep ONLY sorting here. Filtering lives in the client wrapper.
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function baseCompare(aVal: unknown, bVal: unknown): number {
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (typeof aVal === "number" && typeof bVal === "number") return aVal - bVal;
    return String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: "base" });
  }

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = (a as any)[sortKey];
      const bv = (b as any)[sortKey];
      const cmp = baseCompare(av, bv);
      const dir = sortDir === "asc" ? 1 : -1;
      return dir * cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function onSort(k: SortKey) {
    if (k === sortKey) setSortDir(d => (d === "asc" ? "desc" : "asc"));
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
          title={active ? `Sorted ${sortDir}. Click to toggle` : `Click to sort ascending`}
        >
          <span>{children}</span>
          {active ? <span aria-hidden className="inline-block text-xs text-gray-500">{sortDir === "asc" ? "▲" : "▼"}</span> : null}
        </button>
      </th>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[720px] w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <HeadCell k="brand">Brand</HeadCell>
            <HeadCell k="model">Model</HeadCell>
            <HeadCell k="capacity">Capacity</HeadCell>
            <HeadCell k="price">Price</HeadCell>
            <HeadCell k="score">Score</HeadCell>
          </tr>
        </thead>
        <tbody>
          {sorted.map(r => (
            <tr key={r.brand + r.model} className="border-b last:border-b-0">
              <td className="px-4 py-3">{r.brand}</td>
              <td className="px-4 py-3">{r.model}</td>
              <td className="px-4 py-3">{r.capacity}</td>
              <td className="px-4 py-3">{typeof r.price === "number" ? `$${r.price.toLocaleString()}` : "—"}</td>
              <td className="px-4 py-3">{r.score ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

