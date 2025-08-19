// lib/catalog.ts
// Temporary hardcoded list; replace with Option A when ready.

export const VALID_IDS = [
    'baileigh-rdb-250',
    'jd2-model-32',
    'pro-tools-105hd',
    'roguefab-m600-series',
  ].map(s => s.toLowerCase());
  
  export function isValidId(id: string): boolean {
    if (!id) return false;
    const s = id.trim().toLowerCase();
    return VALID_IDS.includes(s);
  }
  