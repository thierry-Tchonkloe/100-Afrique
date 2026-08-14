'use client';
// src/components/emploi/jobs/JobsSidebar.tsx
import { Search, MapPin, RotateCcw, X } from 'lucide-react';
import { FilterSection, CheckItem } from './FilterPrimitives';
import {
  type JobsFilters, EMPTY_JOBS_FILTERS, CONTRACT_OPTIONS, REMOTE_OPTIONS,
  EXPERIENCE_OPTIONS, ADVANTAGE_OPTIONS,
} from './JobsFilterTypes';

export default function JobsSidebar({
  filters, setFilters, onClose,
}: {
  filters: JobsFilters;
  setFilters: React.Dispatch<React.SetStateAction<JobsFilters>>;
  onClose?: () => void;
}) {
  function toggle(key: keyof JobsFilters, val: string) {
    setFilters((f) => {
      const arr = f[key] as string[];
      return { ...f, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  }

  const hasFilters = filters.contractTypes.length > 0 || filters.remote.length > 0
    || filters.sectors.length > 0 || filters.experience.length > 0 || filters.advantages.length > 0;

  return (
    <aside className="w-full bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
        <h2 className="font-bold text-gray-800 text-sm">Filtres</h2>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button onClick={() => setFilters(EMPTY_JOBS_FILTERS)} className="text-xs font-semibold text-[#E8622A] hover:underline flex items-center gap-1">
              <RotateCcw size={11} /> Réinitialiser
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <FilterSection title="Recherche">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Métier, entreprise..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition" />
        </div>
      </FilterSection>

      <FilterSection title="Localisation">
        <div className="relative mb-2">
          <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={filters.location} onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
            placeholder="Ville, région..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition" />
        </div>
        <select value={filters.radius} onChange={(e) => setFilters((f) => ({ ...f, radius: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#E8622A] transition appearance-none bg-white">
          {['10', '20', '50', '100'].map((r) => <option key={r} value={r}>Rayon {r} km</option>)}
        </select>
      </FilterSection>

      <FilterSection title="Type de contrat">
        {CONTRACT_OPTIONS.map((c) => (
          <CheckItem key={c} label={c} checked={filters.contractTypes.includes(c)} onChange={() => toggle('contractTypes', c)} />
        ))}
      </FilterSection>

      <FilterSection title="Télétravail">
        {REMOTE_OPTIONS.map(({ value, label }) => (
          <CheckItem key={value} label={label} checked={filters.remote.includes(value)} onChange={() => toggle('remote', value)} />
        ))}
      </FilterSection>

      <FilterSection title="Niveau d'expérience" defaultOpen={false}>
        {EXPERIENCE_OPTIONS.map((e) => (
          <CheckItem key={e} label={e} checked={filters.experience.includes(e)} onChange={() => toggle('experience', e)} />
        ))}
      </FilterSection>

      <FilterSection title="Avantages" defaultOpen={false}>
        {ADVANTAGE_OPTIONS.map((a) => (
          <CheckItem key={a} label={a} checked={filters.advantages.includes(a)} onChange={() => toggle('advantages', a)} />
        ))}
      </FilterSection>
    </aside>
  );
}
