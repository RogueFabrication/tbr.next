/**
 * Client-side helpers for compare IDs (persisted in localStorage).
 * 
 * Also emits a lightweight CustomEvent so components can react without polling.
 */
const KEY = "tbr.compare.ids";
const EV = "compare:changed";

export function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const ids = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(ids) ? (ids as string[]) : [];
  } catch {
    return [];
  }
}

export function writeIds(next: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    // Tell any listeners (same-tab) that the list changed.
    window.dispatchEvent(new CustomEvent(EV));
  } catch {
    // ignore
  }
}

/**
 * Subscribe to changes from either:
 * - native "storage" (cross-tab), or
 * - in-tab CustomEvent dispatched by writeIds.
 */
export function subscribe(cb: () => void): () => void {
  const on = () => cb();
  window.addEventListener("storage", on);
  window.addEventListener(EV, on as EventListener);
  return () => {
    window.removeEventListener("storage", on);
    window.removeEventListener(EV, on as EventListener);
  };
}

export function toggle(id: string): string[] {
  const cur = readIds();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  writeIds(next);
  return next;
}

export { KEY };
