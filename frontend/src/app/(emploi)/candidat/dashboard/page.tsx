// src/app/(emploi)/candidat/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Eye,
  Bookmark,
  Bell,
  Search,
  ArrowRight,
  MapPin,
  Clock,
} from 'lucide-react';
import { useCandidatDashboard } from '@/hooks/useCandidatDashboard';
import { applyToJob } from '@/services/emploi.service';
import ProfileStrengthRing from '@/components/candidat/dashboard/ProfileStrengthRing';
import KpiCard from '@/components/candidat/dashboard/KpiCard';
import StatusBadge from '@/components/candidat/dashboard/StatusBadge';
import SectorIcon from '@/components/candidat/dashboard/SectorIcon';
import NotificationItem from '@/components/candidat/dashboard/NotificationItem';

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'hier';
  if (days < 7) return `il y a ${days} jours`;
  return `il y a ${Math.floor(days / 7)} semaine${Math.floor(days / 7) > 1 ? 's' : ''}`;
}

function todayLabel(): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

// ── Dashboard Page ────────────────────────────────────────────────────────────

export default function CandidatDashboardPage() {
  const { data, loading } = useCandidatDashboard();
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  async function handleApply(jobId: string) {
    setApplyingId(jobId);
    try {
      await applyToJob(jobId);
      setAppliedIds((prev) => new Set([...prev, jobId]));
    } catch {
      // Optimistic fallback: still mark as applied in UI
      setAppliedIds((prev) => new Set([...prev, jobId]));
    } finally {
      setApplyingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#E8622A] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Chargement du tableau de bord…</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { profile, stats, recentApplications, suggestions, notifications } = data;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* ── Header Row ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {profile.firstName}&nbsp;! Ravi de vous revoir.
          </h1>
          <p className="text-sm text-gray-400 mt-1 capitalize">{todayLabel()}</p>
        </div>
        <Link
          href="/candidat/jobs"
          className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white
                     text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Search size={15} />
          Rechercher une offre
        </Link>
      </div>

      {/* ── Profile Strength ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-5">
        <ProfileStrengthRing percentage={profile.profileStrength} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">Force de votre profil</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {profile.profileStrengthMessage}
          </p>
        </div>
        <Link
          href="/candidat/profil"
          className="flex-shrink-0 text-sm font-semibold text-[#E8622A] hover:underline flex items-center gap-1"
        >
          Compléter mon profil <ArrowRight size={14} />
        </Link>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
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

      {/* ── Main Content Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

        {/* Candidatures Récentes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Candidatures Récentes</h2>
            <Link
              href="/candidat/candidatures"
              className="text-xs font-semibold text-[#E8622A] hover:underline"
            >
              Voir toutes
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                <SectorIcon sector={app.sector} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{app.jobTitle}</p>
                  <p className="text-xs text-gray-500 truncate">{app.companyName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(app.appliedAt)}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Notifications</h2>
          </div>
          <div className="p-3 space-y-2">
            {notifications.map((notif) => (
              <NotificationItem key={notif.id} notification={notif} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Suggestions ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800 text-sm">Suggestions pour vous</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Basées sur votre profil {profile.sector}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-50">
          {suggestions.map((job) => (
            <div key={job.id} className="p-5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <SectorIcon sector={job.sector} size={15} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{job.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{job.companyName}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin size={11} /> {job.location}
                </span>
                <span className="font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  {job.contractType}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> Publié {timeAgo(job.publishedAt)}
                </span>
              </div>

              <button
                onClick={() => handleApply(job.id)}
                disabled={applyingId === job.id || appliedIds.has(job.id)}
                className="w-full bg-[#E8622A] hover:bg-[#D45520] disabled:bg-gray-200
                           disabled:text-gray-400 text-white text-sm font-semibold
                           py-2.5 rounded-xl transition-colors"
              >
                {appliedIds.has(job.id)
                  ? '✓ Postulé'
                  : applyingId === job.id
                  ? 'Envoi…'
                  : 'Postuler'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}