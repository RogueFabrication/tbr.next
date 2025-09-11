import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Review | TBR" };

type PageProps = { params: { slug: string } };

type Row = {
  id?: string;
  slug?: string;
  key?: string;
  brand?: string;
  model?: string;
  name?: string;
  title?: string;
};

function normalizeTitle(r: Row, slug: string) {
  const t =
    r?.title ??
    r?.name ??
    [r?.brand, r?.model].filter(Boolean).join(" ").trim();
  return t && t.length > 0 ? t : slug;
}

async function getKnownReviewSlugs(): Promise<string[]> {
  // catalog
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cat = await import("../../../lib/catalog");
    const anyList =
      (cat as any).VALID_IDS ||
      (cat as any).default ||
      (cat as any).catalog ||
      (cat as any).rows ||
      (cat as any).list;
    if (anyList) {
      if (anyList instanceof Set) return Array.from(anyList);
      if (Array.isArray(anyList)) {
        return anyList
          .map((r: any) => (typeof r === "string" ? r : r?.id || r?.slug || r?.key))
          .filter(Boolean);
      }
    }
  } catch {}
  // tube-benders
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tb = await import("../../../lib/tube-benders");
    if (typeof (tb as any).getTubeBenders === "function") {
      const rows = await (tb as any).getTubeBenders();
      if (Array.isArray(rows))
        return rows.map((r: any) => r?.id || r?.slug || r?.key).filter(Boolean);
    }
    const anyList =
      (tb as any).default ||
      (tb as any).BENDERS ||
      (tb as any).benders ||
      (tb as any).TUBE_BENDERS ||
      (tb as any).list;
    if (Array.isArray(anyList))
      return anyList.map((r: any) => r?.id || r?.slug || r?.key).filter(Boolean);
  } catch {}
  // API
  try {
    const url = await import("../../../lib/url").catch(() => null as any);
    const origin =
      (url && typeof (url as any).absoluteUrl === "function" && (url as any).absoluteUrl("/").replace(/\/$/, "")) ||
      "http://localhost:3000";
    const res = await fetch(`${origin}/api/tube-benders`, { cache: "no-store" });
    if (res.ok) {
      const j = await res.json().catch(() => null);
      const raw =
        (Array.isArray(j) && j) ||
        (Array.isArray(j?.data) && j.data) ||
        (Array.isArray(j?.rows) && j.rows) ||
        [];
      return raw.map((r: any) => (typeof r === "string" ? r : r?.id || r?.slug || r?.key)).filter(Boolean);
    }
  } catch {}
  return [];
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return (await getKnownReviewSlugs()).map((s) => ({ slug: s }));
}

export default async function Page({ params }: PageProps) {
  const slug = params.slug;
  const row = await (async () => {
    // catalog
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const cat = await import("../../../lib/catalog");
      const anyList =
        (cat as any).default ||
        (cat as any).catalog ||
        (cat as any).rows ||
        (cat as any).list ||
        null;
      if (Array.isArray(anyList)) {
        const found = anyList.find((r: any) => r?.id === slug || r?.slug === slug || r?.key === slug);
        if (found) return found as Row;
      }
    } catch {}
    // tube-benders
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const tb = await import("../../../lib/tube-benders");
      if (typeof (tb as any).getTubeBenders === "function") {
        const rows = await (tb as any).getTubeBenders();
        if (Array.isArray(rows)) {
          const found = rows.find((r: any) => r?.id === slug || r?.slug === slug || r?.key === slug);
          if (found) return found as Row;
        }
      }
      const anyList =
        (tb as any).default ||
        (tb as any).BENDERS ||
        (tb as any).benders ||
        (tb as any).TUBE_BENDERS ||
        (tb as any).list;
      if (Array.isArray(anyList)) {
        const found = anyList.find((r: any) => r?.id === slug || r?.slug === slug || r?.key === slug);
        if (found) return found as Row;
      }
    } catch {}
    // API
    try {
      const url = await import("../../../lib/url").catch(() => null as any);
      const origin =
        (url && typeof (url as any).absoluteUrl === "function" && (url as any).absoluteUrl("/").replace(/\/$/, "")) ||
        "http://localhost:3000";
      const res = await fetch(`${origin}/api/tube-benders`, { cache: "no-store" });
      if (res.ok) {
        const j = await res.json().catch(() => null);
        const raw =
          (Array.isArray(j) && j) ||
          (Array.isArray(j?.data) && j.data) ||
          (Array.isArray(j?.rows) && j.rows) ||
          [];
        const found = raw.find((r: any) => r?.id === slug || r?.slug === slug || r?.key === slug);
        if (found) return found as Row;
      }
    } catch {}
    return null;
  })();
  if (!row) return notFound();
  const title = normalizeTitle(row, slug);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-xs text-muted-foreground">
        Slug: <code>{slug}</code>
      </p>
      <div className="mt-6 space-y-2">
        <p className="text-sm text-muted-foreground">
          Full specs, charts, and scoring are coming soon for this model.
        </p>
        <Link href="/compare" className="text-sm text-blue-600 hover:underline">
          Looking for details? Compare models →
        </Link>
      </div>
    </div>
  );
}