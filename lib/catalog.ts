// lib/catalog.ts
// TODO: Replace this temporary hardcoded VALID_IDS with a real import from your products list.
// Example (when ready):
// import { PRODUCTS } from '@/data/products';
// export const VALID_IDS = PRODUCTS.map(p => p.slug?.toLowerCase()).filter(Boolean);


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
  