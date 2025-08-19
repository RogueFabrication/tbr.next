"use client";
import React from 'react';
import Link from 'next/link';
import { readIds } from '../lib/compare';

// ... existing code that derives the current ids selection ...
// assume we already have ids: string[]

export default function StickyCompareBar(/* existing props */) {
  // ... existing rendering up to the CTA...

  return (
    <div className="/* existing classes */">
      {/* ...count / clear... */}
      <Link
        href={ids.length ? `/compare?ids=${encodeURIComponent(ids.join(','))}` : '/compare'}
        className="btn btn-primary"
        aria-label="Compare selected models"
      >
        Compare
      </Link>
    </div>
  );
}

