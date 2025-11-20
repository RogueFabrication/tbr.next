// Server component: deploy-safe landing page
import Link from "next/link";
import { VALID_IDS } from "../lib/catalog";

export const metadata = {
  title: "TBR | TubeBenderReviews",
  description:
    "Compare popular tube benders side-by-side and find the best choice for your shop.",
};

export default function Page() {
  const picks = Array.isArray(VALID_IDS) ? VALID_IDS.slice(0, 4) : [];
  return (
    <main className="relative overflow-hidden min-h-[70vh]">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: "url(/images/hero/hero-industrial.jpg)",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Foreground content */}
      <div className="relative px-6 py-10">
        <section className="mx-auto max-w-5xl">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Compare tube benders, fast.
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Quickly evaluate capacity, die costs, weight, cycle time, and more —
            then compare models side-by-side.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/compare"
              className="inline-flex items-center rounded-lg px-4 py-2 text-white bg-gray-900 hover:bg-gray-800"
              aria-label="Start comparing tube benders"
            >
              Start comparing
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center rounded-lg px-4 py-2 border border-gray-300 text-gray-800 hover:bg-gray-50"
              aria-label="Open buyer's guide"
            >
              Buyer&apos;s Guide
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl mt-12">
          <h2 className="text-lg font-medium text-gray-900">Quick picks</h2>
          <p className="text-sm text-gray-500 mb-3">
            Jump straight to a model — edit selections on the compare page.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {picks.length === 0 ? (
              <div className="text-sm text-gray-500 col-span-full">
                No models available.
              </div>
            ) : (
              picks.map((id) => (
                <Link
                  key={id as string}
                  href={`/compare?ids=${encodeURIComponent(id as string)}`}
                  className="rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-4 py-3"
                  aria-label={`Compare ${String(id)}`}
                >
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {String(id)}
                  </div>
                  <div className="text-xs text-gray-500">Open in compare ›</div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
