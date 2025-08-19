'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProductSchema = z.object({
  id: z.string(),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  maxCapacity: z.string().min(1, 'Max capacity is required'),
  clrRange: z.string().min(1, 'CLR range is required'),
  dieCost: z.string().min(1, 'Die cost is required'),
  cycleTime: z.string().min(1, 'Cycle time is required'),
  weight: z.string().min(1, 'Weight is required'),
  price: z.string().min(1, 'Price is required'),
  mandrel: z.enum(['Available', 'Standard', 'No']),
  totalScore: z.number().min(0).max(10),
  description: z.string().optional()
});

type Product = z.infer<typeof ProductSchema>;

interface EditableFieldProps {
  value: string | number;
  onSave: (value: string | number) => void;
  type?: 'text' | 'number';
  options?: string[];
}

function EditableField({ value, onSave, type = 'text', options }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleSave = () => {
    const finalValue = type === 'number' ? parseFloat(editValue) : editValue;
    onSave(finalValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
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
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          autoFocus
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') handleCancel();
        }}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-sm"
    >
      {value}
    </div>
  );
}

export function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/tube-benders');
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data ? Object.values(data) : []);
      } else {
        setError('Failed to fetch products');
      }
    } catch {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, field: keyof Product, value: string | number) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...p, [field]: value } : p
        ));
      } else {
        setError('Failed to update product');
      }
    } catch {
      setError('Failed to update product');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLR Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Die Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mandrel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(Array.isArray(products) ? products : (products as any)?.items ?? []).map((product: any) => (
              <tr
                key={String(product?.id ?? "")}
                className="hover:bg-gray-50"
              >
                                  <td className="px-6 py-4 whitespace-nowrap">
                    <EditableField
                      value={product?.name != null ? String(product.name) : ""}
                      /* ...other props... */
                    />
                  </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product.model}
                    onSave={(value) => updateProduct(product.id, 'model', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product.maxCapacity}
                    onSave={(value) => updateProduct(product.id, 'maxCapacity', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product.clrRange}
                    onSave={(value) => updateProduct(product.id, 'clrRange', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product.dieCost}
                    onSave={(value) => updateProduct(product.id, 'dieCost', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product.cycleTime}
                    onSave={(value) => updateProduct(product.id, 'cycleTime', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product.weight}
                    onSave={(value) => updateProduct(product.id, 'weight', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product.price}
                    onSave={(value) => updateProduct(product.id, 'price', value as string)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableField
                    value={product.mandrel}
                    onSave={(value) => updateProduct(product.id, 'mandrel', value as string)}
                    options={['Available', 'Standard', 'No']}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <EditableField
                    value={product?.price != null ? String(product.price) : ""}
                  />
                </td>
              </tr>
            )
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
