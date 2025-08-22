// app/compare/page.tsx
import React, { Suspense } from 'react';
import { CompareTable } from '../../components/compare/CompareTable';
import { LoadingSkeleton } from '../../components/comparison/LoadingSkeleton';
import CompareQueryHydrator from '../../components/compare/CompareQueryHydrator';

export const metadata = {
  title: 'Compare Tube Benders – Side-by-Side Analysis',
};


export default function ComparePage() {
  return (
    <>
      {/* Sync ?ids= from the URL into the compare store/localStorage */}
      <CompareQueryHydrator />
      return <h1 className="text-2xl font-semibold">Compare (stub)</h1>;
      <Suspense fallback={<LoadingSkeleton />}>
        <CompareTable />
      </Suspense>
    </>
  );
}
