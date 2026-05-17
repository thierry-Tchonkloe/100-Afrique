// src/app/(recruteur)/recruteur/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Users, Briefcase, TrendingUp, Star, ChevronDown, ArrowRight } from 'lucide-react';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useRecruteurDashboard } from '@/hooks/useRecruteurDashboard';
import { toggleCandidatureStar } from '@/services/recruteur.service';
import type { DashboardPeriod } from '@/types/recruteur.types';
import { PERIOD_LABELS } from '@/types/recruteur.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  if (h < 1) return 'il y a < 1h';
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

function formatBig(n: number): string {
  if (n === 0) return '0';
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n);
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string | number;
  evol?: number;
  evolLabel?: string;
  icon: React.ReactNode;
  iconBg: string;
  suffix?: string;
}

function KpiCard({ label, value, evol, evolLabel, icon, iconBg, suffix }: KpiCardProps) {
  const positive = evol !== undefined && evol >= 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        {evol !== undefined && (
          <span className={`text-xs font-semibold ${positive ? 'text-green-500' : 'text-red-400'}`}>
            {positive ? '+' : ''}{evol}%
          </span>
        )}
        {evolLabel && <span className="text-xs text-gray-400">{evolLabel}</span>}
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {value}
        {suffix && <span className="text-sm font-medium text-gray-500 ml-0.5">{suffix}</span>}
      </p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, src }: { name: string; src?: string }) {
  const initials = name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  const colors   = ['bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'];
  const color    = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      className={`w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center ${
        src ? '' : color
      }`}
    >
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover" />
        : <span className="text-white text-xs font-bold">{initials}</span>}
    </div>
  );
}

// ── Completion ring ───────────────────────────────────────────────────────────
function CompletionRing({ pct }: { pct: number }) {
  const r    = 42;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#F3F4F6" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke="#E8622A" strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={circ - (pct / 100) * circ}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{pct}%</span>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-bold text-[#E8622A]">{payload[0].value} candidature{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  );
}

// ── Empty state pour les graphiques ──────────────────────────────────────────
function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-[180px]">
      <p className="text-xs text-gray-400 text-center">{message}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RecruteurDashboardPage() {
  const { data, loading, period, setPeriod, setData } = useRecruteurDashboard();
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  async function handleStar(id: string, current: boolean) {
    setData((prev) =>
      prev
        ? {
            ...prev,
            recentCandidatures: prev.recentCandidatures.map((c) =>
              c.id === id ? { ...c, starred: !current } : c,
            ),
          }
        : prev,
    );
    try {
      await toggleCandidatureStar(id, !current);
    } catch {
      // Rollback
      setData((prev) =>
        prev
          ? {
              ...prev,
              recentCandidatures: prev.recentCandidatures.map((c) =>
                c.id === id ? { ...c, starred: current } : c,
              ),
            }
          : prev,
      );
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

  const hasChartData    = chartData.some((d) => d.value > 0);
  const hasMetierParts  = metierParts.length > 0 && metierParts.some((m) => m.value > 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          {/* ── FIX : firstName vient du vrai profil API, jamais du MOCK ── */}
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour,&nbsp;{profile.firstName}&nbsp;! Voici l'état de vos recrutements.
          </h1>
          <p className="text-sm text-gray-400 mt-1">Période : {PERIOD_LABELS[period]}</p>
        </div>

        {/* Period selector */}
        <div className="relative">
          <button
            onClick={() => setShowPeriodMenu((v) => !v)}
            className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5
                       text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            {PERIOD_LABELS[period]} <ChevronDown size={15} className="text-gray-400" />
          </button>
          {showPeriodMenu && (
            <div
              className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border
                          border-gray-100 z-20 py-1 min-w-44 overflow-hidden"
            >
              {(Object.entries(PERIOD_LABELS) as [DashboardPeriod, string][]).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => { setPeriod(k); setShowPeriodMenu(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${
                    k === period ? 'font-semibold text-[#E8622A]' : 'text-gray-700'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── KPIs ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Portée Globale"
          value={formatBig(stats.porteeGlobale)}
          evol={stats.porteeEvolution || undefined}
          icon={<Eye size={18} className="text-blue-500" />}
          iconBg="bg-blue-50"
        />
        <KpiCard
          label="Candidatures"
          value={stats.candidatures}
          evol={stats.candidaturesEvol || undefined}
          icon={<Users size={18} className="text-orange-500" />}
          iconBg="bg-orange-50"
        />
        <KpiCard
          label="Offres Actives"
          value={stats.offresActives}
          evolLabel="Actuel"
          icon={<Briefcase size={18} className="text-green-500" />}
          iconBg="bg-green-50"
        />
        <KpiCard
          label="Taux de Conversion"
          value={stats.tauxConversion.toFixed(2)}
          suffix="%"
          evol={stats.tauxConversionEvol || undefined}
          icon={<TrendingUp size={18} className="text-purple-500" />}
          iconBg="bg-purple-50"
        />
      </div>

      {/* ── Charts ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">

        {/* Évolution des candidatures */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-4">Évolution des candidatures</h2>
          {hasChartData ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#E8622A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#E8622A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#E8622A"
                  strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#E8622A', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Aucune candidature reçue sur cette période." />
          )}
        </div>

        {/* Répartition par métier */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-4">Répartition par métier</h2>
          {hasMetierParts ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={metierParts}
                  cx="42%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {metierParts.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #F3F4F6', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Publiez des offres pour voir la répartition par métier." />
          )}
        </div>
      </div>

      {/* ── Bottom row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">

        {/* Candidatures récentes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Candidatures récentes</h2>
            <Link
              href="/recruteur/candidatures"
              className="text-xs font-semibold text-[#E8622A] hover:underline flex items-center gap-1"
            >
              Voir toutes <ArrowRight size={12} />
            </Link>
          </div>

          {recentCandidatures.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <p className="text-sm text-gray-400">Aucune candidature reçue pour le moment.</p>
              <Link
                href="/recruteur/offres"
                className="mt-3 text-xs font-semibold text-[#E8622A] hover:underline"
              >
                Publier une offre →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentCandidatures.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition"
                >
                  <Avatar name={c.candidatName} src={c.candidatAvatar} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{c.candidatName}</p>
                    <p className="text-xs text-gray-400">
                      {c.jobTitle} · {timeAgo(c.receivedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* ── FIX : lien vers la liste (pas un détail inexistant) ── */}
                    <Link
                      href="/recruteur/candidatures"
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
                      title="Voir les candidatures"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => handleStar(c.id, c.starred)}
                      className={`p-1.5 rounded-lg transition ${
                        c.starred
                          ? 'text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'
                      }`}
                      title={c.starred ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <Star size={16} fill={c.starred ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vitrine health */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <h2 className="font-semibold text-gray-800 text-sm mb-4">
            Santé de la Vitrine Entreprise
          </h2>
          <CompletionRing pct={vitrineHealth.completionScore} />
          <p className="text-xs text-gray-400 text-center mt-2 mb-5">Score de complétion</p>
          <div className="space-y-2.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Vues de la vitrine</span>
              <span className="text-xs font-semibold text-gray-800">
                {vitrineHealth.views.toLocaleString('fr-FR')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Taux d'engagement</span>
              <span className="text-xs font-semibold text-green-500">
                +{vitrineHealth.engagementRate}%
              </span>
            </div>
          </div>
          <Link
            href="/recruteur/vitrine"
            className="mt-5 w-full bg-[#E8622A] hover:bg-[#D45520] text-white text-sm font-semibold
                       py-2.5 rounded-xl transition text-center block"
          >
            Améliorer ma vitrine
          </Link>
        </div>
      </div>
    </div>
  );
}


















// // src/app/(recruteur)/recruteur/dashboard/page.tsx
// 'use client';
// // FIX: Suppression du wrapper <RecruteurLayout> qui causait la duplication.
// // Le layout.tsx parent de Next.js gère déjà sidebar + header via RecruteurContext.

// import { useState } from 'react';
// import Link from 'next/link';
// import { Eye, Users, Briefcase, TrendingUp, Star, ChevronDown, ArrowRight } from 'lucide-react';
// import {
//   XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart,
//   PieChart, Pie, Cell, Legend,
// } from 'recharts';
// import { useRecruteurDashboard } from '@/hooks/useRecruteurDashboard';
// import { toggleCandidatureStar } from '@/services/recruteur.service';
// import type { DashboardPeriod } from '@/types/recruteur.types';
// import { PERIOD_LABELS } from '@/types/recruteur.types';

// // ── Helpers ───────────────────────────────────────────────────────────────────

// function timeAgo(iso: string): string {
//   const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
//   if (h < 1) return 'il y a < 1h';
//   return `il y a ${h}h`;
// }

// function formatBig(n: number): string {
//   return n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n);
// }

// // ── KPI Card ──────────────────────────────────────────────────────────────────
// interface KpiCardProps {
//   label: string; value: string | number; evol?: number;
//   evolLabel?: string; icon: React.ReactNode; iconBg: string; suffix?: string;
// }

// function KpiCard({ label, value, evol, evolLabel, icon, iconBg, suffix }: KpiCardProps) {
//   const positive = evol !== undefined && evol >= 0;
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
//       <div className="flex items-start justify-between mb-3">
//         <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
//         {evol !== undefined && (
//           <span className={`text-xs font-semibold ${positive ? 'text-green-500' : 'text-red-400'}`}>
//             {positive ? '+' : ''}{evol}%
//           </span>
//         )}
//         {evolLabel && <span className="text-xs text-gray-400">{evolLabel}</span>}
//       </div>
//       <p className="text-2xl font-bold text-gray-900">
//         {value}{suffix && <span className="text-sm font-medium text-gray-500 ml-0.5">{suffix}</span>}
//       </p>
//       <p className="text-xs text-gray-400 mt-1">{label}</p>
//     </div>
//   );
// }

// // ── Avatar ────────────────────────────────────────────────────────────────────
// function Avatar({ name, src }: { name: string; src?: string }) {
//   const initials = name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
//   const colors   = ['bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'];
//   const color    = colors[name.charCodeAt(0) % colors.length];
//   return (
//     <div className={`w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center ${src ? '' : color}`}>
//       {src ? <img src={src} alt={name} className="w-full h-full object-cover" />
//            : <span className="text-white text-xs font-bold">{initials}</span>}
//     </div>
//   );
// }

// // ── Completion ring ───────────────────────────────────────────────────────────
// function CompletionRing({ pct }: { pct: number }) {
//   const r = 42; const circ = 2 * Math.PI * r;
//   return (
//     <div className="relative w-28 h-28 mx-auto">
//       <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
//         <circle cx="50" cy="50" r={r} fill="none" stroke="#F3F4F6" strokeWidth="8" />
//         <circle cx="50" cy="50" r={r} fill="none" stroke="#E8622A" strokeWidth="8"
//           strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
//           strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
//       </svg>
//       <div className="absolute inset-0 flex items-center justify-center">
//         <span className="text-2xl font-bold text-gray-900">{pct}%</span>
//       </div>
//     </div>
//   );
// }

// function CustomTooltip({ active, payload, label }: any) {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-lg px-3 py-2">
//       <p className="text-xs text-gray-500">{label}</p>
//       <p className="text-sm font-bold text-[#E8622A]">{payload[0].value} candidatures</p>
//     </div>
//   );
// }

// // ── Page ──────────────────────────────────────────────────────────────────────
// export default function RecruteurDashboardPage() {
//   const { data, loading, period, setPeriod, setData } = useRecruteurDashboard();
//   const [showPeriodMenu, setShowPeriodMenu] = useState(false);

//   async function handleStar(id: string, current: boolean) {
//     setData((prev) => prev ? {
//       ...prev,
//       recentCandidatures: prev.recentCandidatures.map((c) =>
//         c.id === id ? { ...c, starred: !current } : c
//       ),
//     } : prev);
//     try { await toggleCandidatureStar(id, !current); } catch {}
//   }

//   if (loading || !data) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   const { stats, chartData, metierParts, recentCandidatures, vitrineHealth, profile } = data;

//   return (
//     <div className="p-6 space-y-6 max-w-7xl mx-auto">

//       {/* Header */}
//       <div className="flex items-start justify-between gap-4 flex-wrap">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Bonjour, {profile.firstName}&nbsp;! Voici l'état de vos recrutements.
//           </h1>
//           <p className="text-sm text-gray-400 mt-1">Période : {PERIOD_LABELS[period]}</p>
//         </div>
//         <div className="relative">
//           <button onClick={() => setShowPeriodMenu((v) => !v)}
//             className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5
//                        text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
//             {PERIOD_LABELS[period]} <ChevronDown size={15} className="text-gray-400" />
//           </button>
//           {showPeriodMenu && (
//             <div className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border
//                             border-gray-100 z-20 py-1 min-w-44 overflow-hidden">
//               {(Object.entries(PERIOD_LABELS) as [DashboardPeriod, string][]).map(([k, v]) => (
//                 <button key={k} onClick={() => { setPeriod(k); setShowPeriodMenu(false); }}
//                   className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${
//                     k === period ? 'font-semibold text-[#E8622A]' : 'text-gray-700'}`}>
//                   {v}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* KPIs */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <KpiCard label="Portée Globale"     value={formatBig(stats.porteeGlobale)} evol={stats.porteeEvolution}    icon={<Eye size={18} className="text-blue-500" />}     iconBg="bg-blue-50" />
//         <KpiCard label="Candidatures"       value={stats.candidatures}             evol={stats.candidaturesEvol}   icon={<Users size={18} className="text-orange-500" />}  iconBg="bg-orange-50" />
//         <KpiCard label="Offres Actives"     value={stats.offresActives}            evolLabel="Actuel"              icon={<Briefcase size={18} className="text-green-500" />} iconBg="bg-green-50" />
//         <KpiCard label="Taux de Conversion" value={stats.tauxConversion.toFixed(2)} suffix="%" evol={stats.tauxConversionEvol} icon={<TrendingUp size={18} className="text-purple-500" />} iconBg="bg-purple-50" />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//           <h2 className="font-semibold text-gray-800 text-sm mb-4">Évolution des candidatures</h2>
//           <ResponsiveContainer width="100%" height={180}>
//             <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
//               <defs>
//                 <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%"  stopColor="#E8622A" stopOpacity={0.15} />
//                   <stop offset="95%" stopColor="#E8622A" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
//               <Tooltip content={<CustomTooltip />} />
//               <Area type="monotone" dataKey="value" stroke="#E8622A" strokeWidth={2.5}
//                 fill="url(#areaGrad)" dot={false}
//                 activeDot={{ r: 5, fill: '#E8622A', stroke: '#fff', strokeWidth: 2 }} />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//           <h2 className="font-semibold text-gray-800 text-sm mb-4">Répartition par métier</h2>
//           <ResponsiveContainer width="100%" height={180}>
//             <PieChart>
//               <Pie data={metierParts} cx="42%" cy="50%" innerRadius={52} outerRadius={80}
//                 paddingAngle={2} dataKey="value">
//                 {metierParts.map((entry, i) => <Cell key={i} fill={entry.color} />)}
//               </Pie>
//               <Legend layout="vertical" align="right" verticalAlign="middle"
//                 iconType="circle" iconSize={8}
//                 formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} />
//               <Tooltip formatter={(value) => [`${value}%`, '']}
//                 contentStyle={{ borderRadius: 12, border: '1px solid #F3F4F6', fontSize: 12 }} />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Bottom row */}
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
//             <h2 className="font-semibold text-gray-800 text-sm">Candidatures récentes</h2>
//             <Link href="/recruteur/candidatures"
//               className="text-xs font-semibold text-[#E8622A] hover:underline flex items-center gap-1">
//               Voir toutes <ArrowRight size={12} />
//             </Link>
//           </div>
//           <div className="divide-y divide-gray-50">
//             {recentCandidatures.map((c) => (
//               <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition">
//                 <Avatar name={c.candidatName} src={c.candidatAvatar} />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold text-gray-800">{c.candidatName}</p>
//                   <p className="text-xs text-gray-400">{c.jobTitle} · {timeAgo(c.receivedAt)}</p>
//                 </div>
//                 <div className="flex items-center gap-2 flex-shrink-0">
//                   <Link href={`/recruteur/candidatures/${c.id}`}
//                     className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
//                     <Eye size={16} />
//                   </Link>
//                   <button onClick={() => handleStar(c.id, c.starred)}
//                     className={`p-1.5 rounded-lg transition ${c.starred
//                       ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'}`}>
//                     <Star size={16} fill={c.starred ? 'currentColor' : 'none'} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
//           <h2 className="font-semibold text-gray-800 text-sm mb-4">Santé de la Vitrine Entreprise</h2>
//           <CompletionRing pct={vitrineHealth.completionScore} />
//           <p className="text-xs text-gray-400 text-center mt-2 mb-5">Score de complétion</p>
//           <div className="space-y-2.5 flex-1">
//             <div className="flex items-center justify-between">
//               <span className="text-xs text-gray-500">Vues de la vitrine</span>
//               <span className="text-xs font-semibold text-gray-800">{vitrineHealth.views.toLocaleString('fr-FR')}</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-xs text-gray-500">Taux d'engagement</span>
//               <span className="text-xs font-semibold text-green-500">+{vitrineHealth.engagementRate}%</span>
//             </div>
//           </div>
//           <Link href="/recruteur/vitrine"
//             className="mt-5 w-full bg-[#E8622A] hover:bg-[#D45520] text-white text-sm font-semibold
//                        py-2.5 rounded-xl transition text-center block">
//             Améliorer ma vitrine
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }





















// // src/app/(recruteur)/recruteur/dashboard/page.tsx
// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { Eye, Users, Briefcase, TrendingUp, Star, ChevronDown, ArrowRight } from 'lucide-react';
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart,
//   PieChart, Pie, Cell, Legend,
// } from 'recharts';
// import { useRecruteurDashboard } from '@/hooks/useRecruteurDashboard';
// import { toggleCandidatureStar } from '@/services/recruteur.service';
// import RecruteurLayout from '../layout';
// import type { DashboardPeriod } from '@/types/recruteur.types';
// import { PERIOD_LABELS } from '@/types/recruteur.types';

// // ── Helpers ───────────────────────────────────────────────────────────────────

// function timeAgo(iso: string): string {
//   const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
//   if (h < 1) return 'il y a < 1h';
//   return `il y a ${h}h`;
// }

// function formatBig(n: number): string {
//   return n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n);
// }

// // ── KPI Card ──────────────────────────────────────────────────────────────────

// interface KpiCardProps {
//   label: string;
//   value: string | number;
//   evol?: number;
//   evolLabel?: string;
//   icon: React.ReactNode;
//   iconBg: string;
//   suffix?: string;
// }

// function KpiCard({ label, value, evol, evolLabel, icon, iconBg, suffix }: KpiCardProps) {
//   const positive = evol !== undefined && evol >= 0;
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
//       <div className="flex items-start justify-between mb-3">
//         <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
//           {icon}
//         </div>
//         {evol !== undefined && (
//           <span className={`text-xs font-semibold ${positive ? 'text-green-500' : 'text-red-400'}`}>
//             {positive ? '+' : ''}{evol}%
//           </span>
//         )}
//         {evolLabel && (
//           <span className="text-xs text-gray-400">{evolLabel}</span>
//         )}
//       </div>
//       <p className="text-2xl font-bold text-gray-900">
//         {value}{suffix && <span className="text-sm font-medium text-gray-500 ml-0.5">{suffix}</span>}
//       </p>
//       <p className="text-xs text-gray-400 mt-1">{label}</p>
//     </div>
//   );
// }

// // ── Avatar initials ───────────────────────────────────────────────────────────

// function Avatar({ name, src, size = 9 }: { name: string; src?: string; size?: number }) {
//   const initials = name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
//   const colors = ['bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'];
//   const color  = colors[name.charCodeAt(0) % colors.length];
//   return (
//     <div className={`w-${size} h-${size} rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center ${src ? '' : color}`}>
//       {src ? (
//         <img src={src} alt={name} className="w-full h-full object-cover" />
//       ) : (
//         <span className="text-white text-xs font-bold">{initials}</span>
//       )}
//     </div>
//   );
// }

// // ── Profile completion ring ───────────────────────────────────────────────────

// function CompletionRing({ pct }: { pct: number }) {
//   const r = 42;
//   const circ = 2 * Math.PI * r;
//   const offset = circ - (pct / 100) * circ;
//   return (
//     <div className="relative w-28 h-28 mx-auto">
//       <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
//         <circle cx="50" cy="50" r={r} fill="none" stroke="#F3F4F6" strokeWidth="8" />
//         <circle
//           cx="50" cy="50" r={r} fill="none"
//           stroke="#E8622A" strokeWidth="8"
//           strokeDasharray={circ}
//           strokeDashoffset={offset}
//           strokeLinecap="round"
//           style={{ transition: 'stroke-dashoffset 0.8s ease' }}
//         />
//       </svg>
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-2xl font-bold text-gray-900">{pct}%</span>
//       </div>
//     </div>
//   );
// }

// // ── Custom tooltip for line chart ─────────────────────────────────────────────

// function CustomTooltip({ active, payload, label }: any) {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-lg px-3 py-2">
//       <p className="text-xs text-gray-500">{label}</p>
//       <p className="text-sm font-bold text-[#E8622A]">{payload[0].value} candidatures</p>
//     </div>
//   );
// }

// // ── Dashboard Page ────────────────────────────────────────────────────────────

// export default function RecruteurDashboardPage() {
//   const { data, loading, period, setPeriod, setData } = useRecruteurDashboard();
//   const [showPeriodMenu, setShowPeriodMenu] = useState(false);

//   async function handleStar(id: string, current: boolean) {
//     const next = !current;
//     setData((prev) => prev ? {
//       ...prev,
//       recentCandidatures: prev.recentCandidatures.map((c) =>
//         c.id === id ? { ...c, starred: next } : c
//       ),
//     } : prev);
//     try { await toggleCandidatureStar(id, next); } catch {}
//   }

//   if (loading || !data) {
//     return (
//       <RecruteurLayout>
//         <div className="flex items-center justify-center h-full">
//           <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
//         </div>
//       </RecruteurLayout>
//     );
//   }

//   const { stats, chartData, metierParts, recentCandidatures, vitrineHealth, profile } = data;

//   return (
//     <RecruteurLayout
//       profile={profile}
//       newCandidaturesCount={data.newCandidaturesCount}
//       onEtablissementChange={(id) => {
//         setData((prev) => prev ? {
//           ...prev,
//           profile: { ...prev.profile, activeEtablissementId: id },
//         } : prev);
//       }}
//     >
//       <div className="p-6 space-y-6 max-w-7xl mx-auto">

//         {/* ── Page Header ──────────────────────────────────────────────── */}
//         <div className="flex items-start justify-between gap-4 flex-wrap">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Bonjour, {profile.firstName}&nbsp;! Voici l'état de vos recrutements.
//             </h1>
//             <p className="text-sm text-gray-400 mt-1">
//               Période : {PERIOD_LABELS[period]}
//             </p>
//           </div>

//           {/* Period selector */}
//           <div className="relative">
//             <button
//               onClick={() => setShowPeriodMenu((v) => !v)}
//               className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5
//                          text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
//             >
//               {PERIOD_LABELS[period]}
//               <ChevronDown size={15} className="text-gray-400" />
//             </button>
//             {showPeriodMenu && (
//               <div className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border
//                               border-gray-100 z-20 py-1 min-w-44 overflow-hidden">
//                 {(Object.entries(PERIOD_LABELS) as [DashboardPeriod, string][]).map(([k, v]) => (
//                   <button
//                     key={k}
//                     onClick={() => { setPeriod(k); setShowPeriodMenu(false); }}
//                     className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-gray-50 ${
//                       k === period ? 'font-semibold text-[#E8622A]' : 'text-gray-700'
//                     }`}
//                   >
//                     {v}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── KPI Row ──────────────────────────────────────────────────── */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           <KpiCard
//             label="Portée Globale"
//             value={formatBig(stats.porteeGlobale)}
//             evol={stats.porteeEvolution}
//             icon={<Eye size={18} className="text-blue-500" />}
//             iconBg="bg-blue-50"
//           />
//           <KpiCard
//             label="Candidatures"
//             value={stats.candidatures}
//             evol={stats.candidaturesEvol}
//             icon={<Users size={18} className="text-orange-500" />}
//             iconBg="bg-orange-50"
//           />
//           <KpiCard
//             label="Offres Actives"
//             value={stats.offresActives}
//             evolLabel="Actuel"
//             icon={<Briefcase size={18} className="text-green-500" />}
//             iconBg="bg-green-50"
//           />
//           <KpiCard
//             label="Taux de Conversion"
//             value={stats.tauxConversion.toFixed(2)}
//             suffix="%"
//             evol={stats.tauxConversionEvol}
//             icon={<TrendingUp size={18} className="text-purple-500" />}
//             iconBg="bg-purple-50"
//           />
//         </div>

//         {/* ── Charts Row ───────────────────────────────────────────────── */}
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">

//           {/* Line chart */}
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//             <h2 className="font-semibold text-gray-800 text-sm mb-4">Évolution des candidatures</h2>
//             <ResponsiveContainer width="100%" height={180}>
//               <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
//                 <defs>
//                   <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%"  stopColor="#E8622A" stopOpacity={0.15} />
//                     <stop offset="95%" stopColor="#E8622A" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="value"
//                   stroke="#E8622A"
//                   strokeWidth={2.5}
//                   fill="url(#areaGrad)"
//                   dot={false}
//                   activeDot={{ r: 5, fill: '#E8622A', stroke: '#fff', strokeWidth: 2 }}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Donut chart */}
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//             <h2 className="font-semibold text-gray-800 text-sm mb-4">Répartition par métier</h2>
//             <ResponsiveContainer width="100%" height={180}>
//               <PieChart>
//                 <Pie
//                   data={metierParts}
//                   cx="42%"
//                   cy="50%"
//                   innerRadius={52}
//                   outerRadius={80}
//                   paddingAngle={2}
//                   dataKey="value"
//                 >
//                   {metierParts.map((entry, i) => (
//                     <Cell key={i} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Legend
//                   layout="vertical"
//                   align="right"
//                   verticalAlign="middle"
//                   iconType="circle"
//                   iconSize={8}
//                   formatter={(value) => (
//                     <span className="text-xs text-gray-600">{value}</span>
//                   )}
//                 />
//                 <Tooltip
//                   formatter={(value) => [`${value}%`, '']}
//                   contentStyle={{ borderRadius: 12, border: '1px solid #F3F4F6', fontSize: 12 }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* ── Bottom Row ───────────────────────────────────────────────── */}
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">

//           {/* Recent candidatures */}
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//             <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
//               <h2 className="font-semibold text-gray-800 text-sm">Candidatures récentes</h2>
//               <Link href="/recruteur/candidatures"
//                 className="text-xs font-semibold text-[#E8622A] hover:underline flex items-center gap-1">
//                 Voir toutes <ArrowRight size={12} />
//               </Link>
//             </div>

//             <div className="divide-y divide-gray-50">
//               {recentCandidatures.map((c) => (
//                 <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition">
//                   <Avatar name={c.candidatName} src={c.candidatAvatar} size={9} />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-gray-800">{c.candidatName}</p>
//                     <p className="text-xs text-gray-400">{c.jobTitle} · {timeAgo(c.receivedAt)}</p>
//                   </div>
//                   <div className="flex items-center gap-2 flex-shrink-0">
//                     <Link href={`/recruteur/candidatures/${c.id}`}
//                       className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
//                       <Eye size={16} />
//                     </Link>
//                     <button
//                       onClick={() => handleStar(c.id, c.starred)}
//                       className={`p-1.5 rounded-lg transition ${
//                         c.starred
//                           ? 'text-yellow-400 hover:text-yellow-500'
//                           : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'
//                       }`}
//                     >
//                       <Star size={16} fill={c.starred ? 'currentColor' : 'none'} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Vitrine health */}
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
//             <h2 className="font-semibold text-gray-800 text-sm mb-4">Santé de la Vitrine Entreprise</h2>

//             <CompletionRing pct={vitrineHealth.completionScore} />
//             <p className="text-xs text-gray-400 text-center mt-2 mb-5">Score de complétion</p>

//             <div className="space-y-2.5 flex-1">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs text-gray-500">Vues de la vitrine</span>
//                 <span className="text-xs font-semibold text-gray-800">
//                   {vitrineHealth.views.toLocaleString('fr-FR')}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-xs text-gray-500">Taux d'engagement</span>
//                 <span className="text-xs font-semibold text-green-500">
//                   +{vitrineHealth.engagementRate}%
//                 </span>
//               </div>
//             </div>

//             <Link
//               href="/recruteur/vitrine"
//               className="mt-5 w-full bg-[#E8622A] hover:bg-[#D45520] text-white text-sm font-semibold
//                          py-2.5 rounded-xl transition text-center block"
//             >
//               Améliorer ma vitrine
//             </Link>
//           </div>
//         </div>

//       </div>
//     </RecruteurLayout>
//   );
// }