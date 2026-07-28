// src/app/(emploi)/candidat/dashboard/page.tsx
'use client';

import { useCandidatDashboard } from '@/hooks/useCandidatDashboard';
import DashboardHeader from '@/components/candidat/dashboard/DashboardHeader';
import ProfileStrengthCard from '@/components/candidat/dashboard/ProfileStrengthCard';
import KpiGrid from '@/components/candidat/dashboard/KpiGrid';
import RecentApplicationsCard from '@/components/candidat/dashboard/RecentApplicationsCard';
import NotificationsCard from '@/components/candidat/dashboard/NotificationsCard';
import SuggestionsSection from '@/components/candidat/dashboard/SuggestionsSection';

function DashboardLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-[#E8622A] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Chargement du tableau de bord…</p>
      </div>
    </div>
  );
}

function DashboardError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <p className="text-sm text-gray-500 text-center max-w-sm">{message}</p>
    </div>
  );
}

export default function CandidatDashboardPage() {
  const { data, loading, error } = useCandidatDashboard();

  if (loading) return <DashboardLoader />;
  if (error) return <DashboardError message={error} />;
  if (!data?.profile) return null;

  const {
    profile,
    stats = { applicationsCount: 0, profileViews: 0, savedJobsCount: 0, activeAlertsCount: 0 },
    recentApplications = [],
    suggestions = [],
    notifications = [],
  } = data;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <DashboardHeader firstName={profile.firstName} />

      <ProfileStrengthCard percentage={profile.profileStrength} message={profile.profileStrengthMessage} />

      <KpiGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <RecentApplicationsCard applications={recentApplications} />
        <NotificationsCard notifications={notifications} />
      </div>

      <SuggestionsSection suggestions={suggestions} sector={profile.sector} />
    </div>
  );
}
