// src/components/destinations/DestinationGrid.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, FileText, ChevronDown, SlidersHorizontal, Loader2 } from 'lucide-react';
import { LocaleMark } from '@/components/icons/CustomIcons';
import { AxiosError } from 'axios';
import api from '@/lib/api';

interface Destination {
  id: number;
  name: string;
  slug: string;
  description?: string;
  coverImage: string;
  continent?: string;
  articleCount?: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    data: Destination[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      pageSize: number;
    };
  };
}

// ─── Hook reveal ──────────────────────────────────────────────────────────────

function useReveal(threshold = 0.08) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useCallback((node: HTMLElement | null) => setEl(node), []);

  useEffect(() => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);

  return { ref, visible };
}

// ─── Hook détection touch ─────────────────────────────────────────────────────

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => { setIsTouch(window.matchMedia('(pointer: coarse)').matches); }, []);
  return isTouch;
}

// ─── Carte destination — style ReportageGrid ──────────────────────────────────

function DestinationCard({ dest, delay = 0 }: { dest: Destination; delay?: number }) {
  const { ref, visible } = useReveal(0.06);
  const [hovered, setHovered] = useState(false);
  const isTouch = useIsTouchDevice();
  const overlayVisible = isTouch || hovered;

  return (
    <div
      ref={ref as React.RefCallback<HTMLDivElement>}
      className="transition-all duration-700"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <Link
        href={`/destinations/${dest.slug}`}
        className="group block relative overflow-hidden rounded-2xl active:scale-[0.98] transition-transform duration-150"
        style={{ aspectRatio: '4/3' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="absolute inset-0">
          <Image
            src={dest.coverImage || '/images/placeholder-dest.jpg'}
            alt={dest.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Dégradé de base */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.45) 50%, rgba(0,0,0,0.05) 100%)' }}
          />
        </div>

        {/* Badge continent */}
        {dest.continent && (
          <span
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm z-10"
            style={{ background: 'rgba(26,92,67,0.88)' }}
          >
            <LocaleMark size={12} />
            <span className="hidden sm:inline">{dest.continent}</span>
          </span>
        )}

        {/* ── Overlay hover émeraude ── */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5 transition-opacity duration-300 z-10"
          style={{
            background: 'linear-gradient(to top, rgba(26,92,67,0.97) 0%, rgba(26,92,67,0.60) 55%, transparent 100%)',
            opacity: overlayVisible ? 1 : 0,
          }}
        >
          <h3 className="font-bold text-base sm:text-lg leading-tight text-white mb-1 uppercase tracking-wide">
            {dest.name}
          </h3>
          {dest.description && (
            <p className="hidden sm:block text-white/75 text-[11px] leading-relaxed line-clamp-2 mb-2">
              {dest.description}
            </p>
          )}
          <div className="border-t pt-2.5" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
            <span className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: '#C8A84B' }}>
              <FileText size={9} />
              {dest.articleCount ?? 0} articles &amp; vidéos
            </span>
          </div>
        </div>

        {/* ── État par défaut ── */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 transition-opacity duration-300 z-10"
          style={{ opacity: overlayVisible ? 0 : 1 }}
        >
          <h3 className="font-bold text-base sm:text-lg leading-tight text-white uppercase tracking-wide mb-1">
            {dest.name}
          </h3>
          <p className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em' }}>
            {dest.articleCount ?? 0} articles &amp; vidéos
          </p>
        </div>
      </Link>
    </div>
  );
}

// ─── Squelette ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-gray-200 animate-pulse" style={{ aspectRatio: '4/3' }} />
      ))}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const CONTINENTS = ['TOUTES', 'AFRIQUE', 'EUROPE', 'AMÉRIQUES', 'ASIE/MOYEN-ORIENT', 'OCÉANIE'];

const DestinationGrid = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filter, setFilter]             = useState('TOUTES');
  const [searchQuery, setSearchQuery]   = useState('');
  const [loading, setLoading]           = useState(false);
  const [page, setPage]                 = useState(1);
  const [hasMore, setHasMore]           = useState(true);

  const { ref: headingRef, visible: headingVisible } = useReveal(0.1);
  const { ref: filterRef,  visible: filterVisible  } = useReveal(0.05);
  const { ref: gridRef,    visible: gridVisible    } = useReveal(0.03);

  const fetchDestinations = useCallback(async (isNewFilter = false) => {
    if (loading) return;
    try {
      setLoading(true);
      const currentPage = isNewFilter ? 1 : page;
      const response = await api.get<ApiResponse>('/destinations', {
        params: {
          continent: filter !== 'TOUTES' ? filter : undefined,
          search: searchQuery || undefined,
          page: currentPage,
          pageSize: 8,
          status: 'PUBLISHED',
        },
      });
      const apiData = response.data.data;
      const newDestinations = apiData.data || [];
      const pagination = apiData.pagination;

      if (isNewFilter) {
        setDestinations(newDestinations);
        setPage(2);
      } else {
        setDestinations((prev) => [...prev, ...newDestinations]);
        setPage((prev) => prev + 1);
      }
      setHasMore(pagination ? pagination.currentPage < pagination.totalPages : newDestinations.length >= 8);
    } catch (error) {
      if (error instanceof AxiosError) console.error('Erreur destinations:', error.response?.data || error.message);
      if (isNewFilter) setDestinations([]);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchQuery, page]);

  useEffect(() => {
    const t = setTimeout(() => fetchDestinations(true), 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchQuery]);

  return (
    <section className="py-12 sm:py-16 px-5 sm:px-6" style={{ background: '#F7F9F8' }}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Heading ── */}
        <div
          ref={headingRef as React.RefCallback<HTMLDivElement>}
          className="flex items-center gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-gray-200 transition-all duration-700"
          style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? 'none' : 'translateY(20px)' }}
        >
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#1A5C43' }}
          >
            <LocaleMark size={32} className="shrink-0 text-white" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: '#B85C38' }}>
              — Explorer
            </p>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}>
              Toutes les <span style={{ color: '#1A5C43' }}>destinations</span>
            </h2>
          </div>
        </div>

        {/* ── Barre filtres compacte ── */}
        <div
          ref={filterRef as React.RefCallback<HTMLDivElement>}
          className="transition-all duration-700"
          style={{ opacity: filterVisible ? 1 : 0, transform: filterVisible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Ligne 1 — recherche + filtre tri */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <SlidersHorizontal size={14} style={{ color: '#1A5C43' }} />
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none transition-all focus:border-[#1A5C43] disabled:opacity-50"
                />
              </div>
              {!loading && destinations.length > 0 && (
                <span className="ml-auto text-[10px] font-medium text-gray-400 shrink-0">
                  {destinations.length} destination{destinations.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Ligne 2 — pills continents scrollables */}
            <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {CONTINENTS.map((c) => {
                const isActive = filter === c;
                return (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    disabled={loading}
                    className="shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: isActive ? '#1A5C43' : 'rgba(0,0,0,0.04)',
                      color: isActive ? '#fff' : '#6B7280',
                      boxShadow: isActive ? '0 2px 8px rgba(26,92,67,0.3)' : 'none',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(26,92,67,0.08)'; e.currentTarget.style.color = '#1A5C43'; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#6B7280'; } }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Grille ── */}
        <div ref={gridRef as React.RefCallback<HTMLDivElement>}>
          {loading && destinations.length === 0 ? (
            <Skeleton />
          ) : destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {destinations.map((dest, i) => (
                <DestinationCard key={dest.id} dest={dest} delay={Math.min(i, 7) * 70} />
              ))}
            </div>
          ) : (
            <div
              className="py-16 text-center rounded-2xl border border-dashed border-gray-200"
              style={{ background: '#F7F9F8' }}
            >
              <p className="text-gray-400 text-sm">Aucune destination ne correspond à vos critères.</p>
            </div>
          )}
        </div>

        {/* ── Voir plus ── */}
        {hasMore && destinations.length > 0 && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => fetchDestinations(false)}
              disabled={loading}
              className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-[0.2em] px-10 py-4 rounded-full text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#1A5C43' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#B85C38'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1A5C43'; }}
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={14} /> Chargement...</>
              ) : (
                <><ChevronDown size={14} /> Voir plus de destinations</>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DestinationGrid;












// // src/components/destinations/DestinationGrid.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Search, Loader2 } from 'lucide-react';
// import { AxiosError } from 'axios';
// import api from '@/lib/api';

// interface Destination {
//   id: number;
//   name: string;
//   slug: string;
//   description?: string;
//   coverImage: string;
//   continent?: string;
//   articleCount?: number;
// }

// interface ApiResponse {
//   success: boolean;
//   data: {
//     data: Destination[];
//     pagination: {
//       currentPage: number;
//       totalPages: number;
//       totalItems: number;
//       pageSize: number;
//     };
//   };
// }

// const DestinationGrid = () => {
//   const [destinations, setDestinations] = useState<Destination[]>([]);
//   const [filter, setFilter] = useState('TOUTES');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const continents = ['TOUTES', 'AFRIQUE', 'EUROPE', 'AMÉRIQUES', 'ASIE/MOYEN-ORIENT', 'OCÉANIE'];

//   const fetchDestinations = async (isNewFilter = false) => {
//     if (loading) return;

//     try {
//       setLoading(true);
//       const currentPage = isNewFilter ? 1 : page;
      
//       // ✅ Endpoint principal : Liste des destinations
//       const response = await api.get<ApiResponse>('/destinations', {
//         params: {
//           continent: filter !== 'TOUTES' ? filter : undefined,
//           search: searchQuery || undefined,
//           page: currentPage,
//           pageSize: 8,
//           status: 'PUBLISHED'
//         }
//       });

//       // ✅ CORRECTION : Accès correct aux données
//       const apiData = response.data.data; // Premier .data = axios, second .data = structure API
//       const newDestinations = apiData.data || []; // Les destinations sont dans data.data
//       const pagination = apiData.pagination;

//       if (isNewFilter) {
//         setDestinations(newDestinations);
//         setPage(2);
//       } else {
//         setDestinations((prev) => [...prev, ...newDestinations]);
//         setPage((prev) => prev + 1);
//       }

//       // Vérifier s'il y a plus de résultats
//       if (pagination) {
//         setHasMore(pagination.currentPage < pagination.totalPages);
//       } else {
//         setHasMore(newDestinations.length >= 8);
//       }
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         console.error("Erreur destinations:", error.response?.data || error.message);
//       }
//       if (isNewFilter) {
//         setDestinations([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Déclencher la recherche quand le filtre ou la saisie change
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchDestinations(true);
//     }, 300); // Debounce de 300ms pour la recherche

//     return () => clearTimeout(timeoutId);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filter, searchQuery]);

//   return (
//     <section className="py-12 px-6 max-w-7xl mx-auto">
      
//       {/* BARRE DE FILTRES ET RECHERCHE */}
//       <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
//         <div className="flex flex-wrap justify-center gap-3">
//           {continents.map((c) => (
//             <button
//               key={c}
//               onClick={() => setFilter(c)}
//               disabled={loading}
//               className={`px-5 py-2 rounded-full text-[11px] font-bold tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                 filter === c 
//                 ? 'bg-[#F19300] text-white shadow-lg' 
//                 : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
//               }`}
//             >
//               {c}
//             </button>
//           ))}
//         </div>

//         <div className="relative w-full lg:w-80">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//           <input 
//             type="text"
//             placeholder="Rechercher un pays, une ville..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             disabled={loading}
//             className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1D3A8A]/10 outline-none transition-all disabled:opacity-50"
//           />
//         </div>
//       </div>

//       <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2D3E50] uppercase tracking-[0.15em] mb-10">
//         Explorez nos destinations
//       </h2>

//       {/* GRILLE */}
//       {loading && destinations.length === 0 ? (
//         <div className="text-center py-20 bg-slate-50 rounded-2xl">
//           <Loader2 className="animate-spin mx-auto mb-4 text-[#F19300]" size={40} />
//           <p className="text-gray-400">Chargement des destinations...</p>
//         </div>
//       ) : destinations.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {destinations.map((dest) => (
//             <Link
//               href={`/destinations/${dest.slug}`}
//               key={dest.id}
//               className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-xl bg-slate-200 hover:shadow-2xl transition-shadow"
//             >
//               <Image
//                 src={dest.coverImage || '/images/placeholder-dest.jpg'}
//                 alt={dest.name}
//                 fill
//                 className="object-cover transition-transform duration-700 group-hover:scale-110"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
//               <div className="absolute bottom-6 left-6 text-white">
//                 <h3 className="text-xl font-bold tracking-wide mb-1 uppercase">{dest.name}</h3>
//                 <p className="text-xs font-light text-white/80 tracking-widest uppercase">
//                   {dest.articleCount || 0} Articles & Vidéos
//                 </p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-20 bg-slate-50 rounded-2xl">
//           <p className="text-gray-400 text-lg">
//             Aucune destination ne correspond à vos critères de recherche.
//           </p>
//         </div>
//       )}

//       {/* BOUTON VOIR PLUS */}
//       {hasMore && destinations.length > 0 && (
//         <div className="mt-16 flex justify-center">
//           <button 
//             onClick={() => fetchDestinations(false)}
//             disabled={loading}
//             className="bg-[#1D3A8A] hover:bg-[#F19300] disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-10 py-4 rounded-lg font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="animate-spin" size={16} />
//                 Chargement...
//               </>
//             ) : (
//               'Voir plus de destinations'
//             )}
//           </button>
//         </div>
//       )}
//     </section>
//   );
// };

// export default DestinationGrid;