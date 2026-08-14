'use client';
// src/app/(emploi)/recruteur/dashboard/page.tsx
// Page fine : orchestre les hooks/services et délègue chaque bloc visuel
// (graphiques, listes, KPIs) à un composant dédié sous
// src/components/recruteur/dashboard/*.

import { useRecruteurDashboard } from '@/hooks/useRecruteurDashboard';
import { toggleCandidatureStar } from '@/services/recruteur.service';
import { Eye, Users, Briefcase, TrendingUp } from 'lucide-react';
import KpiCard from '@/components/recruteur/dashboard/KpiCard';
import PeriodSelector from '@/components/recruteur/dashboard/PeriodSelector';
import EvolutionChart from '@/components/recruteur/dashboard/EvolutionChart';
import MetierPieChart from '@/components/recruteur/dashboard/MetierPieChart';
import RecentCandidaturesCard from '@/components/recruteur/dashboard/RecentCandidaturesCard';
import VitrineHealthCard from '@/components/recruteur/dashboard/VitrineHealthCard';
import { formatBig } from '@/utils/format';
import { PERIOD_LABELS } from '@/types/recruteur.types';

export default function RecruteurDashboardPage() {
  const { data, loading, period, setPeriod, setData } = useRecruteurDashboard();

  async function handleStar(id: string, current: boolean) {
    setData((prev) => prev ? {
      ...prev,
      recentCandidatures: prev.recentCandidatures.map((c) => (c.id === id ? { ...c, starred: !current } : c)),
    } : prev);
    try {
      await toggleCandidatureStar(id, !current);
    } catch {
      setData((prev) => prev ? {
        ...prev,
        recentCandidatures: prev.recentCandidatures.map((c) => (c.id === id ? { ...c, starred: current } : c)),
      } : prev);
    }
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, chartData, metierParts, recentCandidatures, vitrineHealth, profile } = data;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour,&nbsp;{profile.firstName}&nbsp;! Voici l'état de vos recrutements.
          </h1>
          <p className="text-sm text-gray-400 mt-1">Période : {PERIOD_LABELS[period]}</p>
        </div>
        <PeriodSelector period={period} setPeriod={setPeriod} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Portée Globale" value={formatBig(stats.porteeGlobale)} evol={stats.porteeEvolution || undefined}
          icon={<Eye size={18} className="text-blue-500" />} iconBg="bg-blue-50" />
        <KpiCard label="Candidatures" value={stats.candidatures} evol={stats.candidaturesEvol || undefined}
          icon={<Users size={18} className="text-orange-500" />} iconBg="bg-orange-50" />
        <KpiCard label="Offres Actives" value={stats.offresActives} evolLabel="Actuel"
          icon={<Briefcase size={18} className="text-green-500" />} iconBg="bg-green-50" />
        <KpiCard label="Taux de Conversion" value={stats.tauxConversion.toFixed(2)} suffix="%" evol={stats.tauxConversionEvol || undefined}
          icon={<TrendingUp size={18} className="text-purple-500" />} iconBg="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        <EvolutionChart chartData={chartData} />
        <MetierPieChart metierParts={metierParts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        <RecentCandidaturesCard candidatures={recentCandidatures} onToggleStar={handleStar} />
        <VitrineHealthCard vitrineHealth={vitrineHealth} />
      </div>
    </div>
  );
}
