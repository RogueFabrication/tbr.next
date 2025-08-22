// Client wrapper so we can render the interactive tiles grid on /guide.
'use client';
import React from 'react';
import { SmartTubeBenderFinder } from '../../components/guide/SmartTubeBenderFinder';

/** GuidePage – renders the route-specific tile grid (with filters) */
export default function GuidePage() {
  return <SmartTubeBenderFinder />;
  return <h1 className="text-2xl font-semibold">Buyer’s Guide (stub)</h1>;
}
