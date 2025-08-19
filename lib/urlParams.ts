export type ParamRecord = Record<string, string | number | boolean | undefined | null>;

export function buildSearchString(params: ParamRecord) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    // Booleans become "1"/"0" to be explicit and stable
    if (typeof v === "boolean") sp.set(k, v ? "1" : "0");
    else sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// shallow, loop‑safe replace – only call router.replace if different
export function shouldReplace(current: string, next: string) {
  // Normalize ordering via URLSearchParams so comparisons don't flap
  const norm = (s: string) => {
    const u = new URLSearchParams(s.startsWith("?") ? s.slice(1) : s);
    const entries = [...u.entries()].sort(([a],[b]) => a.localeCompare(b));
    return entries.map(([k,v]) => `${k}=${v}`).join("&");
  };
  return norm(current) !== norm(next);
}
