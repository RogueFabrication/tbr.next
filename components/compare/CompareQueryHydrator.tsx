// components/compare/CompareQueryHydrator.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { readIds, writeIds } from '../../lib/compare';

export default function CompareQueryHydrator() {
  const params = useSearchParams();
  const idsParam = params.get('ids') ?? '';

  // Normalize once so effects are stable
  const idsFromQuery = useMemo(
    () =>
      idsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [idsParam]
  );

  useEffect(() => {
    if (idsFromQuery.length === 0) return;

    // Only write if different to avoid useless re-renders
    const current = readIds();
    const same =
      current.length === idsFromQuery.length &&
      current.every((v, i) => v === idsFromQuery[i]);

    if (!same) writeIds(idsFromQuery);
  }, [idsFromQuery]);

  return null;
}
