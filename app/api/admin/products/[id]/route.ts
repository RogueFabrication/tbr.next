/**
 * Admin Products API (disabled placeholder)
 * The original implementation depended on `zod` and is not part of the rescue build.
 * We return 501 to indicate the endpoint is intentionally disabled for now.
 */
import { NextResponse, type NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { error: "Admin API is disabled in the rescue build." },
    { status: 501 }
  );
}

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { error: "Admin API is disabled in the rescue build." },
    { status: 501 }
  );
}

export async function PUT(_req: NextRequest) {
  return NextResponse.json(
    { error: "Admin API is disabled in the rescue build." },
    { status: 501 }
  );
}

export async function DELETE(_req: NextRequest) {
  return NextResponse.json(
    { error: "Admin API is disabled in the rescue build." },
    { status: 501 }
  );
}
