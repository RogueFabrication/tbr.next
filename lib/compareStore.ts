// lib/compareStore.ts
// Purpose: single client-side source of truth for compare IDs.
// - Strictly sanitizes IDs using lib/catalog.ts
// - Stores in localStorage
// - Emits cross-component events
// - Can sync from URL (?ids=...) and auto-canonicalize the URL
//
// NOTE: this is a client-only utility because it uses window/localStorage.

'use client';

import { isValidId } from './catalog';

export const KEY = 'tbr.compare.ids';
export const EVT = 'compare:ids';

function emit(ids: string[]) {
  try {
    window.dispatchEvent(new CustomEvent<string[]>(EVT, { detail: ids } as any));
  } catch {
    // no-op
  }
}

/** Normalize, de-dupe, enforce slug format, and enforce catalog validity. */
export function sanitizeIds(ids: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const raw of ids) {
    if (typeof raw !== 'string') continue;

    const s = raw.trim().toLowerCase();

    // Accept only sluggy ids and only if they're in our catalog.
    if (!/^[a-z0-9-]+$/.test(s)) continue;
    if (!isValidId(s)) continue;

    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }

  return out;
}

/** Read current list from localStorage (already sanitized). */
export function readIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return sanitizeIds(arr);
  } catch {
    return [];
  }
}

/** Write list to localStorage; emits change event by default. */
export function writeIds(ids: string[], opts: { emit?: boolean } = { emit: true }) {
  if (typeof window === 'undefined') return;
  const clean = sanitizeIds(ids);
  localStorage.setItem(KEY, JSON.stringify(clean));
  if (opts.emit !== false) emit(clean);
}

export function clear() {
  writeIds([]);
}

export function add(id: string) {
  const next = sanitizeIds([...readIds(), id]);
  writeIds(next);
}

export function remove(id: string) {
  const s = (id || '').trim().toLowerCase();
  writeIds(readIds().filter(x => x !== s));
}

/** Subscribe to changes (local event + cross-tab 'storage'). */
export function subscribe(cb: (ids: string[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const onEvent = () => cb(readIds());
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb(readIds());
  };

  window.addEventListener(EVT, onEvent as EventListener);
  window.addEventListener('storage', onStorage);

  // fire once immediately with current state
  try { cb(readIds()); } catch {}

  return () => {
    window.removeEventListener(EVT, onEvent as EventListener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Pull ids from URLSearchParams (raw, unsanitized). */
export function parseIdsParam(params: URLSearchParams): string[] {
  const v = params.get('ids') ?? '';
  if (!v) return [];
  return v.split(/[,\s]+/).map(s => s.trim()).filter(Boolean);
}

/**
 * Sync store from the current URL and canonicalize the URL in place.
 * Returns the cleaned canonical list.
 */
export function syncFromUrlAndClean(url?: URL): string[] {
  if (typeof window === 'undefined') return [];
  const u = url ?? new URL(window.location.href);

  const raw = parseIdsParam(u.searchParams);
  const cleaned = sanitizeIds(raw);

  // Update store if different
  const have = readIds();
  if (JSON.stringify(have) !== JSON.stringify(cleaned)) {
    writeIds(cleaned, { emit: true });
  }

  // Canonicalize the URL
  const canonical = cleaned.join(',');
  const current = u.searchParams.get('ids') ?? '';
  if (canonical !== current) {
    if (canonical) u.searchParams.set('ids', canonical);
    else u.searchParams.delete('ids');
    const newHref = u.pathname + (u.searchParams.toString() ? `?${u.searchParams}` : '') + u.hash;
    window.history.replaceState(null, '', newHref);
  }

  return cleaned;
}

// Initialize localStorage key if missing (prevents null → [] jitter)
if (typeof window !== 'undefined' && localStorage.getItem(KEY) == null) {
  writeIds([], { emit: false });
}
