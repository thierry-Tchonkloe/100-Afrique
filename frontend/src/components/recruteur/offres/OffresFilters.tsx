'use client';
// src/components/recruteur/offres/OffresFilters.tsx
import { Search, ChevronDown } from 'lucide-react';
import { CONTRACT_TYPES } from '@/types/offres.types';

export default function OffresFilters({
  search, setSearch, filterCont, setFilterCont, filterLoc, setFilterLoc, cities,
}: {
  search: string; setSearch: (v: string) => void;
  filterCont: string; setFilterCont: (v: string) => void;
  filterLoc: string; setFilterLoc: (v: string) => void;
  cities: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-52">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par titre ou localisation…"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                     focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
        />
      </div>

      <div className="relative">
        <select
          value={filterCont}
          onChange={(e) => setFilterCont(e.target.value)}
          className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm
                     text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30
                     focus:border-[#E8622A] transition cursor-pointer"
        >
          <option value="">Tous les contrats</option>
          {CONTRACT_TYPES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {cities.length > 0 && (
        <div className="relative">
          <select
            value={filterLoc}
            onChange={(e) => setFilterLoc(e.target.value)}
            className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm
                       text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30
                       focus:border-[#E8622A] transition cursor-pointer"
          >
            <option value="">Toutes les localisations</option>
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      )}
    </div>
  );
}
