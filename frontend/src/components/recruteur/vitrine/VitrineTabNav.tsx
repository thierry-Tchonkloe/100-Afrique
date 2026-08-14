'use client';
// src/components/recruteur/vitrine/VitrineTabNav.tsx
import clsx from 'clsx';
import type { VitrineTab } from '@/types/vitrine.types';
import { VITRINE_TABS } from '@/types/vitrine.types';

export default function VitrineTabNav({
  activeTab, onNavigate,
}: { activeTab: VitrineTab; onNavigate: (id: string) => void }) {
  const tabs = [...VITRINE_TABS, { key: 'reseaux' as VitrineTab, label: 'Réseaux Sociaux' }];

  return (
    <div className="sticky top-[57px] z-10 bg-white border-b border-gray-200 px-6">
      <div className="flex items-center gap-0 overflow-x-auto">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={clsx(
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition -mb-px',
              activeTab === key ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
