// src/components/emploi/entreprise-detail/CompanyKpiBar.tsx
import { KPI_ICONS } from '@/types/vitrine.types';
import type { PublicCompanyDetail } from '@/services/emploi-public.service';

export default function CompanyKpiBar({ kpis }: { kpis: PublicCompanyDetail['kpis'] }) {
  if (!kpis || kpis.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {kpis.map((kpi) => {
            const emoji = KPI_ICONS.find((i) => i.key === kpi.icon)?.emoji ?? '📊';
            return (
              <div key={kpi.id} className="text-center">
                <div className="flex justify-center mb-1 text-2xl">{emoji}</div>
                <p className="text-xl font-extrabold text-[#1E2A3A]">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
