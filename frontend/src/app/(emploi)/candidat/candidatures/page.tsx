'use client';
// src/app/(emploi)/candidat/candidatures/page.tsx

import { useState } from 'react';
import { useCandidatures } from '@/hooks/useCandidatures';
import { useCandidaturesFilter } from '@/hooks/useCandidaturesFilter';
import CandidaturesKpiRow from '@/components/candidat/candidatures/CandidaturesKpiRow';
import CandidaturesFiltersBar from '@/components/candidat/candidatures/CandidaturesFiltersBar';
import CandidaturesList from '@/components/candidat/candidatures/CandidaturesList';
import ApplicationDrawer from '@/components/candidat/candidatures/ApplicationDrawer';
import type { Application, FilterTab } from '@/types/candidatures.types';

export default function MesCandidaturesPage() {
  const { data, loading, refetch } = useCandidatures();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<FilterTab>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filtered = useCandidaturesFilter(data, search, tab);

  function handleWithdrawn(id: string) {
    refetch();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Chargement des candidatures…</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Suivi de mes candidatures</h1>
      </div>

      <CandidaturesKpiRow stats={data.stats} />

      <CandidaturesFiltersBar search={search} setSearch={setSearch} tab={tab} setTab={setTab} />

      <CandidaturesList applications={filtered} onSelect={setSelectedApp} />

      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {filtered.length} candidature{filtered.length > 1 ? 's' : ''}
        </p>
      )}

      <ApplicationDrawer
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        onWithdrawn={handleWithdrawn}
      />
    </div>
  );
}
