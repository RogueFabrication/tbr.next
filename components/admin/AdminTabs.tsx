'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { ProductsTab } from './tabs/ProductsTab';
import { CategoriesTab } from './tabs/CategoriesTab';
import { SiteContentTab } from './tabs/SiteContentTab';
import { PricingTab } from './tabs/PricingTab';
import { NotesTab } from './tabs/NotesTab';
import { ImagesTab } from './tabs/ImagesTab';
import { BannerTab } from './tabs/BannerTab';
import { EmailTab } from './tabs/EmailTab';
import { DiagnosticsTab } from './tabs/DiagnosticsTab';

type AdminTab = 'products' | 'categories' | 'content' | 'pricing' | 'notes' | 'images' | 'banner' | 'email' | 'diagnostics';

const tabs = [
  { id: 'products' as AdminTab, name: 'Products', icon: '📦' },
  { id: 'categories' as AdminTab, name: 'Categories', icon: '🏷️' },
  { id: 'content' as AdminTab, name: 'Site Content', icon: '📝' },
  { id: 'pricing' as AdminTab, name: 'Pricing', icon: '💰' },
  { id: 'notes' as AdminTab, name: 'Notes', icon: '📋' },
  { id: 'images' as AdminTab, name: 'Images', icon: '🖼️' },
  { id: 'banner' as AdminTab, name: 'Banner', icon: '🎯' },
  { id: 'email' as AdminTab, name: 'Email', icon: '📧' },
  { id: 'diagnostics' as AdminTab, name: 'Diagnostics', icon: '🔧' }
];

export function AdminTabs() {
  const sp = useSearchParams();
  const router = useRouter();

  const validTabs: AdminTab[] = ['products', 'categories', 'content', 'pricing', 'notes', 'images', 'banner', 'email', 'diagnostics'];
  const activeTab: AdminTab = useMemo(() => {
    const q = sp.get("tab");
    return validTabs.includes(q as AdminTab) ? (q as AdminTab) : "products";
  }, [sp]);

  const renderTabContent = (tab: AdminTab) => {
    switch (tab) {
      case 'products':
        return <ProductsTab />;
      case 'categories':
        return <CategoriesTab />;
      case 'content':
        return <SiteContentTab />;
      case 'pricing':
        return <PricingTab />;
      case 'notes':
        return <NotesTab />;
      case 'images':
        return <ImagesTab />;
      case 'banner':
        return <BannerTab />;
      case 'email':
        return <EmailTab />;
      case 'diagnostics':
        return <DiagnosticsTab />;
      default:
        return <ProductsTab />;
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(`/admin?tab=${tab.id}`)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {renderTabContent(activeTab)}
      </div>
    </div>
  );
}

