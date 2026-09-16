'use client';
// src/app/(emploi)/recruteur/offres/page.tsx

import { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { useOffres } from '@/hooks/useOffres';
import { useOffresActions } from '@/hooks/useOffresActions';
import OffreCard from '@/components/recruteur/offres/OffreCard';
import OffreModal from '@/components/recruteur/offres/OffreModal';
import OffreSkeleton from '@/components/recruteur/offres/OffreSkeleton';
import ErrorToast from '@/components/recruteur/offres/ErrorToast';
import OffresTabs from '@/components/recruteur/offres/OffresTabs';
import OffresFilters from '@/components/recruteur/offres/OffresFilters';
import type { OffreTab } from '@/types/offres.types';

const STATUS_MAP: Record<OffreTab, string[]> = {
  online: ['active', 'paused'],
  drafts: ['draft'],
  archives: ['archived'],
};

export default function GererOffresPage() {
  const { data, offres, loading, setOffres, refetch } = useOffres();

  const [tab, setTab] = useState<OffreTab>('online');
  const [search, setSearch] = useState('');
  const [filterCont, setFilterCont] = useState('');
  const [filterLoc, setFilterLoc] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { saving, error, setError, handleCreate, handlePause, handleArchive, handleDuplicate } =
    useOffresActions(offres, setOffres, setTab);

  const filtered = useMemo(() => {
    const allowed = STATUS_MAP[tab];
    return offres.filter((o) => {
      const matchTab = allowed.includes(o.status);
      const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.location.toLowerCase().includes(search.toLowerCase());
      const matchCont = !filterCont || o.contractType === filterCont;
      const matchLoc = !filterLoc || o.location.toLowerCase().includes(filterLoc.toLowerCase());
      return matchTab && matchSearch && matchCont && matchLoc;
    });
  }, [offres, tab, search, filterCont, filterLoc]);

  const cities = useMemo(() => {
    const all = offres.map((o) => o.location.split(' ')[0]).filter(Boolean);
    return [...new Set(all)].sort();
  }, [offres]);

  function openCreate() { setEditingId(null); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditingId(null); setError(null); }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mes Offres d'Emploi</h1>
          <p className="text-sm text-gray-400 mt-1">
            Gérez vos annonces et suivez leurs performances
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white
                     text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex-shrink-0"
        >
          <Plus size={16} /> Publier une nouvelle offre
        </button>
      </div>

      <OffresTabs tab={tab} setTab={setTab} stats={data?.stats} />

      <OffresFilters
        search={search} setSearch={setSearch}
        filterCont={filterCont} setFilterCont={setFilterCont}
        filterLoc={filterLoc} setFilterLoc={setFilterLoc}
        cities={cities}
      />

      {loading ? (
        <OffreSkeleton />
      ) : offres.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
            <Plus size={26} className="text-[#E8622A]" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Aucune offre pour le moment</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Publiez votre première offre pour commencer à recevoir des candidatures.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white
                       text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <Plus size={15} /> Publier une offre
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <Search size={22} className="text-gray-300" />
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

      {showModal && (
        <OffreModal
          mode={editingId ? 'edit' : 'create'}
          onSave={(form) => handleCreate(form, () => setShowModal(false))}
          onClose={closeModal}
          saving={saving}
        />
      )}

      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
    </div>
  );
}
