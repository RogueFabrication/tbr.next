'use client';

import { useState, useEffect } from 'react';
// Admin grid reads from /api/admin/products; writes hit /api/admin/products/[id]

type Product = {
  id: string;
  brand?: string;
  model?: string;
  // Scoring-related fields (drive the 100-pt score)
  price?: string;
  maxCapacity?: string;
  country?: string;
  madeIn?: string;
  powerType?: string;
  bendAngle?: string | number;
  wallThicknessCapacity?: string;
  sBendCapability?: string | boolean;
  // Other descriptive/display fields
  clrRange?: string;
  dieCost?: string;
  cycleTime?: string;
  weight?: string;
  mandrel?: string;
  // Newly added public-facing fields
  type?: string;
  capacity?: string;
  max_od?: string;
  maxWall?: string;
  dimensions?: string;
  warranty?: string;
  image?: string;
  highlights?: string; // stored comma-separated for simple admin editing
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              {/* Scoring drivers first (after ID) */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">* Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">* Max Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">* Country / Made In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">* Power Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">* Bend Angle (°)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">* Wall Thickness</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">* Mandrel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">* S-Bend Capable</th>
              {/* Non-scoring / display fields to the right */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLR Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Die Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image Path</th>
              {/* Additional display fields */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max OD</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Wall</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Highlights</th>
            </tr>
            <tr>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Stable internal ID. Do not change unless catalog data is updated to match.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Entry / starter setup price (USD) used for Value for Money scoring.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Largest round tube OD this machine can bend (inches).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Primary manufacturing country (e.g. USA) used for USA Manufacturing score.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Manual / Hydraulic / Electric, etc. Affects Ease of Use &amp; Setup score.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Maximum advertised single-pass bend angle in degrees.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Max wall for 1.75&quot; DOM used for wall thickness scoring (inches).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Mandrel option: Available / Standard / No, used for Mandrel score.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Yes/No: documented ability to create S-bends (affects S-Bend score).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Brand / manufacturer name (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Model designation exactly as marketed (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Approximate min–max CLR coverage, for future content / specs.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Rough die price notes (not currently used in scoring).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Bend cycle speed notes (not currently used in scoring).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Approximate shipping/operating weight for the specs table.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Relative path under <code className="font-mono">/images/products/</code>. If the file doesn&apos;t exist, the photo will break.
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Product type classification (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Alternative capacity field (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Maximum outer diameter spec (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Maximum wall thickness spec (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Physical dimensions for specs table (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
                Warranty terms for specs table (display only).
              </th>
              <th className="px-6 pb-3 text-left text-[0.65rem] text-gray-400 font-normal">
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
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                  {String(product?.id ?? '')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.price ?? ''}
                    onSave={(value) => updateProduct(product.id, 'price', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.maxCapacity ?? ''}
                    onSave={(value) => updateProduct(product.id, 'maxCapacity', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.country ?? product?.madeIn ?? ''}
                    onSave={(value) => {
                      // Store as "country" in the overlay; scoring also falls back to madeIn if present.
                      updateProduct(product.id, 'country', value as string);
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.powerType ?? ''}
                    onSave={(value) => updateProduct(product.id, 'powerType', value as string)}
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
                    value={product?.dieCost ?? ''}
                    onSave={(value) => updateProduct(product.id, 'dieCost', value as string)}
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
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.capacity ?? ''}
                    onSave={(val) => updateProduct(product.id, 'capacity', val as string)}
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
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
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
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded text-sm"
    >
      {value || '-'}
    </div>
  );
}
