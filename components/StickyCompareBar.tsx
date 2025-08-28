'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { BENDERS, toSlug } from '../data/benders';

type MaybeId = string | number;
type MaybeSet = Set<MaybeId> | MaybeId[] | undefined;

/**
 * StickyCompareBar
 * Renders a bottom tray with a "Compare" link. If no selection is provided, the bar is hidden.
 * Accepts either:
 *  - props.ids: array of row ids
 *  - props.selected: Set or array of row ids
 * If both are absent or empty, nothing renders.
 */
export default function StickyCompareBar(props: { ids?: MaybeId[]; selected?: MaybeSet }) {
  const ids = useMemo<string[]>(() => {
    if (Array.isArray(props?.ids)) return props.ids.map(String);
    const sel = props?.selected;
    if (sel instanceof Set) return Array.from(sel).map(String);
    if (Array.isArray(sel)) return sel.map(String);
    return [];
  }, [props?.ids, props?.selected]);

  // Try to build a slug list for stable compare URLs; fall back to ids if no rows resolve.
  const mParam = useMemo(() => {
    if (!ids.length) return '';
    const slugs = ids
      .map((id) => {
        const row = BENDERS.find((b) => String((b as any).id) === id);
        return row ? toSlug(row) : '';
      })
      .filter(Boolean);
    return slugs.length ? slugs.join(',') : '';
  }, [ids]);

  const href = mParam
    ? `/compare?m=${encodeURIComponent(mParam)}`
    : (ids.length ? `/compare?ids=${encodeURIComponent(ids.join(','))}` : '/compare');

  if (ids.length === 0) return null; // hide when nothing selected

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-3">
        <span className="text-sm">{ids.length} models selected</span>
        <div className="flex gap-2">
          {/* Clear button can be wired by parent; this is just the Compare link */}
          <Link href={href} className="btn btn-primary" aria-label="Compare selected models">
            Compare
          </Link>
        </div>
      </div>
    </div>
  );
}

