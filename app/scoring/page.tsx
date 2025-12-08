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
            Our 11-category scoring system evaluates tube benders across
            primarily measurable, spec-based criteria, plus a small number of
            brand-weighted categories for support history and ecosystem depth.
            Where data is incomplete or ambiguous, we mark it as &quot;Not
            Published&quot; and apply conservative defaults rather than
            stretching the numbers.
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

                {cat.key === "valueForMoney" && (
                  <p className="mb-2 text-xs text-muted-foreground">
                    For each machine we build a conservative{" "}
                    <span className="font-medium">
                      minimum safe operating system cost
                    </span>{" "}
                    from the lowest documented price (in normal catalog
                    configurations) of four components:{" "}
                    <span className="font-medium">
                      frame, a ready-to-bend 180° die in a common size
                      (typically 1.50&quot; tube), hydraulics or power unit
                      (when required), and a stand/mount only when the machine
                      cannot be safely operated without one.
                    </span>{" "}
                    Optional carts, premium stands, and cosmetic upgrades are
                    excluded from this calculation. When we cannot verify a
                    component price, we either omit it (for hydraulics/stands
                    that are truly optional) or assign a conservative baseline
                    so that incomplete data never inflates a score.
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
                          machine, a middle-of-the-road 180° die, and hydraulic
                          or power options where required – against the rest of
                          each machine&apos;s objective feature score.
                        </p>
                        <p>
                          We first total up the non-price categories (capacity,
                          bend angle, wall thickness, mandrel/S-bend capability,
                          die ecosystem, etc.) to get a single
                          &quot;feature score&quot; (out of a fixed pool of
                          feature points) for each machine. That feature score is
                          then divided by the minimum safe operating system cost
                          and scaled into a 0–20 point range. Machines with
                          unusually strong features-per-dollar ratios approach
                          20/20; weaker ratios receive proportionally fewer
                          points.
                        </p>
                        <p>
                          When we do not have enough data to compute a fair
                          features-per-dollar comparison (for example missing
                          pricing or key specs), the Value for Money category is
                          left at 0/20 with a note explaining that it is{" "}
                          <span className="font-semibold">not scored</span> for
                          that machine rather than guessing. Whenever we have to
                          omit a component price or fall back to a conservative
                          baseline, we call that out in that machine&apos;s
                          detailed score breakdown so it&apos;s obvious what we
                          were missing and how we handled it, instead of quietly
                          smoothing over gaps in the data.
                        </p>
                        <p>
                          For die pricing we standardise on{" "}
                          <span className="font-semibold">
                            180° complete dies only
                          </span>
                          :
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">Die Min</span> – the
                            lowest priced 180° complete die (ready to bend in
                            the machine) in a common size, typically a
                            ~1.50&quot; OD tube die. We do{" "}
                            <span className="font-semibold">
                              not use tiny, niche, or partial-degree dies
                            </span>{" "}
                            just to reduce the apparent cost.
                          </li>
                          <li>
                            <span className="font-semibold">Die Max</span> – the
                            lowest priced 180° complete die that either:
                            (a) is a 1.50&quot; OD die that can reach the
                            machine&apos;s published maximum bend angle, or, if
                            that doesn&apos;t exist, (b) is the die that best
                            matches the published max OD or max CLR for the
                            machine (whichever is the limiting capability).
                          </li>
                        </ul>
                        <p className="mt-2">
                          For hydraulics, we use the{" "}
                          <span className="font-semibold">
                            lowest price manufacturer-endorsed power option
                          </span>{" "}
                          (including third-party units only when the
                          manufacturer explicitly supports them), rather than
                          unsupported DIY or bargain jacks. For stands and
                          carts, we{" "}
                          <span className="font-semibold">
                            only include the lowest-cost stand/cart when it is
                            required for safe, stable operation
                          </span>
                          . Optional carts on machines with built-in stable
                          bases are treated as accessories, not mandatory system
                          cost.
                        </p>
                      </>
                    )}
                    {cat.key === "easeOfUseSetup" && (
                      <>
                        <p>
                          Evaluates setup complexity, ergonomics, and how much
                          effort it takes to go from crate to first accurate
                          bend, plus how easy the machine is to move around
                          your shop.
                        </p>
                        <p>
                          This category is scored out of 12 points in two
                          pieces:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-medium">
                              Base ergonomics &amp; operation (up to 9 pts)
                            </span>{" "}
                            – a legacy, brand/power-type heuristic that
                            reflects how refined the controls and layout are in
                            real use (for example vertical, foot-operated
                            designs vs. more basic, low-slung hand-crank
                            layouts). This will eventually be replaced with a
                            purely spec-driven formula, but for now it is
                            applied consistently across all machines and
                            surfaced in each product&apos;s score breakdown.
                          </li>
                          <li>
                            <span className="font-medium">
                              Portability tier (0–3 pts)
                            </span>{" "}
                            – a simple, explicit mapping based on the
                            admin-entered portability field:
                            <ul className="ml-4 mt-1 list-disc space-y-0.5">
                              <li>
                                <span className="font-semibold">0 pts</span> –
                                fixed base that must be mounted to the floor or
                                a bench to use.
                              </li>
                              <li>
                                <span className="font-semibold">1 pt</span> –
                                portable base (can be moved between locations)
                                but with no factory rolling option.
                              </li>
                              <li>
                                <span className="font-semibold">2 pts</span> –
                                portable base with an{" "}
                                <span className="font-semibold">
                                  optional rolling cart or rolling base
                                </span>{" "}
                                documented for that machine.
                              </li>
                              <li>
                                <span className="font-semibold">3 pts</span> –
                                rolling base as a{" "}
                                <span className="font-semibold">
                                  standard feature
                                </span>{" "}
                                (ships on wheels, ready to roll around the
                                shop).
                              </li>
                            </ul>
                          </li>
                        </ul>
                        <p className="mt-2">
                          The final Ease of Use &amp; Setup score is the sum of
                          the base ergonomics/operation score and the
                          portability tier, clamped to a maximum of 12/12. The
                          per-machine breakdown on each review page shows the
                          exact points awarded and the portability tier used.
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
                          for a{" "}
                          <span className="font-semibold">
                            full, FTC-unqualified Made in USA–level origin
                            claim
                          </span>{" "}
                          (all or virtually all significant parts and processing
                          of U.S. origin), as documented by the manufacturer.
                        </p>
                        <p>
                          Machines that are only{" "}
                          <span className="font-semibold">
                            assembled in the USA from mixed-origin components
                          </span>
                          , or that make qualified origin claims (for example,
                          &quot;Made in USA with imported components&quot;), are
                          treated as non-USA for scoring in this category to
                          stay conservative. This category is labeled in plain
                          language on comparison tables so customers understand
                          the origin groupings without needing FTC jargon.
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
                          they can bend, plus which materials the manufacturer
                          explicitly documents as compatible.
                        </p>
                        <p>
                          Machines with published wall data are tiered by
                          thickness: heavier-wall capacity earns more points,
                          while lighter-wall capacity earns fewer points. On top
                          of that, we add a small score for documented material
                          coverage — mild steel, 4130 chromoly, stainless,
                          aluminum, titanium, and copper/brass/bronze — based
                          only on what the manufacturer actually lists in specs
                          or documentation.
                        </p>
                        <p>
                          When no wall thickness is published, we apply a small
                          conservative baseline instead of guessing and say so
                          directly in that machine&apos;s score breakdown. When
                          no material list is published, the materials portion
                          of this category is left at zero rather than assuming
                          it can bend everything.
                        </p>
                      </>
                    )}
                    {cat.key === "dieSelectionShapes" && (
                      <>
                        <p>
                          Scores each machine&apos;s die ecosystem based on{" "}
                          <span className="font-semibold">
                            how many real-world shapes and standards it supports
                          </span>{" "}
                          — not just one or two common tube sizes.
                        </p>
                        <p>
                          We only count shapes and standards that the
                          manufacturer actually documents for that frame. The
                          core of this category is{" "}
                          <span className="font-semibold">round tube</span> dies
                          across a meaningful range of diameters and CLRs.
                          From there, we award additional points for documented
                          support of:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-medium">Pipe sizes</span>{" "}
                            (NPS/pipe dies distinct from tube dies – this
                            matters for handrail, structural, and industrial
                            work).
                          </li>
                          <li>
                            <span className="font-medium">
                              Square and rectangular tube
                            </span>{" "}
                            dies that are marketed for this machine.
                          </li>
                          <li>
                            <span className="font-medium">
                              EMT and metric tube/pipe
                            </span>{" "}
                            (round or square) where the manufacturer calls out
                            those standards explicitly.
                          </li>
                          <li>
                            <span className="font-medium">Flat bar</span>,{" "}
                            <span className="font-medium">angle</span>,{" "}
                            <span className="font-medium">channel</span>, or
                            similar profile dies that are clearly intended for
                            bending on this frame.
                          </li>
                          <li>
                            <span className="font-medium">
                              Plastic / urethane / low-marring pressure dies
                            </span>{" "}
                            marketed for aluminum or thin-wall work (these are
                            counted separately from the thin-wall upgrade flags
                            in the Upgrade Path category to avoid double
                            counting).
                          </li>
                        </ul>
                        <p className="mt-2">
                          <span className="font-semibold">
                            Solid bar is not treated as a separate shape for
                            extra points
                          </span>{" "}
                          — any machine that can bend round tube with a given
                          die family will generally support solid round in the
                          same sizes, so we assume that coverage whenever round
                          tube is documented.
                        </p>
                        <p className="mt-2">
                          Scoring is tier-based: machines with only a small,
                          basic round-tube die range receive baseline points.
                          As documented coverage expands to pipe standards,
                          square/rectangular tube, EMT/metric, and profile
                          shapes with practical CLR coverage, the machine earns
                          more of this category&apos;s points, up to a fixed
                          cap. We do not give extra credit for ultra-niche or
                          special-order dies that are not part of the normal
                          catalog.
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
                          Points for documented power upgrades, LRA control
                          (length, rotation, angle, auto-stop), and
                          bend-quality tooling (thin/thick wall, wipers).
                        </p>
                        <p className="font-medium text-gray-900">
                          What this measures
                        </p>
                        <p>
                          This category answers: &quot;If I buy the base
                          machine, how far can it grow with me?&quot;
                        </p>
                        <p>
                          We only award points for upgrades the manufacturer
                          actually documents for that frame:
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            <span className="font-semibold">
                              Power upgrade path (1 pt)
                            </span>{" "}
                            – Documented upgrades from manual to hydraulic,
                            higher-output power units, or similar
                            factory-supported power options.
                          </li>
                          <li>
                            <span className="font-semibold">
                              LRA control path – length, rotation, angle (up to
                              4 pts)
                            </span>
                            <ul className="ml-4 mt-1 list-disc space-y-0.5">
                              <li>
                                <span className="font-medium">Length:</span>{" "}
                                backstops or length-stop systems for repeatable
                                bend locations.
                              </li>
                              <li>
                                <span className="font-medium">Rotation:</span>{" "}
                                indexing fixtures or systems for repeatable
                                bend-to-bend rotation.
                              </li>
                              <li>
                                <span className="font-medium">
                                  Angle readout:
                                </span>{" "}
                                built-in or securely machine-mounted angle
                                measurement (beyond &quot;hold a loose angle
                                cube on the tube&quot;).
                              </li>
                              <li>
                                <span className="font-medium">
                                  Auto-stop for bend angle:
                                </span>{" "}
                                where the machine can be set to stop at a target
                                angle. This behaves like a light version of CNC
                                on angle only and is rare but extremely valuable
                                in real shops.
                              </li>
                            </ul>
                          </li>
                          <li>
                            <span className="font-semibold">
                              Bend-quality tooling upgrades (up to 3 pts)
                            </span>
                            <ul className="ml-4 mt-1 list-disc space-y-0.5">
                              <li>
                                <span className="font-medium">
                                  Thick-wall upgrades:
                                </span>{" "}
                                tooling or options specifically aimed at heavier
                                wall / high-load work (longer or reinforced
                                pressure dies, torque/pressure upgrades, etc.).
                              </li>
                              <li>
                                <span className="font-medium">
                                  Thin-wall upgrades:
                                </span>{" "}
                                tooling or options aimed at improving bend
                                quality on thin wall, aluminum, stainless, or
                                similar (for example translating/rolling pressure
                                dies or other manufacturer-claimed thin-wall
                                improvements).
                              </li>
                              <li>
                                <span className="font-medium">
                                  Wiper die support:
                                </span>{" "}
                                documented support for wiper dies on that frame.
                              </li>
                            </ul>
                          </li>
                        </ul>
                        <p className="mt-2">
                          <span className="font-semibold">
                            Mandrel compatibility is not scored here.
                          </span>{" "}
                          Mandrel systems are important enough that they live in
                          their own category. This upgrade section only measures
                          add-ons that sit around the core machine (power, LRA
                          control, and thin/thick-wall tooling), so we
                          don&apos;t double-count mandrel.
                        </p>
                        <p className="mt-2 font-medium text-gray-900">
                          Scoring
                        </p>
                        <p>
                          Each documented, manufacturer-supported upgrade flag
                          adds points up to a hard cap of 8.
                        </p>
                        <p>
                          Machines with no published upgrade or modular options
                          beyond the base configuration receive 0/8 here and are
                          treated as &quot;fixed capability&quot; platforms.
                        </p>
                        <p className="mt-2 font-medium text-gray-900">
                          Data sources &amp; verification
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                          <li>
                            Manufacturer product pages and technical spec
                            sections
                          </li>
                          <li>
                            Official manuals and installation/upgrade guides
                          </li>
                          <li>
                            Manufacturer documentation of upgrade kits,
                            thin/thick-wall packages, and wiper die options
                          </li>
                        </ul>
                        <p className="mt-2">
                          When an upgrade is not documented, we mark it as
                          &quot;Not published&quot; in the admin and do not
                          assume it exists. We would rather under-score than
                          guess.
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
                        <p>
                          Mandrel capability is crucial for thin-wall,
                          high-finish work in motorsport, aerospace, and
                          production environments.
                        </p>
                        <p>
                          For scoring and for the &quot;Mandrel&quot; pills you
                          see on comparison tables,{" "}
                          <span className="font-semibold">
                            &quot;Available&quot; only applies when the
                            manufacturer publishes or explicitly supports a
                            mandrel option for that model
                          </span>
                          . Third-party or DIY mandrel kits with no factory
                          backing are treated as{" "}
                          <span className="font-semibold">
                            no mandrel option
                          </span>{" "}
                          even if they physically exist in the market.
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
                        <p>
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
                          </span>{" "}
                          for S-bend capability in this system and will be shown
                          as &quot;No S-Bends&quot; in the UI.
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

        {/* Factors we don't score */}
        <section className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Important Factors We Don&apos;t Score (And How to Test Them Yourself)
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
                <li>&quot;If I ordered today, what is the lead time on the machine?&quot;</li>
                <li>&quot;What&apos;s the lead time on your most popular die sizes?&quot;</li>
              </ul>
              <p className="mt-2">
                Some machines and dies ship same day or in a couple business
                days. Others have multi-month die lead times. You&apos;ll get the
                real answer in under a minute, and it will be more current than
                anything we could publish here.
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
                <li>Whether they&apos;re rushed and defensive, or patient and helpful</li>
                <li>
                  How transparent they are about stock, backorders, and
                  realistic ship dates
                </li>
              </ul>
              <p className="mt-2">
                We don&apos;t turn these into points. Instead, we give you almost
                everything that can be scored objectively and then tell you
                exactly how to pressure-test the last few items directly with
                the manufacturers you&apos;re considering.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
