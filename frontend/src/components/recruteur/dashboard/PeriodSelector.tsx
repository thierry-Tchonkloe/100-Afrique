'use client';
// src/components/recruteur/dashboard/PeriodSelector.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { DashboardPeriod } from '@/types/recruteur.types';
import { PERIOD_LABELS } from '@/types/recruteur.types';

export default function PeriodSelector({
  period, setPeriod,
}: { period: DashboardPeriod; setPeriod: (p: DashboardPeriod) => void }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setShowMenu((v) => !v)}
        className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
        {PERIOD_LABELS[period]} <ChevronDown size={15} className="text-gray-400" />
      </button>
      {showMenu && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 py-1 min-w-44 overflow-hidden">
          {(Object.entries(PERIOD_LABELS) as [DashboardPeriod, string][]).map(([k, v]) => (
            <button key={k} onClick={() => { setPeriod(k); setShowMenu(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${k === period ? 'font-semibold text-[#E8622A]' : 'text-gray-700'}`}>
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
