import Link from "next/link";
import { BENDERS } from "../../data/benders";

export default function HomeShell() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight">TubeBenderReviews</h1>
        <p className="mt-3 text-lg text-gray-600">
          Independent-style comparisons with real specs. This is the clean boot shell—no charts or calendars yet.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/compare" className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700">
            Compare benders
          </Link>
          <Link href="/guide" className="rounded-lg border px-5 py-2.5 hover:bg-gray-50">
            Buyer's guide
          </Link>
        </div>
      </section>

      {/* Mini comparison table (static) */}
      <section id="compare" className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="mb-4 text-2xl font-semibold">Quick comparison</h2>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {BENDERS.slice(0, 3).map((r) => {
                const price = typeof r.price === "number" ? `$${r.price.toLocaleString()}` : "—";
                return (
                  <tr key={r.brand + r.model} className="border-t">
                    <td className="px-4 py-3">{r.brand}</td>
                    <td className="px-4 py-3">{r.model}</td>
                    <td className="px-4 py-3">{r.capacity}</td>
                    <td className="px-4 py-3">{price}</td>
                    <td className="px-4 py-3">{r.score ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Buyer's guide stub */}
      <section id="guide" className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-3 text-2xl font-semibold">Buyer's guide (stub)</h2>
        <ul className="list-disc space-y-1 pl-6 text-gray-700">
          <li>Decide on max OD/WT you must bend.</li>
          <li>Check die availability and lead times.</li>
          <li>Look for repeatability features and calibration.</li>
        </ul>
      </section>
    </div>
  );
}
  