import React from "react";
import Link from "next/link";
import { allTubeBenders } from "../../lib/catalog";

type Product = {
  id: string;
  slug?: string;
  name?: string;
  brand?: string;
  model?: string;
};

/** Lightweight slugify (no deps). */
function slugOf(input: string): string {
  const s = String(input ?? "");
  const decomp = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  return decomp.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}

/** Normalize a free-form token (id/slug/brand+model/name) to slug. */
const normalizeToken = (t: string) => slugOf(t.trim());

/** Parse `ids` robustly: supports `%2C`, `;`, `|`, spaces, or an array param. */
function parseIds(ids: string | string[] | undefined): string[] {
  let input = Array.isArray(ids) ? ids.join(",") : (ids ?? "");
  try { input = decodeURIComponent(input); } catch {}
  input = input.replace(/%2C/gi, ",").replace(/[|;]+/g, ",");
  return input.split(",").map(s => s.trim()).filter(Boolean);
}

/** True if token is an integer (e.g., "2"). */
const isIntToken = (t: string) => /^[0-9]+$/.test(t);

/** Decide if numeric tokens should be treated as 1-based or 0-based (request-wide). */
function chooseIndexScheme(tokens: string[], listLen: number): "one" | "zero" {
  const ints = tokens.filter(isIntToken);
  if (ints.length === 0) return "zero";
  const allOneRange = ints.every(t => { const n = parseInt(t, 10); return n >= 1 && n <= listLen; });
  const hasZero = ints.some(t => t === "0");
  return (allOneRange && !hasZero) ? "one" : "zero";
}

function titleOf(p: Product): string {
  return (p.name && p.name.trim()) || [p.brand, p.model].filter(Boolean).join(" ").trim() || p.id;
}

function buildLookup(products: Product[]): Map<string, Product> {
  const map = new Map<string, Product>();
  for (const p of products) {
    const cands = new Set<string>();
    if (p.id) cands.add(p.id);
    if (p.slug) cands.add(p.slug);
    if (p.name) cands.add(p.name);
    const bm = [p.brand, p.model].filter(Boolean).join(" ");
    if (bm) cands.add(bm);
    for (const c of Array.from(cands)) map.set(slugOf(c), p);
  }
  return map;
}

function dedupePreserveOrder(items: Product[]): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of items) {
    const key = p.id || p.slug;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

type ComparePageProps = { searchParams?: { ids?: string | string[] } };
export default function ComparePage({ searchParams }: ComparePageProps) {
  const tokens = parseIds(searchParams?.ids);
  const lookup = buildLookup(allTubeBenders as Product[]);
  const normalized = tokens.map(normalizeToken);
  // Resolve tokens with a single index scheme to avoid doubling (bug: 2 tokens → 3+ rows).
  const list = allTubeBenders as Product[];
  const scheme = chooseIndexScheme(normalized, list.length);
  const matched = normalized.flatMap((t) => {
    const byKey = lookup.get(t);
    if (byKey) return [byKey];
    if (!isIntToken(t)) return [];
    const n = parseInt(t, 10);
    const idx = scheme === "one" ? (n - 1) : n;
    const p = (idx >= 0 && idx < list.length) ? list[idx] : undefined;
    return p ? [p] : [];
  }) as Product[];
  const rows = dedupePreserveOrder(matched);

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Compare</h1>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matches.</p>
      ) : (
        <div className="text-sm mb-4">
          {/* Minimal, non-invasive rendering so matches are visible */}
          <ul className="list-disc pl-5">
            {rows.map((p) => (
              <li key={p.id}>
                <span className="font-medium">{titleOf(p)}</span>
                <span className="text-muted-foreground"> — {p.id}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 text-sm text-muted-foreground">
        <Link className="underline" href="/reviews">Browse reviews</Link>
      </div>
    </main>
  );
}