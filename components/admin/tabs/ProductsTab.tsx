'use client';

import { useState, useEffect } from 'react';
// This tab is tolerant of minimal data: it will render rows when only { id } exists
// and progressively show more fields as they become available/edited.

type Product = {
  id: string;
  brand?: string;
  model?: string;
  maxCapacity?: string;
  clrRange?: string;
  dieCost?: string;
  cycleTime?: string;
  weight?: string;
  price?: string;
  mandrel?: string;
  totalScore?: string;
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
      // Use the admin overlay endpoint so edits are reflected immediately.
      // The [id] GET returns all rows; any id value works, we use 0.
      const response = await fetch('/api/admin/products/0');
      if (response.ok) {
        const json = await response.json();
        const rows = Array.isArray(json?.data) ? json.data
          : Array.isArray(json) ? json
          : Array.isArray(json?.rows) ? json.rows
          : [];
        // Normalize rows so the grid always has an id and object shape
        const normalized = rows.map((r: any) => {
          if (r == null) return null;
          if (typeof r === 'string' || typeof r === 'number') return { id: String(r) };
          const id = r.id ?? r.slug ?? r.key ?? String(r?.name ?? '');
          return id ? { id: String(id), ...r } : r;
        }).filter(Boolean);
        setProducts(normalized as Product[]);
      } else {
        setError('Failed to fetch products');
      }
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
        <p className="text-sm text-gray-500">Click on any field to edit</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLR Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Die Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mandrel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
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
                    value={product?.maxCapacity ?? ''}
                    onSave={(value) => updateProduct(product.id, 'maxCapacity', value as string)}
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
                    value={product?.price ?? ''}
                    onSave={(value) => updateProduct(product.id, 'price', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product?.mandrel ?? ''}
                    onSave={(value) => updateProduct(product.id, 'mandrel', value as string)}
                    options={['Available', 'Standard', 'No']}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <EditableField
                    value={product?.totalScore != null ? String(product.totalScore) : ""}
                    onSave={(value) => updateProduct(product.id, 'totalScore', value as string)}
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
