'use client';
// src/components/emploi/metiers/SectorFilterBar.tsx
import { Search, MapPin, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function SectorFilterBar({
  search, setSearch, contractType, setContractType, location, setLocation,
  total, loading, onReset, hasFilters,
}: {
  search: string; setSearch: (v: string) => void;
  contractType: string; setContractType: (v: string) => void;
  location: string; setLocation: (v: string) => void;
  total: number; loading: boolean;
  onReset: () => void; hasFilters: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 flex-1 min-w-[180px] border border-gray-200 rounded-xl
                      px-3 py-2 focus-within:border-[#E8622A] transition-colors">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Intitulé du poste..."
          className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
        )}
      </div>

      <div className="flex items-center gap-2 min-w-[160px] border border-gray-200 rounded-xl
                      px-3 py-2 focus-within:border-[#E8622A] transition-colors">
        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ville, région..."
          className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
        />
      </div>

      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2
                      focus-within:border-[#E8622A] transition-colors">
        <SlidersHorizontal size={14} className="text-gray-400 flex-shrink-0" />
        <select
          value={contractType}
          onChange={(e) => setContractType(e.target.value)}
          className="text-sm text-gray-700 outline-none bg-transparent appearance-none cursor-pointer"
        >
          <option value="">Tous les contrats</option>
          {['CDI', 'CDD', 'CDD Saisonnier', 'Alternance', 'Stage', 'Freelance'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {hasFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400
                       hover:text-gray-600 transition-colors"
          >
            <RotateCcw size={12} /> Réinitialiser
          </button>
        )}
        <span className="text-sm font-bold text-gray-500">
          {loading
            ? <span className="inline-block w-8 h-4 bg-gray-200 rounded animate-pulse" />
            : <><span className="text-[#1E2A3A]">{total}</span> offre{total > 1 ? 's' : ''}</>
          }
        </span>
      </div>
    </div>
  );
}
