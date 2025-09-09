import Link from "next/link";

export const dynamic = "force-dynamic";
// data-marker: reviews-tiles-v1
// NOTE: No client components, no next/image needed to stay Vercel-safe.

type Row = { id?: string; slug?: string; brand?: string; model?: string; name?: string };

function titleOf(r: Row): string {
  const friendly = (r.name ?? "").toString().trim();
  const combo = [r.brand, r.model].filter(Boolean).join(" ").trim();
  const id = (r.slug || r.id || "").toString();
  return friendly || combo || id;
}

/** Normalize unknown shapes into { id, slug, brand, model, name }. */
function coerceRow(x: any): Row | null {
  if (!x) return null;
  if (typeof x === "string") return { id: x, slug: x };
  const id = x.id ?? x.slug ?? x.key ?? null;
  const brand = x.brand ?? x.make ?? x.manufacturer ?? undefined;
  const model = x.model ?? x.series ?? undefined;
  const name = x.name ?? x.title ?? (brand && model ? `${brand} ${model}` : undefined);
  if (!id) return null;
  return { id: String(id), slug: String(id), brand, model, name };
}

/** Try an API request to /api/tube-benders and normalize whatever shape it returns. */
async function tryApi(): Promise<Row[]> {
  try {
    const res = await fetch("/api/tube-benders", { cache: "no-store" });
    if (!res.ok) return [];
    const j = await res.json().catch(() => null) as any;
    const raw: any[] =
      (Array.isArray(j) && j) ||
      (Array.isArray(j?.data) && j.data) ||
      (Array.isArray(j?.rows) && j.rows) ||
      [];
    return raw.map(coerceRow).filter(Boolean) as Row[];
  } catch {
    return [];
  }
}

/** Try importing lib/catalog in whatever shape it exists, then normalize. */
async function tryCatalog(): Promise<Row[]> {
  try {
    const mod = await import("../../lib/catalog");
    const maybeList: any =
      (mod as any).default ??
      (mod as any).CATALOG ??
      (mod as any).catalog ??
      (mod as any).rows ??
      (mod as any).list ??
      null;
    const list: any[] = Array.isArray(maybeList) ? maybeList : [];
    return list.map(coerceRow).filter(Boolean) as Row[];
  } catch {
    return [];
  }
}

/** Try importing lib/tube-benders in whatever shape it exists, then normalize. */
async function tryTubeBenders(): Promise<Row[]> {
  try {
    const tb = await import("../../lib/tube-benders");
    if (typeof (tb as any).getTubeBenders === "function") {
      const rows = await (tb as any).getTubeBenders();
      if (Array.isArray(rows) && rows.length) {
        return rows.map(coerceRow).filter(Boolean) as Row[];
      }
    }
    const anyList: any =
      (tb as any).default ??
      (tb as any).BENDERS ??
      (tb as any).benders ??
      (tb as any).TUBE_BENDERS ??
      (tb as any).list ??
      null;
    const list: any[] = Array.isArray(anyList) ? anyList : [];
    return list.map(coerceRow).filter(Boolean) as Row[];
  } catch {
    return [];
  }
}

/** Final fallback: known-good IDs so UI renders while wiring data sources. */
const FALLBACK_IDS = [
  "baileigh-rdb-250",
  "jd2-model-32",
  "pro-tools-105hd",
  "roguefab-m600-series",
];

async function loadRows(): Promise<Row[]> {
  // 1) API first
  const a = await tryApi();
  if (a.length) return a;
  // 2) catalog module
  const b = await tryCatalog();
  if (b.length) return b;
  // 3) tube-benders module
  const c = await tryTubeBenders();
  if (c.length) return c;
  // 4) last resort: hardcoded list to confirm UI works
  return FALLBACK_IDS.map((id) => ({ id, slug: id }));
}

export default async function ReviewsIndex() {
  const rows = await loadRows();
  // Normalize, unique by id/slug, and create items for tiles.
  const seen = new Set<string>();
  const items = rows
    .map((r) => {
      const id = (r.slug || r.id || "").toString();
      return id ? { id, title: titleOf(r) } : null;
    })
    .filter(Boolean)
    .filter((it) => {
      const key = (it as { id: string }).id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }) as Array<{ id: string; title: string }>;

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Pick a model to view its review page.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground" data-testid="reviews-tiles-v1-empty">
          No reviewable models yet (tiles).
        </div>
      ) : (
        <div
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          data-testid="reviews-tiles-v1"
        >
          {items.map((it) => (
            <Link
              key={it.id}
              href={`/reviews/${encodeURIComponent(it.id)}`}
              className="block rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow"
              aria-label={`Open review for ${it.title}`}
            >
              <div className="p-4 flex flex-col gap-3">
                <div className="h-28 w-full rounded-xl bg-gray-100 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Review</span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-gray-900 line-clamp-2">{it.title}</h2>
                  <p className="text-xs text-muted-foreground break-words">{it.id}</p>
                </div>
                <span className="mt-1 inline-flex items-center text-xs font-medium text-blue-700">
                  View review →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}