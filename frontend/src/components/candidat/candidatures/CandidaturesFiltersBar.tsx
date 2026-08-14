'use client';
// src/components/candidat/candidatures/CandidaturesFiltersBar.tsx
import { Search } from 'lucide-react';
import clsx from 'clsx';
import { FILTER_TABS } from '@/data/candidaturesFilters';
import type { FilterTab } from '@/types/candidatures.types';

export default function CandidaturesFiltersBar({
  search, setSearch, tab, setTab,
}: {
  search: string; setSearch: (v: string) => void;
  tab: FilterTab; setTab: (t: FilterTab) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-48 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par entreprise…"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                     focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
        />
      </div>

      <div className="flex bg-gray-100 rounded-xl p-1 gap-1 ml-auto">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              'px-4 py-1.5 text-sm font-semibold rounded-lg transition-all',
              tab === key
                ? 'bg-[#E8622A] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
