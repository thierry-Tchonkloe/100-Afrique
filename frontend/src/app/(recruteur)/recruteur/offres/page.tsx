// src/app/(recruteur)/recruteur/offres/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, ChevronDown } from 'lucide-react';
import { useOffres } from '@/hooks/useOffres';
import OffreCard from '@/components/recruteur/offres/OffreCard';
import OffreModal from '@/components/recruteur/offres/OffreModal';
import { createOffre, updateOffreStatus, duplicateOffre, archiveOffre } from '@/services/offres.service';
import type { Offre, OffreFormData, OffreTab } from '@/types/offres.types';
import { CONTRACT_TYPES } from '@/types/offres.types';
import clsx from 'clsx';

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS: { key: OffreTab; label: string; statKey: 'online' | 'drafts' | 'archives' }[] = [
  { key: 'online',   label: 'En ligne',  statKey: 'online'   },
  { key: 'drafts',   label: 'Brouillons', statKey: 'drafts'  },
  { key: 'archives', label: 'Archives',   statKey: 'archives' },
];

const STATUS_MAP: Record<OffreTab, string[]> = {
  online:   ['active', 'paused'],
  drafts:   ['draft'],
  archives: ['archived'],
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function OffreSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 border-l-4 border-l-gray-100 px-5 py-4 h-24" />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GererOffresPage() {
  const { data, offres, loading, setOffres } = useOffres();

  const [tab,        setTab]        = useState<OffreTab>('online');
  const [search,     setSearch]     = useState('');
  const [filterCont, setFilterCont] = useState('');
  const [filterLoc,  setFilterLoc]  = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [saving,     setSaving]     = useState(false);

  // ── Filtered offres ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const allowedStatuses = STATUS_MAP[tab];
    return offres.filter((o) => {
      const matchTab     = allowedStatuses.includes(o.status);
      const matchSearch  = !search  || o.title.toLowerCase().includes(search.toLowerCase()) || o.location.toLowerCase().includes(search.toLowerCase());
      const matchCont    = !filterCont || o.contractType === filterCont;
      const matchLoc     = !filterLoc  || o.location.toLowerCase().includes(filterLoc.toLowerCase());
      return matchTab && matchSearch && matchCont && matchLoc;
    });
  }, [offres, tab, search, filterCont, filterLoc]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  async function handleCreate(form: OffreFormData) {
    setSaving(true);
    try {
      const created = await createOffre(form);
      setOffres([created, ...offres]);
    } catch {
      const mock: Offre = {
        id: `offre-${Date.now()}`, title: form.step1.title, sector: form.step1.sector,
        contractType: form.step1.contractType, location: form.step1.location,
        publishedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
        status: 'active', isPremium: false, views: 0, candidatesCount: 0, newCandidatesCount: 0,
      };
      setOffres([mock, ...offres]);
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  }

  async function handlePause(id: string) {
    setOffres(offres.map((o) => o.id === id ? { ...o, status: o.status === 'paused' ? 'active' : 'paused' } : o));
    try { await updateOffreStatus(id, offres.find((o) => o.id === id)?.status === 'paused' ? 'active' : 'paused'); } catch {}
  }

  async function handleArchive(id: string) {
    if (!confirm('Archiver cette offre ? Elle ne sera plus visible sur le site.')) return;
    setOffres(offres.map((o) => o.id === id ? { ...o, status: 'archived' } : o));
    try { await archiveOffre(id); } catch {}
  }

  async function handleDuplicate(id: string) {
    try {
      const dup = await duplicateOffre(id);
      setOffres([dup, ...offres]);
    } catch {
      const orig = offres.find((o) => o.id === id);
      if (!orig) return;
      const mock: Offre = { ...orig, id: `offre-dup-${Date.now()}`, title: `${orig.title} (copie)`, status: 'draft', views: 0, candidatesCount: 0, newCandidatesCount: 0 };
      setOffres([mock, ...offres]);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">

      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mes Offres d'Emploi</h1>
          <p className="text-sm text-gray-400 mt-1">Gérez vos annonces et suivez leurs performances</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white
                     text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex-shrink-0"
        >
          <Plus size={16} /> Publier une nouvelle offre
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-gray-200">
        {TABS.map(({ key, label, statKey }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px',
              tab === key
                ? 'border-[#E8622A] text-[#E8622A]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {label}
            {data && (
              <span className={clsx(
                'text-xs font-bold px-1.5 py-0.5 rounded-full',
                tab === key ? 'bg-[#FFF3EC] text-[#E8622A]' : 'bg-gray-100 text-gray-500'
              )}>
                {data.stats[statKey]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une offre par titre, localisation…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
          />
        </div>

        {/* Contract filter */}
        <div className="relative">
          <select
            value={filterCont}
            onChange={(e) => setFilterCont(e.target.value)}
            className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm
                       text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30
                       focus:border-[#E8622A] transition cursor-pointer"
          >
            <option value="">Tous les contrats</option>
            {CONTRACT_TYPES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Location filter */}
        <div className="relative">
          <select
            value={filterLoc}
            onChange={(e) => setFilterLoc(e.target.value)}
            className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm
                       text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30
                       focus:border-[#E8622A] transition cursor-pointer"
          >
            <option value="">Toutes les localisations</option>
            {['Paris', 'Monaco', 'Cannes', 'Saint-Tropez', 'Nice', 'Lyon'].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Offre list */}
      {loading ? (
        <OffreSkeleton />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <Plus size={22} className="text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-500">Aucune offre trouvée</p>
          <p className="text-xs text-gray-400 mt-1">Modifiez vos filtres ou publiez une nouvelle offre.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((offre) => (
            <OffreCard
              key={offre.id}
              offre={offre}
              onEdit={(id) => { setEditingId(id); setShowModal(true); }}
              onPause={handlePause}
              onArchive={handleArchive}
              onDuplicate={handleDuplicate}
            />
          ))}
          <p className="text-xs text-gray-400 text-right pt-1">
            {filtered.length} offre{filtered.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <OffreModal
          mode={editingId ? 'edit' : 'create'}
          onSave={handleCreate}
          onClose={() => { setShowModal(false); setEditingId(null); }}
          saving={saving}
        />
      )}
    </div>
  );
}