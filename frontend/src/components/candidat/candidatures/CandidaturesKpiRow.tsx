// src/components/candidat/candidatures/CandidaturesKpiRow.tsx
import { Send, Clock, CalendarCheck } from 'lucide-react';
import KpiCard from '@/components/candidat/dashboard/KpiCard';

export default function CandidaturesKpiRow({
  stats,
}: { stats: { total: number; inProgress: number; interviews: number } }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <KpiCard
        label="Total des envois"
        value={stats.total}
        iconBg="bg-blue-50"
        icon={<Send size={18} className="text-blue-500" />}
      />
      <KpiCard
        label="Candidatures en cours"
        value={stats.inProgress}
        iconBg="bg-orange-50"
        icon={<Clock size={18} className="text-orange-500" />}
      />
      <KpiCard
        label="Entretiens programmés"
        value={stats.interviews}
        iconBg="bg-green-50"
        icon={<CalendarCheck size={18} className="text-green-500" />}
      />
    </div>
  );
}
