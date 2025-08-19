'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TubeBender } from '../../lib/validators';

interface FilterBarProps {
  className?: string;
}

export function FilterBar({ className = '' }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [textFilter, setTextFilter] = useState(searchParams.get('search') || '');
  const [mandrelFilter, setMandrelFilter] = useState<TubeBender['mandrel'] | 'all'>(
    (searchParams.get('mandrel') as TubeBender['mandrel'] | 'all') || 'all'
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (textFilter) {
        params.set('search', textFilter);
      } else {
        params.delete('search');
      }
      router.replace(`?${params.toString()}`);
    }, 200);

    return () => clearTimeout(timer);
  }, [textFilter, router, searchParams]);

  const handleMandrelChange = useCallback((mandrel: TubeBender['mandrel'] | 'all') => {
    setMandrelFilter(mandrel);
    const params = new URLSearchParams(searchParams);
    if (mandrel === 'all') {
      params.delete('mandrel');
    } else {
      params.set('mandrel', mandrel);
    }
    router.replace(`?${params.toString()}`);
  }, [router, searchParams]);

    return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Text Search */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Search by brand or model..."
              value={textFilter}
              onChange={(e) => setTextFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby="search-description"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <p id="search-description" className="mt-1 text-sm text-gray-500">
            Filter by brand name or model number
          </p>
        </div>

        {/* Mandrel Filter */}
        <div className="sm:w-48">
          <label htmlFor="mandrel-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Mandrel
          </label>
          <select
            id="mandrel-filter"
            value={mandrelFilter}
            onChange={(e) => handleMandrelChange(e.target.value as TubeBender['mandrel'] | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Options</option>
            <option value="Available">Available</option>
            <option value="Standard">Standard</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {/* Chip Filters */}
      <div className="mt-4">
        <span className="text-sm font-medium text-gray-700 mr-2">Quick Filters:</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {(['Available', 'Standard', 'No'] as const).map((mandrel) => (
            <button
              key={mandrel}
              onClick={() => handleMandrelChange(mandrelFilter === mandrel ? 'all' : mandrel)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                mandrelFilter === mandrel
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              aria-pressed={mandrelFilter === mandrel}
            >
              {mandrel}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
