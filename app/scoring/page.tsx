import type { Metadata } from "next";
import { SCORING_CATEGORIES, TOTAL_POINTS } from "../../lib/scoring";

export const metadata: Metadata = {
  title: "Tube Bender Scoring Methodology",
  description:
    "See the full scoring framework used to rate tube benders on TubeBenderReviews.",
  openGraph: {
    title: "Tube Bender Scoring Methodology",
    description:
      "Transparent, category-based scoring system for tube bender comparisons.",
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
                Each bender receives a score out of {TOTAL_POINTS} points across{" "}
                {SCORING_CATEGORIES.length} categories.
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
          <p className="mt-1 text-xs text-gray-600">
            If you want to see these scores applied to a real machine, open any
            review on TubeBenderReviews.com and scroll near the bottom of the
            page. Click the link that expands the full citation and score
            calculation section. You&apos;ll see every category score
            calculated with the exact numbers we used for that machine.
          </p>

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

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {/* What this measures */}
                  <div className="space-y-2 text-xs text-gray-600">
                    <p className="font-medium text-gray-900">
                      What this measures
                    </p>

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
                          &quot;feature score&quot; for each machine. That
                          feature score is then divided by the minimum safe
                          operating system cost and scaled into a 0–20 point
                          range. Machines with unusually strong
                          features-per-dollar ratios approach 20/20; weaker
                          ratios receive proportionally fewer points.
                        </p>
                        <p className="mt-2">
                          To make this concrete, here is the actual math we use:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            Take the machine&apos;s feature score from all
                            non-price categories (for example,{" "}
                            <span className="font-semibold">72</span> points out
                            of 80 possible feature points).
                          </li>
                          <li>
                            Divide by the minimum safe system cost (for example,{" "}
                            <span className="font-semibold">$3,600</span>):{" "}
                            <code>72 ÷ 3600 ≈ 0.02</code> points per dollar.
                          </li>
                          <li>
                            Compare that features-per-dollar ratio to a
                            conservative market baseline and scale it into a
                            0–20 point range. Machines with unusually strong
                            features-per-dollar ratios approach{" "}
                            <span className="font-semibold">20/20</span>; weaker
                            ratios receive proportionally fewer points.
                          </li>
                        </ul>
                        <p className="mt-2">
                          If you want to see this in a live calculation, open
                          any machine review and expand the full citation and
                          score calculation section. You&apos;ll see every point
                          for features divided by every dollar of cost, and the
                          result multiplied into this 20-point category exactly
                          as described here.
                        </p>
                      </>
                    )}

                    {cat.key === "easeOfUseSetup" && (
                      <>
                        <p>
                          Evaluates setup complexity, ergonomics, and how much
                          effort it takes to go from crate to first accurate
                          bend, plus how easy the machine is to move around your
                          shop.
                        </p>
                        <p>
                          The score combines a base ergonomics/operation number
                          (brand + power-type heuristic) with a{" "}
                          <span className="font-semibold">
                            portability tier
                          </span>{" "}
                          derived from the admin field:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">0 pts</span> – fixed
                            base that must be bolted to the floor or bench.
                          </li>
                          <li>
                            <span className="font-semibold">1 pt</span> –
                            portable, no factory rolling option.
                          </li>
                          <li>
                            <span className="font-semibold">2 pts</span> –
                            portable with a documented rolling base/cart
                            option.
                          </li>
                          <li>
                            <span className="font-semibold">3 pts</span> –
                            ships on a rolling base as standard.
                          </li>
                        </ul>
                        <p className="mt-2">
                          The final Ease of Use &amp; Setup score is the sum of
                          the base ergonomics/operation score and the
                          portability tier, clamped to a maximum of{" "}
                          {cat.maxPoints}/{cat.maxPoints}.
                        </p>
                      </>
                    )}

                    {cat.key === "maxDiameterRadius" && (
                      <>
                        <p>
                          Looks at the{" "}
                          <span className="font-semibold">
                            maximum round tube outside diameter
                          </span>{" "}
                          the machine is rated for with its catalog tooling.
                        </p>
                        <p className="mt-1">
                          In the future this category will also explicitly score
                          Center Line Radius (CLR) range. Right now, CLR
                          documentation is not consistent across all machines,
                          so the math is{" "}
                          <span className="font-semibold">OD-only</span> even
                          though we describe CLR in the copy. We&apos;d rather
                          admit that limitation than pretend we are already
                          scoring CLR numerically.
                        </p>
                      </>
                    )}

                    {cat.key === "bendAngleCapability" && (
                      <>
                        <p>
                          Evaluates the{" "}
                          <span className="font-semibold">
                            maximum bend angle
                          </span>{" "}
                          the machine is rated for with its published tooling,
                          not just a one-shot partial-degree example.
                        </p>
                        <p className="mt-1">
                          Scoring tiers are explicit:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">≥ 195°</span> – full{" "}
                            <span className="font-semibold">
                              {cat.maxPoints}
                            </span>{" "}
                            points.
                          </li>
                          <li>
                            <span className="font-semibold">180–194°</span> –{" "}
                            <span className="font-semibold">7</span> points.
                          </li>
                          <li>
                            <span className="font-semibold">120–179°</span> –{" "}
                            <span className="font-semibold">4</span> points.
                          </li>
                          <li>
                            <span className="font-semibold">&lt; 120°</span> –{" "}
                            <span className="font-semibold">2</span> points.
                          </li>
                          <li>
                            <span className="font-semibold">
                              No published max angle
                            </span>{" "}
                            – <span className="font-semibold">0</span> points;
                            the product page shows this as &quot;Not
                            Published&quot;.
                          </li>
                        </ul>
                      </>
                    )}

                    {cat.key === "wallThicknessCapability" && (
                      <>
                        <p>
                          Standardises all machines to a{" "}
                          <span className="font-semibold">
                            1.75&quot; OD DOM reference size
                          </span>{" "}
                          and scores based on the thickest wall the
                          manufacturer is willing to publish, plus which
                          materials they explicitly document as compatible.
                        </p>
                        <p className="mt-1">
                          The math has two parts:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">
                              Thickness (0–6 pts)
                            </span>{" "}
                            – based on the published max wall at 1.75&quot; OD.
                            Thicker walls earn more points; very light walls
                            earn fewer.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Material coverage (0–3 pts)
                            </span>{" "}
                            – mild steel, 4130 chromoly, stainless, aluminum,
                            titanium, copper/brass/bronze, and other alloys
                            based only on what the manufacturer actually lists.
                          </li>
                        </ul>
                        <p className="mt-2">
                          Any machine{" "}
                          <span className="font-semibold">
                            without a published max wall
                          </span>{" "}
                          for 1.75&quot; OD DOM gets{" "}
                          <span className="font-semibold">0 points</span> in
                          this category. We do not infer capacity from photos
                          or marketing language.
                        </p>
                      </>
                    )}

                    {cat.key === "dieSelectionShapes" && (
                      <>
                        <p>
                          Scores each machine&apos;s die ecosystem based on{" "}
                          <span className="font-semibold">
                            how many real-world tube/pipe families it covers
                          </span>
                          .
                        </p>
                        <p className="mt-1">
                          This is a simple checklist:{" "}
                          <span className="font-semibold">
                            1 point per documented family
                          </span>{" "}
                          up to {cat.maxPoints}:
                        </p>
                        <ul className="ml-4 list-disc space-y-1 mt-1">
                          <li>Round tube</li>
                          <li>Pipe (NPS)</li>
                          <li>Square tube</li>
                          <li>EMT</li>
                          <li>Metric round</li>
                          <li>Metric square/rectangular</li>
                          <li>Plastic / urethane / low-marring pressure dies</li>
                          <li>
                            Other clearly documented shapes (for example,
                            regular production dies for rectangular tube or hex
                            tube).
                          </li>
                        </ul>
                        <p className="mt-2">
                          When a machine is explicitly designed around another
                          brand&apos;s die ecosystem (for example, Pro-Tools),
                          we only credit those shapes when the bender
                          manufacturer clearly claims that compatibility and we
                          can cite both their documentation and the die
                          manufacturer&apos;s catalog. We do not silently import
                          third-party ecosystems the manufacturer never
                          mentions.
                        </p>
                      </>
                    )}

                    {cat.key === "yearsInBusiness" && (
                      <>
                        <p>
                          Lightly weighted indicator of manufacturer track
                          record. This category is only {cat.maxPoints} points
                          out of 100; it nudges established brands up slightly
                          but does not rescue a weak machine or sink a strong
                          new entrant.
                        </p>
                        <p className="mt-1">
                          We use approximate years in business based on the
                          manufacturer&apos;s published history and map that
                          into a simple tiered score: long-standing brands earn
                          a bit more, newer brands get a modest baseline.
                        </p>
                      </>
                    )}

                    {cat.key === "upgradePathModularity" && (
                      <>
                        <p>
                          Answers:{" "}
                          <span className="font-semibold">
                            &quot;If I buy the base machine, how far can it
                            grow with me?&quot;
                          </span>
                        </p>
                        <p className="mt-1">
                          This category is worth {cat.maxPoints} points total:{" "}
                          <span className="font-semibold">
                            1 point for each documented upgrade
                          </span>
                          :
                        </p>
                        <ul className="ml-4 list-disc space-y-1 mt-1">
                          <li>Power upgrade path (manual → hydraulic, etc.)</li>
                          <li>Length stop / backstop system</li>
                          <li>Rotation indexing for bend-to-bend alignment</li>
                          <li>Built-in or securely machine-mounted angle readout</li>
                          <li>Auto-stop for bend angle</li>
                          <li>Thick-wall specific tooling or capacity upgrades</li>
                          <li>Thin-wall / AL / stainless bend-quality upgrades</li>
                          <li>Support for wiper dies</li>
                        </ul>
                        <p className="mt-2">
                          We only award points for upgrades the manufacturer
                          actually documents for that frame. If none of the
                          items above are published for a machine, it receives{" "}
                          0/{cat.maxPoints} here.
                        </p>
                      </>
                    )}

                    {cat.key === "mandrelCompatibility" && (
                      <>
                        <p>
                          Looks at whether the platform supports mandrel
                          bending out of the box or via{" "}
                          <span className="font-semibold">
                            manufacturer-documented, supported upgrades
                          </span>
                          .
                        </p>
                        <p className="mt-1">
                          Scoring is three-tier:
                        </p>
                        <ul className="ml-4 list-disc space-y-1 mt-1">
                          <li>
                            <span className="font-semibold">0 points</span> – no
                            documented mandrel option.
                          </li>
                          <li>
                            <span className="font-semibold">2 points</span> – an{" "}
                            <span className="font-semibold">economy mandrel</span>{" "}
                            option (non-bronze mandrels such as plastic,
                            aluminum, or steel) documented for this frame.
                          </li>
                          <li>
                            <span className="font-semibold">
                              {cat.maxPoints} points
                            </span>{" "}
                            – a full bronze or equivalent mandrel system,
                            clearly documented and supported by the
                            manufacturer.
                          </li>
                        </ul>
                        <p className="mt-2">
                          We only award points when the manufacturer explicitly
                          publishes a mandrel option. Third-party or DIY kits
                          that the manufacturer does not stand behind are
                          treated as &quot;no mandrel option&quot; for scoring
                          purposes.
                        </p>
                      </>
                    )}

                    {cat.key === "sBendCapability" && (
                      <>
                        <p>
                          Binary category indicating whether the machine can
                          produce a{" "}
                          <span className="font-semibold">true S-bend</span>: two
                          bends in opposite directions with essentially no
                          straight tangent between them.
                        </p>
                        <p className="mt-1">
                          For scoring, we use a strict engineering definition:
                          the straight section between the end of the first bend
                          and the start of the second bend must be{" "}
                          <span className="font-semibold">
                            at or below 0.125&quot; (1/8&quot;) of tangent
                          </span>
                          . Any configuration that leaves several inches of
                          straight tube between bends – even if marketed as an
                          &quot;S-bend&quot; –{" "}
                          <span className="font-semibold">
                            does not qualify
                          </span>
                          .
                        </p>
                      </>
                    )}

                    {cat.key === "usaManufacturingDisclosure" && (
                      <>
                        <p>
                          Scores{" "}
                          <span className="font-semibold">
                            what the manufacturer claims
                          </span>{" "}
                          about origin, not what we or you might discover in a
                          factory audit. This is intentionally{" "}
                          {cat.maxPoints}-points out of 100 so it matters, but
                          it doesn&apos;t dominate the system.
                        </p>
                        <p className="mt-1">
                          The admin tool assigns a 0–5 tier based on published
                          language, roughly:
                        </p>
                        <ul className="ml-4 list-disc space-y-1 mt-1">
                          <li>
                            <span className="font-semibold">5 pts</span> – broad,
                            unqualified whole-system &quot;Made in USA&quot;-type
                            claim (frame, dies, hydraulics, and assembly all
                            implied to be domestic).
                          </li>
                          <li>
                            <span className="font-semibold">4 pts</span> – clear
                            claim that{" "}
                            <span className="font-semibold">
                              frames and dies
                            </span>{" "}
                            are made in the USA, with hydraulics or small
                            hardware openly described as imported.
                          </li>
                          <li>
                            <span className="font-semibold">3 pts</span> – mixed
                            claims such as &quot;assembled in USA from domestic
                            and imported components&quot; or &quot;frame made
                            here, dies imported&quot;.
                          </li>
                          <li>
                            <span className="font-semibold">2 pts</span> – weak
                            USA-flavored language (&quot;engineered in USA&quot;,
                            &quot;designed in USA&quot;) without a clear
                            statement about where major parts are made.
                          </li>
                          <li>
                            <span className="font-semibold">0 pts</span> –
                            clearly non-USA origin or no USA-related claim at
                            all.
                          </li>
                        </ul>
                        <p className="mt-2">
                          This category is{" "}
                          <span className="font-semibold">
                            disclosure-based only
                          </span>
                          . It does not tell you whether a claim would satisfy
                          the FTC&apos;s rules for an unqualified &quot;Made in
                          USA&quot; statement, and we are not giving legal
                          opinions on that.
                        </p>
                      </>
                    )}

                    {cat.key === "originTransparency" && (
                      <>
                        <p>
                          Scores how clearly a manufacturer explains{" "}
                          <span className="font-semibold">
                            where major components come from
                          </span>{" "}
                          – not which country is &quot;better&quot; or
                          &quot;worse&quot;.
                        </p>
                        <p className="mt-1">
                          Higher scores go to brands that publish concrete,
                          component-level origin info (for example, &quot;frame
                          machined in US, dies from Italy, hydraulics from
                          Japan&quot;). Lower scores go to vague marketing
                          language or silence.
                        </p>
                        <p className="mt-1">
                          This category is intentionally separate from the USA
                          Manufacturing score so that transparent non-US brands
                          can still score well here.
                        </p>
                      </>
                    )}

                    {cat.key === "singleSourceSystem" && (
                      <>
                        <p>
                          Binary category: can a normal buyer obtain a{" "}
                          <span className="font-semibold">
                            complete, fully functional system
                          </span>{" "}
                          (frame + dies + hydraulics or lever, plus any stand
                          required for safe use) from one primary
                          manufacturer/storefront?
                        </p>
                        <p className="mt-1">
                          If the answer is yes, the machine gets{" "}
                          <span className="font-semibold">2 points</span>. If
                          the manufacturer pushes you to assemble a basic system
                          from multiple companies, or does not clearly offer a
                          full system, it gets{" "}
                          <span className="font-semibold">0 points</span>.
                        </p>
                      </>
                    )}

                    {cat.key === "warrantySupport" && (
                      <>
                        <p>
                          Scores the{" "}
                          <span className="font-semibold">
                            published warranty terms
                          </span>{" "}
                          only – not how often a company says &quot;yes&quot; or
                          &quot;no&quot; on the phone.
                        </p>
                        <p className="mt-1">
                          Tiers are simple:
                        </p>
                        <ul className="ml-4 list-disc space-y-1 mt-1">
                          <li>
                            <span className="font-semibold">0 pts</span> – no
                            meaningful written warranty, sold as-is, or warranty
                            not mentioned.
                          </li>
                          <li>
                            <span className="font-semibold">1 pt</span> – some
                            warranty language present, but short, limited, or
                            vague in duration/coverage.
                          </li>
                          <li>
                            <span className="font-semibold">2 pts</span> – clear
                            written warranty with roughly 1–2 years of coverage
                            on the machine or major components.
                          </li>
                          <li>
                            <span className="font-semibold">
                              {cat.maxPoints} pts
                            </span>{" "}
                            – clear multi-year or lifetime coverage on major
                            structural components (for example, frame lifetime
                            warranty) spelled out in the warranty terms.
                          </li>
                        </ul>
                        <p className="mt-2">
                          We do{" "}
                          <span className="font-semibold">
                            not score how well any warranty is honored in real
                            life
                          </span>
                          . That still comes down to your experience and what
                          you hear from real customers.
                        </p>
                      </>
                    )}

                    {/* Fallback generic explanation */}
                    {![
                      "valueForMoney",
                      "easeOfUseSetup",
                      "maxDiameterRadius",
                      "bendAngleCapability",
                      "wallThicknessCapability",
                      "dieSelectionShapes",
                      "yearsInBusiness",
                      "upgradePathModularity",
                      "mandrelCompatibility",
                      "sBendCapability",
                      "usaManufacturingDisclosure",
                      "originTransparency",
                      "singleSourceSystem",
                      "warrantySupport",
                    ].includes(cat.key) && (
                      <p>
                        This category is described in more detail on the
                        individual product pages and in the admin overlay. We
                        score only what we can document from published specs and
                        conservative assumptions.
                      </p>
                    )}
                  </div>

                  {/* Data sources & verification */}
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
                        Published&quot; in the UI and avoid estimating wherever
                        possible.
                      </li>
                    </ul>
                    <p className="mt-2">
                      When we have to fall back to conservative assumptions
                      (for example, treating unknown portability as fixed), we
                      do it in a way that{" "}
                      <span className="font-semibold">
                        does not inflate scores
                      </span>{" "}
                      and explain that behavior in the score breakdown on each
                      product page.
                    </p>
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
              <p className="font-medium text-gray-900 mb-1">Data sources</p>
              <ul className="space-y-1 list-disc pl-4">
                <li>Manufacturer technical specs and capacity charts</li>
                <li>Product manuals and official documentation</li>
                <li>Company founding dates and published history</li>
                <li>Published warranty and origin statements</li>
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
                  Per-product pages expose per-category breakdowns so you can
                  inspect each score.
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
              <p className="font-medium text-gray-900 mb-1">Lead times</p>
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
                Whatever they tell you on that call will be more current than
                any chart we could publish. Use the same questions with every
                brand and compare answers.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">
                Service quality
              </p>
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
