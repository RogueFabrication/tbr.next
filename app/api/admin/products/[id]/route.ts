import { NextRequest, NextResponse } from "next/server";
import { update, getAll } from "../../../../../lib/adminStore";

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
  const data = getAll();
  return NextResponse.json({ ok: true, data });
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
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid id: must be a number" },
        { status: 400 }
      );
    }
    const res = update(numericId, patch);
    return NextResponse.json({ ok: true, updated: 1, id, overlay: res });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid JSON payload";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
