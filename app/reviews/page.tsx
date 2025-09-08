import Link from "next/link";
import { headers } from "next/headers";

/**
 * If set to "1", we skip hitting /api/tube-benders and use the local fallback instead.
 * Helpful for testing the fallback path without killing the dev server.
 */
const forceFallback = process.env.TBR_FORCE_REVIEWS_FALLBACK === "1";

type Row = {
  id?: string;
  slug?: string;
  brand?: string;
  model?: string;
  name?: string;
};

/** Build an absolute origin for server-side fetches (works in dev and Vercel). */
function resolveOrigin(): string {
  const h = headers();
  const xfProto = h.get("x-forwarded-proto");
  const xfHost = h.get("x-forwarded-host");
  const host = h.get("host");
  const proto = xfProto ?? (host?.startsWith("localhost") ? "http" : "https");
  const authority = xfHost ?? host ?? "localhost:3000";
  return `${proto}://${authority}`;
}

function rowsFromAny(input: unknown): Row[] | null {
  if (Array.isArray(input)) return input as Row[];
  if (input && typeof input === "object") {
    for (const v of Object.values(input as Record<string, unknown>)) {
      if (Array.isArray(v)) return v as Row[];
    }
  }
  return null;
}

function slugOf(r: Row): string {
  return (r.slug ?? r.id ?? "").toString();
}

function titleOf(r: Row): string {
  const friendly = r.name;
  if (friendly) return friendly;
  const parts = [r.brand, r.model].filter(Boolean).join(" ");
  return parts || slugOf(r);
}

async function tryApi(): Promise<{ rows: Row[]; source: string } | null> {
  const origin = resolveOrigin();
  try {
    const res = await fetch(`${origin}/api/tube-benders`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    const rows = rowsFromAny(data);
    if (rows && rows.length > 0) {
      return { rows, source: "api" };
    }
    return null;
  } catch {
    return null;
  }
}

async function tryFallback(): Promise<{ rows: Row[]; source: string } | null> {
  // Try a couple of local data modules without assuming exact export shape
  const specs = ["../../lib/catalog", "../../lib/tube-benders", "../../lib/tube_benders"];
  for (const spec of specs) {
    try {
      const mod: any = await import(spec);
      const rows = rowsFromAny(mod?.default ?? mod);
      if (rows && rows.length > 0) return { rows, source: `fallback:${spec}` };
    } catch {
      // keep trying
    }
  }
  return null;
}

/**
 * Resolve rows, preferring API unless forced to fallback via env.
 */
async function loadRows(): Promise<{ rows: Row[]; source: string }> {
  if (forceFallback) return (await tryFallback()) ?? { rows: [], source: "empty(fallback-forced)" };
  const viaApi = await tryApi();
  if (viaApi) return viaApi;
  const viaFallback = await tryFallback();
  if (viaFallback) return viaFallback;
  return { rows: [], source: "empty" };
}

/** Server component: lists reviewable models and links to their review pages. */
export default async function Page() {
  const { rows, source } = await loadRows();
  const isDev = process.env.NODE_ENV !== "production";
  const forced = forceFallback;

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <p className="text-sm text-gray-500">Pick a model to view its review page.</p>
        {isDev && (
          <p className="mt-1 text-xs text-gray-400">
            source: <code>{source}</code> (count: {rows.length}, forceFallback: {String(forced)})
          </p>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-gray-600">
          No reviewable models yet.
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {rows
            .map((r) => ({ slug: slugOf(r), title: titleOf(r) }))
            .filter((x) => x.slug)
            .map(({ slug, title }) => (
              <li key={slug}>
                <Link
                  href={`/reviews/${encodeURIComponent(slug)}`}
                  className="block rounded-md border p-4 hover:bg-gray-50"
                >
                  <div className="font-medium">{title}</div>
                  <div className="text-xs text-gray-500">/{slug}</div>
                </Link>
              </li>
            ))}
        </ul>
      )}
    </main>
  );
}