// lib/slug.ts
export function toSlug(input: string) {
    return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  export function tbToSlug(tb: { brand?: string; model?: string; slug?: string; id?: string | number }) {
    if (tb?.slug) return tb.slug;
    if (tb?.id) return String(tb.id);
    return toSlug(`${tb?.brand ?? ""}-${tb?.model ?? ""}`);
  }
  
