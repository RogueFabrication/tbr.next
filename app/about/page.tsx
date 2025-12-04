import Link from "next/link";
import ContactForm from "../../components/ContactForm";

export const metadata = {
  title: "About & Disclosures | TubeBenderReviews",
  description:
    "Who runs TubeBenderReviews, how the scoring works, and how RogueFab fits into the picture.",
};

type AboutPageProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

export default function AboutPage({ searchParams }: AboutPageProps) {
  const sentParam = searchParams?.sent;
  const sent =
    typeof sentParam === "string"
      ? sentParam === "1"
      : Array.isArray(sentParam)
        ? sentParam.includes("1")
        : false;

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Success banner after email verification */}
      {sent && (
        <div className="mb-6 rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold">✓ Message sent successfully!</p>
          <p className="mt-1">
            Your message has been forwarded to the TubeBenderReviews team.
            We&apos;ll review it and get back to you at the email address you
            provided.
          </p>
        </div>
      )}

      {/* Contact Form - Primary CTA */}
      <section id="contact">
        <ContactForm />
      </section>

      <div className="mt-12 space-y-8">
        <h1 className="text-3xl font-semibold mb-6">About & Disclosures</h1>

      <section className="mb-8 space-y-3">
        <h2 className="text-xl font-semibold">Who runs TubeBenderReviews</h2>
        <p className="text-sm text-muted-foreground">
          TubeBenderReviews is published by <strong>Joseph Gambino</strong> — a
          mechanical engineer and the founder of Rogue Fabrication (RogueFab).
          Yes, I own RogueFab. And yes, we make tube benders.
        </p>
        <p className="text-sm text-muted-foreground">
          This site exists because most tube bender "reviews" online are either
          thin marketing pieces or random forum opinions. I wanted a
          single place where you can compare all the major manual and hydraulic
          benders using one scoring system, with the rules written down in
          public.
        </p>
      </section>

      <section className="mb-8 space-y-3">
        <h2 className="text-xl font-semibold">Ownership & conflicts of interest</h2>
        <p className="text-sm text-muted-foreground">
          I am the majority owner of Rogue Fabrication, LLC. That means I have a
          direct financial interest in one of the brands listed on this site.
          You should know that up front.
        </p>
        <p className="text-sm text-muted-foreground">
          To keep things honest, every brand (including RogueFab) is scored
          using the{" "}
          <Link href="/scoring" className="underline">
            same published 11-category, 100-point scoring framework
          </Link>
          . RogueFab does not get special categories, hidden weights, or
          "editor-only" bonuses. If a RogueFab product scores well, it&apos;s
          because it wins on the published criteria. If it doesn&apos;t, the
          score reflects that.
        </p>
      </section>

      <section className="mb-8 space-y-3">
        <h2 className="text-xl font-semibold">How the scoring works</h2>
        <p className="text-sm text-muted-foreground">
          The scoring system is built around real specs and real trade-offs, not
          vague vibes. Each product is evaluated on things like:
        </p>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          <li>
            Value for money (features-per-dollar using a conservative{" "}
            <span className="font-medium">minimum safe operating system cost</span>:
            frame, starter die, required hydraulics, and required stand)
          </li>
          <li>Max tube diameter and bend radius capability</li>
          <li>Country of origin and manufacturing</li>
          <li>Maximum bend angle</li>
          <li>Wall thickness capability (for 1.75&quot; DOM)</li>
          <li>Die selection and shapes</li>
          <li>Years in business and track record</li>
          <li>Upgrade path, modularity, and supported mandrel options</li>
          <li>S-bend capability and real-world flexibility</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          You can read the full scoring breakdown on the{" "}
          <Link href="/scoring" className="underline">
            Scoring Methodology
          </Link>{" "}
          page. The short version: there is one scoring model, it&apos;s
          transparent, and it applies to everyone.
        </p>
      </section>

      <section className="mb-8 space-y-3">
        <h2 className="text-xl font-semibold">Data sources & corrections</h2>
        <p className="text-sm text-muted-foreground">
          Specs and pricing start from the manufacturers&apos; published data,
          then get normalized so you can compare apples to apples. On top of
          that, I maintain a private admin panel that lets me correct or update
          specs without redeploying the whole site.
        </p>
        <p className="text-sm text-muted-foreground">
          If you represent a brand and notice an error,{" "}
          <span className="font-medium">email me with documentation</span> and
          I&apos;ll fix it. I care much more about being correct than &quot;winning&quot;
          a comparison.
        </p>
      </section>

      <section className="mb-8 space-y-3">
        <h2 className="text-xl font-semibold">Affiliate links & money</h2>
        <p className="text-sm text-muted-foreground">
          At the time of writing, this site does not take paid placement and
          does not accept &quot;pay to win&quot; deals from any brand. In the future,
          some outbound links may be affiliate links, which means the site could
          earn a small commission if you buy through them. If/when that happens,
          those links will be labeled clearly.
        </p>
      </section>

      <section className="mb-8 space-y-3" id="external-reviews">
        <h2 className="text-xl font-semibold">External reviews &amp; Google ratings</h2>
        <p className="text-sm text-muted-foreground">
          On some pages you&apos;ll see a small line of star icons under a brand name,
          showing that manufacturer&apos;s{" "}
          <span className="font-medium">Google rating and review count</span>. This
          data is pulled from the public Google Business listing for that brand,
          sampled periodically.
        </p>
        <p className="text-sm text-muted-foreground">
          Those Google ratings are there for context only. They are{" "}
          <span className="font-semibold">not part of the TubeBenderReviews score</span>{" "}
          and do not affect the 100-point scoring system. We don&apos;t adjust or
          curate those reviews, and we can&apos;t guarantee that the rating you see on
          this site is always the very latest number shown inside Google at the exact
          moment you visit.
        </p>
      </section>

      <section className="mb-8 space-y-3">
        <h2 className="text-xl font-semibold">What we don&apos;t score (yet)</h2>
        <p className="text-sm text-muted-foreground">
          There are a few things most buyers care deeply about that we{" "}
          <span className="font-semibold">do not convert into points</span>, because
          they&apos;re hard to verify consistently from public data:
        </p>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          <li>Real-world lead times for machines and dies</li>
          <li>Day-to-day customer service quality and responsiveness</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          These can change quickly and are rarely documented in a way that would
          survive a legal or engineering-level audit. Rather than guessing or
          relying on rumors, we keep them out of the score entirely.
        </p>
        <p className="text-sm text-muted-foreground">
          Instead, we recommend you{" "}
          <span className="font-semibold">test these yourself</span> with the
          short-list of manufacturers you&apos;re considering:
        </p>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          <li>
            Call or email and ask specifically about{" "}
            <span className="font-medium">current lead times for machines and dies</span>.
          </li>
          <li>
            Pay attention to how quickly they respond, how clearly they answer, and
            whether they&apos;re transparent about delays or backorders.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          You&apos;ll learn more from a 5–10 minute conversation with each brand
          than any website can reliably quantify, and you can combine that with the
          objective specs and scoring here.
        </p>
      </section>

      <p className="text-xs text-muted-foreground">
        Last updated: {new Date().toISOString().split("T")[0]}
      </p>
      </div>
    </main>
  );
}
