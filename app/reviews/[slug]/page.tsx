import { notFound } from "next/navigation";

type Row = Record<string, unknown> | string;

/** Try to coerce any module export into an array of rows.
 *  - Arrays are returned as-is
 *  - Plain object maps become Object.values, injecting the map key as id/slug if missing
 *  - Functions (no-arg) that return an array/object are invoked
 */
function rowsFromModule(mod: any): any[] | null {
  if (!mod) return null;

  const candidates = [
    mod,
    mod.default,
    mod.rows,
    mod.list,
    mod.items,
    mod.BENDERS,
    mod.benders,
  ];

  const coerce = (val: any): any[] | null => {
    if (!val) return null;
    // If it's already an array, done.
    if (Array.isArray(val)) return val as any[];

    // If it's a function (no-arg getter), try calling it.
    if (typeof val === "function") {
      try {
        const out = val();
        if (Array.isArray(out)) return out as any[];
        if (out && typeof out === "object") return injectKeysToValues(out);
        return null;
      } catch {
        return null;
      }
    }

    // If it's a plain object map, take values and inject keys when missing.
    if (val && typeof val === "object") {
      return injectKeysToValues(val);
    }
    return null;
  };

  for (const c of candidates) {
    const arr = coerce(c);
    if (arr) return arr;
  }
  return null;
}

/** Convert a record map to an array; carry the key as id/slug if not present. */
function injectKeysToValues(map: Record<string, any>): any[] {
  return Object.entries(map).map(([key, v]) => {
    if (v && typeof v === "object") {
      const haveId = v.id != null || v.slug != null || v.key != null;
      return haveId ? v : { ...v, id: key, slug: key };
    }
    // If the value is primitive, wrap it
    return { id: key, slug: String(v ?? key) };
  });
}

/** Try both sources; return first usable array. */
async function loadAll(): Promise<Row[]> {
  const sources = ["../../../lib/catalog", "../../../lib/tube-benders"];
  for (const spec of sources) {
    try {
      const mod = await import(spec);
      const rows = rowsFromModule(mod);
      if (rows) return rows as Row[];
    } catch {
      // ignore and try next
    }
  }
  // Final fallback: ask our own API for the list of slugs and turn them into objects.
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/tube-benders`, {
      // Ensure this runs at request time on the server
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json().catch(() => null);
      const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      // Turn ["slug", ...] into [{ id, slug }]
      return data.map((s: any) =>
        typeof s === "string" ? ({ id: s, slug: s } as Row) : (s as Row)
      );
    }
  } catch {}
  return [] as Row[];
}

/** Turn a string row into an object with id+slug for uniform handling. */
function normalizeRow(r: Row): Record<string, unknown> {
  if (typeof r === "string") return { id: r, slug: r };
  return r as Record<string, unknown>;
}

/** Pull a best-effort "slug-ish" identifier from a row. */
function pickIdish(row: Record<string, unknown>): string | null {
  const v =
    (row.slug as any) ??
    (row.id as any) ??
    (row.key as any) ??
    (row.name as any) ??
    null;
  if (v == null) return null;
  return String(v).trim().toLowerCase();
}

/** Normalize for matching (lowercase & collapse spaces/underscores). */
function normSlug(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-");
}

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const asked = normSlug(params.slug);
  const raw = await loadAll();
  const rows = raw.map(normalizeRow);

  const match = rows.find((r) => {
    const base = pickIdish(r);
    return base ? normSlug(base) === asked : false;
  });

  if (!match) {
    // Short server-side crumb for diagnosis (shows up in server logs)
    console.log("[reviews/slug] miss", {
      asked,
      sampleIds: rows
        .slice(0, 8)
        .map((r) => pickIdish(r))
        .filter(Boolean),
      length: rows.length,
    });
    return notFound();
  }

  const title =
    (match as any)?.title ??
    (match as any)?.name ??
    (match as any)?.brand ??
    (match as any)?.id ??
    params.slug;

  // Pull common spec-ish fields if they exist; render only non-empty ones.
  const m = match as Record<string, any>;
  const specs: Array<[string, any]> = [
    ["Brand", m.brand],
    ["Model", m.model],
    ["Max Capacity", m.maxCapacity ?? m.capacity ?? m.max_cap],
    ["CLR Range", m.clrRange ?? m.clr ?? m.clr_range],
    ["Die Cost", m.dieCost],
    ["Cycle Time", m.cycleTime ?? m.cycletime],
    ["Weight", m.weight],
    ["Price", m.price],
    ["Mandrel", m.mandrel],
    ["Total Score", m.totalScore ?? m.score ?? m.total_score],
  ].filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "");

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      {/* Breadcrumb / nav helpers */}
      <div className="text-sm">
        <a href="/" className="text-blue-600 hover:underline">Home</a>
        <span className="mx-2 text-gray-400">/</span>
        <a href="/compare" className="text-blue-600 hover:underline">Compare</a>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500">Review</span>
      </div>

      {/* Title */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold leading-tight">{String(title)}</h1>
        <p className="text-sm text-gray-500">
          Slug: <code className="px-1 py-0.5 rounded bg-gray-100">{params.slug}</code>
        </p>
      </header>

      {/* Key Specs */}
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-medium text-gray-700">Key Specifications</h2>
        </div>
        {specs.length === 0 ? (
          <div className="px-4 py-6 text-sm text-gray-500">
            No structured specs available for this model yet.
          </div>
        ) : (
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 px-4 py-5 sm:grid-cols-2">
            {specs.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-gray-500">{label}</dt>
                <dd className="text-sm font-medium text-gray-900 text-right">
                  {String(value)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {/* Placeholder for future content (pros/cons, images, scoring breakdown, etc.) */}
      <div className="text-xs text-gray-400">
        (Detailed review content coming next.)
      </div>
    </div>
  );
}