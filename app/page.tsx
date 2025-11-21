// Server component: deploy-safe landing page
import Link from "next/link";
import { Tag, ShieldCheck, TrendingUp } from "lucide-react";
import { VALID_IDS } from "../lib/catalog";

export const metadata = {
  title: "TBR | TubeBenderReviews",
  description:
    "Compare popular tube benders side-by-side and find the best choice for your shop.",
};

export default function Page() {
  const picks = Array.isArray(VALID_IDS) ? VALID_IDS.slice(0, 4) : [];
  return (
    <main className="relative overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/images/hero/hero-industrial.jpg)",
        }}
      />

      {/* Dark overlay to keep text readable */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Foreground content */}
      <div className="relative">
        {/* Hero section */}
        <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-10 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Find the Right Tube Bender in Minutes.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
            Compare real-world capacity, die and tooling costs, footprint, and workflow speed across
            popular shop benders — all in one place.
          </p>

          {/* Proof tiles */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left text-xs sm:text-sm">
            <div className="rounded-lg bg-black/55 border-2 border-white/40 px-4 py-3 shadow-md">
              <div className="font-semibold text-white">
                11-Point Scoring Algorithm
              </div>
              <div className="mt-1 text-white/70">
                Weighted for real shop priorities like capacity, tooling cost, and uptime.
              </div>
            </div>
            <div className="rounded-lg bg-black/55 border-2 border-white/40 px-4 py-3 shadow-md">
              <div className="font-semibold text-white">
                12+ Brands Reviewed
              </div>
              <div className="mt-1 text-white/70">
                Popular fabrication benders compared on a common scoring framework.
              </div>
            </div>
            <div className="rounded-lg bg-black/55 border-2 border-white/40 px-4 py-3 shadow-md">
              <div className="font-semibold text-white">
                100% Transparent Methodology
              </div>
              <div className="mt-1 text-white/70">
                Clear criteria and scoring so you can sanity-check every recommendation.
              </div>
            </div>
          </div>

          {/* Trust line (now above buttons) */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-white/80">
            <div className="inline-flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-400" />
              <span>Expert Tested</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-orange-400" />
              <span>Unbiased Reviews</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Tag className="h-4 w-4 text-orange-400" />
              <span>Value-Focused</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/compare"
              className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent transition-colors"
              aria-label="Start comparing tube benders"
            >
              Start Comparing
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium border border-white/30 text-white hover:bg-white/10 transition-colors"
              aria-label="Open buyer's guide"
            >
              Buyer&apos;s Guide
            </Link>
          </div>

          {/* Mobile attribution in-flow */}
          <p className="mt-6 text-xs text-white/70 sm:hidden">
            Built by Mechanical Engineer Joseph Gambino — data-driven, brand-agnostic comparisons.
          </p>

          {/* Desktop attribution pinned to bottom-right of hero */}
          <div className="hidden sm:block absolute bottom-4 right-6 text-[11px] text-white/75 text-right max-w-xs leading-snug">
            Built by Mechanical Engineer Joseph Gambino
            <br />
            — data-driven, brand-agnostic comparisons.
          </div>
        </section>

        {/* Quick picks section */}
        <section className="mx-auto max-w-6xl px-6 pb-12 mt-2">
          <div className="rounded-xl bg-white/95 backdrop-blur shadow-sm border border-black/5 px-5 py-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Quick Picks</h2>
                <p className="text-xs text-gray-500">
                  Open a model directly in the compare table.
                </p>
              </div>
              <div className="text-xs text-gray-400">
                4 seeded models • more coming soon
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {picks.length === 0 ? (
                <div className="text-sm text-gray-500 col-span-full">
                  No models available yet. Check back soon.
                </div>
              ) : (
                picks.map((id) => (
                  <Link
                    key={id as string}
                    href={`/compare?ids=${encodeURIComponent(id as string)}`}
                    className="rounded-lg border border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50 px-4 py-3 transition-colors"
                    aria-label={`Compare ${String(id)}`}
                  >
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {String(id)}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Open in compare ›
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
