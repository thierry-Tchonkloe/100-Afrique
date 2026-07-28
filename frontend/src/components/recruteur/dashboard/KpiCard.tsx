// src/components/recruteur/dashboard/KpiCard.tsx
import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  evol?: number;
  evolLabel?: string;
  icon: ReactNode;
  iconBg: string;
  suffix?: string;
}

export default function KpiCard({ label, value, evol, evolLabel, icon, iconBg, suffix }: KpiCardProps) {
  const positive = evol !== undefined && evol >= 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
        {evol !== undefined && (
          <span className={`text-xs font-semibold ${positive ? 'text-green-500' : 'text-red-400'}`}>
            {positive ? '+' : ''}{evol}%
          </span>
        )}
        {evolLabel && <span className="text-xs text-gray-400">{evolLabel}</span>}
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {value}
        {suffix && <span className="text-sm font-medium text-gray-500 ml-0.5">{suffix}</span>}
      </p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}