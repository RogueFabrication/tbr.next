'use client';

import { useState, useEffect } from 'react';
// Admin grid reads from /api/admin/products; writes hit /api/admin/products/[id]

type Product = {
  id: string;
  brand?: string;
  model?: string;
  // Scoring-related fields (drive the 100-pt score)
  maxCapacity?: string;
  country?: string;
  powerType?: string;
  bendAngle?: string | number;
  wallThicknessCapacity?: string;
  sBendCapability?: string | boolean;
  // Other descriptive/display fields
  clrRange?: string;
  cycleTime?: string;
  weight?: string;
  mandrel?: string;
  // Newly added public-facing fields
  type?: string;
  max_od?: string;
  maxWall?: string;
  dimensions?: string;
  warranty?: string;
  image?: string;
  highlights?: string; // stored comma-separated for simple admin editing

  // Review content fields (all optional; stored in overlay)
  pros?: string;
  cons?: string;
  consSources?: string;
  keyFeatures?: string;
  materials?: string;

  // Pricing breakdown fields (all optional; stored in overlay)
  framePriceMin?: string;
  framePriceMax?: string;
  diePriceMin?: string;
  diePriceMax?: string;
  hydraulicPriceMin?: string;
  hydraulicPriceMax?: string;
  standPriceMin?: string;
  standPriceMax?: string;
};

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      if (!res.ok) {
        setError('Failed to fetch products');
        return;
      }
      const json: any = await res.json();
      // Accept either { ok, data } or a raw array (defensive)
      let rows: any[] = [];
      if (Array.isArray(json)) {
        rows = json;
      } else if (Array.isArray(json?.data)) {
        rows = json.data;
      } else if (json?.ok && Array.isArray(json?.data)) {
        rows = json.data;
      } else {
        rows = [];
      }
      setProducts(rows as Product[]);
      setError('');
    } catch {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, field: keyof Product, value: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        // Refresh the products list to show the updated data
        fetchProducts();
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Products</h2>
        <p className="text-sm text-gray-500">
          Click on any field to edit. Fields marked <span className="font-semibold">*</span> directly influence scoring.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Image path expects a file under <code className="font-mono text-[0.7rem]">/public/images/products/</code>. Changing the path without a matching file will break the photo.
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 relative">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 top-0 z-30 bg-gray-50">ID</th>
              {/* Scoring drivers first (after ID) */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">* Max Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">* Country / Made In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">* Power Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">* Bend Angle (°)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">* Wall Thickness</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">* Mandrel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">* S-Bend Capable</th>
              {/* Non-scoring / display fields to the right */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">CLR Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">Cycle Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">Image Path</th>
              {/* Additional display fields */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">Max OD</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">Max Wall</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">Floor footprint</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">Warranty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-20 bg-gray-50">Highlights</th>
            </tr>
            <tr>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky left-0 top-12 bg-gray-50 z-30">
                Stable internal ID. Do not change unless catalog data is updated to match.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Largest round tube OD this machine can bend (inches).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Primary manufacturing country (e.g. USA). Drives USA Manufacturing score.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Manual / Hydraulic / Electric, etc. Affects Ease of Use &amp; Setup score.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Maximum advertised single-pass bend angle in degrees.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Max wall for 1.75&quot; DOM used for wall thickness scoring (inches).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Mandrel option: Available / Standard / No, used for Mandrel score.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Yes/No: documented ability to create S-bends (affects S-Bend score).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Brand / manufacturer name (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Model designation exactly as marketed (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Approximate min–max CLR coverage, for future content / specs.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Fastest documented bend cycle time for any available configuration. Leave blank if the manufacturer does not publish this.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Approximate weight for an average, commonly sold configuration (for example, averaging lighter and heavier frame/cart variants).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Relative path under <code className="font-mono">/images/products/</code>. If the file doesn&apos;t exist, the photo will break.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Product type classification (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Maximum outer diameter spec (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Maximum wall thickness spec (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Floor footprint, only filled out when published directly by the manufacturer.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Warranty terms for specs table (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal sticky top-12 bg-gray-50 z-20">
                Comma-separated highlight bullets for review pages (display only).
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(Array.isArray(products) ? products : (products as any)?.items ?? []).map((product: any) => (
              <tr
                key={String(product?.id ?? "")}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 sticky left-0 bg-white z-10">
                  {String(product?.id ?? '')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.maxCapacity ?? ''}
                    onSave={(value) => updateProduct(product.id, 'maxCapacity', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.country ?? ''}
                    onSave={(value) => {
                      updateProduct(product.id, 'country', value as string);
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.powerType ?? ''}
                    onSave={(value) => updateProduct(product.id, 'powerType', value as string)}
                    options={[
                      'Manual',
                      'Hydraulic',
                      'Manual + Hydraulic',
                      'Electric / CNC',
                      'Other',
                    ]}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.bendAngle != null ? String(product.bendAngle) : ''}
                    onSave={(value) => updateProduct(product.id, 'bendAngle', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.wallThicknessCapacity ?? ''}
                    onSave={(value) => updateProduct(product.id, 'wallThicknessCapacity', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.mandrel ?? ''}
                    onSave={(value) => updateProduct(product.id, 'mandrel', value as string)}
                    options={['Available', 'Standard', 'No']}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={
                      typeof product?.sBendCapability === 'boolean'
                        ? (product.sBendCapability ? 'Yes' : 'No')
                        : (product?.sBendCapability ?? '')
                    }
                    onSave={(value) => updateProduct(product.id, 'sBendCapability', value as string)}
                    options={['', 'Yes', 'No']}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.brand ?? ''}
                    onSave={(value) => updateProduct(product.id, 'brand', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.model ?? ''}
                    onSave={(value) => updateProduct(product.id, 'model', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.clrRange ?? ''}
                    onSave={(value) => updateProduct(product.id, 'clrRange', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.cycleTime ?? ''}
                    onSave={(value) => updateProduct(product.id, 'cycleTime', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.weight ?? ''}
                    onSave={(value) => updateProduct(product.id, 'weight', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.image ?? ''}
                    onSave={(value) => updateProduct(product.id, 'image', value as string)}
                  />
                </td>

                {/* Additional display fields */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.type ?? ''}
                    onSave={(val) => updateProduct(product.id, 'type', val as string)}
                    options={['Rotary draw', 'Ram compression', 'Roll']}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.max_od ?? ''}
                    onSave={(val) => updateProduct(product.id, 'max_od', val as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.maxWall ?? ''}
                    onSave={(val) => updateProduct(product.id, 'maxWall', val as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.dimensions ?? ''}
                    onSave={(val) => updateProduct(product.id, 'dimensions', val as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.warranty ?? ''}
                    onSave={(val) => updateProduct(product.id, 'warranty', val as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={
                      product?.highlights
                        ? Array.isArray(product.highlights)
                          ? product.highlights.join(', ')
                          : String(product.highlights)
                        : ''
                    }
                    onSave={(val) => updateProduct(product.id, 'highlights', val as string)}
                  />
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pricing breakdown section (component-level min/max) */}
      <section className="mt-10 border-t border-gray-200 pt-6">
        <h3 className="text-base font-semibold text-gray-900">Pricing breakdown (min / max)</h3>
        <p className="mt-1 text-xs text-gray-500 max-w-3xl">
          These values are used for transparent pricing when we explain Value for Money scoring.
          Enter conservative, documented prices only. System totals are calculated as the sum of all component min/max values.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {(Array.isArray(products) ? products : (products as any)?.items ?? []).map((product: any) => {
            const parse = (v: unknown): number =>
              typeof v === 'number'
                ? v
                : parseFloat(String(v ?? '').replace(/[^0-9.+-]/g, '')) || 0;

            const minTotal =
              parse(product?.framePriceMin) +
              parse(product?.diePriceMin) +
              parse(product?.hydraulicPriceMin) +
              parse(product?.standPriceMin);

            const maxTotal =
              parse(product?.framePriceMax) +
              parse(product?.diePriceMax) +
              parse(product?.hydraulicPriceMax) +
              parse(product?.standPriceMax);

            return (
              <div
                key={String(product?.id ?? '')}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {String(product?.id ?? '')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product?.brand || product?.model
                        ? [product?.brand, product?.model].filter(Boolean).join(' ')
                        : 'Unnamed product'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[0.65rem] uppercase tracking-wide text-gray-500">
                      Min system total
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {minTotal > 0 ? `$${minTotal.toFixed(0)}` : '—'}
                    </div>
                    <div className="text-[0.65rem] uppercase tracking-wide text-gray-500">
                      Max system total
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {maxTotal > 0 ? `$${maxTotal.toFixed(0)}` : '—'}
                    </div>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Frame</div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="text-[0.65rem] text-gray-500 mb-0.5">Min</div>
                        <EditableField
                          value={product?.framePriceMin ?? ''}
                          onSave={(value) =>
                            updateProduct(product.id, 'framePriceMin', value as string)
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-[0.65rem] text-gray-500 mb-0.5">Max</div>
                        <EditableField
                          value={product?.framePriceMax ?? ''}
                          onSave={(value) =>
                            updateProduct(product.id, 'framePriceMax', value as string)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Dies</div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="text-[0.65rem] text-gray-500 mb-0.5">Min</div>
                        <EditableField
                          value={product?.diePriceMin ?? ''}
                          onSave={(value) =>
                            updateProduct(product.id, 'diePriceMin', value as string)
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-[0.65rem] text-gray-500 mb-0.5">Max</div>
                        <EditableField
                          value={product?.diePriceMax ?? ''}
                          onSave={(value) =>
                            updateProduct(product.id, 'diePriceMax', value as string)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Hydraulics</div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="text-[0.65rem] text-gray-500 mb-0.5">Min</div>
                        <EditableField
                          value={product?.hydraulicPriceMin ?? ''}
                          onSave={(value) =>
                            updateProduct(product.id, 'hydraulicPriceMin', value as string)
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-[0.65rem] text-gray-500 mb-0.5">Max</div>
                        <EditableField
                          value={product?.hydraulicPriceMax ?? ''}
                          onSave={(value) =>
                            updateProduct(product.id, 'hydraulicPriceMax', value as string)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Stand / Mount</div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="text-[0.65rem] text-gray-500 mb-0.5">Min</div>
                        <EditableField
                          value={product?.standPriceMin ?? ''}
                          onSave={(value) =>
                            updateProduct(product.id, 'standPriceMin', value as string)
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-[0.65rem] text-gray-500 mb-0.5">Max</div>
                        <EditableField
                          value={product?.standPriceMax ?? ''}
                          onSave={(value) =>
                            updateProduct(product.id, 'standPriceMax', value as string)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Review content (pros / cons / features / materials) */}
      <section className="mt-10 border-t border-gray-200 pt-6">
        <h3 className="text-base font-semibold text-gray-900">Review content</h3>
        <p className="mt-1 text-xs text-gray-500 max-w-3xl">
          Pros, cons, key features, and materials compatibility shown on each review page.
          For cons,{" "}
          <span className="font-semibold">
            every line must have a matching source line
          </span>{" "}
          (manufacturer docs, product page, or other verifiable reference).
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {(Array.isArray(products) ? products : (products as any)?.items ?? []).map(
            (product: any) => {
              const id = String(product?.id ?? "");

              const pros = product?.pros ?? "";
              const cons = product?.cons ?? "";
              const consSources = product?.consSources ?? "";
              const keyFeatures = product?.keyFeatures ?? "";
              const materialsRaw = product?.materials ?? "";

              const MATERIAL_OPTIONS = [
                "Mild steel",
                "Stainless steel",
                "4130 chromoly",
                "Aluminum",
                "Titanium",
                "Copper",
                "Brass",
              ] as const;

              const selectedMaterials = new Set(
                String(materialsRaw)
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              );

              const toggleMaterial = (label: string) => {
                const next = new Set(selectedMaterials);
                if (next.has(label)) {
                  next.delete(label);
                } else {
                  next.add(label);
                }
                const serialized = Array.from(next).join(", ");
                updateProduct(id, "materials", serialized);
              };

              return (
                <div
                  key={id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product?.brand || product?.model
                          ? [product?.brand, product?.model]
                              .filter(Boolean)
                              .join(" ")
                          : "Unnamed product"}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 text-xs md:grid-cols-2">
                    <div>
                      <div className="mb-1 font-semibold text-gray-800">
                        Pros (one per line)
                      </div>
                      <textarea
                        className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        rows={5}
                        defaultValue={pros}
                        onBlur={(e) =>
                          updateProduct(id, "pros", e.target.value ?? "")
                        }
                      />
                    </div>

                    <div>
                      <div className="mb-1 font-semibold text-gray-800">
                        Cons (one per line) &amp; sources
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div>
                          <div className="mb-0.5 text-[0.7rem] text-gray-500">
                            Cons
                          </div>
                          <textarea
                            className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                            rows={5}
                            defaultValue={cons}
                            onBlur={(e) =>
                              updateProduct(id, "cons", e.target.value ?? "")
                            }
                          />
                        </div>
                        <div>
                          <div className="mb-0.5 text-[0.7rem] text-gray-500">
                            Sources (matching lines: docs, product pages, etc.)
                          </div>
                          <textarea
                            className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                            rows={5}
                            defaultValue={consSources}
                            onBlur={(e) =>
                              updateProduct(
                                id,
                                "consSources",
                                e.target.value ?? "",
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 text-xs md:grid-cols-2">
                    <div>
                      <div className="mb-1 font-semibold text-gray-800">
                        Key features (one per line)
                      </div>
                      <textarea
                        className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        rows={4}
                        defaultValue={keyFeatures}
                        onBlur={(e) =>
                          updateProduct(id, "keyFeatures", e.target.value ?? "")
                        }
                      />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-gray-800">
                        Materials compatibility
                      </div>
                      <p className="mb-2 text-[0.7rem] text-gray-500">
                        Check all materials this machine is suitable for. This is
                        displayed as read-only tags on the review page.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {MATERIAL_OPTIONS.map((label) => {
                          const active = selectedMaterials.has(label);
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => toggleMaterial(label)}
                              className={[
                                "rounded-full border px-2.5 py-0.5 text-[0.7rem]",
                                active
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                  : "border-gray-300 bg-gray-50 text-gray-700",
                              ].join(" ")}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </section>
    </div>
  );
}

// EditableField component for inline editing
function EditableField({ 
  value, 
  onSave, 
  options 
}: { 
  value: string; 
  onSave: (value: string) => void; 
  options?: string[]; 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  // Sync editValue when value prop changes (e.g., after save)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    if (options) {
      return (
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        autoFocus
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      onFocus={() => setIsEditing(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsEditing(true);
        }
      }}
      tabIndex={0}
      className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
    >
      {value || '-'}
    </div>
  );
}
