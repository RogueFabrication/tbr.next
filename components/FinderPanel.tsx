'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useDebounce } from '../lib/useDebounce';
import { useEffect, useMemo, useState } from 'react';

export type FinderState = {
  q: string;
  power: 'any' | 'manual' | 'hydraulic';
  originUS: boolean;
  originTW: boolean;
  capacityMin: string; // e.g., "2" for 2" OD
  priceMax: string;    // number string
};

function readState(sp: URLSearchParams): FinderState {
  return {
    q: sp.get('q') ?? '',
    power: (sp.get('power') as any) ?? 'any',
    originUS: sp.get('us') === '1',
    originTW: sp.get('tw') === '1',
    capacityMin: sp.get('cap') ?? '',
    priceMax: sp.get('pmax') ?? '',
  };
}

export default function FinderPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<FinderState>(() => readState(searchParams));
  const debouncedQ = useDebounce(state.q, 350);

  // keep state in sync when user navigates/back-forward
  useEffect(() => {
    setState(readState(searchParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const nextParams = useMemo(() => {
    const sp = new URLSearchParams();
    if (debouncedQ) sp.set('q', debouncedQ);
    if (state.power !== 'any') sp.set('power', state.power);
    if (state.originUS) sp.set('us', '1');
    if (state.originTW) sp.set('tw', '1');
    if (state.capacityMin) sp.set('cap', state.capacityMin);
    if (state.priceMax) sp.set('pmax', state.priceMax);
    return sp;
  }, [debouncedQ, state.power, state.originUS, state.originTW, state.capacityMin, state.priceMax]);

  // push params only when they actually change -> avoids loops
  useEffect(() => {
    const current = searchParams.toString();
    const target = nextParams.toString();
    if (current !== target) {
      const url = target ? `/?${target}` : '/';
      router.replace(url);
    }
  }, [nextParams, router, searchParams]);

  return (
    <aside className="hidden lg:block w-64 shrink-0 pr-6">
      <div className="sticky top-16 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            value={state.q}
            onChange={(e) => setState(s => ({ ...s, q: e.target.value }))}
            placeholder="Brand or model..."
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Power</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={state.power === 'any'}
              onChange={() => setState(s => ({ ...s, power: 'any' }))}
            /> Any
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={state.power === 'manual'}
              onChange={() => setState(s => ({ ...s, power: 'manual' }))}
            /> Manual
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={state.power === 'hydraulic'}
              onChange={() => setState(s => ({ ...s, power: 'hydraulic' }))}
            /> Hydraulic
          </label>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Origin</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={state.originUS}
              onChange={(e) => setState(s => ({ ...s, originUS: e.target.checked }))}
            /> USA
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={state.originTW}
              onChange={(e) => setState(s => ({ ...s, originTW: e.target.checked }))}
            /> Taiwan
          </label>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Min OD</label>
            <input
              value={state.capacityMin}
              onChange={(e) => setState(s => ({ ...s, capacityMin: e.target.value }))}
              placeholder={`e.g., 2`}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Price</label>
            <input
              value={state.priceMax}
              onChange={(e) => setState(s => ({ ...s, priceMax: e.target.value }))}
              placeholder="e.g., 4000"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setState({ q: '', power: 'any', originUS: false, originTW: false, capacityMin: '', priceMax: '' })}
          className="text-xs text-slate-600 underline"
        >
          Clear all
        </button>
      </div>
    </aside>
  );
}
