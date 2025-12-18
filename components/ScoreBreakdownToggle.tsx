"use client";

import { useState } from "react";
import type { ProductScore } from "../lib/scoring";
import { ScoreBreakdown } from "./reviews/ScoreBreakdown";

type ScoreBreakdownToggleProps = {
  score: ProductScore | null | undefined;
};

/**
 * Client-side wrapper that hangs a button + disclosure UI
 * in front of the full ScoreBreakdown table.
 *
 * Intended to live near the "expand citation log" / audit
 * area on a review detail page so users only see the full
 * math if they explicitly expand it.
 */
export default function ScoreBreakdownToggle({
  score,
}: ScoreBreakdownToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-700">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Score math summary
          </p>
          <p className="mt-0.5 text-[11px] text-gray-600">
            This shows every category, the exact points awarded, and the reasoning
            used for this model. (Citations and audit trail are in the section below.)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-3 py-1 text-[11px] font-medium text-gray-800 shadow-sm hover:bg-gray-50"
        >
          {open ? "Hide score math" : "Show score math for this model"}
        </button>
      </div>

      {open && (
        <div className="pt-2">
          <ScoreBreakdown scores={score} />
        </div>
      )}
    </div>
  );
}

