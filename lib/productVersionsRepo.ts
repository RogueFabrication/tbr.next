// lib/productVersionsRepo.ts
import { sql } from "./db";

export type EvidenceInsert = {
  id?: string;
  fieldKey: string;
  sourceType: "web-page" | "pdf" | "manual" | "other";
  url?: string;
  quotedText?: string;
  howGathered?: string;
  notes?: string;
  verifiedBy: string;
  verifiedAt: Date;
};

export type ProductVersionRow = {
  id: string;
  product_id: string;
  status: "draft" | "published";
  version: number;
  fields_json: any;
  score_json: any;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type EvidenceRow = {
  id: string;
  product_version_id: string;
  field_key: string;
  source_type: "web-page" | "pdf" | "manual" | "other";
  url: string | null;
  quoted_text: string | null;
  how_gathered: string | null;
  notes: string | null;
  verified_by: string;
  verified_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Save (upsert) the current draft for a product and replace its evidence rows.
 * This is an explicit "one request per click" write path (no autosave).
 */
export async function saveProductDraft(args: {
  productId: string;
  fieldsJson: unknown;
  scoreJson: unknown;
  actor: string;
  evidence: EvidenceInsert[];
}): Promise<{ draftVersionId: string }> {
  const { productId, fieldsJson, scoreJson, actor, evidence } = args;

  return await sql.begin(async (tx) => {
    // Find existing draft version id (one draft row per product)
    const existing =
      await tx<{ id: string }[]>`
        select id
        from product_versions
        where product_id = ${productId} and status = 'draft'
        limit 1
      `;

    let draftVersionId: string;
    if (existing.length) {
      draftVersionId = existing[0]!.id;
      await tx`
        update product_versions
        set
          fields_json = ${tx.json(fieldsJson)},
          score_json  = ${tx.json(scoreJson)},
          created_by  = ${actor},
          updated_at  = now()
        where id = ${draftVersionId}
      `;
    } else {
      const inserted =
        await tx<{ id: string }[]>`
          insert into product_versions
            (product_id, status, version, fields_json, score_json, created_by)
          values
            (${productId}, 'draft', 0, ${tx.json(fieldsJson)}, ${tx.json(scoreJson)}, ${actor})
          returning id
        `;
      draftVersionId = inserted[0]!.id;
    }

    // Replace-on-save evidence rows for this draft version.
    await tx`
      delete from product_field_evidence
      where product_version_id = ${draftVersionId}
    `;

    if (evidence.length) {
      await tx`
        insert into product_field_evidence
          (product_version_id, field_key, source_type, url, quoted_text, how_gathered, notes, verified_by, verified_at)
        values
          ${tx(
            evidence.map((e) => [
              draftVersionId,
              e.fieldKey,
              e.sourceType,
              e.url ?? null,
              e.quotedText ?? null,
              e.howGathered ?? null,
              e.notes ?? null,
              e.verifiedBy,
              e.verifiedAt,
            ]),
          )}
      `;
    }

    return { draftVersionId };
  });
}

export async function getLatestDraftVersion(productId: string): Promise<ProductVersionRow | null> {
  const rows = (await sql`
    select
      id,
      product_id,
      status,
      version,
      fields_json,
      score_json,
      created_by,
      created_at,
      updated_at
    from product_versions
    where product_id = ${productId} and status = 'draft'
    order by updated_at desc
    limit 1
  `) as unknown as ProductVersionRow[];

  if (!rows || rows.length === 0) return null;
  return rows[0]!;
}

export async function getEvidenceForVersion(productVersionId: string): Promise<EvidenceRow[]> {
  const rows = (await sql`
    select
      id,
      product_version_id,
      field_key,
      source_type,
      url,
      quoted_text,
      how_gathered,
      notes,
      verified_by,
      verified_at,
      is_active,
      created_at,
      updated_at
    from product_field_evidence
    where product_version_id = ${productVersionId}
      and is_active = true
    order by verified_at desc, created_at desc
  `) as unknown as EvidenceRow[];

  return rows ?? [];
}

/**
 * Load the latest published version for a product (or null if none).
 * This is the read-side companion to POST publish.
 */
export async function getLatestPublishedVersion(productId: string) {
  // IMPORTANT:
  // Avoid selecting speculative columns (e.g. published_at) that may not exist
  // across environments. POST publish already works; GET should be resilient.
  const rows = await sql/* sql */`
    SELECT *
    FROM product_versions
    WHERE product_id = ${productId}
      AND status = 'published'
    ORDER BY version DESC
    LIMIT 1
  `;

  if (!rows || rows.length === 0) return null;
  return rows[0];
}

export async function publishCurrentDraft(args: {
  productId: string;
  actor: string;
}): Promise<{ publishedVersionId: string; version: number }> {
  const { productId, actor } = args;

  return await sql.begin(async (tx) => {
    // Load draft
    const draftRows = (await tx`
      select
        id,
        product_id,
        status,
        version,
        fields_json,
        score_json,
        created_by,
        created_at,
        updated_at
      from product_versions
      where product_id = ${productId} and status = 'draft'
      order by updated_at desc
      limit 1
    `) as unknown as ProductVersionRow[];

    if (!draftRows || draftRows.length === 0) {
      throw new Error("NO_DRAFT");
    }

    const draft = draftRows[0]!;

    // Compute next published version number
    const maxPub = await tx<{ max: number | null }[]>`
      select max(version) as max
      from product_versions
      where product_id = ${productId} and status = 'published'
    `;
    const nextVersion = (maxPub?.[0]?.max ?? 0) + 1;

    // Insert published version row
    const inserted = await tx<{ id: string }[]>`
      insert into product_versions
        (product_id, status, version, fields_json, score_json, created_by)
      values
        (${productId}, 'published', ${nextVersion}, ${tx.json(draft.fields_json)}, ${tx.json(draft.score_json)}, ${actor})
      returning id
    `;
    const publishedVersionId = inserted[0]!.id;

    // Copy evidence from draft -> published
    const evidence = (await tx`
      select
        field_key,
        source_type,
        url,
        quoted_text,
        how_gathered,
        notes,
        verified_by,
        verified_at
      from product_field_evidence
      where product_version_id = ${draft.id}
        and is_active = true
    `) as unknown as Array<{
      field_key: string;
      source_type: EvidenceInsert["sourceType"];
      url: string | null;
      quoted_text: string | null;
      how_gathered: string | null;
      notes: string | null;
      verified_by: string;
      verified_at: string;
    }>;

    if (evidence?.length) {
      await tx`
        insert into product_field_evidence
          (product_version_id, field_key, source_type, url, quoted_text, how_gathered, notes, verified_by, verified_at)
        values
          ${tx(
            evidence.map((e) => [
              publishedVersionId,
              e.field_key,
              e.source_type,
              e.url,
              e.quoted_text,
              e.how_gathered,
              e.notes,
              e.verified_by,
              new Date(e.verified_at),
            ]),
          )}
      `;
    }

    return { publishedVersionId, version: nextVersion };
  });
}

