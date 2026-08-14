'use client';
// src/components/emploi/entreprises/CompanyFilterSidebar.tsx
import {
  SlidersHorizontal, X, RotateCcw, Check, Zap, Star, Briefcase,
} from 'lucide-react';
import { SECTOR_ICONS } from '@/data/entreprisesPageConfig';
import { SECTOR_DEFS } from '@/lib/sectors';
import { COMPANY_SIZES } from '@/data/entreprisesPageConfig';
import { EMPTY_COMPANY_FILTERS, type CompanyFilterState } from './types';

export default function CompanyFilterSidebar({
  filters, setFilters, onClose,
}: {
  filters: CompanyFilterState;
  setFilters: (f: CompanyFilterState) => void;
  onClose?: () => void;
}) {
  const hasActive = filters.sectors.length || filters.sizes.length || filters.hasOffres
    || filters.isPremium || filters.isRecruiting || filters.minRating;

  function toggleArr<K extends 'sectors' | 'sizes'>(key: K, val: string) {
    const arr = filters[key] as string[];
    setFilters({ ...filters, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] });
  }

  return (
    <aside className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-gray-500" />
          <span className="font-bold text-gray-800 text-sm">Filtres</span>
          {hasActive && (
            <span className="w-5 h-5 bg-[#E8622A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {[filters.sectors.length, filters.sizes.length, +filters.hasOffres, +filters.isPremium, +filters.isRecruiting, +(filters.minRating !== null)].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActive && (
            <button onClick={() => setFilters(EMPTY_COMPANY_FILTERS)}
                    className="text-[11px] font-semibold text-[#E8622A] hover:underline flex items-center gap-1">
              <RotateCcw size={10} /> Tout effacer
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Statut</p>
          {[
            { key: 'isRecruiting', label: 'Recrute activement', icon: <Zap size={12} className="text-[#E8622A]" /> },
            { key: 'isPremium', label: 'Entreprise Premium', icon: <Star size={12} className="text-amber-500" /> },
            { key: 'hasOffres', label: 'Avec offres ouvertes', icon: <Briefcase size={12} className="text-blue-500" /> },
          ].map(({ key, label, icon }) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer py-1 group">
              <div
                onClick={() => setFilters({ ...filters, [key]: !filters[key as keyof CompanyFilterState] })}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition
                  ${filters[key as keyof CompanyFilterState] ? 'bg-[#E8622A] border-[#E8622A]' : 'border-gray-300 group-hover:border-[#E8622A]'}`}
              >
                {filters[key as keyof CompanyFilterState] && <Check size={9} className="text-white" strokeWidth={3} />}
              </div>
              <span className="flex items-center gap-1.5 text-sm text-gray-600 group-hover:text-gray-900">
                {icon} {label}
              </span>
            </label>
          ))}
        </div>

        <div className="h-px bg-gray-100" />

        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Secteur</p>
          {SECTOR_DEFS.map((s) => (
            <label key={s.key} className="flex items-center gap-2.5 cursor-pointer py-0.5 group">
              <div
                onClick={() => toggleArr('sectors', s.key)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition
                  ${filters.sectors.includes(s.key) ? 'bg-[#E8622A] border-[#E8622A]' : 'border-gray-300 group-hover:border-[#E8622A]'}`}
              >
                {filters.sectors.includes(s.key) && <Check size={9} className="text-white" strokeWidth={3} />}
              </div>
              <span className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-900">
                <span className="text-gray-400">{SECTOR_ICONS[s.key]}</span>
                {s.label}
              </span>
            </label>
          ))}
        </div>

        <div className="h-px bg-gray-100" />

        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Taille</p>
          {COMPANY_SIZES.slice(1).map((s) => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer py-0.5 group">
              <div
                onClick={() => toggleArr('sizes', s)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition
                  ${filters.sizes.includes(s) ? 'bg-[#E8622A] border-[#E8622A]' : 'border-gray-300 group-hover:border-[#E8622A]'}`}
              >
                {filters.sizes.includes(s) && <Check size={9} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{s}</span>
            </label>
          ))}
        </div>

        <div className="h-px bg-gray-100" />

        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Note minimale</p>
          <div className="flex gap-1.5 flex-wrap">
            {[null, 4, 4.5, 4.8].map((r) => (
              <button
                key={String(r)}
                onClick={() => setFilters({ ...filters, minRating: r })}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition ${
                  filters.minRating === r ? 'bg-[#E8622A] border-[#E8622A] text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {r === null ? 'Toutes' : `≥ ${r} ⭐`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
