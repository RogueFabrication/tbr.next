import type { Metadata } from "next";
import { SCORING_CATEGORIES, TOTAL_POINTS } from "../../lib/scoring";

export const metadata: Metadata = {
  title: "Tube Bender Scoring Methodology",
  description:
    "See the full 11-category, 100-point scoring framework used to rate tube benders on TubeBenderReviews.",
  openGraph: {
    title: "Tube Bender Scoring Methodology",
    description:
      "Transparent, 11-category, 100-point scoring system for tube bender comparisons.",
  },
};

export default function ScoringPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
            Tube Bender Scoring Methodology
            </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-gray-600">
            Complete transparency in how we calculate objective scores for tube
            bender comparisons. All scoring is based on published specs,
            documented capabilities, and verifiable data sources — not
            subjective opinions.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {/* Scoring overview */}
        <section className="rounded-xl border border-gray-200 bg-white px-5 py-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Scoring Overview
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Our 11-category scoring system evaluates tube benders across
            measurable, objective criteria.
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Total Points
                  </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {TOTAL_POINTS}
                  </div>
              <p className="mt-1 text-xs text-gray-500">
                Each bender receives a score out of 100 points across 11
                categories.
              </p>
                  </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Categories
                  </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {SCORING_CATEGORIES.length}
                  </div>
              <p className="mt-1 text-xs text-gray-500">
                Covering value, capacity, manufacturing, upgrade path, and
                advanced capability.
              </p>
                </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Scoring Types
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-gray-700">
                  Scaled scoring
                </span>
                <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-gray-700">
                  Binary scoring
                </span>
                <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-gray-700">
                  Tier-based scoring
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed categories */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Detailed Category Scoring
          </h2>

          <div className="space-y-6">
            {SCORING_CATEGORIES.map((cat) => (
              <article
                key={cat.key}
                className="rounded-xl border border-gray-200 bg-white px-5 py-5 shadow-sm"
                id={cat.key === "valueForMoney" ? "value-for-money" : undefined}
              >
                <header className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
              <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {cat.index}. {cat.name}{" "}
                      <span className="font-normal text-gray-500">
                        ({cat.maxPoints} points)
                      </span>
                    </h3>
                    <p className="mt-1 text-xs text-gray-600">
                      {cat.tagline}
                    </p>
                </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                      Method:{" "}
                      {cat.method === "tier"
                        ? "Tier-based"
                        : cat.method === "scaled"
                        ? "Scaled"
                        : cat.method === "binary"
                        ? "Binary"
                        : "Brand-based"}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                      Max {cat.maxPoints} pts
                    </span>
              </div>
                </header>

                {cat.key === "valueForMoney" && (
                  <p className="mb-2 text-xs text-muted-foreground">
                    For each machine we build a conservative minimum safe operating system cost from the lowest documented price of four components:{" "}
                    <span className="font-medium">frame, a ready-to-bend 180° die in a common size (typically 1.50&quot; tube), hydraulics (if required), and stand/mount when the machine cannot be safely operated without one</span>. Optional carts or premium stands that are not required for safe use are excluded from this calculation. When we cannot verify a component price, we either omit it
                    (for hydraulics/stands that are truly optional) or assign a conservative baseline so that incomplete data never inflates a score.
                  </p>
                )}

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 text-xs text-gray-600">
                    <p className="font-medium text-gray-900">
                      What this measures
                    </p>
                    {cat.key === "valueForMoney" && (
                      <>
                        <p>
                          Compares complete setup pricing – including base
                          machine, a middle-of-the-road 180° die, and hydraulic or power
                          options where required – against the rest of each
                          machine&apos;s objective feature score.
                        </p>
                        <p>
                          We first total up the non-price categories (capacity, bend angle, wall thickness, mandrel/S-bend capability, die ecosystem,
                          etc.) to get a single &quot;feature score&quot; out of 80 possible feature points for each machine. That feature score is then divided by the
                          minimum safe operating system cost and scaled into a 0–20 point range. Machines with unusually strong features-per-dollar ratios approach 20/20; weaker
                          ratios receive proportionally fewer points.
                        </p>
                        <p>
                          When we do not have enough data to compute a fair features-per-dollar comparison (for example missing pricing or key
                          specs), the Value for Money category is left at 0/20 with a note explaining that it is not scored for that machine rather
                          than guessing.
                        </p>
                        <p>
                          For die pricing we standardise on a single, ready-to-bend 180° die in a common size (typically 1.50&quot; tube) rather than
                          chasing the absolute cheapest small or low-degree die that might technically fit. For hydraulics, we use the lowest
                          manufacturer-endorsed power option rather than unsupported third-party jacks. For stands and carts, we only include
                          the lowest-cost option required for safe, stable operation; optional carts are treated as accessories, not mandatory system cost.
                        </p>
                      </>
                    )}
                    {cat.key === "easeOfUseSetup" && (
                      <>
                        <p>
                          Evaluates setup complexity, documentation quality,
                          and how much effort it takes to go from crate to
                          first accurate bend.
                        </p>
                        <p>
                          Factors include pre-assembly, clear instructions,
                          ergonomics, and how forgiving the machine is for
                          newer operators.
                        </p>
                      </>
                    )}
                    {cat.key === "maxDiameterRadius" && (
                      <>
                        <p>
                          Looks at maximum tube diameter capacity and the range
                          of centerline radii supported by the die ecosystem.
                        </p>
                        <p>
                          Larger, more flexible capacity scores higher for
                          shops that build a wider variety of projects.
                        </p>
                      </>
                    )}
                    {cat.key === "usaManufacturing" && (
                      <>
                        <p>
                          Binary score based on whether the machine qualifies
                          for an FTC-unqualified &quot;Made in USA&quot; claim –
                          meaning all or virtually all significant parts and
                          processing are of U.S. origin – as documented by the
                          manufacturer.
                        </p>
                        <p>
                          Machines that are assembled in the USA from mixed
                          components, or that only make qualified origin
                          claims, are treated as non-USA for scoring in this
                          category to stay conservative. This category reflects
                          customer preference for domestic manufacturing,
                          support, and parts availability.
                        </p>
                      </>
                    )}
                    {cat.key === "bendAngleCapability" && (
                      <>
                        <p>
                          Evaluates the maximum single-pass bend angle the
                          machine can reach with standard tooling.
                        </p>
                        <p>
                          Higher angles reduce the need for multi-stage bends
                          and enable more complex geometries.
                        </p>
                        <p>
                          Scoring is threshold-based on the manufacturer&apos;s
                          published maximum angle: 195° or more earns full
                          points, 180–194° earns a strong score, 120–179°
                          earns a mid-range score, and lower published angles
                          earn reduced points. If no bend angle is published,
                          this category receives zero points and is labeled
                          as "Not Published" on the product page.
                        </p>
                      </>
                    )}
                    {cat.key === "wallThicknessCapability" && (
                      <>
                        <p>
                          Standardises all machines to a 1.75&quot; OD reference
                          size and scores based on the thickest published wall
                          they can bend.
                        </p>
                        <p>
                          Machines with published wall data are tiered by
                          thickness: heavier-wall capacity earns more points,
                          while lighter-wall capacity earns fewer points. When
                          no wall thickness is published, we apply a conservative
                          baseline score and clearly label the data as "Not
                          Published" rather than guessing.
                        </p>
                      </>
                    )}
                    {cat.key === "dieSelectionShapes" && (
                      <>
                        <p>
                          Scores the die ecosystem by variety of diameters,
                          radii, and shapes (round tube, square, rectangle,
                          EMT, flat bar, etc.).
                        </p>
                        <p>
                          More coverage and better availability equal higher
                          scores, especially for specialty applications.
                        </p>
                      </>
                    )}
                    {cat.key === "yearsInBusiness" && (
                      <>
                        <p>
                          Tier-based scoring on manufacturer track record:
                          longer continuous operation generally means more
                          mature products and support.
                        </p>
                        <p>
                          Newer brands are not penalized out of contention but
                          receive conservative baseline scores until they build
                          history.
                        </p>
                      </>
                    )}
                    {cat.key === "upgradePathModularity" && (
                      <>
                        <p>
                          Evaluates how far the machine can grow with the shop:
                          power upgrades, automation, software, and accessory
                          ecosystem.
                        </p>
                        <p>
                          Systems that accept bolt-on upgrades or modular
                          tooling without replacing the base machine score
                          higher.
                        </p>
                      </>
                    )}
                    {cat.key === "mandrelCompatibility" && (
                      <>
                        <p>
                          Looks at whether the platform supports mandrel
                          bending out of the box or via documented upgrades.
                        </p>
                        <p>
                          Mandrel capability is crucial for thin-wall,
                          high-finish work in motorsport, aerospace, and
                          production environments.
                        </p>
                      </>
                    )}
                    {cat.key === "sBendCapability" && (
                      <>
                        <p>
                          Binary category indicating whether the manufacturer
                          documents S-bend capability with their tooling.
                        </p>
                        <p>
                          S-bends allow complex 3D geometries in a compact run
                          and are validated through published specs or proven
                          test pieces.
                        </p>
                      </>
                    )}
                </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p className="font-medium text-gray-900">
                      Data sources & verification
                    </p>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Manufacturer technical specs and capacity charts</li>
                      <li>Official product manuals and documentation</li>
                      <li>Manufacturer-published origin and company history</li>
                      <li>
                        When a spec is not published, we mark it as "Not
                        Published" in the UI and apply conservative defaults
                        rather than estimating.
                      </li>
                  </ul>
                </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Transparency block */}
        <section className="rounded-xl border border-gray-200 bg-white px-5 py-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Transparency & Verification
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            All scoring data is based on publicly available manufacturer
            specifications, product documentation, and clearly published
            technical capabilities. When specifications are not published, we
            label them as "Not Published" and avoid estimating wherever
            possible; any required fallbacks are intentionally conservative.
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-2 text-xs text-gray-600">
              <div>
              <p className="font-medium text-gray-900 mb-1">Data sources</p>
              <ul className="space-y-1 list-disc pl-4">
                <li>Manufacturer technical specs and capacity charts</li>
                <li>Product manuals and official documentation</li>
                <li>Company founding dates and manufacturer-published history</li>
                </ul>
              </div>
              <div>
              <p className="font-medium text-gray-900 mb-1">
                Scoring verification
              </p>
              <ul className="space-y-1 list-disc pl-4">
                <li>Cross-checks across multiple official sources</li>
                <li>
                  Conservative scoring when data is incomplete or ambiguous
                </li>
                <li>
                  Individual product pages will eventually expose per-category
                  breakdowns so you can inspect each score.
                </li>
                </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
