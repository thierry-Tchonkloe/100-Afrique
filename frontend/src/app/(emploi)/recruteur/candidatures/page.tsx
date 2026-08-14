'use client';
// src/app/(emploi)/recruteur/candidatures/page.tsx

import { useState, useMemo } from 'react';
import { useCandidaturesRec } from '@/hooks/useCandidaturesRec';
import CandidateCard from '@/components/recruteur/candidatures/CandidateCard';
import CandidateDetailPanel from '@/components/recruteur/candidatures/CandidateDetailPanel';
import ListSkeleton from '@/components/recruteur/candidatures/ListSkeleton';
import CandidaturesTabs, { type TabKey } from '@/components/recruteur/candidatures/CandidaturesTabs';
import CandidaturesFiltersBar from '@/components/recruteur/candidatures/CandidaturesFiltersBar';
import { markCandidatureRead } from '@/services/candidatures-rec.service';
import type { CandidatureRec, CandidaturesRecResponse } from '@/types/candidatures-rec.types';

export default function CandidaturesRecuesPage() {
  const { data, loading, error, setData } = useCandidaturesRec();

  const [activeTab, setActiveTab] = useState<TabKey>('new');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [offerId, setOfferId] = useState('');
  const [search, setSearch] = useState('');

  function updateCandidature(id: string, patch: Partial<CandidatureRec>) {
    setData((prev: CandidaturesRecResponse) => {
      const updated = prev.candidatures.map((c) => (c.id === id ? { ...c, ...patch } : c));
      const stats = {
        new: updated.filter((c) => c.status === 'new' && !c.isRead).length,
        in_progress: updated.filter((c) => c.status === 'in_progress' || (c.status === 'new' && c.isRead)).length,
        interview: updated.filter((c) => c.status === 'interview').length,
        favorite: updated.filter((c) => c.isFavorite).length,
        refused: updated.filter((c) => c.status === 'refused').length,
      };
      return { ...prev, candidatures: updated, stats };
    });
  }

  async function handleSelect(id: string) {
    setSelectedId(id);
    const cand = data.candidatures.find((c) => c.id === id);
    if (cand && !cand.isRead) {
      updateCandidature(id, { isRead: true, status: 'in_progress' });
      try {
        await markCandidatureRead(id);
      } catch {
        updateCandidature(id, { isRead: false, status: 'new' });
      }
    }
  }

  const filtered = useMemo(() => {
    return data.candidatures.filter((c) => {
      let matchTab: boolean;
      if (activeTab === 'all') matchTab = true;
      else if (activeTab === 'favorite') matchTab = c.isFavorite;
      else if (activeTab === 'new') matchTab = (c.status === 'new' || c.status === 'sent') && !c.isRead;
      else if (activeTab === 'in_progress') matchTab = c.status === 'in_progress' || ((c.status === 'new' || c.status === 'sent') && c.isRead);
      else matchTab = c.status === activeTab;

      const matchOffer = !offerId || c.offerId === offerId;
      const q = search.toLowerCase();
      const matchSearch = !search
        || c.candidatName.toLowerCase().includes(q)
        || c.candidatTitle.toLowerCase().includes(q)
        || c.skills.some((s) => s.toLowerCase().includes(q))
        || c.offerTitle.toLowerCase().includes(q);

      return matchTab && matchOffer && matchSearch;
    });
  }, [data, activeTab, offerId, search]);

  const selected = data.candidatures.find((c) => c.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center gap-4 flex-wrap flex-shrink-0">
        <h1 className="font-bold text-gray-900 text-lg flex-1 min-w-0">Candidatures reçues</h1>
        <CandidaturesFiltersBar
          offerId={offerId} setOfferId={setOfferId}
          search={search} setSearch={setSearch}
          offers={data.offers}
        />
      </div>

      <CandidaturesTabs activeTab={activeTab} setActiveTab={setActiveTab} stats={data.stats} />

      {error && (
        <div className="px-6 py-2 bg-red-50 border-b border-red-100 text-xs text-red-600 flex-shrink-0">{error}</div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full lg:w-[40%] border-r border-gray-200 bg-white flex flex-col overflow-hidden flex-shrink-0">
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <ListSkeleton />
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <p className="text-sm font-semibold text-gray-500">Aucune candidature</p>
                <p className="text-xs text-gray-400 mt-1">
                  {search || offerId ? 'Aucun résultat pour ces filtres.' : 'Aucune candidature dans cet onglet.'}
                </p>
              </div>
            ) : (
              <div>
                {filtered.map((c) => (
                  <CandidateCard key={c.id} candidature={c} isSelected={c.id === selected?.id} onClick={() => handleSelect(c.id)} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex flex-1 flex-col overflow-hidden bg-white">
          {selected ? (
            <CandidateDetailPanel key={selected.id} candidature={selected} onChange={(patch) => updateCandidature(selected.id, patch)} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm font-semibold text-gray-400">Sélectionnez une candidature</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
