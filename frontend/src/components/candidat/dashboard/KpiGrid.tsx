// src/components/candidat/dashboard/KpiGrid.tsx
import { Send, Eye, Bookmark, Bell } from 'lucide-react';
import KpiCard from './KpiCard';
import type { CandidatStats } from '@/types/emploi.types';

interface KpiGridProps {
  stats: CandidatStats;
}

export default function KpiGrid({ stats }: KpiGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        label="Candidatures envoyées"
        value={stats.applicationsCount}
        iconBg="bg-blue-50"
        icon={<Send size={18} className="text-blue-500" />}
      />
      <KpiCard
        label="Vues du profil"
        value={stats.profileViews}
        iconBg="bg-teal-50"
        icon={<Eye size={18} className="text-teal-500" />}
      />
      <KpiCard
        label="Offres enregistrées"
        value={stats.savedJobsCount}
        iconBg="bg-purple-50"
        icon={<Bookmark size={18} className="text-purple-500" />}
      />
      <KpiCard
        label="Alertes actives"
        value={stats.activeAlertsCount}
        iconBg="bg-[#FFF3EC]"
        icon={<Bell size={18} className="text-[#E8622A]" />}
      />
    </div>
  );
}