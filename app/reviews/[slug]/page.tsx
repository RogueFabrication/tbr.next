// NOTE:
// Do NOT add `"use server"` here. This file is a regular Server Component.
// We intentionally export objects (e.g., metadata) and async functions here.

import { notFound } from "next/navigation";
import Link from "next/link";
import { absoluteUrl } from "../../../lib/site";

type PageProps = { params: { slug: string } };

/** Robust "is this slug known?" check using local helpers first, then API. */
async function isKnownSlug(slug: string): Promise<boolean> {
  // 1) lib/catalog — prefer direct validator if available
  try {
    const cat = await import("../../../lib/catalog");
    if (typeof (cat as any).isValidId === "function") {
      if ((cat as any).isValidId(slug)) return true;
    }
    // Some repos expose VALID_IDS as a Set<string>
    if ((cat as any).VALID_IDS && typeof (cat as any).VALID_IDS.has === "function") {
      if ((cat as any).VALID_IDS.has(slug)) return true;
    }
    // Or an array of objects/strings
    const anyList =
      (cat as any).default ??
      (cat as any).CATALOG ??
      (cat as any).catalog ??
      (cat as any).rows ??
      (cat as any).list;
    if (Array.isArray(anyList)) {
      const has = anyList.some((r: any) =>
        typeof r === "string" ? r === slug : r?.id === slug || r?.slug === slug
      );
      if (has) return true;
    }
  } catch {}

  // 2) lib/tube-benders — many codebases expose a getter
  try {
    const tb = await import("../../../lib/tube-benders");
    if (typeof (tb as any).getTubeBenders === "function") {
      const rows = await (tb as any).getTubeBenders();
      if (Array.isArray(rows) && rows.length) {
        const has = rows.some((r: any) => r?.id === slug || r?.slug === slug || r?.key === slug);
        if (has) return true;
      }
    }
    // Or static arrays under common names
    const anyList =
      (tb as any).default ??
      (tb as any).BENDERS ??
      (tb as any).benders ??
      (tb as any).TUBE_BENDERS ??
      (tb as any).list;
    if (Array.isArray(anyList)) {
      const has = anyList.some((r: any) =>
        typeof r === "string" ? r === slug : r?.id === slug || r?.slug === slug || r?.key === slug
      );
      if (has) return true;
    }
  } catch {}

  // 3) API fallback — use absolute URL so server-side fetch works
  try {
    const res = await fetch(absoluteUrl("/api/tube-benders"), { cache: "no-store" });
    if (res.ok) {
      const j = await res.json().catch(() => null);
      const raw =
        (Array.isArray(j) && j) ||
        (Array.isArray(j?.data) && j.data) ||
        (Array.isArray(j?.rows) && j.rows) ||
        [];
      if (Array.isArray(raw)) {
        const has = raw.some((r: any) =>
          typeof r === "string" ? r === slug : r?.id === slug || r?.slug === slug || r?.key === slug
        );
        if (has) return true;
      }
    }
  } catch {}

  return false;
}

/** Optional: help Next prebuild known slugs when possible. */
export async function generateStaticParams() {
  // Keep this conservative; we can enhance later.
  return [];
}

function slugToTitle(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b[a-z]/g, (m) => m.toUpperCase());
}

export default async function Page({ params }: PageProps) {
  const slug = params.slug;
  const known = await isKnownSlug(slug);
  if (!known) {
    return notFound();
  }

  // Render a minimal review shell (keeps us deploy-safe); you can hydrate this later.
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-2">
      <h1 className="text-2xl font-semibold">{slugToTitle(slug)}</h1>
      <p className="text-sm text-muted-foreground">
        Slug: <code className="px-1 rounded bg-muted">{slug}</code>
      </p>
      <p className="text-sm">
        Looking for details?{" "}
        <Link className="underline" href="/compare">
          Compare models
        </Link>
        .
      </p>
    </div>
  );
}