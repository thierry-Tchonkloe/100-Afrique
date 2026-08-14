'use client';
// src/components/recruteur/candidatures/CandidaturesTabs.tsx
import clsx from 'clsx';
import type { CandidatureRecStatus } from '@/types/candidatures-rec.types';

export type TabKey = CandidatureRecStatus | 'all';

const TABS: { key: TabKey; labelFn: (stats: Record<string, number>) => string }[] = [
  { key: 'new', labelFn: (s) => `Nouveaux (${s.new ?? 0})` },
  { key: 'in_progress', labelFn: (s) => `En cours (${s.in_progress ?? 0})` },
  { key: 'interview', labelFn: (s) => `Entretiens (${s.interview ?? 0})` },
  { key: 'favorite', labelFn: (s) => `Favoris (${s.favorite ?? 0})` },
  { key: 'refused', labelFn: (s) => `Refusés (${s.refused ?? 0})` },
];

export default function CandidaturesTabs({
  activeTab, setActiveTab, stats,
}: {
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
  stats: Record<string, number>;
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 flex-shrink-0">
      <div className="flex items-center gap-0 overflow-x-auto">
        {TABS.map(({ key, labelFn }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={clsx(
              'px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition -mb-px',
              activeTab === key ? 'border-[#E8622A] text-[#E8622A] bg-[#FFF3EC]/50' : 'border-transparent text-gray-500 hover:text-gray-700',
            )}>
            {labelFn(stats)}
          </button>
        ))}
      </div>
    </div>
  );
}
