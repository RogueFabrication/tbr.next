"use client";
import { useMemo, useState } from "react";
import type { Bender } from "../../data/benders";
import CompareTable from "./CompareTable";

/**
 * Client wrapper for /compare: simple text filter + sortable table.
 */
export default function CompareClient({ rows }: { rows: Bender[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) => {
      const price = typeof r.price === "number" ? `$${r.price}` : "";
      const score = typeof r.score === "number" ? String(r.score) : "";
      const hay = [r.brand, r.model, r.capacity, price, score].join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [rows, q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label htmlFor="compare-filter" className="text-sm font-medium">
          Filter
        </label>
        <input
          id="compare-filter"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search brand, model, capacity…"
          className="w-full max-w-md rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          aria-describedby="compare-filter-hint"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            title="Clear filter"
          >
            Clear
          </button>
        )}
      </div>
      <p id="compare-filter-hint" className="text-xs text-gray-500">
        Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
        {q ? ` for "${q}"` : ""}.
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-md border px-4 py-6 text-sm text-gray-600">
          No matches{q ? ` for "${q}"` : ""}. Try another term.
        </div>
      ) : (
        <CompareTable rows={filtered} />
      )}
    </div>
  );
}
