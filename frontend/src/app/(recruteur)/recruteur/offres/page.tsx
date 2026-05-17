// src/app/(recruteur)/recruteur/offres/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, ChevronDown, AlertCircle } from 'lucide-react';
import { useOffres } from '@/hooks/useOffres';
import OffreCard from '@/components/recruteur/offres/OffreCard';
import OffreModal from '@/components/recruteur/offres/OffreModal';
import {
  createOffre,
  updateOffreStatus,
  duplicateOffre,
  archiveOffre,
} from '@/services/offres.service';
import type { Offre, OffreFormData, OffreTab } from '@/types/offres.types';
import { CONTRACT_TYPES } from '@/types/offres.types';
import clsx from 'clsx';

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS: { key: OffreTab; label: string; statKey: 'online' | 'drafts' | 'archives' }[] = [
  { key: 'online',   label: 'En ligne',   statKey: 'online'   },
  { key: 'drafts',   label: 'Brouillons', statKey: 'drafts'   },
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
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 border-l-4 border-l-gray-100 px-5 py-4 h-24"
        />
      ))}
    </div>
  );
}

// ── Toast d'erreur léger ──────────────────────────────────────────────────────
function ErrorToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3
                    bg-red-50 border border-red-200 text-red-700 text-sm font-medium
                    px-4 py-3 rounded-2xl shadow-lg">
      <AlertCircle size={16} className="flex-shrink-0" />
      {message}
      <button onClick={onClose} className="ml-2 text-red-400 hover:text-red-600 font-bold">×</button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GererOffresPage() {
  const { data, offres, loading, setOffres, refetch } = useOffres();

  const [tab,        setTab]        = useState<OffreTab>('online');
  const [search,     setSearch]     = useState('');
  const [filterCont, setFilterCont] = useState('');
  const [filterLoc,  setFilterLoc]  = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // ── Filtered offres ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const allowed = STATUS_MAP[tab];
    return offres.filter((o) => {
      const matchTab    = allowed.includes(o.status);
      const matchSearch = !search     || o.title.toLowerCase().includes(search.toLowerCase())    || o.location.toLowerCase().includes(search.toLowerCase());
      const matchCont   = !filterCont || o.contractType === filterCont;
      const matchLoc    = !filterLoc  || o.location.toLowerCase().includes(filterLoc.toLowerCase());
      return matchTab && matchSearch && matchCont && matchLoc;
    });
  }, [offres, tab, search, filterCont, filterLoc]);

  // Villes issues des vraies offres
  const cities = useMemo(() => {
    const all = offres.map((o) => o.location.split(' ')[0]).filter(Boolean);
    return [...new Set(all)].sort();
  }, [offres]);

  // ── Create ─────────────────────────────────────────────────────────────────
  // FIX : pas de fallback optimiste avec un faux ID → l'offre créée en DB
  // a un vrai ID ; on l'insère directement dans le state depuis la réponse API.
  // Si l'API échoue, on affiche une erreur sans toucher au state.
  async function handleCreate(form: OffreFormData) {
    setSaving(true);
    setError(null);
    try {
      const created = await createOffre(form);
      // created vient directement de la DB avec un vrai ID
      setOffres([created, ...offres]);
      setTab('online');
      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      console.error('[handleCreate]', err);
      setError("La publication a échoué. Vérifiez votre connexion et réessayez.");
      // Ne pas fermer le modal → l'utilisateur peut réessayer
    } finally {
      setSaving(false);
    }
  }

  // ── Pause / Reprise ────────────────────────────────────────────────────────
  async function handlePause(id: string) {
    const offre = offres.find((o) => o.id === id);
    if (!offre) return;
    const nextStatus = offre.status === 'paused' ? 'active' : 'paused';

    // Mise à jour optimiste (statut est connu en avance — pas de risque de faux ID)
    setOffres(offres.map((o) => o.id === id ? { ...o, status: nextStatus } : o));

    try {
      await updateOffreStatus(id, nextStatus);
    } catch {
      // Rollback
      setOffres(offres.map((o) => o.id === id ? { ...o, status: offre.status } : o));
      setError("Impossible de modifier le statut. Réessayez.");
    }
  }

  // ── Archive ────────────────────────────────────────────────────────────────
  async function handleArchive(id: string) {
    if (!confirm('Archiver cette offre ? Elle ne sera plus visible sur le site.')) return;

    const offre = offres.find((o) => o.id === id);
    setOffres(offres.map((o) => o.id === id ? { ...o, status: 'archived' } : o));

    try {
      await archiveOffre(id);
    } catch {
      if (offre) setOffres(offres.map((o) => o.id === id ? offre : o));
      setError("Impossible d'archiver l'offre. Réessayez.");
    }
  }

  // ── Duplicate ──────────────────────────────────────────────────────────────
  // FIX : même logique que create — on utilise uniquement la réponse API,
  // pas un objet local avec un faux ID.
  async function handleDuplicate(id: string) {
    try {
      const dup = await duplicateOffre(id);
      setOffres([dup, ...offres]);
      setTab('drafts');
    } catch {
      setError("Impossible de dupliquer l'offre. Réessayez.");
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mes Offres d'Emploi</h1>
          <p className="text-sm text-gray-400 mt-1">
            Gérez vos annonces et suivez leurs performances
          </p>
        </div>
        <button
          onClick={() => { setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white
                     text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex-shrink-0"
        >
          <Plus size={16} /> Publier une nouvelle offre
        </button>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0 border-b border-gray-200">
        {TABS.map(({ key, label, statKey }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px',
              tab === key
                ? 'border-[#E8622A] text-[#E8622A]'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
          >
            {label}
            {data && (
              <span
                className={clsx(
                  'text-xs font-bold px-1.5 py-0.5 rounded-full',
                  tab === key ? 'bg-[#FFF3EC] text-[#E8622A]' : 'bg-gray-100 text-gray-500',
                )}
              >
                {data.stats[statKey]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre ou localisation…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
          />
        </div>

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

        {cities.length > 0 && (
          <div className="relative">
            <select
              value={filterLoc}
              onChange={(e) => setFilterLoc(e.target.value)}
              className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm
                         text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30
                         focus:border-[#E8622A] transition cursor-pointer"
            >
              <option value="">Toutes les localisations</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>

      {/* ── Offre list ──────────────────────────────────────────────────── */}
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
            onClick={() => { setEditingId(null); setShowModal(true); }}
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

      {/* ── Modal ───────────────────────────────────────────────────────── */}
      {showModal && (
        <OffreModal
          mode={editingId ? 'edit' : 'create'}
          onSave={handleCreate}
          onClose={() => { setShowModal(false); setEditingId(null); setError(null); }}
          saving={saving}
        />
      )}

      {/* ── Error toast ──────────────────────────────────────────────────── */}
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
    </div>
  );
}



















// // src/app/(recruteur)/recruteur/offres/page.tsx
// 'use client';

// import { useState, useMemo } from 'react';
// import { Plus, Search, ChevronDown } from 'lucide-react';
// import { useOffres } from '@/hooks/useOffres';
// import OffreCard from '@/components/recruteur/offres/OffreCard';
// import OffreModal from '@/components/recruteur/offres/OffreModal';
// import {
//   createOffre,
//   updateOffreStatus,
//   duplicateOffre,
//   archiveOffre,
// } from '@/services/offres.service';
// import type { Offre, OffreFormData, OffreTab } from '@/types/offres.types';
// import { CONTRACT_TYPES } from '@/types/offres.types';
// import clsx from 'clsx';

// // ── Tab config ────────────────────────────────────────────────────────────────
// const TABS: { key: OffreTab; label: string; statKey: 'online' | 'drafts' | 'archives' }[] = [
//   { key: 'online',   label: 'En ligne',   statKey: 'online'   },
//   { key: 'drafts',   label: 'Brouillons', statKey: 'drafts'   },
//   { key: 'archives', label: 'Archives',   statKey: 'archives' },
// ];

// const STATUS_MAP: Record<OffreTab, string[]> = {
//   online:   ['active', 'paused'],
//   drafts:   ['draft'],
//   archives: ['archived'],
// };

// // ── Skeleton ──────────────────────────────────────────────────────────────────
// function OffreSkeleton() {
//   return (
//     <div className="space-y-3 animate-pulse">
//       {[1, 2, 3].map((i) => (
//         <div
//           key={i}
//           className="bg-white rounded-2xl border border-gray-100 border-l-4 border-l-gray-100 px-5 py-4 h-24"
//         />
//       ))}
//     </div>
//   );
// }

// // ── Page ──────────────────────────────────────────────────────────────────────
// export default function GererOffresPage() {
//   const { data, offres, loading, setOffres } = useOffres();

//   const [tab,        setTab]        = useState<OffreTab>('online');
//   const [search,     setSearch]     = useState('');
//   const [filterCont, setFilterCont] = useState('');
//   const [filterLoc,  setFilterLoc]  = useState('');
//   const [showModal,  setShowModal]  = useState(false);
//   const [editingId,  setEditingId]  = useState<string | null>(null);
//   const [saving,     setSaving]     = useState(false);

//   // ── Filtered offres ─────────────────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     const allowedStatuses = STATUS_MAP[tab];
//     return offres.filter((o) => {
//       const matchTab    = allowedStatuses.includes(o.status);
//       const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.location.toLowerCase().includes(search.toLowerCase());
//       const matchCont   = !filterCont || o.contractType === filterCont;
//       const matchLoc    = !filterLoc  || o.location.toLowerCase().includes(filterLoc.toLowerCase());
//       return matchTab && matchSearch && matchCont && matchLoc;
//     });
//   }, [offres, tab, search, filterCont, filterLoc]);

//   // ── Villes uniques issues des vraies offres ────────────────────────────────
//   const cities = useMemo(() => {
//     const all = offres.map((o) => o.location.split(' ')[0]).filter(Boolean);
//     return [...new Set(all)].sort();
//   }, [offres]);

//   // ── Create ─────────────────────────────────────────────────────────────────
//   async function handleCreate(form: OffreFormData) {
//     setSaving(true);
//     try {
//       const created = await createOffre(form);
//       // Ajouter en tête de liste + aller sur l'onglet "En ligne"
//       setOffres([created, ...offres]);
//       setTab('online');
//     } catch {
//       // Fallback optimiste : afficher l'offre localement même si l'API échoue
//       const mock: Offre = {
//         id:                `offre-${Date.now()}`,
//         title:             form.step1.title,
//         sector:            form.step1.sector,
//         contractType:      form.step1.contractType,
//         location:          form.step1.location,
//         publishedAt:       new Date().toISOString(),
//         expiresAt:         new Date(Date.now() + 30 * 86400000).toISOString(),
//         status:            'active',
//         isPremium:         false,
//         views:             0,
//         candidatesCount:   0,
//         newCandidatesCount: 0,
//       };
//       setOffres([mock, ...offres]);
//       setTab('online');
//     } finally {
//       setSaving(false);
//       setShowModal(false);
//       setEditingId(null);
//     }
//   }

//   // ── Pause / Reprise ────────────────────────────────────────────────────────
//   async function handlePause(id: string) {
//     const offre = offres.find((o) => o.id === id);
//     if (!offre) return;
//     const nextStatus = offre.status === 'paused' ? 'active' : 'paused';

//     // Mise à jour optimiste
//     setOffres(offres.map((o) => o.id === id ? { ...o, status: nextStatus } : o));

//     try {
//       await updateOffreStatus(id, nextStatus);
//     } catch {
//       // Rollback
//       setOffres(offres.map((o) => o.id === id ? { ...o, status: offre.status } : o));
//     }
//   }

//   // ── Archive ────────────────────────────────────────────────────────────────
//   async function handleArchive(id: string) {
//     if (!confirm('Archiver cette offre ? Elle ne sera plus visible sur le site.')) return;

//     setOffres(offres.map((o) => o.id === id ? { ...o, status: 'archived' } : o));
//     setTab('archives');

//     try {
//       await archiveOffre(id);
//     } catch {
//       // Rollback
//       const original = offres.find((o) => o.id === id);
//       if (original) {
//         setOffres(offres.map((o) => o.id === id ? original : o));
//       }
//     }
//   }

//   // ── Duplicate ──────────────────────────────────────────────────────────────
//   async function handleDuplicate(id: string) {
//     try {
//       const dup = await duplicateOffre(id);
//       setOffres([dup, ...offres]);
//       setTab('drafts'); // la copie est un brouillon
//     } catch {
//       const orig = offres.find((o) => o.id === id);
//       if (!orig) return;
//       const mock: Offre = {
//         ...orig,
//         id:    `offre-dup-${Date.now()}`,
//         title: `${orig.title} (copie)`,
//         status: 'draft',
//         views: 0,
//         candidatesCount:   0,
//         newCandidatesCount: 0,
//       };
//       setOffres([mock, ...offres]);
//       setTab('drafts');
//     }
//   }

//   return (
//     <div className="p-6 max-w-5xl mx-auto space-y-5">

//       {/* ── Page Header ────────────────────────────────────────────────── */}
//       <div className="flex items-start justify-between gap-4 flex-wrap">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900">Mes Offres d'Emploi</h1>
//           <p className="text-sm text-gray-400 mt-1">
//             Gérez vos annonces et suivez leurs performances
//           </p>
//         </div>
//         <button
//           onClick={() => { setEditingId(null); setShowModal(true); }}
//           className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white
//                      text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex-shrink-0"
//         >
//           <Plus size={16} /> Publier une nouvelle offre
//         </button>
//       </div>

//       {/* ── Tabs ───────────────────────────────────────────────────────── */}
//       <div className="flex items-center gap-0 border-b border-gray-200">
//         {TABS.map(({ key, label, statKey }) => (
//           <button
//             key={key}
//             onClick={() => setTab(key)}
//             className={clsx(
//               'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px',
//               tab === key
//                 ? 'border-[#E8622A] text-[#E8622A]'
//                 : 'border-transparent text-gray-500 hover:text-gray-700',
//             )}
//           >
//             {label}
//             {data && (
//               <span
//                 className={clsx(
//                   'text-xs font-bold px-1.5 py-0.5 rounded-full',
//                   tab === key ? 'bg-[#FFF3EC] text-[#E8622A]' : 'bg-gray-100 text-gray-500',
//                 )}
//               >
//                 {data.stats[statKey]}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* ── Filters ────────────────────────────────────────────────────── */}
//       <div className="flex flex-wrap items-center gap-3">
//         <div className="relative flex-1 min-w-52">
//           <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Rechercher une offre par titre, localisation…"
//             className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
//                        focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
//           />
//         </div>

//         <div className="relative">
//           <select
//             value={filterCont}
//             onChange={(e) => setFilterCont(e.target.value)}
//             className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm
//                        text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30
//                        focus:border-[#E8622A] transition cursor-pointer"
//           >
//             <option value="">Tous les contrats</option>
//             {CONTRACT_TYPES.map((c) => <option key={c}>{c}</option>)}
//           </select>
//           <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//         </div>

//         {/* ── FIX : villes issues des vraies offres, pas d'une liste statique ── */}
//         {cities.length > 0 && (
//           <div className="relative">
//             <select
//               value={filterLoc}
//               onChange={(e) => setFilterLoc(e.target.value)}
//               className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm
//                          text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30
//                          focus:border-[#E8622A] transition cursor-pointer"
//             >
//               <option value="">Toutes les localisations</option>
//               {cities.map((c) => <option key={c}>{c}</option>)}
//             </select>
//             <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//           </div>
//         )}
//       </div>

//       {/* ── Offre list ──────────────────────────────────────────────────── */}
//       {loading ? (
//         <OffreSkeleton />
//       ) : offres.length === 0 ? (
//         /* Compte vide : aucune offre publiée */
//         <div className="flex flex-col items-center justify-center py-20 text-center">
//           <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
//             <Plus size={26} className="text-[#E8622A]" />
//           </div>
//           <p className="text-sm font-semibold text-gray-700">Aucune offre pour le moment</p>
//           <p className="text-xs text-gray-400 mt-1 max-w-xs">
//             Publiez votre première offre pour commencer à recevoir des candidatures.
//           </p>
//           <button
//             onClick={() => { setEditingId(null); setShowModal(true); }}
//             className="mt-4 flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white
//                        text-sm font-semibold px-5 py-2.5 rounded-xl transition"
//           >
//             <Plus size={15} /> Publier une offre
//           </button>
//         </div>
//       ) : filtered.length === 0 ? (
//         /* Offres existent mais aucune ne correspond aux filtres */
//         <div className="flex flex-col items-center justify-center py-16 text-center">
//           <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
//             <Search size={22} className="text-gray-300" />
//           </div>
//           <p className="text-sm font-semibold text-gray-500">Aucune offre trouvée</p>
//           <p className="text-xs text-gray-400 mt-1">Modifiez vos filtres ou publiez une nouvelle offre.</p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {filtered.map((offre) => (
//             <OffreCard
//               key={offre.id}
//               offre={offre}
//               onEdit={(id) => { setEditingId(id); setShowModal(true); }}
//               onPause={handlePause}
//               onArchive={handleArchive}
//               onDuplicate={handleDuplicate}
//             />
//           ))}
//           <p className="text-xs text-gray-400 text-right pt-1">
//             {filtered.length} offre{filtered.length > 1 ? 's' : ''}
//           </p>
//         </div>
//       )}

//       {/* ── Modal ───────────────────────────────────────────────────────── */}
//       {showModal && (
//         <OffreModal
//           mode={editingId ? 'edit' : 'create'}
//           onSave={handleCreate}
//           onClose={() => { setShowModal(false); setEditingId(null); }}
//           saving={saving}
//         />
//       )}
//     </div>
//   );
// }



















// // src/app/(recruteur)/recruteur/offres/page.tsx
// 'use client';

// import { useState, useMemo } from 'react';
// import { Plus, Search, ChevronDown } from 'lucide-react';
// import { useOffres } from '@/hooks/useOffres';
// import OffreCard from '@/components/recruteur/offres/OffreCard';
// import OffreModal from '@/components/recruteur/offres/OffreModal';
// import { createOffre, updateOffreStatus, duplicateOffre, archiveOffre } from '@/services/offres.service';
// import type { Offre, OffreFormData, OffreTab } from '@/types/offres.types';
// import { CONTRACT_TYPES } from '@/types/offres.types';
// import clsx from 'clsx';

// // ── Tab config ────────────────────────────────────────────────────────────────
// const TABS: { key: OffreTab; label: string; statKey: 'online' | 'drafts' | 'archives' }[] = [
//   { key: 'online',   label: 'En ligne',  statKey: 'online'   },
//   { key: 'drafts',   label: 'Brouillons', statKey: 'drafts'  },
//   { key: 'archives', label: 'Archives',   statKey: 'archives' },
// ];

// const STATUS_MAP: Record<OffreTab, string[]> = {
//   online:   ['active', 'paused'],
//   drafts:   ['draft'],
//   archives: ['archived'],
// };

// // ── Skeleton ──────────────────────────────────────────────────────────────────
// function OffreSkeleton() {
//   return (
//     <div className="space-y-3 animate-pulse">
//       {[1, 2, 3].map((i) => (
//         <div key={i} className="bg-white rounded-2xl border border-gray-100 border-l-4 border-l-gray-100 px-5 py-4 h-24" />
//       ))}
//     </div>
//   );
// }

// // ── Page ──────────────────────────────────────────────────────────────────────
// export default function GererOffresPage() {
//   const { data, offres, loading, setOffres } = useOffres();

//   const [tab,        setTab]        = useState<OffreTab>('online');
//   const [search,     setSearch]     = useState('');
//   const [filterCont, setFilterCont] = useState('');
//   const [filterLoc,  setFilterLoc]  = useState('');
//   const [showModal,  setShowModal]  = useState(false);
//   const [editingId,  setEditingId]  = useState<string | null>(null);
//   const [saving,     setSaving]     = useState(false);

//   // ── Filtered offres ─────────────────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     const allowedStatuses = STATUS_MAP[tab];
//     return offres.filter((o) => {
//       const matchTab     = allowedStatuses.includes(o.status);
//       const matchSearch  = !search  || o.title.toLowerCase().includes(search.toLowerCase()) || o.location.toLowerCase().includes(search.toLowerCase());
//       const matchCont    = !filterCont || o.contractType === filterCont;
//       const matchLoc     = !filterLoc  || o.location.toLowerCase().includes(filterLoc.toLowerCase());
//       return matchTab && matchSearch && matchCont && matchLoc;
//     });
//   }, [offres, tab, search, filterCont, filterLoc]);

//   // ── Handlers ────────────────────────────────────────────────────────────────
//   async function handleCreate(form: OffreFormData) {
//     setSaving(true);
//     try {
//       const created = await createOffre(form);
//       setOffres([created, ...offres]);
//     } catch {
//       const mock: Offre = {
//         id: `offre-${Date.now()}`, title: form.step1.title, sector: form.step1.sector,
//         contractType: form.step1.contractType, location: form.step1.location,
//         publishedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
//         status: 'active', isPremium: false, views: 0, candidatesCount: 0, newCandidatesCount: 0,
//       };
//       setOffres([mock, ...offres]);
//     } finally {
//       setSaving(false);
//       setShowModal(false);
//     }
//   }

//   async function handlePause(id: string) {
//     setOffres(offres.map((o) => o.id === id ? { ...o, status: o.status === 'paused' ? 'active' : 'paused' } : o));
//     try { await updateOffreStatus(id, offres.find((o) => o.id === id)?.status === 'paused' ? 'active' : 'paused'); } catch {}
//   }

//   async function handleArchive(id: string) {
//     if (!confirm('Archiver cette offre ? Elle ne sera plus visible sur le site.')) return;
//     setOffres(offres.map((o) => o.id === id ? { ...o, status: 'archived' } : o));
//     try { await archiveOffre(id); } catch {}
//   }

//   async function handleDuplicate(id: string) {
//     try {
//       const dup = await duplicateOffre(id);
//       setOffres([dup, ...offres]);
//     } catch {
//       const orig = offres.find((o) => o.id === id);
//       if (!orig) return;
//       const mock: Offre = { ...orig, id: `offre-dup-${Date.now()}`, title: `${orig.title} (copie)`, status: 'draft', views: 0, candidatesCount: 0, newCandidatesCount: 0 };
//       setOffres([mock, ...offres]);
//     }
//   }

//   return (
//     <div className="p-6 max-w-5xl mx-auto space-y-5">

//       {/* Page Header */}
//       <div className="flex items-start justify-between gap-4 flex-wrap">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900">Mes Offres d'Emploi</h1>
//           <p className="text-sm text-gray-400 mt-1">Gérez vos annonces et suivez leurs performances</p>
//         </div>
//         <button
//           onClick={() => { setEditingId(null); setShowModal(true); }}
//           className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white
//                      text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex-shrink-0"
//         >
//           <Plus size={16} /> Publier une nouvelle offre
//         </button>
//       </div>

//       {/* Tabs */}
//       <div className="flex items-center gap-0 border-b border-gray-200">
//         {TABS.map(({ key, label, statKey }) => (
//           <button
//             key={key}
//             onClick={() => setTab(key)}
//             className={clsx(
//               'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px',
//               tab === key
//                 ? 'border-[#E8622A] text-[#E8622A]'
//                 : 'border-transparent text-gray-500 hover:text-gray-700'
//             )}
//           >
//             {label}
//             {data && (
//               <span className={clsx(
//                 'text-xs font-bold px-1.5 py-0.5 rounded-full',
//                 tab === key ? 'bg-[#FFF3EC] text-[#E8622A]' : 'bg-gray-100 text-gray-500'
//               )}>
//                 {data.stats[statKey]}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-3">
//         <div className="relative flex-1 min-w-52">
//           <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Rechercher une offre par titre, localisation…"
//             className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
//                        focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
//           />
//         </div>

//         {/* Contract filter */}
//         <div className="relative">
//           <select
//             value={filterCont}
//             onChange={(e) => setFilterCont(e.target.value)}
//             className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm
//                        text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30
//                        focus:border-[#E8622A] transition cursor-pointer"
//           >
//             <option value="">Tous les contrats</option>
//             {CONTRACT_TYPES.map((c) => <option key={c}>{c}</option>)}
//           </select>
//           <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//         </div>

//         {/* Location filter */}
//         <div className="relative">
//           <select
//             value={filterLoc}
//             onChange={(e) => setFilterLoc(e.target.value)}
//             className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-sm
//                        text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30
//                        focus:border-[#E8622A] transition cursor-pointer"
//           >
//             <option value="">Toutes les localisations</option>
//             {['Paris', 'Monaco', 'Cannes', 'Saint-Tropez', 'Nice', 'Lyon'].map((l) => (
//               <option key={l}>{l}</option>
//             ))}
//           </select>
//           <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//         </div>
//       </div>

//       {/* Offre list */}
//       {loading ? (
//         <OffreSkeleton />
//       ) : filtered.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 text-center">
//           <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
//             <Plus size={22} className="text-gray-300" />
//           </div>
//           <p className="text-sm font-semibold text-gray-500">Aucune offre trouvée</p>
//           <p className="text-xs text-gray-400 mt-1">Modifiez vos filtres ou publiez une nouvelle offre.</p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {filtered.map((offre) => (
//             <OffreCard
//               key={offre.id}
//               offre={offre}
//               onEdit={(id) => { setEditingId(id); setShowModal(true); }}
//               onPause={handlePause}
//               onArchive={handleArchive}
//               onDuplicate={handleDuplicate}
//             />
//           ))}
//           <p className="text-xs text-gray-400 text-right pt-1">
//             {filtered.length} offre{filtered.length > 1 ? 's' : ''}
//           </p>
//         </div>
//       )}

//       {/* Modal */}
//       {showModal && (
//         <OffreModal
//           mode={editingId ? 'edit' : 'create'}
//           onSave={handleCreate}
//           onClose={() => { setShowModal(false); setEditingId(null); }}
//           saving={saving}
//         />
//       )}
//     </div>
//   );
// }