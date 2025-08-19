"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import ColumnToggleMenu from "./ColumnToggleMenu";
import PriceBreakdownModal, { PriceBreakdown } from "./PriceBreakdownModal";
import EmptyState from "./EmptyState";
import type { TubeBender } from "../lib/tube-benders";
import { type ColKey, normalizeCols, DEFAULT_VISIBLE } from "../lib/colvis";

// Optional sample breakdowns (keys must match your model strings)
const BREAKDOWNS: Record<string, PriceBreakdown> = {
  "RogueFab M600 Series": [
    { label: "Frame", price: 995 },
    { label: "Die (example)", price: 185 },
    { label: "Stand/Mount", price: 125 },
    { label: "Hydraulic ram", price: 450 },
  ],
  "JD2 Model 32": [
    { label: "Frame", price: 599 },
    { label: "Die (example)", price: 155 },
    { label: "Stand/Mount", price: 99 },
  ],
  "Baileigh RDB-100": [
    { label: "Frame", price: 1895 },
    { label: "Die (example)", price: 195 },
  ],
};

type SortKey = "brand" | "model" | "price" | "capacity" | string;
type SortDir = "asc" | "desc" | undefined;

function ChevronPair({ dir }: { dir: SortDir }) {
  // Split chevrons with thin gap (no color changes needed, Tailwind only)
  return (
    <span className="inline-flex flex-col ml-1">
      <span className={`leading-none -mb-0.5 ${dir === "asc" ? "opacity-100" : "opacity-30"}`}>▲</span>
      <span className={`leading-none ${dir === "desc" ? "opacity-100" : "opacity-30"}`}>▼</span>
    </span>
  );
}

function extractMinPrice(value: unknown): number | undefined {
  // Accepts price like "$1,605 – $1,755" or numeric array or single number
  if (Array.isArray(value) && value.length) return Math.min(...value.map(Number));
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const nums = value.match(/[\d,]+/g)?.map(s => Number(s.replace(/,/g, "")));
    if (nums && nums.length) return Math.min(...nums);
  }
  return undefined;
}

type Props = {
  data: TubeBender[];
};

export default function ComparisonTable({ data }: Props) {
  // Define column metadata
  const columns = [
    { key: "price", label: "Price", sort: "numeric-range" as const },
    { key: "maxCapacity", label: "Max Capacity", sort: "numeric" as const },
    { key: "power", label: "Power", sort: "text" as const },
    { key: "origin", label: "Origin", sort: "text" as const },
  ];

  // Search state
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Column visibility state (initialized from defaults)
  const [visibleCols, setVisibleCols] = useState<ColKey[]>(() => DEFAULT_VISIBLE);

  // Sync with localStorage after mount (but don't change SSR markup)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tbr_cols");
      if (raw) {
        const fromLS = normalizeCols(JSON.parse(raw));
        if (JSON.stringify(fromLS) !== JSON.stringify(visibleCols)) {
          setVisibleCols(fromLS);
        }
      }
    } catch {}
  }, []); // eslint-disable-line

  // Sorting state
  const [sortKey, setSortKey] = useState<SortKey>();
  const [sortDir, setSortDir] = useState<SortDir>(undefined);

  function onSortClick(key: SortKey) {
    setSortKey(prev => {
      if (prev !== key) { setSortDir("asc"); return key; }
      // cycle asc -> desc -> none
      setSortDir(d => (d === "asc" ? "desc" : d === "desc" ? undefined : "asc"));
      return key;
    });
  }

  // Price modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalModel, setModalModel] = useState<string>("");
  const [modalRange, setModalRange] = useState<string | undefined>(undefined);
  const [modalItems, setModalItems] = useState<PriceBreakdown | undefined>(undefined);

  // Keyboard shortcut for search focus
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && !(document.activeElement instanceof HTMLInputElement) && !(document.activeElement instanceof HTMLTextAreaElement) && (document.activeElement?.getAttribute("contenteditable") !== "true")) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Apply sorting to the data
  const rows = useMemo(() => {
    if (!data) return [];
    if (!sortKey || !sortDir) return data;
    const next = [...data];
    next.sort((a: any, b: any) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (sortKey === "price") {
        va = extractMinPrice(a.priceMin);
        vb = extractMinPrice(b.priceMin);
      }
      // Default string/number compare with safe fallbacks
      const na = typeof va === "number" ? va : Number.NEGATIVE_INFINITY;
      const nb = typeof vb === "number" ? vb : Number.NEGATIVE_INFINITY;
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? na - nb : nb - na;
      }
      const sa = (va ?? "").toString();
      const sb = (vb ?? "").toString();
      return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
    return next;
  }, [data, sortKey, sortDir]);

  const openBreakdown = (row: TubeBender) => {
    const modelName = [row.brand, row.model].filter(Boolean).join(' ');
    const priceText = row.priceMin && row.priceMax 
      ? `$${row.priceMin.toLocaleString()} – $${row.priceMax.toLocaleString()}`
      : undefined;
    
    setModalModel(modelName);
    setModalRange(priceText);
    setModalItems(BREAKDOWNS[modelName]);
    setModalOpen(true);
  };

  // Reset filters function
  const resetFilters = () => {
    setQuery('');
    setVisibleCols(["model", "price", "maxCapacity", "power", "origin"]);
    // Remove from localStorage
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("tbr_cols");
    }
    searchRef.current?.focus();
  };

  // ---- Render ----
  return (
    <div className="relative">
      {/* controls */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="relative">
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brand or model..."
            className="h-9 w-72 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            aria-label="Search models"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => { setQuery(""); searchRef?.current?.focus(); }}
            >
              ×
            </button>
          )}
        </div>
        <ColumnToggleMenu
          visibleCols={visibleCols}
          setVisibleCols={setVisibleCols}
          allColumns={columns}
        />
      </div>

      <p className="text-xs text-slate-500 mt-2">Tip: Click column headers to sort</p>

      {/* table */}
      {rows.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No tube benders found" subtitle="Clear search or show more columns to broaden results.">
            <button onClick={resetFilters} className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
              Clear
            </button>
          </EmptyState>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th
                  scope="col"
                  role="columnheader"
                                      aria-sort={sortKey === "model" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  className="px-3 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
                  onClick={() => onSortClick("model")}
                >
                  <span className="inline-flex items-center">Model <ChevronPair dir={sortKey === "model" ? sortDir : undefined} /></span>
                </th>
                {visibleCols.includes("price") && (
                  <th
                    scope="col"
                    role="columnheader"
                    aria-sort={sortKey === "price" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                    className="px-3 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
                    onClick={() => onSortClick("price")}
                  >
                    <span className="inline-flex items-center">Price <ChevronPair dir={sortKey === "price" ? sortDir : undefined} /></span>
                  </th>
                )}
                {visibleCols.includes("maxCapacity") && (
                  <th
                    scope="col"
                    role="columnheader"
                    aria-sort={sortKey === "maxCapacity" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                    className="px-3 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
                    onClick={() => onSortClick("maxCapacity")}
                  >
                    <span className="inline-flex items-center">Max Capacity <ChevronPair dir={sortKey === "maxCapacity" ? sortDir : undefined} /></span>
                  </th>
                )}
                {visibleCols.includes("power") && (
                  <th
                    scope="col"
                    role="columnheader"
                    aria-sort={sortKey === "power" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                    className="px-3 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
                    onClick={() => onSortClick("power")}
                  >
                    <span className="inline-flex items-center">Power <ChevronPair dir={sortKey === "power" ? sortDir : undefined} /></span>
                  </th>
                )}
                {visibleCols.includes("origin") && (
                  <th
                    scope="col"
                    role="columnheader"
                    aria-sort={sortKey === "origin" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                    className="px-3 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none"
                    onClick={() => onSortClick("origin")}
                  >
                    <span className="inline-flex items-center">Origin <ChevronPair dir={sortKey === "origin" ? sortDir : undefined} /></span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row: TubeBender) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2">
                    <div className="font-medium">{row.brand} {row.model}</div>
                  </td>
                  {visibleCols.includes("price") && (
                    <td className="px-3 py-2">
                      {row.priceMin && row.priceMax ? (
                        <button
                          onClick={() => openBreakdown(row)}
                          className="text-left hover:underline"
                        >
                          ${row.priceMin.toLocaleString()} – ${row.priceMax.toLocaleString()}
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                  )}
                  {visibleCols.includes("maxCapacity") && (
                    <td className="px-3 py-2">{row.maxCapacity || "—"}</td>
                  )}
                  {visibleCols.includes("power") && (
                    <td className="px-3 py-2">{row.power || "—"}</td>
                  )}
                  {visibleCols.includes("origin") && (
                    <td className="px-3 py-2">{row.origin || "—"}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PriceBreakdownModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        model={modalModel}
        breakdown={modalItems}
        totalRange={modalRange}
      />
    </div>
  );
}
