'use client';
// src/components/emploi/entreprises/ActiveCompanyFilterChips.tsx
import { X } from 'lucide-react';
import { SECTOR_DEFS } from '@/lib/sectors';
import type { CompanyFilterState } from './types';

export default function ActiveCompanyFilterChips({
  filters, setFilters,
}: {
  filters: CompanyFilterState;
  setFilters: (f: CompanyFilterState) => void;
}) {
  const hasAny = filters.sectors.length > 0 || filters.isPremium || filters.isRecruiting || filters.hasOffres || filters.minRating !== null;
  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.sectors.map((key) => {
        const def = SECTOR_DEFS.find((s) => s.key === key);
        return (
          <span key={key} className="flex items-center gap-1 text-xs font-medium text-[#E8622A]
                                   bg-white border border-[#E8622A]/30 px-2.5 py-1 rounded-full">
            {def?.label ?? key}
            <button onClick={() => setFilters({ ...filters, sectors: filters.sectors.filter((x) => x !== key) })}>
              <X size={10} />
            </button>
          </span>
        );
      })}
      {filters.isRecruiting && (
        <span className="flex items-center gap-1 text-xs font-medium text-[#E8622A]
                         bg-white border border-[#E8622A]/30 px-2.5 py-1 rounded-full">
          Recrute activement <button onClick={() => setFilters({ ...filters, isRecruiting: false })}><X size={10} /></button>
        </span>
      )}
      {filters.isPremium && (
        <span className="flex items-center gap-1 text-xs font-medium text-[#E8622A]
                         bg-white border border-[#E8622A]/30 px-2.5 py-1 rounded-full">
          Premium <button onClick={() => setFilters({ ...filters, isPremium: false })}><X size={10} /></button>
        </span>
      )}
      {filters.minRating !== null && (
        <span className="flex items-center gap-1 text-xs font-medium text-[#E8622A]
                         bg-white border border-[#E8622A]/30 px-2.5 py-1 rounded-full">
          ≥ {filters.minRating} ⭐ <button onClick={() => setFilters({ ...filters, minRating: null })}><X size={10} /></button>
        </span>
      )}
    </div>
  );
}
