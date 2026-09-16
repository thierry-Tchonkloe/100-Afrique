'use client';
// src/components/emploi/jobs/ActiveJobsFilterChips.tsx
import { X } from 'lucide-react';
import { REMOTE_OPTIONS, type JobsFilters } from './JobsFilterTypes';

export default function ActiveJobsFilterChips({
  filters, setFilters,
}: {
  filters: JobsFilters;
  setFilters: React.Dispatch<React.SetStateAction<JobsFilters>>;
}) {
  const chips = [
    ...filters.contractTypes,
    ...filters.remote.map((r) => REMOTE_OPTIONS.find((o) => o.value === r)?.label ?? r),
    ...filters.experience,
    ...filters.advantages,
  ];

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((f) => (
        <span key={f} className="flex items-center gap-1 bg-white border border-[#E8622A]/30 text-[#E8622A] text-xs font-medium px-2.5 py-1 rounded-full">
          {f}
          <button onClick={() => setFilters((prev) => ({
            ...prev,
            contractTypes: prev.contractTypes.filter((x) => x !== f),
            remote: prev.remote.filter((x) => (REMOTE_OPTIONS.find((o) => o.value === x)?.label ?? x) !== f),
            experience: prev.experience.filter((x) => x !== f),
            advantages: prev.advantages.filter((x) => x !== f),
          }))}>
            <X size={10} />
          </button>
        </span>
      ))}
      <button onClick={() => setFilters({ ...filters, contractTypes: [], remote: [], experience: [], advantages: [] })}
        className="text-xs text-gray-400 hover:text-gray-600 underline">
        Effacer tout
      </button>
    </div>
  );
}
