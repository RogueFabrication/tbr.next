"use client";

import { useSearchParams } from "next/navigation";
import HomeFinderPanel from "../components/HomeFinderPanel";
import ComparisonTable from "../components/ComparisonTable";
import type { TubeBender } from "../lib/tube-benders";
import { getTubeBenders } from "../lib/tube-benders";
import { LayoutMain } from "./layout";

function parseCapacityInches(val?: string) {
  if (!val) return 0;
  // pull first number (handles 2-3/8", 2", etc.)
  const m = val.match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}

function passesFilters(tb: TubeBender, sp: URLSearchParams) {
  const q = (sp.get("q") ?? "").toLowerCase();
  const power = (sp.get("power") ?? "any").toLowerCase(); // any | manual | hydraulic
  const originUS = sp.get("originUS") === "1";
  const originTW = sp.get("originTW") === "1";
  const capacityMin = sp.get("capacityMin") ? Number(sp.get("capacityMin")) : undefined;
  const priceMax = sp.get("priceMax") ? Number(sp.get("priceMax")) : undefined;

  const text = `${tb.brand ?? ""} ${tb.model ?? ""}`.trim().toLowerCase();
  if (q && !text.includes(q)) return false;

  if (power !== "any" && (tb.power ?? "").toLowerCase() !== power) return false;

  if (originUS && !(tb.origin ?? "").includes("US")) return false;
  if (originTW && !(tb.origin ?? "").includes("TW")) return false;

  if (capacityMin !== undefined) {
    const capacity = parseCapacityInches(tb.maxCapacity);
    if (capacity < capacityMin) return false;
  }

  if (priceMax !== undefined) {
    const minPrice = tb.priceMin ?? tb.priceMin; // keep fallback identical to current data shape
    if (minPrice != null && minPrice > priceMax) return false;
  }

  return true;
}

export default function HomePage() {
  const sp = useSearchParams();
  const tubeBenders = getTubeBenders();
  const filtered = tubeBenders.filter((tb) => passesFilters(tb, sp));

  return (
    <LayoutMain tall>
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <aside>
          <HomeFinderPanel />
        </aside>

        <section className="min-w-0">
          <ComparisonTable data={filtered} />
        </section>
      </div>
    </LayoutMain>
  );
}
