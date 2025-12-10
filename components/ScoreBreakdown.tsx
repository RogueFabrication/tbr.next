import { TOTAL_POINTS, type ProductScore } from "../lib/scoring";

type ScoreBreakdownProps = {
  score: ProductScore | null | undefined;
};

/**
 * Presentational component for showing the full scoring breakdown
 * for a single machine:
 *
 * - Per-category points and maxPoints
 * - Human-readable reasoning from the scoring engine
 * - Raw sum of category points vs final clamped total out of TOTAL_POINTS
 *
 * Designed to be dropped into the "expand citations / full math" area
 * on a review detail page.
 */
export default function ScoreBreakdown({ score }: ScoreBreakdownProps) {
  if (!score || score.total == null || !score.breakdown || score.breakdown.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
        Score breakdown is not available for this machine yet. This usually
        means the product is missing key specs or has not been fully scored
        in the latest algorithm.
      </div>
    );
  }

  const breakdown = score.breakdown;

  const rawTotal = breakdown.reduce((sum, item) => {
    const pts = Number.isFinite(item.points) ? item.points : 0;
    return sum + pts;
  }, 0);

  const finalTotal = score.total;

  // In practice, rawTotal and finalTotal should only differ when clamping
  // to TOTAL_POINTS occurs (for example, if a future algorithm could exceed
  // 100 points and is then clamped). We surface that fact explicitly rather
  // than pretending the clamp never happened.
  const wasClamped =
    typeof finalTotal === "number" &&
    typeof rawTotal === "number" &&
    rawTotal > TOTAL_POINTS &&
    finalTotal === TOTAL_POINTS;

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white px-4 py-4 text-xs text-gray-700">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Score math summary
          </p>
          <p className="mt-0.5 text-sm font-medium text-gray-900">
            Raw sum:{" "}
            <span className="font-semibold">
              {rawTotal}
            </span>{" "}
            points
            {" · "}
            Final score:{" "}
            <span className="font-semibold">
              {finalTotal}/{TOTAL_POINTS}
            </span>
            {wasClamped && (
              <span className="ml-1 text-[11px] font-normal text-amber-700">
                (clamped from {rawTotal} to {TOTAL_POINTS})
              </span>
            )}
          </p>
        </div>
        <p className="max-w-xs text-[11px] text-gray-500">
          Every category below comes directly from the live scoring engine for
          this machine. Points are integers; we round and then clamp the total
          to {TOTAL_POINTS} where needed.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse text-left text-[11px]">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-3 py-2 font-medium text-gray-700">
                Category
              </th>
              <th className="px-3 py-2 font-medium text-gray-700">
                Points
              </th>
              <th className="px-3 py-2 font-medium text-gray-700">
                How this was scored
              </th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((item, idx) => (
              <tr
                key={`${item.criteria}-${idx}`}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border-t border-gray-200 px-3 py-2 align-top text-gray-900">
                  {item.criteria}
                </td>
                <td className="border-t border-gray-200 px-3 py-2 align-top text-gray-900">
                  <span className="font-semibold">
                    {item.points}
                  </span>{" "}
                  <span className="text-gray-500">
                    / {item.maxPoints}
                  </span>
                </td>
                <td className="border-t border-gray-200 px-3 py-2 align-top text-gray-600">
                  {item.reasoning}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-gray-500">
        If something looks off, it&apos;s almost always a data issue (for
        example, missing specs or an outdated admin overlay), not a hidden
        multiplier. Fix the inputs and the math here will update automatically.
      </p>
    </div>
  );
}

