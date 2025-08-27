// app/compare/page.tsx
import { BENDERS } from "../../data/benders";
import CompareClient from "../../components/compare/CompareClient";

export const metadata = { title: "Compare | TubeBenderReviews" };

/** Compare page backed by the shared dataset with client-side filtering. */
export default function ComparePage() {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Compare</h1>
      <CompareClient rows={BENDERS} />
    </div>
  );
}
