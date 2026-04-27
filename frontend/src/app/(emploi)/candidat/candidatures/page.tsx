'use client';

import { useState, useMemo } from 'react';
import { Send, Clock, CalendarCheck, Search } from 'lucide-react';
import { useCandidatures } from '@/hooks/useCandidatures';
import KpiCard from '@/components/candidat/dashboard/KpiCard';
import ApplicationRow from '@/components/candidat/candidatures/ApplicationRow';
import ApplicationDrawer from '@/components/candidat/candidatures/ApplicationDrawer';
import type { Application, FilterTab } from '@/types/candidatures.types';
import clsx from 'clsx';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',      label: 'Toutes' },
  { key: 'active',   label: 'Actives' },
  { key: 'archived', label: 'Archives' },
];

const ACTIVE_STATUSES = new Set(['sent', 'viewed', 'in_progress', 'selected', 'interview', 'accepted']);
const ARCHIVED_STATUSES = new Set(['refused', 'archived']);

export default function MesCandidaturesPage() {
  const { data, loading, refetch } = useCandidatures();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<FilterTab>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.applications.filter((app) => {
      const matchSearch =
        !search ||
        app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        app.companyName.toLowerCase().includes(search.toLowerCase());

      const matchTab =
        tab === 'all' ||
        (tab === 'active' && ACTIVE_STATUSES.has(app.status)) ||
        (tab === 'archived' && ARCHIVED_STATUSES.has(app.status));

      return matchSearch && matchTab;
    });
  }, [data, search, tab]);

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

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Suivi de mes candidatures</h1>
      </div>

      {/* ── KPI Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KpiCard
          label="Total des envois"
          value={data.stats.total}
          iconBg="bg-blue-50"
          icon={<Send size={18} className="text-blue-500" />}
        />
        <KpiCard
          label="Candidatures en cours"
          value={data.stats.inProgress}
          iconBg="bg-orange-50"
          icon={<Clock size={18} className="text-orange-500" />}
        />
        <KpiCard
          label="Entretiens programmés"
          value={data.stats.interviews}
          iconBg="bg-green-50"
          icon={<CalendarCheck size={18} className="text-green-500" />}
        />
      </div>

      {/* ── Filters Row ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par entreprise…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
          />
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 ml-auto">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={clsx(
                'px-4 py-1.5 text-sm font-semibold rounded-lg transition-all',
                tab === key
                  ? 'bg-[#E8622A] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Applications List ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
              <Send size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">Aucune candidature trouvée</p>
            <p className="text-xs text-gray-400 mt-1">Modifiez vos filtres ou commencez à postuler.</p>
          </div>
        ) : (
          <div>
            {filtered.map((app) => (
              <ApplicationRow
                key={app.id}
                application={app}
                onClick={() => setSelectedApp(app)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Count */}
      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {filtered.length} candidature{filtered.length > 1 ? 's' : ''}
        </p>
      )}

      {/* ── Detail Drawer ─────────────────────────────────────────────────── */}
      <ApplicationDrawer
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        onWithdrawn={handleWithdrawn}
      />
    </div>
  );
}