// components/home/HomeShell.tsx
type Row = {
    brand: string;
    model: string;
    capacity: string;
    price: string;
    score: number;
  };
  
  const rows: Row[] = [
    { brand: "RogueFab", model: "M625", capacity: '2" x .120 DOM', price: "—", score: 95 },
    { brand: "Brand A", model: "AB200", capacity: '1.75" x .095', price: "—", score: 82 },
    { brand: "Brand B", model: "BX150", capacity: '1.5" x .083', price: "—", score: 78 },
  ];
  
  export default function HomeShell() {
    return (
      <div className="min-h-screen">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="text-4xl font-bold tracking-tight">TubeBenderReviews</h1>
          <p className="mt-3 text-lg text-gray-600">
            Independent-style comparisons with real specs. This is the clean boot shell—no charts or calendars yet.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#compare" className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700">Compare benders</a>
            <a href="#guide" className="rounded-lg border px-5 py-2.5 hover:bg-gray-50">Buyer’s guide</a>
          </div>
        </section>
  
        {/* Mini comparison table (static) */}
        <section id="compare" className="mx-auto max-w-6xl px-6 pb-12">
          <h2 className="mb-4 text-2xl font-semibold">Quick comparison</h2>
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.brand + r.model} className="border-t">
                    <td className="px-4 py-3">{r.brand}</td>
                    <td className="px-4 py-3">{r.model}</td>
                    <td className="px-4 py-3">{r.capacity}</td>
                    <td className="px-4 py-3">{r.price}</td>
                    <td className="px-4 py-3">{r.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
  
        {/* Buyer’s guide stub */}
        <section id="guide" className="mx-auto max-w-6xl px-6 pb-16">
          <h2 className="mb-3 text-2xl font-semibold">Buyer’s guide (stub)</h2>
          <ul className="list-disc space-y-1 pl-6 text-gray-700">
            <li>Decide on max OD/WT you must bend.</li>
            <li>Check die availability and lead times.</li>
            <li>Look for repeatability features and calibration.</li>
          </ul>
        </section>
      </div>
    );
  }
  