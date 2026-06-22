// src/components/videos/VideoExplorer.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown, ExternalLink, Clock } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '@/lib/api';

interface VideoItem {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  createdAt: string;
  excerpt: string;
  category: { id: number; name: string; slug: string };
  content: Array<{ type: string; url?: string }>;
}

interface CategoryFilter {
  id: string;
  label: string;
}

const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all',              label: 'Toutes'             },
  { id: 'hotellerie',       label: 'Hôtellerie'         },
  { id: 'transport',        label: 'Transport'          },
  { id: 'restauration',     label: 'Restauration'       },
  { id: 'voyages-affaires', label: "Voyages d'Affaires" },
  { id: 'mice-evenements',  label: 'MICE & Événements'  },
  { id: 'divertissement',   label: 'Divertissement'     },
  { id: 'tourisme-durable', label: 'Tourisme Durable'   },
];

const PAGE_SIZE = 8;

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

// ─── Carte vidéo — style ReportageGrid (image sombre + overlay hover) ─────────

function VideoCard({ video, delay = 0 }: { video: VideoItem; delay?: number }) {
  const { ref, visible } = useReveal(0.06);
  const [hovered, setHovered] = useState(false);
  const isTouch = useIsTouchDevice();
  const overlayVisible = isTouch || hovered;
  const hasVideoBlock = video.content?.some((b) => b.type === 'video');

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
        href={`/videos/${video.slug}`}
        className="group block relative overflow-hidden rounded-2xl active:scale-[0.98] transition-transform duration-150"
        style={{ aspectRatio: '16/9' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image + dégradé de base */}
        <div className="absolute inset-0">
          <img
            src={video.coverImage || '/images/placeholder.jpg'}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.55) 45%, rgba(0,0,0,0.08) 100%)' }}
          />
        </div>

        {/* Bouton play centré — visible hors hover */}
        <div
          className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300"
          style={{ opacity: overlayVisible ? 0 : 0.9 }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: 'rgba(184,92,56,0.85)', backdropFilter: 'blur(4px)' }}
          >
            <Play size={16} fill="white" className="text-white ml-0.5" />
          </div>
        </div>

        {/* Badge catégorie */}
        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm z-10"
          style={{ background: 'rgba(184,92,56,0.88)' }}
        >
          <Play size={9} className="fill-current" />
          <span className="hidden sm:inline">{video.category?.name ?? 'Vidéo'}</span>
        </span>

        {/* Badge VIDÉO si bloc video détecté */}
        {hasVideoBlock && (
          <span
            className="absolute top-3 right-3 text-white text-[8px] font-black px-2 py-0.5 rounded z-10 uppercase tracking-wider"
            style={{ background: 'rgba(0,0,0,0.65)' }}
          >
            ▶ VIDEO
          </span>
        )}

        {/* ── Overlay hover (avec excerpt) ── */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 transition-opacity duration-300 z-10"
          style={{
            background: 'linear-gradient(to top, rgba(26,92,67,0.97) 0%, rgba(26,92,67,0.60) 55%, transparent 100%)',
            opacity: overlayVisible ? 1 : 0,
          }}
        >
          <p className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#C8A84B' }}>
            <Clock size={8} />
            {new Date(video.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <h3 className="font-bold text-[12px] sm:text-[13px] leading-snug line-clamp-2 text-white mb-1.5">
            {video.title}
          </h3>
          {video.excerpt && (
            <p className="hidden sm:block text-white/75 text-[10px] leading-relaxed line-clamp-2 mb-2">
              {video.excerpt}
            </p>
          )}
          <div className="border-t pt-2" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold" style={{ color: '#B85C38' }}>
              Regarder la vidéo <ExternalLink size={8} />
            </span>
          </div>
        </div>

        {/* ── État par défaut ── */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transition-opacity duration-300 z-10"
          style={{ opacity: overlayVisible ? 0 : 1 }}
        >
          <p className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1 sm:mb-1.5" style={{ color: '#C8A84B' }}>
            <Clock size={8} />
            {new Date(video.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <h3 className="font-bold text-[12px] sm:text-[13px] leading-snug line-clamp-2 text-white mb-2">{video.title}</h3>
          <div className="border-t pt-2" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold" style={{ color: '#B85C38' }}>
              Regarder la vidéo <ExternalLink size={8} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Squelette ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(PAGE_SIZE).fill(0).map((_, i) => (
        <div key={i} className="rounded-2xl bg-gray-200 animate-pulse" style={{ aspectRatio: '16/9' }} />
      ))}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const VideoExplorer = () => {
  const [videos, setVideos]                 = useState<VideoItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy]                 = useState<'createdAt:desc' | 'createdAt:asc' | 'views:desc'>('createdAt:desc');
  const [currentPage, setCurrentPage]       = useState(1);
  const [totalPages, setTotalPages]         = useState(1);
  const [totalItems, setTotalItems]         = useState(0);
  const [loading, setLoading]               = useState(true);

  const { ref: headingRef, visible: headingVisible } = useReveal(0.1);
  const { ref: filterRef,  visible: filterVisible  } = useReveal(0.05);
  const { ref: gridRef,    visible: gridVisible    } = useReveal(0.03);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          type: 'VIDEO', page: currentPage, pageSize: PAGE_SIZE, status: 'PUBLISHED', sortBy,
        };
        if (activeCategory !== 'all') params.categorySlug = activeCategory;
        const response = await api.get('/mag/articles', { params });
        setVideos(response.data.data ?? []);
        const pagination = response.data.pagination ?? response.data.meta;
        if (pagination) { setTotalPages(pagination.totalPages ?? 1); setTotalItems(pagination.total ?? 0); }
      } catch (error) {
        if (error instanceof AxiosError) console.error('Erreur chargement vidéos:', error.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [activeCategory, sortBy, currentPage]);

  const handleCategoryChange = (id: string) => { setActiveCategory(id); setCurrentPage(1); };
  const handleSortChange     = (value: string) => { setSortBy(value as typeof sortBy); setCurrentPage(1); };
  const handlePageChange     = (page: number) => {
    if (page >= 1 && page <= totalPages) { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 1);
    const end   = Math.min(totalPages, start + 3);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <section className="py-12 sm:py-16 px-5 sm:px-6" style={{ background: '#F7F9F8' }}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Heading ── */}
        <div
          ref={headingRef as React.RefCallback<HTMLDivElement>}
          className="flex items-center gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-gray-200 transition-all duration-700"
          style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? 'none' : 'translateY(20px)' }}
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#B85C38' }}>
            <Play size={15} fill="white" className="text-white ml-0.5" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: '#B85C38' }}>
              — Explorer
            </p>
            <h2 className="text-xl sm:text-2xl font-black leading-tight" style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}>
              Toutes les <span style={{ color: '#1A5C43' }}>vidéos</span>
            </h2>
          </div>
        </div>

        {/* ── Barre de filtres compacte inline ── */}
        <div
          ref={filterRef as React.RefCallback<HTMLDivElement>}
          className="transition-all duration-700"
          style={{ opacity: filterVisible ? 1 : 0, transform: filterVisible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Ligne 1 — filtres principaux */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <SlidersHorizontal size={14} style={{ color: '#1A5C43' }} />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mr-1 hidden sm:block shrink-0">
                Filtrer
              </span>
              <div className="h-5 w-px bg-gray-200 hidden sm:block" />

              {/* Tri inline */}
              <div className="relative flex items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:block shrink-0">Trier :</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    disabled={loading}
                    className="appearance-none bg-transparent border-0 text-sm font-semibold outline-none cursor-pointer pr-6 pl-1 py-0 text-gray-700 disabled:opacity-50"
                  >
                    <option value="createdAt:desc">Plus récent</option>
                    <option value="createdAt:asc">Plus ancien</option>
                    <option value="views:desc">Plus vu</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </div>

              {/* Count */}
              {!loading && (
                <span className="ml-auto text-[10px] font-medium text-gray-400 shrink-0">
                  {totalItems} vidéo{totalItems > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Ligne 2 — pills catégories scrollables */}
            <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
              {CATEGORY_FILTERS.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
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
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Grille ── */}
        <div ref={gridRef as React.RefCallback<HTMLDivElement>}>
          {loading ? (
            <Skeleton />
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              {videos.map((video, i) => (
                <VideoCard key={video.id} video={video} delay={i * 60} />
              ))}
            </div>
          ) : (
            <div
              className="py-16 sm:py-20 text-center rounded-2xl border border-dashed border-gray-200"
              style={{ background: '#F7F9F8' }}
            >
              <p className="text-gray-400 text-sm">
                Aucune vidéo disponible{activeCategory !== 'all' ? ' dans cette catégorie' : ''}.
              </p>
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-2 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {getPageNumbers().map((n) => (
              <button
                key={n}
                onClick={() => handlePageChange(n)}
                disabled={loading}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-bold transition-all disabled:cursor-not-allowed"
                style={{
                  background: currentPage === n ? '#1A5C43' : 'white',
                  color: currentPage === n ? 'white' : '#374151',
                  border: currentPage === n ? 'none' : '1px solid #E5E7EB',
                  boxShadow: currentPage === n ? '0 4px 12px rgba(26,92,67,0.3)' : 'none',
                }}
              >
                {n}
              </button>
            ))}

            {totalPages > 4 && currentPage < totalPages - 2 && (
              <>
                <span className="px-1 text-gray-400 text-sm">…</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={loading}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-2 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default VideoExplorer;



















// // src/components/videos/VideoExplorer.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { Play, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
// import { AxiosError } from 'axios';
// import api from '@/lib/api';

// interface VideoItem {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string;
//   createdAt: string;
//   excerpt: string;
//   category: {
//     id: number;
//     name: string;
//     slug: string;
//   };
//   content: Array<{
//     type: string;
//     url?: string;
//   }>;
// }

// // Les slugs correspondent exactement aux catégories créées en base
// interface CategoryFilter {
//   id: string;          // slug de catégorie ('all' = pas de filtre)
//   label: string;
//   badgeColor: string;  // classes Tailwind pour le badge
// }

// const CATEGORY_FILTERS: CategoryFilter[] = [
//   { id: 'all',                  label: 'Toutes',               badgeColor: 'bg-gray-100 text-gray-600'      },
//   { id: 'hotellerie',           label: 'Hôtellerie',           badgeColor: 'bg-blue-100 text-blue-700'      },
//   { id: 'transport',            label: 'Transport',            badgeColor: 'bg-purple-100 text-purple-700'  },
//   { id: 'restauration',         label: 'Restauration',         badgeColor: 'bg-red-100 text-red-700'        },
//   { id: 'voyages-affaires',     label: 'Voyages d\'Affaires',  badgeColor: 'bg-orange-100 text-orange-700'  },
//   { id: 'mice-evenements',      label: 'MICE & Événements',    badgeColor: 'bg-yellow-100 text-yellow-700'  },
//   { id: 'divertissement',       label: 'Divertissement',       badgeColor: 'bg-pink-100 text-pink-700'      },
//   { id: 'tourisme-durable',     label: 'Tourisme Durable',     badgeColor: 'bg-green-100 text-green-700'    },
// ];

// const PAGE_SIZE = 8;

// const VideoExplorer = () => {
//   const [videos, setVideos]               = useState<VideoItem[]>([]);
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [sortBy, setSortBy]               = useState<'createdAt:desc' | 'createdAt:asc' | 'views:desc'>('createdAt:desc');
//   const [currentPage, setCurrentPage]     = useState(1);
//   const [totalPages, setTotalPages]       = useState(1);
//   const [totalItems, setTotalItems]       = useState(0);
//   const [loading, setLoading]             = useState(true);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       setLoading(true);
//       try {
//         const params: Record<string, string | number> = {
//           type:     'VIDEO',        // ✅ uniquement les articles de type VIDEO
//           page:     currentPage,
//           pageSize: PAGE_SIZE,
//           status:   'PUBLISHED',
//           sortBy,
//         };

//         // Filtre catégorie (sauf "all")
//         if (activeCategory !== 'all') {
//           params.categorySlug = activeCategory;
//         }

//         const response = await api.get('/mag/articles', { params });

//         setVideos(response.data.data ?? []);

//         const pagination = response.data.pagination ?? response.data.meta;
//         if (pagination) {
//           setTotalPages(pagination.totalPages ?? 1);
//           setTotalItems(pagination.total ?? 0);
//         }
//       } catch (error) {
//         if (error instanceof AxiosError) {
//           console.error('Erreur chargement vidéos:', error.message);
//         }
//         setVideos([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideos();
//   }, [activeCategory, sortBy, currentPage]);

//   // Réinitialise la page quand filtre/tri change
//   const handleCategoryChange = (id: string) => {
//     setActiveCategory(id);
//     setCurrentPage(1);
//   };

//   const handleSortChange = (value: string) => {
//     setSortBy(value as typeof sortBy);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   // Badge couleur selon la catégorie
//   const getBadgeClass = (categorySlug: string): string => {
//     const match = CATEGORY_FILTERS.find((f) => f.id === categorySlug);
//     return match?.badgeColor ?? 'bg-orange-100 text-orange-600';
//   };

//   // Numéros de pages visibles
//   const getPageNumbers = (): number[] => {
//     const pages: number[] = [];
//     const start = Math.max(1, currentPage - 1);
//     const end   = Math.min(totalPages, start + 3);
//     for (let i = start; i <= end; i++) pages.push(i);
//     return pages;
//   };

//   return (
//     <section className="bg-[#F8FAFC] py-16 px-6">
//       <div className="max-w-7xl mx-auto space-y-10">

//         {/* ── Barre de filtres ─────────────────────────────────────────────── */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <h2 className="text-2xl font-serif font-bold text-[#163066] uppercase mb-6">
//             Explorer par catégorie
//           </h2>

//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//             {/* Filtres catégorie */}
//             <div className="flex flex-wrap gap-3">
//               {CATEGORY_FILTERS.map((cat) => (
//                 <button
//                   key={cat.id}
//                   onClick={() => handleCategoryChange(cat.id)}
//                   disabled={loading}
//                   className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                     activeCategory === cat.id
//                       ? 'bg-[#163066] text-white shadow-md'
//                       : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
//                   }`}
//                 >
//                   {cat.label}
//                 </button>
//               ))}
//             </div>

//             {/* Tri */}
//             <div className="flex items-center gap-3">
//               <span className="text-xs font-bold text-gray-400 uppercase">Trier par :</span>
//               <select
//                 value={sortBy}
//                 onChange={(e) => handleSortChange(e.target.value)}
//                 disabled={loading}
//                 className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:border-[#163066] disabled:opacity-50"
//               >
//                 <option value="createdAt:desc">Plus Récent</option>
//                 <option value="createdAt:asc">Plus Ancien</option>
//                 <option value="views:desc">Plus Vus</option>
//               </select>
//             </div>
//           </div>

//           {/* Compteur */}
//           {!loading && (
//             <p className="text-xs text-gray-400 mt-4">
//               {totalItems} vidéo{totalItems > 1 ? 's' : ''} disponible{totalItems > 1 ? 's' : ''}
//             </p>
//           )}
//         </div>

//         {/* ── Grille de vidéos ─────────────────────────────────────────────── */}
//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {Array(PAGE_SIZE).fill(0).map((_, i) => (
//               <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
//                 <div className="aspect-video bg-gray-200 animate-pulse" />
//                 <div className="p-5 space-y-3">
//                   <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
//                   <div className="h-4 bg-gray-200 rounded animate-pulse" />
//                   <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : videos.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {videos.map((video) => {
//               const hasVideoBlock = video.content?.some((b) => b.type === 'video');

//               return (
//                 <Link
//                   href={`/videos/${video.slug}`}
//                   key={video.id}
//                   className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
//                 >
//                   {/* Thumbnail */}
//                   <div className="relative aspect-video overflow-hidden">
//                     <img
//                       src={video.coverImage || '/images/placeholder.jpg'}
//                       alt={video.title}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                     />
//                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

//                     {/* Bouton play */}
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="w-12 h-12 bg-[#F19300] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         <Play size={20} fill="white" className="text-white ml-0.5" />
//                       </div>
//                     </div>

//                     {/* Badge "VIDÉO" si bloc vidéo présent */}
//                     {hasVideoBlock && (
//                       <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
//                         <Play size={8} fill="white" /> VIDÉO
//                       </span>
//                     )}
//                   </div>

//                   {/* Contenu */}
//                   <div className="p-5 space-y-3">
//                     <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest ${getBadgeClass(video.category?.slug)}`}>
//                       {video.category?.name ?? 'Vidéo'}
//                     </span>

//                     <h3 className="text-sm font-bold text-[#163066] line-clamp-2 leading-snug min-h-[40px] group-hover:text-[#F19300] transition-colors">
//                       {video.title}
//                     </h3>

//                     <p className="text-[11px] text-gray-400 font-medium">
//                       {new Date(video.createdAt).toLocaleDateString('fr-FR', {
//                         day: 'numeric', month: 'long', year: 'numeric',
//                       })}
//                     </p>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="text-center py-20 bg-white rounded-2xl">
//             <Loader2 className="mx-auto mb-4 text-gray-300" size={40} />
//             <p className="text-gray-400 font-medium">
//               Aucune vidéo disponible{activeCategory !== 'all' ? ' dans cette catégorie' : ''}.
//             </p>
//           </div>
//         )}

//         {/* ── Pagination ───────────────────────────────────────────────────── */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-2 pt-10">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1 || loading}
//               className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft size={18} />
//             </button>

//             {getPageNumbers().map((n) => (
//               <button
//                 key={n}
//                 onClick={() => handlePageChange(n)}
//                 disabled={loading}
//                 className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors disabled:cursor-not-allowed ${
//                   currentPage === n
//                     ? 'bg-[#163066] text-white shadow-lg'
//                     : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 {n}
//               </button>
//             ))}

//             {totalPages > 4 && currentPage < totalPages - 2 && (
//               <>
//                 <span className="px-2 text-gray-400">…</span>
//                 <button
//                   onClick={() => handlePageChange(totalPages)}
//                   disabled={loading}
//                   className="w-10 h-10 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50"
//                 >
//                   {totalPages}
//                 </button>
//               </>
//             )}

//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages || loading}
//               className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
//             >
//               <ChevronRight size={18} />
//             </button>
//           </div>
//         )}

//       </div>
//     </section>
//   );
// };

// export default VideoExplorer;