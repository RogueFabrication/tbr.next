// Simple array persistence with TTL in dev; no TTL in prod.
// Stores { t: number, data: T[] } under the key.
export function getPersistedArray<T = string>(
  key: string,
  fallback: T[] = [],
  devTtlMs = 1000 * 60 * 60 // 1 hour in dev
): T[] {
  try {
    const raw =
      process.env.NODE_ENV === "development"
        ? sessionStorage.getItem(key) ?? localStorage.getItem(key)
        : localStorage.getItem(key);
    if (!raw) return fallback;
    const now = Date.now();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.data)) return fallback;
    if (process.env.NODE_ENV === "development") {
      if (typeof parsed.t !== "number" || now - parsed.t > devTtlMs) {
        clearPersisted(key);
        return fallback;
      }
    }
    return parsed.data as T[];
  } catch {
    return fallback;
  }
}

export function setPersistedArray<T = string>(key: string, value: T[]) {
  try {
    const payload = JSON.stringify({
      t: Date.now(),
      data: value,
    });
    if (process.env.NODE_ENV === "development") {
      // Prefer session in dev so a tab close resets it
      sessionStorage.setItem(key, payload);
    } else {
      localStorage.setItem(key, payload);
    }
  } catch {
    // no-op
  }
}

export function clearPersisted(key: string) {
  try {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch {
    // no-op
  }
}
