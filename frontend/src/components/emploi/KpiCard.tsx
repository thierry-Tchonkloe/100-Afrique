// src/components/emploi/KpiCard.tsx
import { type ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  iconBg: string;
}

export default function KpiCard({ label, value, icon, iconBg }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between gap-4 shadow-sm">
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}