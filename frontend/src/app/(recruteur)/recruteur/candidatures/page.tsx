'use client';
// src/app/(recruteur)/recruteur/candidatures/page.tsx

import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useCandidaturesRec } from '@/hooks/useCandidaturesRec';
import CandidateCard from '@/components/recruteur/candidatures/CandidateCard';
import CandidateDetailPanel from '@/components/recruteur/candidatures/CandidateDetailPanel';
import {
  markCandidatureRead,
} from '@/services/candidatures-rec.service';
import type { CandidatureRec, CandidatureRecStatus } from '@/types/candidatures-rec.types';
import { STATUS_LABELS } from '@/types/candidatures-rec.types';
import clsx from 'clsx';

// ── Tab filter config ─────────────────────────────────────────────────────────
type TabKey = CandidatureRecStatus | 'all';

const TABS: { key: TabKey; labelFn: (stats: Record<string, number>) => string }[] = [
  { key: 'new',         labelFn: (s) => `Nouveaux (${s.new ?? 0})`         },
  { key: 'in_progress', labelFn: (s) => `En cours (${s.in_progress ?? 0})` },
  { key: 'interview',   labelFn: (s) => `Entretiens (${s.interview ?? 0})` },
  { key: 'favorite',    labelFn: (s) => `Favoris (${s.favorite ?? 0})`     },
  { key: 'refused',     labelFn: (s) => `Refusés (${s.refused ?? 0})`      },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ListSkeleton() {
  return (
    <div className="divide-y divide-gray-100 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3.5">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
            <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
            <div className="h-2 bg-gray-100 rounded-full w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CandidaturesRecuesPage() {
  const { data, loading, setData } = useCandidaturesRec();

  const [activeTab,    setActiveTab]    = useState<TabKey>('new');
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [offerId,      setOfferId]      = useState('');
  const [search,       setSearch]       = useState('');

  // ── Update candidature in local state ────────────────────────────────────
  function updateCandidature(id: string, patch: Partial<CandidatureRec>) {
    setData((prev) => {
      if (!prev) return prev;
      const updated = prev.candidatures.map((c) => c.id === id ? { ...c, ...patch } : c);
      // Recompute stats
      const stats = { new: 0, in_progress: 0, interview: 0, favorite: 0, refused: 0 };
      updated.forEach((c) => { stats[c.status] = (stats[c.status] ?? 0) + 1; });
      if (patch.isFavorite !== undefined) {
        stats.favorite = updated.filter((c) => c.isFavorite).length;
      }
      return { ...prev, candidatures: updated, stats };
    });
  }

  // ── Handle selection ──────────────────────────────────────────────────────
  async function handleSelect(id: string) {
    setSelectedId(id);
    const cand = data?.candidatures.find((c) => c.id === id);
    if (cand && !cand.isRead) {
      updateCandidature(id, { isRead: true });
      try { await markCandidatureRead(id); } catch {}
    }
  }

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!data) return [];
    return data.candidatures.filter((c) => {
      const matchTab    = activeTab === 'all'
        ? true
        : activeTab === 'favorite'
        ? c.isFavorite
        : c.status === activeTab;
      const matchOffer  = !offerId  || c.offerId === offerId;
      const matchSearch = !search
        || c.candidatName.toLowerCase().includes(search.toLowerCase())
        || c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
        || c.candidatTitle.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchOffer && matchSearch;
    });
  }, [data, activeTab, offerId, search]);

  const selected = data?.candidatures.find((c) => c.id === selectedId)
    ?? filtered[0]
    ?? null;

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center gap-4 flex-wrap flex-shrink-0">
        <h1 className="font-bold text-gray-900 text-lg flex-1 min-w-0">Candidatures reçues</h1>

        {/* Offer filter */}
        <div className="relative">
          <select
            value={offerId}
            onChange={(e) => setOfferId(e.target.value)}
            className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm
                       text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30
                       focus:border-[#E8622A] transition cursor-pointer min-w-40"
          >
            <option value="">Toutes les offres</option>
            {data?.offers.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou compétence…"
            className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white w-64
                       focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
          />
        </div>
      </div>

      {/* ── Tab bar ────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-4 flex-shrink-0">
        <div className="flex items-center gap-0 overflow-x-auto">
          {TABS.map(({ key, labelFn }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={clsx(
                'px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition -mb-px',
                activeTab === key
                  ? 'border-[#E8622A] text-[#E8622A] bg-[#FFF3EC]/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {labelFn(data?.stats ?? {})}
            </button>
          ))}
        </div>
      </div>

      {/* ── Split view ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: candidate list */}
        <div className="w-full lg:w-[40%] border-r border-gray-200 bg-white flex flex-col overflow-hidden flex-shrink-0">
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <ListSkeleton />
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <p className="text-sm font-semibold text-gray-500">Aucune candidature</p>
                <p className="text-xs text-gray-400 mt-1">Modifiez vos filtres.</p>
              </div>
            ) : (
              <div>
                {filtered.map((c) => (
                  <CandidateCard
                    key={c.id}
                    candidature={c}
                    isSelected={c.id === (selected?.id ?? filtered[0]?.id)}
                    onClick={() => handleSelect(c.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: detail panel */}
        <div className="hidden lg:flex flex-1 flex-col overflow-hidden bg-white">
          {selected ? (
            <CandidateDetailPanel
              key={selected.id}
              candidature={selected}
              onChange={(patch) => updateCandidature(selected.id, patch)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm font-semibold text-gray-400">
                Sélectionnez une candidature
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}