// src/components/candidat/dashboard/RecentApplicationsCard.tsx
import Link from 'next/link';
import SectorIcon from './SectorIcon';
import StatusBadge from './StatusBadge';
import { timeAgo } from '@/utils/date';
import type { RecentApplicationSummary } from '@/types/emploi.types';

interface RecentApplicationsCardProps {
  applications: RecentApplicationSummary[];
}

export default function RecentApplicationsCard({ applications }: RecentApplicationsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h2 className="font-semibold text-gray-800 text-sm">Candidatures Récentes</h2>
        <Link href="/candidat/candidatures" className="text-xs font-semibold text-[#E8622A] hover:underline">
          Voir toutes
        </Link>
      </div>

      <div className="divide-y divide-gray-50">
        {applications.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Aucune candidature pour le moment.</p>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
              <SectorIcon sector={app.sector} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{app.jobTitle}</p>
                <p className="text-xs text-gray-500 truncate">{app.companyName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{timeAgo(app.appliedAt)}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}