import React from "react";
import AdminTabs from "@/components/admin/AdminTabs";

type SearchLike = { [key: string]: string | string[] | undefined } | URLSearchParams | undefined;

export default function AdminPage({ searchParams }: { searchParams?: SearchLike }) {
  // Be tolerant to both URLSearchParams and record-like objects
  let param: unknown;
  if (typeof (searchParams as any)?.get === "function") {
    param = (searchParams as URLSearchParams).get("tab");
  } else if (searchParams && typeof searchParams === "object") {
    // @ts-expect-error acceptable: Next may pass record-like searchParams in RSC
    param = (searchParams as Record<string, unknown>)?.tab;
  }
  const active = Array.isArray(param) ? param[0] : (param ?? "products");

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">Admin</h1>
      <AdminTabs active={String(active)} />
    </main>
  );
}
