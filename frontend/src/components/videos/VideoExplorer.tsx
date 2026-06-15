// src/components/videos/VideoExplorer.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
  badgeColor: string;
}

const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all',              label: 'Toutes',              badgeColor: 'bg-gray-100 text-gray-600'         },
  { id: 'hotellerie',       label: 'Hôtellerie',          badgeColor: 'bg-blue-100 text-blue-700'         },
  { id: 'transport',        label: 'Transport',           badgeColor: 'bg-purple-100 text-purple-700'     },
  { id: 'restauration',     label: 'Restauration',        badgeColor: 'bg-red-100 text-red-700'           },
  { id: 'voyages-affaires', label: "Voyages d'Affaires",  badgeColor: 'bg-orange-100 text-orange-700'     },
  { id: 'mice-evenements',  label: 'MICE & Événements',   badgeColor: 'bg-yellow-100 text-yellow-700'     },
  { id: 'divertissement',   label: 'Divertissement',      badgeColor: 'bg-pink-100 text-pink-700'         },
  { id: 'tourisme-durable', label: 'Tourisme Durable',    badgeColor: 'bg-green-100 text-green-700'       },
];

const PAGE_SIZE = 8;

const VideoExplorer = () => {
  const [videos, setVideos]                   = useState<VideoItem[]>([]);
  const [activeCategory, setActiveCategory]   = useState('all');
  const [sortBy, setSortBy]                   = useState<'createdAt:desc' | 'createdAt:asc' | 'views:desc'>('createdAt:desc');
  const [currentPage, setCurrentPage]         = useState(1);
  const [totalPages, setTotalPages]           = useState(1);
  const [totalItems, setTotalItems]           = useState(0);
  const [loading, setLoading]                 = useState(true);

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
        if (pagination) {
          setTotalPages(pagination.totalPages ?? 1);
          setTotalItems(pagination.total ?? 0);
        }
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
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getBadgeClass = (categorySlug: string): string =>
    CATEGORY_FILTERS.find((f) => f.id === categorySlug)?.badgeColor ?? 'bg-orange-100 text-orange-600';

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 1);
    const end   = Math.min(totalPages, start + 3);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <section className="bg-slate-50 py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Barre de filtres */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-serif font-bold text-it-blue uppercase mb-6">
            Explorer par catégorie
          </h2>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  disabled={loading}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeCategory === cat.id
                      ? 'bg-it-emerald-dark text-white shadow-md'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                disabled={loading}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:border-it-emerald-dark disabled:opacity-50"
              >
                <option value="createdAt:desc">Plus Récent</option>
                <option value="createdAt:asc">Plus Ancien</option>
                <option value="views:desc">Plus Vus</option>
              </select>
            </div>
          </div>

          {!loading && (
            <p className="text-xs text-gray-400 mt-4">
              {totalItems} vidéo{totalItems > 1 ? 's' : ''} disponible{totalItems > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Grille */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(PAGE_SIZE).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
                <div className="aspect-video bg-gray-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => {
              const hasVideoBlock = video.content?.some((b) => b.type === 'video');
              return (
                <Link
                  href={`/videos/${video.slug}`}
                  key={video.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.coverImage || '/images/placeholder.jpg'}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-it-terracotta rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play size={20} fill="white" className="text-white ml-0.5" />
                      </div>
                    </div>
                    {hasVideoBlock && (
                      <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Play size={8} fill="white" /> VIDÉO
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest ${getBadgeClass(video.category?.slug)}`}>
                      {video.category?.name ?? 'Vidéo'}
                    </span>
                    <h3 className="text-sm font-bold text-it-blue line-clamp-2 leading-snug min-h-[40px] group-hover:text-it-terracotta transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {new Date(video.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl">
            <Loader2 className="mx-auto mb-4 text-gray-300" size={40} />
            <p className="text-gray-400 font-medium">
              Aucune vidéo disponible{activeCategory !== 'all' ? ' dans cette catégorie' : ''}.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            {getPageNumbers().map((n) => (
              <button
                key={n}
                onClick={() => handlePageChange(n)}
                disabled={loading}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors disabled:cursor-not-allowed ${
                  currentPage === n
                    ? 'bg-it-emerald-dark text-white shadow-lg'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {n}
              </button>
            ))}

            {totalPages > 4 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-400">…</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={loading}
                  className="w-10 h-10 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
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