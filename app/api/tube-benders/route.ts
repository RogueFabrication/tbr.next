import { NextResponse } from "next/server";
import { listProductIds } from "../../../lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const ids = await listProductIds();
  return NextResponse.json({ ok: true, length: ids.length, data: ids });
}