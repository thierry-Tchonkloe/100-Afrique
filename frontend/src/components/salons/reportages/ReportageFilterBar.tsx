// src/components/salons/reportages/ReportageFilterBar.tsx
"use client";
import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import type { ReportageFilterState } from './reportageUtils';

interface ReportageFilterBarProps {
  filters: ReportageFilterState;
  onChange: (f: ReportageFilterState) => void;
  disabled: boolean;
}

const FILTER_GROUPS: {
  key: keyof ReportageFilterState;
  label: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: 'year',
    label: 'Année',
    options: [
      { value: 'all', label: 'Toutes les années' },
      { value: '2026', label: '2026' },
      { value: '2025', label: '2025' },
      { value: '2024', label: '2024' },
      { value: '2023', label: '2023' },
    ],
  },
  {
    key: 'region',
    label: 'Région',
    options: [
      { value: 'all', label: 'Toutes les régions' },
      { value: 'afrique', label: 'Afrique' },
      { value: 'europe', label: 'Europe' },
      { value: 'ameriques', label: 'Amériques' },
      { value: 'asie-pacifique', label: 'Asie-Pacifique' },
      { value: 'moyen-orient', label: 'Moyen-Orient' },
    ],
  },
  {
    key: 'type',
    label: 'Format',
    options: [
      { value: 'all', label: 'Tous les formats' },
      { value: 'article', label: 'Articles' },
      { value: 'video', label: 'Vidéos' },
      { value: 'interview', label: 'Interviews' },
    ],
  },
];

const selectBase =
  'appearance-none bg-transparent border-0 text-sm font-semibold outline-none cursor-pointer pr-6 pl-1 py-0 transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const ReportageFilterBar = ({ filters, onChange, disabled }: ReportageFilterBarProps) => {
  const hasActive = filters.year !== 'all' || filters.region !== 'all' || filters.type !== 'all';

  return (
    <div
      className="flex flex-wrap items-center gap-2 px-4 py-3 rounded-2xl border border-gray-100"
      style={{ background: '#F7F9F8' }}
    >
      <div className="flex items-center gap-2 mr-1 shrink-0">
        <SlidersHorizontal size={14} style={{ color: '#1A5C43' }} />
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 hidden sm:block">
          Filtrer
        </span>
      </div>

      <div className="h-5 w-px bg-gray-200 hidden sm:block" />

      {FILTER_GROUPS.map((f, i) => {
        const value = filters[f.key];
        return (
          <React.Fragment key={f.key}>
            {i > 0 && <div className="h-5 w-px bg-gray-200" />}
            <div className="relative flex items-center gap-1.5 px-2 py-1.5 rounded-xl transition-colors hover:bg-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 shrink-0 hidden md:block">
                {f.label} :
              </span>
              <div className="relative">
                <select
                  value={value}
                  onChange={(e) => onChange({ ...filters, [f.key]: e.target.value })}
                  disabled={disabled}
                  className={selectBase}
                  style={{ color: value !== 'all' ? '#1A5C43' : '#374151' }}
                >
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: value !== 'all' ? '#1A5C43' : '#9CA3AF' }}
                />
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {hasActive && (
        <>
          <div className="h-5 w-px bg-gray-200" />
          <button
            onClick={() => onChange({ year: 'all', region: 'all', type: 'all' })}
            disabled={disabled}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ color: '#B85C38', background: 'rgba(184,92,56,0.08)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(184,92,56,0.16)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(184,92,56,0.08)')}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#B85C38' }} />
            Réinitialiser
          </button>
        </>
      )}
    </div>
  );
};

export default ReportageFilterBar;