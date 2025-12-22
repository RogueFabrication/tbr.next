// app/api/admin/products/[id]/draft/route.ts
import { NextRequest } from "next/server";
import { ok, badRequest } from "../../../../../../lib/http";
import {
  getClientId,
  ratelimitAdminRead,
  enforceRateLimit,
} from "../../../../../../lib/rateLimit";
import {
  getLatestDraftVersion,
  getEvidenceForVersion,
} from "../../../../../../lib/productVersionsRepo";

const ADMIN_COOKIE_NAME = "admin_token";

function isAuthorized(request: NextRequest): boolean {
  const envToken = process.env.ADMIN_TOKEN?.trim();
  if (!envToken) return false;
  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return cookieToken === envToken;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAuthorized(request)) {
    return badRequest("Not authorized");
  }

  const productId = params?.id;
  if (!productId) {
    return badRequest("Missing product id");
  }

  const clientId = getClientId(request);
  const rateLimitResult = await enforceRateLimit(ratelimitAdminRead, [
    "admin_api_read",
    clientId,
    "product_draft",
    productId,
  ]);
  if (!rateLimitResult.ok) {
    return Response.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimitResult.retryAfter ?? 60) },
      },
    );
  }

  try {
    const draft = await getLatestDraftVersion(productId);
    if (!draft) {
      return ok({ draft: null, evidence: [] });
    }
    const evidence = await getEvidenceForVersion(draft.id);
    return ok({
      draft: {
        id: draft.id,
        productId: draft.product_id,
        status: draft.status,
        version: draft.version,
        fields: draft.fields_json ?? {},
        score: draft.score_json ?? {},
        createdBy: draft.created_by,
        createdAt: draft.created_at,
        updatedAt: draft.updated_at,
      },
      evidence: evidence.map((e) => ({
        id: e.id,
        fieldKey: e.field_key,
        sourceType: e.source_type,
        url: e.url,
        quotedText: e.quoted_text,
        howGathered: e.how_gathered,
        notes: e.notes,
        verifiedBy: e.verified_by,
        verifiedAt: e.verified_at,
      })),
    });
  } catch (err) {
    console.error("[product_versions] Failed to load draft:", err);
    return badRequest("Failed to load draft from Neon");
  }
}

