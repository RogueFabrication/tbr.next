import Link from "next/link";
import { getAllTubeBendersWithOverlay } from "../../../lib/catalogOverlay";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = { q?: string };

export default async function AdminProductsIndexPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const qRaw = (searchParams?.q ?? "").trim();
  const q = qRaw.toLowerCase();

  const products = await getAllTubeBendersWithOverlay();

  const filtered = q
    ? products.filter((p: any) => {
        const id = String(p?.id ?? "");
        const brand = String(p?.brand ?? "");
        const model = String(p?.model ?? "");
        const name = `${brand} ${model}`.trim();

        return (
          id.toLowerCase().includes(q) ||
          name.toLowerCase().includes(q) ||
          brand.toLowerCase().includes(q) ||
          model.toLowerCase().includes(q)
        );
      })
    : products;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Admin: Products</h2>
          <p className="mt-1 text-xs text-gray-600">
            Pick a product to edit its Neon overlay. This list is live-read (no cache)
            so you can refresh and see new catalog/overlay changes immediately.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
        >
          Back to login
        </Link>
      </div>

      <form method="GET" className="flex items-center gap-2">
        <input
          name="q"
          defaultValue={qRaw}
          placeholder="Search by id, brand, model…"
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Search
        </button>
        {qRaw ? (
          <Link
            href="/admin/products"
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
          >
            Clear
          </Link>
        ) : null}
      </form>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-2 text-xs text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filtered.length}</span>{" "}
          of <span className="font-semibold text-gray-900">{products.length}</span>
        </div>

        <ul className="divide-y divide-gray-100">
          {filtered.map((p: any) => {
            const id = String(p?.id ?? "");
            const brand = String(p?.brand ?? "").trim();
            const model = String(p?.model ?? "").trim();
            const label = `${brand} ${model}`.trim() || id;

            return (
              <li key={id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-900">
                      {label}
                    </div>
                    <div className="mt-0.5 truncate font-mono text-xs text-gray-500">
                      {id}
                    </div>
                  </div>
                  <Link
                    href={`/admin/products/${encodeURIComponent(id)}`}
                    className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

