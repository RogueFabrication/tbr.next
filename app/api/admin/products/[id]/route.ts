import { NextRequest, NextResponse } from "next/server";
import { update } from "../../../../../lib/adminStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminWritesEnabled() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_ADMIN === "true";
  const onVercel = process.env.VERCEL === "1";
  return enabled && !onVercel;
}

function forbid() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Admin writes are disabled. Enable locally with NEXT_PUBLIC_ENABLE_ADMIN=true. Writes are always blocked on Vercel.",
    },
    { status: 403 }
  );
}

export async function GET() {
  // This endpoint is for individual product updates, not listing
  return NextResponse.json({ ok: false, error: "Use /api/admin/products for listing" }, { status: 404 });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  if (!adminWritesEnabled()) {
    return forbid();
  }

  const id = ctx.params?.id?.trim();
  if (!id || id.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Invalid id in path" },
      { status: 400 }
    );
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const patch = { ...body, id } as Record<string, unknown>;
    const res = update(id, patch);
    return NextResponse.json({ ok: true, id, overlay: res });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid payload";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
