// src/components/news/LatestNewsCarousel.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Loader2, ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Magazine {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage: string | null;
  source: string;
  publishedAt: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface LatestNewsCarouselProps {
  searchFilters?: {
    query: string;
    region: string;
    country: string;
    topic: string;
  };
}

const PAGE_SIZE = 6; // Plus petit sur mobile pour ne pas surcharger

const LatestNewsCarousel = ({ searchFilters }: LatestNewsCarouselProps) => {
  const [magazines, setMagazines]     = useState<Magazine[]>([]);
  const [meta, setMeta]               = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]         = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError]             = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchMagazines = async () => {
      currentPage === 1 ? setLoading(true) : setPageLoading(true);
      setError(null);
      try {
        const res = await api.get('/magazines/rss', {
          params: {
            pageSize: PAGE_SIZE,
            page: currentPage,
            ...(searchFilters?.query   && { search:  searchFilters.query }),
            ...(searchFilters?.region  && { region:  searchFilters.region }),
            ...(searchFilters?.country && { country: searchFilters.country }),
            ...(searchFilters?.topic   && { topic:   searchFilters.topic }),
          },
        });
        setMagazines(res.data?.data?.magazines ?? []);
        setMeta(res.data?.data?.pagination ?? null);
      } catch (err: any) {
        console.error('Erreur chargement magazines:', err);
        setError(err.message || 'Erreur lors du chargement des magazines');
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };
    fetchMagazines();
  }, [currentPage, searchFilters]);

  // Reset page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilters]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = meta?.totalPages ?? 1;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document.getElementById('carousel-magazines-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (currentPage > 3)              pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  // ── États ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="animate-spin text-[#001A4D]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-red-500 text-sm font-medium">{error}</p>
        <button
          onClick={() => { setCurrentPage(1); setError(null); }}
          className="px-5 py-2.5 bg-[#001A4D] text-white text-sm font-bold rounded-lg hover:bg-[#F39C12] transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (magazines.length === 0) {
    return (
      <div className="py-16 text-center space-y-2">
        <p className="text-gray-500 font-medium">Aucun magazine trouvé</p>
        <p className="text-gray-400 text-sm">
          {searchFilters?.query || searchFilters?.region || searchFilters?.country || searchFilters?.topic
            ? 'Essayez de modifier vos filtres de recherche.'
            : "Aucun magazine n'est disponible pour le moment."}
        </p>
      </div>
    );
  }

  // ── Rendu ──────────────────────────────────────────────────────────────────
  return (
    <div id="carousel-magazines-section" className="space-y-8">

      {/* Titre section */}
      {/* <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#001A4D] uppercase tracking-widest">
          Magazines &amp; Revues
        </h2>
        {meta && (
          <p className="text-xs text-gray-400 mt-1">
            {meta.total} magazine{meta.total > 1 ? 's' : ''} disponible{meta.total > 1 ? 's' : ''}
          </p>
        )}
      </div> */}

      {/* Overlay chargement page */}
      <div className={`relative transition-opacity duration-200 ${pageLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        {pageLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-[#001A4D]" size={28} />
          </div>
        )}

        {/* Grille responsive : 1 col mobile / 2 col sm / 3 col md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {magazines.map((mag) => (
            <Link
              href={`/magazine/${mag.slug}`}
              key={mag.id}
              className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 active:scale-[0.98]"
            >
              {/* Cover portrait */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={mag.coverImage || '/images/magazine-placeholder.jpg'}
                  alt={mag.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {mag.source}
                  </span>
                </div>
              </div>

              {/* Infos */}
              <div className="p-3 sm:p-4 flex flex-col flex-1">
                <h3 className="font-bold text-[#001A4D] text-[13px] sm:text-[14px] leading-snug mb-2 line-clamp-2 group-hover:text-[#F39C12] transition-colors flex-1">
                  {mag.title}
                </h3>
                {mag.excerpt && (
                  <p className="text-gray-500 text-[11px] sm:text-[12px] line-clamp-2 mb-2 leading-relaxed">
                    {mag.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400">
                    <Calendar size={10} />
                    {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </div>
                  <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#F39C12]">
                    Lire <ExternalLink size={9} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-gray-100">
          <p className="text-xs text-gray-400 order-2 sm:order-1">
            Page {currentPage} sur {totalPages} — {meta?.total ?? 0} magazine{(meta?.total ?? 0) > 1 ? 's' : ''}
          </p>

          <div className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center">
            {/* Précédent */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Page précédente"
            >
              <ChevronLeft size={15} />
            </button>

            {/* Numéros */}
            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="px-1.5 text-gray-400 text-sm select-none">…</span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-[#001A4D] text-white shadow-md'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Suivant */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Page suivante"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestNewsCarousel;





















// // src/components/news/LatestNewsCarousel.tsx
// 'use client';
 
// import { useState, useEffect } from 'react';
// import api from '@/lib/api';
// import { Loader2 } from 'lucide-react';
// import NewsCarousel from '@/components/ui/NewsCarousel';
 
// interface NewsArticle {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   createdAt: string;
//   category: {
//     id: number;
//     name: string;
//     slug: string;
//   };
//   author: {
//     id: number;
//     name: string;
//   };
//   views: number;
// }
 
// interface LatestNewsCarouselProps {
//   searchFilters?: {
//     query: string;
//     region: string;
//     country: string;
//     topic: string;
//   };
// }
 
// const LatestNewsCarousel = ({ searchFilters }: LatestNewsCarouselProps) => {
//   const [articles, setArticles] = useState<NewsArticle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
 
//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         // Construire les paramètres de recherche
//         const searchParams = {
//           type: 'ARTICLE',
//           pageSize: 12,
//           page: 1,
//           status: 'PUBLISHED',
//           ...(searchFilters?.query && { search: searchFilters.query }),
//           ...(searchFilters?.region && { region: searchFilters.region }),
//           ...(searchFilters?.country && { country: searchFilters.country }),
//           ...(searchFilters?.topic && { topic: searchFilters.topic }),
//         };
 
//         const response = await api.get('/mag/articles', { params: searchParams });
//         setArticles(response.data.data ?? []);
//       } catch (error: any) {
//         console.error('Erreur chargement articles:', error);
//         setError(error.message || 'Erreur lors du chargement des articles');
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchArticles();
//   }, [searchFilters]);
 
//   if (loading) {
//     return (
//       <div className="py-20 flex justify-center">
//         <Loader2 className="animate-spin text-[#001A4D]" size={40} />
//       </div>
//     );
//   }
 
//   if (error) {
//     return (
//       <div className="py-20 text-center">
//         <p className="text-red-600 mb-4">Erreur: {error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           Réessayer
//         </button>
//       </div>
//     );
//   }
 
//   if (articles.length === 0) {
//     return (
//       <div className="py-20 text-center">
//         <div className="text-gray-400 mb-4">
//           <Loader2 className="w-16 h-16 mx-auto" />
//         </div>
//         <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
//         <p className="text-gray-500">
//           {searchFilters?.query || searchFilters?.region || searchFilters?.country || searchFilters?.topic
//             ? "Essayez de modifier vos filtres de recherche."
//             : "Aucun article n'est disponible pour le moment."}
//         </p>
//       </div>
//     );
//   }
 
//   return (
//     <NewsCarousel
//       articles={articles}
//       title="📰 Dernières Actualités Touristiques"
//       subtitle="Découvrez les dernières nouvelles et tendances du secteur touristique africain"
//     />
//   );
// };
 
// export default LatestNewsCarousel;