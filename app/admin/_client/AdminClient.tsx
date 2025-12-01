'use client';

import ProductsTab from '../../../components/admin/tabs/ProductsTab';

export default function AdminClient() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Full-bleed wrapper: escapes any parent max-width container */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-gray-50">
        <div className="px-4 py-6 lg:px-8 lg:py-8">
          <h1 className="mb-4 text-2xl font-semibold text-gray-900">Products</h1>
          {/* Inner content is allowed to use the full viewport width */}
          <div className="w-full max-w-none">
            <ProductsTab />
          </div>
        </div>
      </div>
    </main>
  );
}
