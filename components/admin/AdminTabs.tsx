'use client';
import * as React from 'react';

/**
 * AdminTabs (stub)
 * Temporary client component to satisfy /admin import during the rescue build.
 * Replace with the real admin UI when ready.
 */
export default function AdminTabs(): JSX.Element {
  return (
    <section className="mx-auto max-w-3xl p-6 rounded-xl border border-gray-200 bg-white">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="mt-2 text-gray-600">
        The admin panel is disabled in this rescue build. This placeholder exists only to unblock production builds.
      </p>
      <ul className="mt-4 list-disc pl-6 text-gray-700">
        <li>No database writes.</li>
        <li>No credentials or environment variables required.</li>
        <li>Safe to deploy.</li>
      </ul>
    </section>
  );
}

