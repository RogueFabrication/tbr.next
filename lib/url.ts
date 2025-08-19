// lib/url.ts
export type QueryShape = {
    q?: string;
    power?: "any" | "manual" | "hydraulic";
    originUS?: "1";
    originTW?: "1";
    capacityMin?: string; // keep strings in URL layer
    priceMax?: string;
  };
  
  export function buildQuery(next: Partial<QueryShape>, prev: URLSearchParams) {
    const sp = new URLSearchParams(prev.toString());
  
    for (const [k, v] of Object.entries(next) as [keyof QueryShape, string | undefined][]) {
      const val = (v ?? "").trim();
      // prune empties and "any"
      if (!val || (k === "power" && val.toLowerCase() === "any")) {
        sp.delete(k);
      } else {
        sp.set(k, val);
      }
    }
    return sp;
  }
  
  export function clearAll(prev: URLSearchParams) {
    const sp = new URLSearchParams(prev.toString());
    ["q", "power", "originUS", "originTW", "capacityMin", "priceMax"].forEach((k) => sp.delete(k));
    return sp;
  }
  
