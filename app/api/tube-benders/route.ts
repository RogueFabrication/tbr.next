import { NextResponse } from "next/server";
import { allTubeBenders } from "../../../lib/catalog";

/**
 * Public API: return the 4 canonical IDs from the local catalog.
 */
export async function GET() {
  const ids = allTubeBenders.map((p) => p.id);
  return NextResponse.json(ids);
}

// Cache hints are optional; safe either way.
export const dynamic = "force-static";
export const revalidate = 3600;