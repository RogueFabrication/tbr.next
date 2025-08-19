'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ScoreBadge } from '../comparison/ScoreBadge';
import { toArray } from '../../lib/toArray';

interface Product {
  id: string;
  brand: string;
  model: string;
  maxCapacity: string;
  clrRange: string;
  dieCost: string;
  cycleTime: string;
  weight: string;
  price: string;
  mandrel: string;
  totalScore: number;
  description: string;
}

export function CompareTable() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/tube-benders');
      if (response.ok) {
        const data = await response.json();
        const products = toArray<Product>(data);
        setProducts(products);
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const compareParam = searchParams.get('compare');
  const selectedProductIds = compareParam ? compareParam.split(',') : [];
  const list = Array.isArray(products) ? products : [];
  const selectedProducts = list.filter(p => selectedProductIds.includes(p.id));

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (selectedProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Selected</h3>
        <p className="text-gray-600">Select products from the filters above to compare them side-by-side.</p>
      </div>
    );
  }

  const comparisonFields = [
    { key: 'brand', label: 'Brand' },
    { key: 'model', label: 'Model' },
    { key: 'maxCapacity', label: 'Max Capacity' },
    { key: 'clrRange', label: 'CLR Range' },
    { key: 'dieCost', label: 'Die Cost' },
    { key: 'cycleTime', label: 'Cycle Time' },
    { key: 'weight', label: 'Weight' },
    { key: 'price', label: 'Price' },
    { key: 'mandrel', label: 'Mandrel' },
    { key: 'totalScore', label: 'Total Score' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specification
              </th>
              {selectedProducts.map((product) => (
                <th key={product.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {product.brand} {product.model}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comparisonFields.map((field) => (
              <tr key={field.key} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {field.label}
                </td>
                {selectedProducts.map((product) => (
                  <td key={`${product.id}-${field.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {field.key === 'totalScore' ? (
                      <ScoreBadge score={product[field.key as keyof Product] as number} />
                    ) : (
                      product[field.key as keyof Product]
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Description
              </td>
              {selectedProducts.map((product) => (
                <td key={`${product.id}-description`} className="px-6 py-4 text-sm text-gray-900">
                  <p className="line-clamp-3">{product.description}</p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Comparing {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''}
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              View Detailed Reviews
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
              Export Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

