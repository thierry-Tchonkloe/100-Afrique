'use client';
// src/components/recruteur/offres/OffresTabs.tsx
import clsx from 'clsx';
import type { OffreTab } from '@/types/offres.types';

const TABS: { key: OffreTab; label: string; statKey: 'online' | 'drafts' | 'archives' }[] = [
  { key: 'online', label: 'En ligne', statKey: 'online' },
  { key: 'drafts', label: 'Brouillons', statKey: 'drafts' },
  { key: 'archives', label: 'Archives', statKey: 'archives' },
];

export default function OffresTabs({
  tab, setTab, stats,
}: {
  tab: OffreTab;
  setTab: (t: OffreTab) => void;
  stats?: Record<'online' | 'drafts' | 'archives', number>;
}) {
  return (
    <div className="flex items-center gap-0 border-b border-gray-200">
      {TABS.map(({ key, label, statKey }) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          className={clsx(
            'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px',
            tab === key ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-gray-500 hover:text-gray-700',
          )}
        >
          {label}
          {stats && (
            <span className={clsx(
              'text-xs font-bold px-1.5 py-0.5 rounded-full',
              tab === key ? 'bg-[#FFF3EC] text-[#E8622A]' : 'bg-gray-100 text-gray-500',
            )}>
              {stats[statKey]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
