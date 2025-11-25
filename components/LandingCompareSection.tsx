'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { TOTAL_POINTS } from "../lib/scoring";

export type LandingCompareRow = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  model?: string;
  score: number | null;
  priceMin: number | null;
  priceMax: number | null;
  maxCapacity?: string | null;
  powerType?: string | null;
  country?: string | null;
  mandrel?: string | null;
  sBend?: boolean | null;
};

type Props = {
  rows: LandingCompareRow[];
};

/** Simple USD formatting for price ranges. */
function formatPriceRange(min: number | null, max: number | null): string {
  if (min == null && max == null) return "—";
  const fmt = (v: number | null) =>
    v == null || !Number.isFinite(v) ? null : `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  const lo = fmt(min);
  const hi = fmt(max);
  if (lo && hi) return `${lo} – ${hi}`;
  return lo ?? hi ?? "—";
}

function normalizePower(powerType?: string | null): "manual" | "hydraulic" | "other" | "unknown" {
  const s = (powerType ?? "").toLowerCase();
  if (!s) return "unknown";
  if (s.includes("manual") && s.includes("hydraulic")) return "other";
  if (s.includes("manual")) return "manual";
  if (s.includes("hydraulic") || s.includes("electric") || s.includes("air")) return "hydraulic";
  return "other";
}

function isMandrelOn(mandrel?: string | null): boolean {
  const s = (mandrel ?? "").toLowerCase();
  return s === "available" || s === "standard" || s === "yes";
}

function isSBendOn(flag?: boolean | null): boolean {
  return !!flag;
}

function ScoreCircle({ score }: { score: number | null }) {
  const clamped =
    score == null ? null : Math.max(0, Math.min(TOTAL_POINTS, Math.round(score)));
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const ratio = clamped == null ? 0 : clamped / TOTAL_POINTS;
  const dash = circumference * ratio;

  // Color tiers:
  // 0–59.999 -> red, 60–79.999 -> amber, 80–100 -> green
  let strokeClass = "stroke-gray-300";
  let textClass = "text-gray-700";

  if (clamped != null) {
    if (clamped < 60) {
      strokeClass = "stroke-red-500";
      textClass = "text-red-700";
    } else if (clamped < 80) {
      strokeClass = "stroke-amber-500";
      textClass = "text-amber-700";
    } else {
      strokeClass = "stroke-emerald-500";
      textClass = "text-emerald-700";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="stroke-gray-200"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          className={`${strokeClass} transition-all duration-500`}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className={`text-sm font-semibold ${textClass}`}>
          {clamped != null ? clamped : "—"}
          <span className="text-[0.7rem] text-gray-500"> / {TOTAL_POINTS}</span>
        </span>
        <span className="text-[0.65rem] text-gray-500 uppercase tracking-wide">
          Rating
        </span>
      </div>
    </div>
  );
}

function Pill({ children, active }: { children: React.ReactNode; active: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
        active
          ? "bg-emerald-50 border-emerald-400 text-emerald-700"
          : "bg-gray-50 border-gray-200 text-gray-500",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

type SortKey = "score" | "price" | "name";
type SortDir = "asc" | "desc";

export default function LandingCompareSection({ rows }: Props) {
  const [minScore, setMinScore] = useState<number>(0);
  const [power, setPower] = useState<"any" | "manual" | "hydraulic">("any");
  const [origin, setOrigin] = useState<"any" | "usaOnly">("any");
  const [mandrelOnly, setMandrelOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [detailsRow, setDetailsRow] = useState<LandingCompareRow | null>(null);

  const handleSort = (key: SortKey) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        // Toggle direction when clicking the same column
        setSortDir((prevDir) => (prevDir === "desc" ? "asc" : "desc"));
        return prevKey;
      }
      // New column: sensible default direction
      if (key === "score") {
        setSortDir("desc");
      } else if (key === "price") {
        setSortDir("asc");
      } else {
        setSortDir("asc");
      }
      return key;
    });
  };

  const filtered = useMemo(() => {
    const list = rows.slice().filter((row) => {
      if (minScore > 0 && (row.score ?? 0) < minScore) return false;

      const normPower = normalizePower(row.powerType);
      if (power === "manual" && normPower !== "manual") return false;
      if (power === "hydraulic" && normPower !== "hydraulic") return false;

      const c = (row.country ?? "").toLowerCase();
      if (origin === "usaOnly" && c && c !== "usa" && c !== "united states" && c !== "united states of america") {
        return false;
      }

      if (mandrelOnly && !isMandrelOn(row.mandrel)) return false;

      return true;
    });

    // Sorting after filtering so ranking (#) matches visible order
    list.sort((a, b) => {
      if (sortKey === "score") {
        const sa = a.score ?? -Infinity;
        const sb = b.score ?? -Infinity;
        return sortDir === "desc" ? sb - sa : sa - sb;
      }
      if (sortKey === "price") {
        const pa = a.priceMin ?? Infinity;
        const pb = b.priceMin ?? Infinity;
        return sortDir === "asc" ? pa - pb : pb - pa;
      }
      // name
      const na = a.name.toLowerCase();
      const nb = b.name.toLowerCase();
      if (na === nb) return 0;
      const cmp = na < nb ? -1 : 1;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [rows, minScore, power, origin, mandrelOnly, sortKey, sortDir]);

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return "↕";
    return sortDir === "desc" ? "↓" : "↑";
  };

  return (
    <section className="mt-12 rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tube Bender Comparison</h2>
          <p className="text-xs text-gray-500">
            Products ranked by our 100-point scoring system — highest rated first.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Filters summary + controls */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="hidden sm:inline-block text-[0.7rem] uppercase tracking-wide text-gray-400">
              Filters
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <label className="flex items-center gap-1">
              <span className="text-gray-600">Min score</span>
              <select
                className="rounded border border-gray-300 bg-white px-2 py-1"
                value={String(minScore)}
                onChange={(e) => setMinScore(Number(e.target.value) || 0)}
              >
                <option value="0">Any</option>
                <option value="60">60+</option>
                <option value="70">70+</option>
                <option value="80">80+</option>
                <option value="90">90+</option>
              </select>
            </label>
            <label className="flex items-center gap-1">
              <span className="text-gray-600">Power</span>
              <select
                className="rounded border border-gray-300 bg-white px-2 py-1"
                value={power}
                onChange={(e) => setPower(e.target.value as typeof power)}
              >
                <option value="any">Any</option>
                <option value="manual">Manual</option>
                <option value="hydraulic">Hydraulic</option>
              </select>
            </label>
            <label className="flex items-center gap-1">
              <span className="text-gray-600">Origin</span>
              <select
                className="rounded border border-gray-300 bg-white px-2 py-1"
                value={origin}
                onChange={(e) => setOrigin(e.target.value as typeof origin)}
              >
                <option value="any">Any</option>
                <option value="usaOnly">USA only</option>
              </select>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                className="h-3 w-3"
                checked={mandrelOnly}
                onChange={(e) => setMandrelOnly(e.target.checked)}
              />
              <span className="text-gray-600">Mandrel-ready only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Model</th>
              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => handleSort("score")}
                  className="inline-flex items-center gap-1 font-medium"
                >
                  Rating <span className="text-[0.6rem]">{sortIcon("score")}</span>
                </button>
              </th>
              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => handleSort("price")}
                  className="inline-flex items-center gap-1 font-medium"
                >
                  Price (complete setup){" "}
                  <span className="text-[0.6rem]">{sortIcon("price")}</span>
                </button>
              </th>
              <th className="px-3 py-2 text-left">Max Diameter</th>
              <th className="px-3 py-2 text-left">Power</th>
              <th className="px-3 py-2 text-left">Made in</th>
              <th className="px-3 py-2 text-left">Mandrel</th>
              <th className="px-3 py-2 text-left">S-bend</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-3 py-6 text-center text-sm text-gray-500">
                  No models match the current filters. Try relaxing your filters.
                </td>
              </tr>
            )}
            {filtered.map((row, index) => (
              <tr key={row.id} className={index % 2 === 1 ? "bg-gray-50/40" : ""}>
                <td className="px-3 py-3 align-middle text-xs text-gray-500">
                  #{index + 1}
                </td>
                <td className="px-3 py-3 align-middle">
                  <div className="flex flex-col">
                    <Link
                      href={`/reviews/${row.slug}`}
                      className="text-sm font-semibold text-gray-900 hover:underline"
                    >
                      {row.name}
                    </Link>
                    {(row.brand || row.model) && (
                      <div className="text-xs text-gray-500">
                        {[row.brand, row.model].filter(Boolean).join(" ")}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 align-middle">
                  <ScoreCircle score={row.score} />
                </td>
                <td className="px-3 py-3 align-middle text-sm text-gray-800">
                  {formatPriceRange(row.priceMin, row.priceMax)}
                </td>
                <td className="px-3 py-3 align-middle text-sm text-gray-800">
                  {row.maxCapacity || "—"}
                </td>
                <td className="px-3 py-3 align-middle text-sm text-gray-800">
                  {row.powerType || "—"}
                </td>
                <td className="px-3 py-3 align-middle text-sm text-gray-800">
                  {row.country || "—"}
                </td>
                <td className="px-3 py-3 align-middle">
                  <Pill active={isMandrelOn(row.mandrel)}>Mandrel</Pill>
                </td>
                <td className="px-3 py-3 align-middle">
                  <Pill active={isSBendOn(row.sBend)}>S-bend</Pill>
                </td>
                <td className="px-3 py-3 align-middle">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/reviews/${row.slug}`}
                      className="inline-flex items-center rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-800 hover:bg-gray-50"
                    >
                      Review
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDetailsRow(row)}
                      className="inline-flex items-center rounded border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detailsRow && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {detailsRow.name}
                </h3>
                {(detailsRow.brand || detailsRow.model) && (
                  <p className="text-xs text-gray-500">
                    {[detailsRow.brand, detailsRow.model].filter(Boolean).join(" ")}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDetailsRow(null)}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 flex items-center gap-4">
              <ScoreCircle score={detailsRow.score} />
              <div className="text-xs text-gray-600">
                <div>
                  <span className="font-semibold">Price range: </span>
                  {formatPriceRange(detailsRow.priceMin, detailsRow.priceMax)}
                </div>
                <div>
                  <span className="font-semibold">Max capacity: </span>
                  {detailsRow.maxCapacity || "—"}
                </div>
                <div>
                  <span className="font-semibold">Power: </span>
                  {detailsRow.powerType || "—"}
                </div>
                <div>
                  <span className="font-semibold">Made in: </span>
                  {detailsRow.country || "—"}
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Pill active={isMandrelOn(detailsRow.mandrel)}>Mandrel</Pill>
                  <Pill active={isSBendOn(detailsRow.sBend)}>S-bend</Pill>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
              <Link
                href="/scoring#methodology"
                className="text-xs text-blue-600 hover:underline"
              >
                How our 100-point scoring works
              </Link>
              <Link
                href={`/reviews/${detailsRow.slug}`}
                className="inline-flex items-center rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-800 hover:bg-gray-50"
              >
                Go to full review
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

