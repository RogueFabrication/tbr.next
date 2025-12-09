import type { Metadata } from "next";
import { SCORING_CATEGORIES, TOTAL_POINTS } from "../../lib/scoring";

export const metadata: Metadata = {
  title: "Tube Bender Scoring Methodology",
  description:
    "See the full, 100-point scoring framework used to rate tube benders on TubeBenderReviews.",
  openGraph: {
    title: "Tube Bender Scoring Methodology",
    description:
      "Transparent, multi-category, 100-point scoring system for tube bender comparisons.",
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
            Complete transparency in how we calculate scores for tube bender
            comparisons. Most categories are driven by published specs and
            documented capabilities; a few are brand-weighted for things like
            ecosystem depth and long-term support. In all cases we stay
            conservative and base scoring on verifiable information, not
            hand-wavy marketing claims.
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
            Our scoring system evaluates tube benders across primarily
            measurable, spec-based criteria, plus a small number of
            brand-weighted categories for support history and ecosystem depth.
            Where data is incomplete or ambiguous, we mark it as
            &quot;Not Published&quot; and apply conservative defaults rather
            than stretching the numbers.
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
                Each bender receives a score out of {TOTAL_POINTS} points across
                all scoring categories.
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
                <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-gray-700">
                  Brand-based scoring
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
                id={
                  cat.key === "valueForMoney"
                    ? "value-for-money"
                    : cat.key === "mandrelCompatibility"
                    ? "mandrel-compatibility"
                    : cat.key === "sBendCapability"
                    ? "s-bend-capability"
                    : undefined
                }
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

                {/* Category-specific explanations (left column) */}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 text-xs text-gray-600">
                    <p className="font-medium text-gray-900">
                      What this measures
                    </p>

                    {/* Value for Money */}
                    {cat.key === "valueForMoney" && (
                      <>
                        <p>
                          Compares complete setup pricing – including base
                          machine, a middle-of-the-road 180° die, and hydraulic
                          or power options where required – against the rest of
                          each machine&apos;s objective feature score.
                        </p>
                        <p>
                          We first total up the non-price categories (capacity,
                          bend angle, wall thickness, mandrel/S-bend capability,
                          die ecosystem, etc.) to get a single
                          &quot;feature score&quot; (out of a fixed pool of
                          feature points) for each machine. That feature score
                          is then divided by the{" "}
                          <span className="font-semibold">
                            minimum safe operating system cost
                          </span>{" "}
                          and scaled into this category&apos;s point range.
                        </p>
                        <p>
                          For each machine the minimum system cost is built
                          explicitly from four admin fields:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">Frame</span> –{" "}
                            <code className="font-mono text-[0.7rem]">
                              framePriceMin
                            </code>
                          </li>
                          <li>
                            <span className="font-semibold">
                              180° complete die
                            </span>{" "}
                            –{" "}
                            <code className="font-mono text-[0.7rem]">
                              diePriceMin
                            </code>{" "}
                            in a common size (typically ~1.50&quot; OD)
                          </li>
                          <li>
                            <span className="font-semibold">
                              Hydraulics / power unit
                            </span>{" "}
                            –{" "}
                            <code className="font-mono text-[0.7rem]">
                              hydraulicPriceMin
                            </code>{" "}
                            (only when required)
                          </li>
                          <li>
                            <span className="font-semibold">
                              Stand / cart (if required)
                            </span>{" "}
                            –{" "}
                            <code className="font-mono text-[0.7rem]">
                              standPriceMin
                            </code>
                          </li>
                        </ul>
                        <p className="mt-2">
                          Optional carts, boutique stands, cosmetic upgrades and
                          non-essential accessories are excluded. When we cannot
                          verify a component price, we either omit it (for truly
                          optional items) or use a conservative baseline rather
                          than guessing in a way that would inflate the score.
                        </p>
                      </>
                    )}

                    {/* Ease of Use & Setup */}
                    {cat.key === "easeOfUseSetup" && (
                      <>
                        <p>
                          Evaluates setup complexity and how easy the machine is
                          to move and operate in a real shop. This category
                          blends:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">Portability</span>{" "}
                            – whether the machine is fixed, portable,
                            portable-with-rolling-option, or rolling as
                            standard.
                          </li>
                          <li>
                            <span className="font-semibold">Power type</span> –
                            manual only vs. air/hydraulic vs. electric/hydraulic
                            (when multiple options exist we score the best
                            documented configuration).
                          </li>
                          <li>
                            <span className="font-semibold">
                              Angle measurement &amp; auto-stop
                            </span>{" "}
                            – documented, machine-mounted angle readouts and
                            any auto-stop-on-angle capability.
                          </li>
                        </ul>
                        <p className="mt-2">
                          Internally, these are turned into a 0–100 subscore
                          using a simple weighted average:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            Portability tier (fixed → rolling standard) drives
                            about half the subscore.
                          </li>
                          <li>
                            Power options (manual → electric/hydraulic) drive
                            about a third.
                          </li>
                          <li>
                            Built-in angle readout and auto-stop make up the
                            remainder.
                          </li>
                        </ul>
                        <p className="mt-2">
                          The final 0–100 subscore is then scaled to this
                          category&apos;s point value (
                          <code className="font-mono text-[0.7rem]">
                            cat.maxPoints
                          </code>
                          ). On each review page, we show which portability tier
                          and power options were used.
                        </p>
                      </>
                    )}

                    {/* Max diameter / radius */}
                    {cat.key === "maxDiameterRadius" && (
                      <>
                        <p>
                          Looks at maximum tube diameter capacity and (when
                          documented) the range of centerline radii supported.
                          Larger, more flexible capacity scores higher for
                          shops that build a wider variety of projects.
                        </p>
                        <p className="mt-2">
                          For each machine we reduce its capacity to a single
                          number using the largest documented tube OD (after
                          normalising units). Across the comparison set we then:
                        </p>
                        <ol className="ml-4 list-decimal space-y-1">
                          <li>
                            Find the smallest and largest max OD in the group.
                          </li>
                          <li>
                            Linearly scale each machine&apos;s OD into a 0–100
                            subscore between that min and max.
                          </li>
                        </ol>
                        <p className="mt-2">
                          That 0–100 capacity subscore is then scaled into this
                          category&apos;s point value. As we add new machines
                          with higher capacity, the scale updates automatically.
                        </p>
                      </>
                    )}

                    {/* USA manufacturing (origin points) */}
                    {cat.key === "usaManufacturing" && (
                      <>
                        <p>
                          Scores how strong the manufacturer&apos;s{" "}
                          <span className="font-semibold">
                            published U.S.-origin claims
                          </span>{" "}
                          are for the major components: frame, dies, and
                          hydraulics/lever.
                        </p>
                        <p className="mt-2">
                          This is a <span className="font-semibold">
                            disclosure-only
                          </span>{" "}
                          category. We do not investigate factories, trace
                          supply chains, or decide what would or would not meet
                          the FTC&apos;s legal standard for an unqualified{" "}
                          &quot;Made in USA&quot; claim. Instead:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            We read what the manufacturer publishes (web site,
                            manuals, official documentation).
                          </li>
                          <li>
                            We select a tier in the admin (
                            <code className="font-mono text-[0.7rem]">
                              originUsaScore
                            </code>
                            , 0–5) that best matches that disclosure.
                          </li>
                          <li>
                            We attach citations for every origin claim used in
                            scoring.
                          </li>
                        </ul>
                        <p className="mt-2 font-medium text-gray-900">
                          Tier meanings (0–5)
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">5</span> – Frame,
                            dies, and power unit/lever are all clearly disclosed
                            as manufactured/assembled in the USA with reasonable
                            detail.
                          </li>
                          <li>
                            <span className="font-semibold">4</span> – Frame and
                            dies are clearly USA; hydraulics/lever are disclosed
                            as mixed or partially imported.
                          </li>
                          <li>
                            <span className="font-semibold">3</span> – Frame is
                            clearly USA; origin of dies and/or hydraulics is
                            less clear or obviously mixed.
                          </li>
                          <li>
                            <span className="font-semibold">2</span> – Some
                            meaningful USA fabrication is disclosed (for
                            example, &quot;assembled in USA&quot; or clearly
                            U.S.-built frame) but key components are imported.
                          </li>
                          <li>
                            <span className="font-semibold">1</span> – Only
                            trivial USA references (for example &quot;designed
                            in USA&quot;) with no clear statement about where
                            major components are made.
                          </li>
                          <li>
                            <span className="font-semibold">0</span> – No
                            reliable published origin information, or claims
                            that are too vague/contradictory to rely on.
                          </li>
                        </ul>
                        <p className="mt-2">
                          That 0–5 tier is converted into a 0–100 subscore and
                          then scaled to this category&apos;s{" "}
                          {cat.maxPoints}-point weight. We label the tier choice
                          and the underlying citations on each product&apos;s
                          detailed breakdown.
                        </p>
                        <p className="mt-2 text-[0.7rem] text-gray-500">
                          Important: this category reflects{" "}
                          <span className="font-semibold">
                            how the manufacturer presents their own product
                          </span>
                          . It is not a legal determination of actual origin.
                        </p>
                      </>
                    )}

                    {/* Origin transparency – new category */}
                    {cat.key === "originTransparency" && (
                      <>
                        <p>
                          Rates{" "}
                          <span className="font-semibold">
                            how clearly and completely the manufacturer explains
                            where major components come from
                          </span>
                          , regardless of whether those components are U.S.-,
                          EU-, or elsewhere-made.
                        </p>
                        <p className="mt-2">
                          This category deliberately{" "}
                          <span className="font-semibold">
                            does not reward or punish
                          </span>{" "}
                          any particular country of origin. It only cares about
                          how transparent the documentation is.
                        </p>
                        <p className="mt-2 font-medium text-gray-900">
                          Tier meanings (0–5)
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">5</span> – Clear
                            breakdown for frame, dies, hydraulics, controls, and
                            assembly (for example &quot;frame fabricated in
                            &lt;country&gt;, dies machined in &lt;country&gt;,
                            power unit built by &lt;vendor&gt; in
                            &lt;country&gt;&quot;).
                          </li>
                          <li>
                            <span className="font-semibold">4</span> – Major
                            components (frame, dies, power unit) have explicit
                            origin disclosures; small parts may be grouped or
                            generalized.
                          </li>
                          <li>
                            <span className="font-semibold">3</span> – Partial
                            disclosures across multiple pages/manuals; you can
                            puzzle out most of the story but it isn&apos;t all
                            in one place.
                          </li>
                          <li>
                            <span className="font-semibold">2</span> – Minimal
                            origin language; one-line references with no real
                            detail.
                          </li>
                          <li>
                            <span className="font-semibold">1</span> – Vague,
                            marketing-heavy origin language that doesn&apos;t
                            meaningfully answer &quot;what is made where?&quot;
                          </li>
                          <li>
                            <span className="font-semibold">0</span> – No origin
                            info at all, or contradictory claims that make the
                            documentation unreliable.
                          </li>
                        </ul>
                        <p className="mt-2">
                          In admin this is stored as{" "}
                          <code className="font-mono text-[0.7rem]">
                            originTransparencyTier
                          </code>{" "}
                          (0–5) with citations. We convert that to a 0–100
                          subscore and scale to this category&apos;s{" "}
                          {cat.maxPoints}-point weight.
                        </p>
                      </>
                    )}

                    {/* Bend angle capability */}
                    {cat.key === "bendAngleCapability" && (
                      <>
                        <p>
                          Evaluates the{" "}
                          <span className="font-semibold">
                            maximum bend angle the machine is rated for
                          </span>{" "}
                          with its published tooling, not just a one-shot,
                          partial-degree example.
                        </p>
                        <p className="mt-2">
                          We use the manufacturer&apos;s published maximum angle
                          (multi-stroke is fine as long as it&apos;s documented)
                          and apply explicit thresholds:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">Top tier</span> –
                            published max angle ≥ 195°
                          </li>
                          <li>
                            <span className="font-semibold">High</span> –{" "}
                            180–194°
                          </li>
                          <li>
                            <span className="font-semibold">Mid</span> –{" "}
                            120–179°
                          </li>
                          <li>
                            <span className="font-semibold">Low</span> – below
                            120°
                          </li>
                        </ul>
                        <p className="mt-2">
                          Each tier maps to a fixed fraction of this
                          category&apos;s points. If no bend angle is published,
                          the machine gets 0 here and is labeled &quot;Not
                          Published&quot; in the breakdown.
                        </p>
                      </>
                    )}

                    {/* Wall thickness capability */}
                    {cat.key === "wallThicknessCapability" && (
                      <>
                        <p>
                          Standardises all machines to a 1.75&quot; OD reference
                          size and scores based on the thickest published wall
                          they can bend, plus which materials the manufacturer
                          explicitly documents as compatible.
                        </p>
                        <p className="mt-2">
                          Admin records a reference wall thickness (in inches)
                          for 1.75&quot; DOM along with a materials list. Across
                          the catalog we:
                        </p>
                        <ol className="ml-4 list-decimal space-y-1">
                          <li>
                            Find the thinnest and thickest published walls.
                          </li>
                          <li>
                            Linearly scale each machine into a 0–100 wall
                            subscore.
                          </li>
                        </ol>
                        <p className="mt-2">
                          We then add a small bump for documented materials
                          coverage (mild steel, stainless, 4130, aluminium,
                          titanium, copper/brass) and clamp the combined result
                          at 0–100 before scaling it to this category&apos;s
                          point value.
                        </p>
                        <p className="mt-2">
                          If no wall thickness is published, we apply a small,
                          conservative baseline instead of guessing and mark it
                          as &quot;Not Published&quot; in the UI.
                        </p>
                      </>
                    )}

                    {/* Die selection / shapes */}
                    {cat.key === "dieSelectionShapes" && (
                      <>
                        <p>
                          Scores each machine&apos;s die ecosystem based on how
                          many real-world shapes and standards it supports, not
                          just one or two common tube sizes.
                        </p>
                        <p className="mt-2">
                          We only count shapes and standards that the
                          manufacturer explicitly documents for that frame:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>Round tube (multiple sizes / CLRs)</li>
                          <li>Pipe (NPS)</li>
                          <li>Square and rectangular tube</li>
                          <li>EMT and/or metric tube/pipe</li>
                          <li>
                            Profile shapes (flat bar, angle, channel) when
                            marketed for this bender
                          </li>
                          <li>
                            Plastic/urethane/low-marring pressure dies sold for
                            thin-wall or cosmetic work
                          </li>
                        </ul>
                        <p className="mt-2">
                          Each documented family adds to a 0–100 subscore up to
                          a fixed cap; that subscore is then scaled to this
                          category&apos;s points. Ultra-niche or one-off
                          special-order dies do not earn extra credit.
                        </p>
                        <p className="mt-2 text-[0.7rem] text-gray-500">
                          We do not currently score whether dies are in stock,
                          backordered, or made-to-order. Lead times move too
                          quickly to score safely; we describe how to check them
                          yourself later on this page.
                        </p>
                      </>
                    )}

                    {/* Years in business */}
                    {cat.key === "yearsInBusiness" && (
                      <>
                        <p>
                          Lightly weights manufacturer track record: longer
                          continuous operation generally means more mature
                          products and support.
                        </p>
                        <p className="mt-2">
                          Admin stores an approximate{" "}
                          <code className="font-mono text-[0.7rem]">
                            yearsInBusiness
                          </code>{" "}
                          value based on manufacturer-published history. We:
                        </p>
                        <ol className="ml-4 list-decimal space-y-1">
                          <li>
                            Clamp years to a 0–30 range (30+ years all score the
                            same).
                          </li>
                          <li>
                            Convert that to a 0–100 subscore by simple
                            proportion.
                          </li>
                        </ol>
                        <p className="mt-2">
                          That subscore is then scaled into this
                          category&apos;s relatively small point weight so it
                          can never dominate more important, spec-driven
                          categories.
                        </p>
                      </>
                    )}

                    {/* Upgrade path & modularity */}
                    {cat.key === "upgradePathModularity" && (
                      <>
                        <p>
                          Measures how far the platform can grow with you: power
                          upgrade paths, length/rotation/angle control options,
                          auto-stop features, and thin/thick-wall tooling
                          upgrades.
                        </p>
                        <p className="mt-2">
                          In admin we track a set of boolean flags, including:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>Power upgrade path (manual → hydraulic, etc.)</li>
                          <li>Length stop / backstop</li>
                          <li>Rotation indexing</li>
                          <li>Built-in angle measurement</li>
                          <li>Auto-stop for bend angle</li>
                          <li>Thick-wall upgrade tooling</li>
                          <li>Thin-wall upgrade tooling</li>
                          <li>Wiper die support</li>
                        </ul>
                        <p className="mt-2">
                          Each documented, manufacturer-supported flag adds a
                          fixed amount to a raw upgrade score. We normalise that
                          raw score to a 0–100 subscore and then scale it to
                          this category&apos;s points. Machines with no
                          documented upgrade options stay at 0 here and are
                          treated as fixed-capability platforms.
                        </p>
                        <p className="mt-2 text-[0.7rem] text-gray-500">
                          Mandrel systems are scored separately in the Mandrel
                          category so we don&apos;t double-count them.
                        </p>
                      </>
                    )}

                    {/* Mandrel compatibility */}
                    {cat.key === "mandrelCompatibility" && (
                      <>
                        <p>
                          Looks at whether the platform supports mandrel bending
                          out of the box or via{" "}
                          <span className="font-semibold">
                            manufacturer-documented, supported upgrades
                          </span>
                          .
                        </p>
                        <p className="mt-2">
                          In admin we distinguish between:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">None</span> – no
                            mandrel option documented.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Economy mandrel
                            </span>{" "}
                            – non-bronze mandrels (plastic/aluminium/steel) sold
                            and supported for this frame.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Bronze mandrel
                            </span>{" "}
                            – traditional bronze mandrel system documented for
                            this frame.
                          </li>
                        </ul>
                        <p className="mt-2">
                          Each level maps to a fixed fraction of this
                          category&apos;s points, with bronze mandrels at the
                          top. Wiper die support can add a small bonus, up to
                          this category&apos;s cap.
                        </p>
                        <p className="mt-2">
                          Third-party or DIY mandrel kits with no factory
                          backing are treated as &quot;no mandrel option&quot;
                          even if they physically exist; we only score what the
                          manufacturer will stand behind.
                        </p>
                      </>
                    )}

                    {/* S-bend capability */}
                    {cat.key === "sBendCapability" && (
                      <>
                        <p>
                          Binary category indicating whether the machine can
                          produce a true S-bend:{" "}
                          <span className="font-semibold">
                            two bends in opposite directions with essentially no
                            straight tangent between them.
                          </span>
                        </p>
                        <p className="mt-2">
                          For scoring, we use a strict definition:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            The straight section between bends must be ≤
                            0.125&quot; (1/8&quot;) of tangent.
                          </li>
                          <li>
                            Capability must be documented by the manufacturer or
                            backed by repeatable test parts we can cite.
                          </li>
                        </ul>
                        <p className="mt-2">
                          If those criteria are met, the machine gets the full{" "}
                          {cat.maxPoints} points in this category. Otherwise it
                          gets 0, even if marketing photos show loose,
                          several-inch &quot;S&quot; shapes between bends.
                        </p>
                      </>
                    )}

                    {/* Single-source system – new category */}
                    {cat.key === "singleSourceSystem" && (
                      <>
                        <p>
                          Checks whether you can buy a{" "}
                          <span className="font-semibold">
                            complete, fully functional bending system
                          </span>{" "}
                          from a single primary source (typically the
                          manufacturer&apos;s own web site) without needing to
                          chase critical parts elsewhere.
                        </p>
                        <p className="mt-2">
                          We only care about major functional components:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>Frame</li>
                          <li>
                            At least one real 180° die (including clamp and
                            pressure die)
                          </li>
                          <li>
                            Required power source (hydraulic power unit or
                            manual lever/pump)
                          </li>
                          <li>
                            Stand or base, if required for safe, stable
                            operation
                          </li>
                        </ul>
                        <p className="mt-2">
                          Generic shop utilities (air, electricity, the tubing
                          itself) are ignored – everyone needs those.
                        </p>
                        <p className="mt-2 font-medium text-gray-900">
                          Scoring
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">Full points</span>{" "}
                            – All of the above can be purchased from one primary
                            source, using normal catalog items.
                          </li>
                          <li>
                            <span className="font-semibold">Zero points</span> –
                            Any required piece must be sourced elsewhere.
                          </li>
                        </ul>
                        <p className="mt-2">
                          In admin this is a simple yes/no flag stored as{" "}
                          <code className="font-mono text-[0.7rem]">
                            singleSourceComplete
                          </code>
                          . Internally we convert that to a 0 or 100 subscore
                          and scale it to this category&apos;s{" "}
                          {cat.maxPoints}-point weight.
                        </p>
                      </>
                    )}

                    {/* Warranty support – new category */}
                    {cat.key === "warrantySupport" && (
                      <>
                        <p>
                          Scores{" "}
                          <span className="font-semibold">
                            what the manufacturer claims in writing about
                            warranty coverage
                          </span>{" "}
                          for the machine. We do not test or verify whether they
                          honor it.
                        </p>
                        <p className="mt-2">
                          Admin selects a{" "}
                          <code className="font-mono text-[0.7rem]">
                            warrantyTier
                          </code>{" "}
                          (0–3) based solely on published warranty terms:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">3</span> – Clear,
                            written warranty covering workmanship/materials for
                            3+ years or lifetime on the frame, with exclusions
                            spelled out.
                          </li>
                          <li>
                            <span className="font-semibold">2</span> – Clear
                            written warranty 1–2 years on frame and key
                            components.
                          </li>
                          <li>
                            <span className="font-semibold">1</span> – Warranty
                            is mentioned but vague, partial, or very short
                            (&lt;1 year).
                          </li>
                          <li>
                            <span className="font-semibold">0</span> – No
                            warranty mentioned or explicitly sold &quot;as
                            is&quot;.
                          </li>
                        </ul>
                        <p className="mt-2">
                          We convert the 0–3 tier to a 0–100 subscore and scale
                          it to this category&apos;s{" "}
                          {cat.maxPoints}-point weight. Each product page links
                          to the underlying warranty wording where possible so
                          you can read the fine print yourself.
                        </p>
                        <p className="mt-2 text-[0.7rem] text-gray-500">
                          Important: this category only measures clarity and
                          breadth of the written warranty. It does{" "}
                          <span className="font-semibold">
                            not guarantee real-world service outcomes
                          </span>
                          .
                        </p>
                      </>
                    )}

                    {/* Default fallback for any other categories */}
                    {!(
                      cat.key === "valueForMoney" ||
                      cat.key === "easeOfUseSetup" ||
                      cat.key === "maxDiameterRadius" ||
                      cat.key === "usaManufacturing" ||
                      cat.key === "originTransparency" ||
                      cat.key === "bendAngleCapability" ||
                      cat.key === "wallThicknessCapability" ||
                      cat.key === "dieSelectionShapes" ||
                      cat.key === "yearsInBusiness" ||
                      cat.key === "upgradePathModularity" ||
                      cat.key === "mandrelCompatibility" ||
                      cat.key === "sBendCapability" ||
                      cat.key === "singleSourceSystem" ||
                      cat.key === "warrantySupport"
                    ) && (
                      <p>
                        This category uses the scoring method shown above
                        (scaled, tier-based, binary, or brand-weighted). Exact
                        per-category details are documented in the admin
                        scoring notes and surfaced on each machine&apos;s
                        breakdown page.
                      </p>
                    )}
                  </div>

                  {/* Data sources / verification (right column, generic) */}
                  <div className="space-y-2 text-xs text-gray-600">
                    <p className="font-medium text-gray-900">
                      Data sources &amp; verification
                    </p>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Manufacturer technical specs and capacity charts</li>
                      <li>Official product manuals and documentation</li>
                      <li>
                        Manufacturer-published origin, warranty, and company
                        history
                      </li>
                      <li>
                        When a spec is not published, we mark it as &quot;Not
                        Published&quot; in the UI and apply conservative
                        defaults rather than estimating.
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
            Transparency &amp; Verification
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            All scoring data is based on publicly available manufacturer
            specifications, product documentation, and clearly published
            technical capabilities. When specifications are not published, we
            label them as &quot;Not Published&quot; and avoid estimating
            wherever possible; any required fallbacks are intentionally
            conservative.
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-2 text-xs text-gray-600">
            <div>
              <p className="mb-1 font-medium text-gray-900">Data sources</p>
              <ul className="space-y-1 list-disc pl-4">
                <li>Manufacturer technical specs and capacity charts</li>
                <li>Product manuals and official documentation</li>
                <li>
                  Company founding dates and manufacturer-published history
                </li>
                <li>
                  Manufacturer-published origin and warranty language (with
                  citations stored per machine)
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-1 font-medium text-gray-900">
                Scoring verification
              </p>
              <ul className="space-y-1 list-disc pl-4">
                <li>Cross-checks across multiple official sources</li>
                <li>
                  Conservative scoring when data is incomplete or ambiguous
                </li>
                <li>
                  Individual product pages will expose per-category breakdowns
                  so you can inspect each score.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Factors we don't score */}
        <section className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Important Factors We Don&apos;t Score (And How to Test Them
            Yourself)
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Some things matter a lot in real shops but can&apos;t be scored
            fairly or safely by any comparison site, including this one. Two of
            the biggest are lead times and service quality.
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-2 text-xs text-gray-800">
            <div>
              <p className="mb-1 font-medium text-gray-900">Lead times</p>
              <p className="mb-2">
                Lead times move constantly and are rarely published in a way
                that stays accurate. Instead of pretending to have a single
                number, we recommend you call the top 2–3 manufacturers you&apos;re
                considering and ask:
              </p>
              <ul className="space-y-1 list-disc pl-4">
                <li>
                  &quot;If I ordered today, what is the lead time on the
                  machine?&quot;
                </li>
                <li>
                  &quot;If I order a 2&quot; die today, about when would I have
                  it?&quot;
                </li>
              </ul>
              <p className="mt-2">
                Some machines and dies ship same day or in a couple business
                days. Others have multi-month die lead times.{" "}
                <span className="font-semibold">
                  Call every company you&apos;re seriously considering and ask
                  the exact same questions, then compare answers.
                </span>{" "}
                You&apos;ll be amazed at how much you learn about each
                company&apos;s organization, priorities, and customer service in
                just a few minutes of phone time — and whatever they tell you on
                that call will be more current (and more honest) than any static
                lead-time number we could safely publish in a scoring table.
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium text-gray-900">Service quality</p>
              <p className="mb-2">
                Service quality is not published in specs and can&apos;t be
                captured honestly in a single score. But you can learn a lot
                from one phone call:
              </p>
              <ul className="space-y-1 list-disc pl-4">
                <li>How quickly they answer the phone</li>
                <li>Whether you reach someone who actually knows the product</li>
                <li>
                  Whether they&apos;re rushed and defensive, or patient and
                  helpful
                </li>
                <li>
                  How transparent they are about stock, backorders, and
                  realistic ship dates
                </li>
              </ul>
              <p className="mt-2">
                We don&apos;t turn these into points. Instead, we give you
                almost everything that can be scored objectively and then tell
                you exactly how to pressure-test the last few items directly
                with the manufacturers you&apos;re considering.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
