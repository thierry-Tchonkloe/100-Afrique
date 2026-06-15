// src/components/news/LatestNews.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, Handshake, Loader2, ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { AdvertisingBanner } from '@/components/AdvertisingBanner';
import MagazineImage from '@/components/shared/MagazineImage';

interface Magazine {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage: string | null;
  source: string;
  publishedAt: string;
}

interface SidebarArticle {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  excerpt: string;
  createdAt: string;
  category?: { name: string };
  author?: { name: string };
  readingTime?: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const PAGE_SIZE = 9;

const LatestNews = ({ searchFilters }: { searchFilters?: any }) => {
  const [magazines, setMagazines]     = useState<Magazine[]>([]);
  const [analyses, setAnalyses]       = useState<SidebarArticle[]>([]);
  const [interview, setInterview]     = useState<SidebarArticle | null>(null);
  const [meta, setMeta]               = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]         = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const fetchMagazines = async () => {
      currentPage === 1 ? setLoading(true) : setPageLoading(true);
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
      } catch (error) {
        console.error('Erreur chargement magazines:', error);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };
    fetchMagazines();
  }, [currentPage, searchFilters]);

  useEffect(() => { setCurrentPage(1); }, [searchFilters]);

  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const [resAnalyses, resInterview] = await Promise.all([
          api.get('/mag/articles', {
            params: { type: 'ARTICLE', categorySlug: 'analyses', pageSize: 4, status: 'PUBLISHED' },
          }),
          api.get('/mag/articles', {
            params: { type: 'ARTICLE', categorySlug: 'interviews', pageSize: 1, status: 'PUBLISHED' },
          }),
        ]);
        setAnalyses(resAnalyses.data.data ?? []);
        setInterview(resInterview.data.data?.[0] ?? null);
      } catch (error) {
        console.error('Erreur sidebar:', error);
      }
    };
    fetchSidebar();
  }, []);

  const totalPages = meta?.totalPages ?? 1;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document.getElementById('magazines-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        {/* Loader — émeraude foncé */}
        <Loader2 className="animate-spin" size={40} style={{ color: '#1A5C43' }} />
      </div>
    );
  }

  // ── Blocs sidebar ─────────────────────────────────────────────────────────
  const SidebarInterview = () => interview ? (
    <div className="border-b border-gray-100 pb-6 sm:pb-8">
      <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
        <MagazineImage
          src={interview.coverImage}
          alt={interview.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          {/* Icône play — or doux */}
          <Play size={32} style={{ color: '#C8A84B', fill: '#C8A84B' }} />
        </div>
      </div>
      <h4
        className="font-serif font-bold text-sm uppercase mb-2 tracking-wide"
        style={{ color: '#001A4D' }}
      >
        L&apos;interview à ne pas manquer
      </h4>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{interview.title}</p>
      <Link
        href={`/actualites/${interview.slug}`}
        className="font-bold text-[11px] uppercase flex items-center gap-2"
        style={{ color: '#C8A84B' }}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ border: '1px solid #C8A84B' }}
        >
          <Play size={8} fill="currentColor" />
        </div>
        Lire l&apos;interview
      </Link>
    </div>
  ) : null;

  const SidebarAnalyses = () => analyses.length > 0 ? (
    <div>
      <div className="mb-4 sm:mb-6">
        <h4
          className="font-serif font-bold text-sm uppercase tracking-widest"
          style={{ color: '#001A4D' }}
        >
          Décryptage et Analyse
        </h4>
        {/* Barre accent — or doux */}
        <div className="w-12 h-1 mt-2" style={{ background: '#C8A84B' }} />
      </div>
      <ul className="space-y-4 sm:space-y-6">
        {analyses.map((item) => (
          <li key={item.id}>
            <Link href={`/actualites/${item.slug}`} className="group block">
              <p
                className="text-[14px] font-bold leading-tight mb-1 transition-colors"
                style={{ color: '#333333' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#333333')}
              >
                {item.title}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                {item.readingTime ? ` • ${item.readingTime} min` : ''}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ) : null;

  const SidebarCTA = () => (
    /* Fond — émeraude foncé */
    <div className="p-6 sm:p-10 text-center rounded-lg shadow-xl" style={{ background: '#1A5C43' }}>
      <div className="flex justify-center mb-4">
        {/* Icône — or doux */}
        <Handshake size={40} style={{ color: '#C8A84B' }} />
      </div>
      <h4 className="text-white font-serif font-bold uppercase text-base sm:text-lg mb-3 sm:mb-4">
        Vous êtes un professionnel ?
      </h4>
      <p className="text-white/70 text-xs mb-6 sm:mb-8 leading-relaxed">
        Découvrez nos solutions de visibilité et nos partenariats média
      </p>
      <Link
        href="/partenaires"
        className="block font-bold text-[11px] uppercase py-3 sm:py-4 rounded-md transition-all text-white"
        style={{ background: '#B85C38' }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.color = '#1A5C43';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#B85C38';
          e.currentTarget.style.color = '#ffffff';
        }}
      >
        Découvrez nos Partenariats
      </Link>
    </div>
  );

  return (
    <section id="magazines-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-16 bg-white">

      <div className="text-center mb-8 sm:mb-16">
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-serif font-bold uppercase tracking-widest"
          style={{ color: '#001A4D' }}
        >
          Actualités — Explorer par source
        </h2>
      </div>

      {/* ── MOBILE : sidebar avant le flux ─────────────────────────────── */}
      <div className="lg:hidden space-y-6 mb-10">
        <div className="w-full flex items-center justify-center border border-gray-100 rounded-lg overflow-hidden" style={{ background: '#F0F2F5' }}>
          <AdvertisingBanner zoneSlug="skyscraper-sidebar" showDots={true} className="w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4"><SidebarInterview /></div>
          <div className="bg-gray-50 rounded-xl p-4"><SidebarAnalyses /></div>
        </div>
        <SidebarCTA />
      </div>

      {/* ── LAYOUT PRINCIPAL ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* Flux magazines (3/4) */}
        <div className="lg:col-span-3">
          <div className={`relative transition-opacity duration-200 ${pageLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            {pageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 className="animate-spin" size={32} style={{ color: '#1A5C43' }} />
              </div>
            )}

            {magazines.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                {searchFilters?.query || searchFilters?.region || searchFilters?.country || searchFilters?.topic
                  ? 'Aucune actualité ne correspond à vos critères de recherche.'
                  : 'Aucune actualité disponible pour le moment.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 sm:gap-6">
                {magazines.map((mag) => (
                  <Link
                    href={`/magazine/${mag.slug}`}
                    key={mag.id}
                    className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 active:scale-[0.98]"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <MagazineImage
                        src={mag.coverImage}
                        alt={mag.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        {/* Badge source — émeraude */}
                        <span
                          className="text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm"
                          style={{ background: 'rgba(42,127,95,0.9)' }}
                        >
                          {mag.source}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <h3
                        className="font-bold text-[12px] sm:text-[14px] leading-snug mb-2 line-clamp-2 flex-1 transition-colors"
                        style={{ color: '#001A4D' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#001A4D')}
                      >
                        {mag.title}
                      </h3>
                      {mag.excerpt && (
                        <p className="hidden sm:block text-gray-500 text-[12px] line-clamp-2 mb-3 leading-relaxed">
                          {mag.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400">
                          <Calendar size={10} />
                          <span className="hidden xs:inline">
                            {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
                          <span className="xs:hidden">
                            {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
                              month: 'short', year: 'numeric',
                            })}
                          </span>
                        </div>
                        {/* Lien "Lire" — terre cuite */}
                        <span
                          className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold"
                          style={{ color: '#B85C38' }}
                        >
                          Lire <ExternalLink size={9} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-10 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 order-2 sm:order-1">
                Page {currentPage} sur {totalPages} — {meta?.total ?? 0} magazine{(meta?.total ?? 0) > 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={15} />
                </button>
                {getPageNumbers().map((page, idx) =>
                  page === '...' ? (
                    <span key={`dots-${idx}`} className="px-1.5 text-gray-400 text-sm select-none">…</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-bold transition-colors border border-gray-200 text-gray-600 hover:bg-gray-50"
                      style={currentPage === page
                        ? { background: '#1A5C43', color: '#ffffff', border: 'none', boxShadow: '0 2px 8px rgba(26,92,67,0.3)' }
                        : {}}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR desktop (1/4) */}
        <div className="hidden lg:flex flex-col space-y-12">
          <div className="w-full h-[500px] flex items-center justify-between border-b border-gray-200" style={{ background: '#F0F2F5' }}>
            <AdvertisingBanner zoneSlug="skyscraper-sidebar" showDots={true} className="w-full h-[500px] gap-3 flex" />
          </div>
          <SidebarInterview />
          <SidebarAnalyses />
          <SidebarCTA />
        </div>

      </div>
    </section>
  );
};

export default LatestNews;

















// // src/components/news/LatestNews.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { Play, Handshake, Loader2, ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
// import api from '@/lib/api';
// import { AdvertisingBanner } from '@/components/AdvertisingBanner';
// import MagazineImage from '@/components/shared/MagazineImage';

// interface Magazine {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt?: string | null;
//   coverImage: string | null;
//   source: string;
//   publishedAt: string;
// }

// interface SidebarArticle {
//   id: string;
//   slug: string;
//   title: string;
//   coverImage: string;
//   excerpt: string;
//   createdAt: string;
//   category?: { name: string };
//   author?: { name: string };
//   readingTime?: string;
// }

// interface PaginationMeta {
//   total: number;
//   page: number;
//   pageSize: number;
//   totalPages: number;
// }

// const PAGE_SIZE = 9;

// const LatestNews = ({ searchFilters }: { searchFilters?: any }) => {
//   const [magazines, setMagazines]     = useState<Magazine[]>([]);
//   const [analyses, setAnalyses]       = useState<SidebarArticle[]>([]);
//   const [interview, setInterview]     = useState<SidebarArticle | null>(null);
//   const [meta, setMeta]               = useState<PaginationMeta | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading]         = useState(true);
//   const [pageLoading, setPageLoading] = useState(false);

//   useEffect(() => {
//     const fetchMagazines = async () => {
//       currentPage === 1 ? setLoading(true) : setPageLoading(true);
//       try {
//         const res = await api.get('/magazines/rss', {
//           params: {
//             pageSize: PAGE_SIZE,
//             page: currentPage,
//             ...(searchFilters?.query   && { search:  searchFilters.query }),
//             ...(searchFilters?.region  && { region:  searchFilters.region }),
//             ...(searchFilters?.country && { country: searchFilters.country }),
//             ...(searchFilters?.topic   && { topic:   searchFilters.topic }),
//           },
//         });
//         setMagazines(res.data?.data?.magazines ?? []);
//         setMeta(res.data?.data?.pagination ?? null);
//       } catch (error) {
//         console.error('Erreur chargement magazines:', error);
//       } finally {
//         setLoading(false);
//         setPageLoading(false);
//       }
//     };
//     fetchMagazines();
//   }, [currentPage, searchFilters]);

//   useEffect(() => { setCurrentPage(1); }, [searchFilters]);

//   useEffect(() => {
//     const fetchSidebar = async () => {
//       try {
//         const [resAnalyses, resInterview] = await Promise.all([
//           api.get('/mag/articles', {
//             params: { type: 'ARTICLE', categorySlug: 'analyses', pageSize: 4, status: 'PUBLISHED' },
//           }),
//           api.get('/mag/articles', {
//             params: { type: 'ARTICLE', categorySlug: 'interviews', pageSize: 1, status: 'PUBLISHED' },
//           }),
//         ]);
//         setAnalyses(resAnalyses.data.data ?? []);
//         setInterview(resInterview.data.data?.[0] ?? null);
//       } catch (error) {
//         console.error('Erreur sidebar:', error);
//       }
//     };
//     fetchSidebar();
//   }, []);

//   const totalPages = meta?.totalPages ?? 1;

//   const handlePageChange = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     document.getElementById('magazines-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   const getPageNumbers = (): (number | '...')[] => {
//     if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
//     const pages: (number | '...')[] = [1];
//     if (currentPage > 3)              pages.push('...');
//     for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
//       pages.push(i);
//     }
//     if (currentPage < totalPages - 2) pages.push('...');
//     pages.push(totalPages);
//     return pages;
//   };

//   if (loading) {
//     return (
//       <div className="py-20 flex justify-center">
//         <Loader2 className="animate-spin text-[#001A4D]" size={40} />
//       </div>
//     );
//   }

//   // ── Blocs sidebar extraits pour réutilisation mobile + desktop ────────────
//   const SidebarInterview = () => interview ? (
//     <div className="border-b border-gray-100 pb-6 sm:pb-8">
//       <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
//         {/* ✅ fallback géré par MagazineImage */}
//         <MagazineImage
//           src={interview.coverImage}
//           alt={interview.title}
//           className="object-cover w-full h-full"
//         />
//         <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
//           <Play size={32} className="text-[#F39C12] fill-[#F39C12]" />
//         </div>
//       </div>
//       <h4 className="font-serif font-bold text-[#001A4D] text-sm uppercase mb-2 tracking-wide">
//         L&apos;interview à ne pas manquer
//       </h4>
//       <p className="text-sm text-gray-500 mb-3 line-clamp-2">{interview.title}</p>
//       <Link
//         href={`/actualites/${interview.slug}`}
//         className="text-[#F39C12] font-bold text-[11px] uppercase flex items-center gap-2"
//       >
//         <div className="w-5 h-5 rounded-full border border-[#F39C12] flex items-center justify-center">
//           <Play size={8} fill="currentColor" />
//         </div>
//         Lire l&apos;interview
//       </Link>
//     </div>
//   ) : null;

//   const SidebarAnalyses = () => analyses.length > 0 ? (
//     <div>
//       <div className="mb-4 sm:mb-6">
//         <h4 className="font-serif font-bold text-[#001A4D] text-sm uppercase tracking-widest">
//           Décryptage et Analyse
//         </h4>
//         <div className="w-12 h-1 bg-[#F39C12] mt-2" />
//       </div>
//       <ul className="space-y-4 sm:space-y-6">
//         {analyses.map((item) => (
//           <li key={item.id}>
//             <Link href={`/actualites/${item.slug}`} className="group block">
//               <p className="text-[14px] font-bold text-[#333] group-hover:text-[#F39C12] leading-tight mb-1 transition-colors">
//                 {item.title}
//               </p>
//               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
//                 {new Date(item.createdAt).toLocaleDateString('fr-FR')}
//                 {item.readingTime ? ` • ${item.readingTime} min` : ''}
//               </p>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   ) : null;

//   const SidebarCTA = () => (
//     <div className="bg-[#001A4D] p-6 sm:p-10 text-center rounded-lg shadow-xl">
//       <div className="flex justify-center mb-4">
//         <Handshake size={40} className="text-[#F39C12]" />
//       </div>
//       <h4 className="text-white font-serif font-bold uppercase text-base sm:text-lg mb-3 sm:mb-4">
//         Vous êtes un professionnel ?
//       </h4>
//       <p className="text-gray-300 text-xs mb-6 sm:mb-8 leading-relaxed">
//         Découvrez nos solutions de visibilité et nos partenariats média
//       </p>
//       <Link
//         href="/partenaires"
//         className="block bg-[#F39C12] text-white font-bold text-[11px] uppercase py-3 sm:py-4 rounded-md hover:bg-white hover:text-[#001A4D] transition-all"
//       >
//         Découvrez nos Partenariats
//       </Link>
//     </div>
//   );

//   return (
//     <section id="magazines-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-16 bg-white">

//       <div className="text-center mb-8 sm:mb-16">
//         <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#001A4D] uppercase tracking-widest">
//           Actualités — Explorer par source
//         </h2>
//       </div>

//       {/* ── MOBILE / TABLETTE : sidebar AVANT le flux (< lg) ─────────────── */}
//       <div className="lg:hidden space-y-6 mb-10">
//         <div className="w-full bg-it-gray-light flex items-center justify-center border border-gray-100 rounded-lg overflow-hidden">
//           <AdvertisingBanner
//             zoneSlug="skyscraper-sidebar"
//             showDots={true}
//             className="w-full"
//           />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <div className="bg-gray-50 rounded-xl p-4">
//             <SidebarInterview />
//           </div>
//           <div className="bg-gray-50 rounded-xl p-4">
//             <SidebarAnalyses />
//           </div>
//         </div>
//         <SidebarCTA />
//       </div>

//       {/* ── LAYOUT PRINCIPAL ─────────────────────────────────────────────── */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

//         {/* ── Flux magazines (3/4) ───────────────────────────────────────── */}
//         <div className="lg:col-span-3">
//           <div className={`relative transition-opacity duration-200 ${pageLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
//             {pageLoading && (
//               <div className="absolute inset-0 flex items-center justify-center z-10">
//                 <Loader2 className="animate-spin text-[#001A4D]" size={32} />
//               </div>
//             )}

//             {magazines.length === 0 ? (
//               <div className="py-20 text-center text-gray-400">
//                 {searchFilters?.query || searchFilters?.region || searchFilters?.country || searchFilters?.topic
//                   ? 'Aucune actualité ne correspond à vos critères de recherche.'
//                   : 'Aucune actualité disponible pour le moment.'}
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 sm:gap-6">
//                 {magazines.map((mag) => (
//                   <Link
//                     href={`/magazine/${mag.slug}`}
//                     key={mag.id}
//                     className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 active:scale-[0.98]"
//                   >
//                     {/* Cover portrait — ✅ fallback automatique */}
//                     <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
//                       <MagazineImage
//                         src={mag.coverImage}
//                         alt={mag.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                       <div className="absolute top-2.5 left-2.5">
//                         <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
//                           {mag.source}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Infos */}
//                     <div className="p-3 sm:p-4 flex flex-col flex-1">
//                       <h3 className="font-bold text-[#001A4D] text-[12px] sm:text-[14px] leading-snug mb-2 line-clamp-2 group-hover:text-[#F39C12] transition-colors flex-1">
//                         {mag.title}
//                       </h3>
//                       {mag.excerpt && (
//                         <p className="hidden sm:block text-gray-500 text-[12px] line-clamp-2 mb-3 leading-relaxed">
//                           {mag.excerpt}
//                         </p>
//                       )}
//                       <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
//                         <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400">
//                           <Calendar size={10} />
//                           <span className="hidden xs:inline">
//                             {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
//                               day: 'numeric', month: 'short', year: 'numeric',
//                             })}
//                           </span>
//                           <span className="xs:hidden">
//                             {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
//                               month: 'short', year: 'numeric',
//                             })}
//                           </span>
//                         </div>
//                         <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#F39C12]">
//                           Lire <ExternalLink size={9} />
//                         </span>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-10 pt-6 border-t border-gray-100">
//               <p className="text-xs text-gray-400 order-2 sm:order-1">
//                 Page {currentPage} sur {totalPages} — {meta?.total ?? 0} magazine{(meta?.total ?? 0) > 1 ? 's' : ''}
//               </p>
//               <div className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                   aria-label="Page précédente"
//                 >
//                   <ChevronLeft size={15} />
//                 </button>
//                 {getPageNumbers().map((page, idx) =>
//                   page === '...' ? (
//                     <span key={`dots-${idx}`} className="px-1.5 text-gray-400 text-sm select-none">…</span>
//                   ) : (
//                     <button
//                       key={page}
//                       onClick={() => handlePageChange(page as number)}
//                       className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
//                         currentPage === page
//                           ? 'bg-[#001A4D] text-white shadow-md'
//                           : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   )
//                 )}
//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                   aria-label="Page suivante"
//                 >
//                   <ChevronRight size={15} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── SIDEBAR desktop uniquement (1/4) ──────────────────────────── */}
//         <div className="hidden lg:flex flex-col space-y-12">
//           <div className="w-full bg-it-gray-light h-[500px] flex items-center justify-between border-b border-gray-200">
//             <AdvertisingBanner
//               zoneSlug="skyscraper-sidebar"
//               showDots={true}
//               className="w-full h-[500px] gap-3 flex"
//             />
//           </div>
//           <SidebarInterview />
//           <SidebarAnalyses />
//           <SidebarCTA />
//         </div>

//       </div>
//     </section>
//   );
// };

// export default LatestNews;

























// // src/components/news/LatestNews.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { Play, Handshake, Loader2, ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
// import api from '@/lib/api';
// import { AdvertisingBanner } from '@/components/AdvertisingBanner';

// interface Magazine {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt?: string | null;
//   coverImage: string | null;
//   source: string;
//   publishedAt: string;
// }

// interface SidebarArticle {
//   id: string;
//   slug: string;
//   title: string;
//   coverImage: string;
//   excerpt: string;
//   createdAt: string;
//   category?: { name: string };
//   author?: { name: string };
//   readingTime?: string;
// }

// interface PaginationMeta {
//   total: number;
//   page: number;
//   pageSize: number;
//   totalPages: number;
// }

// const PAGE_SIZE = 9;

// const LatestNews = ({ searchFilters }: { searchFilters?: any }) => {
//   const [magazines, setMagazines]     = useState<Magazine[]>([]);
//   const [analyses, setAnalyses]       = useState<SidebarArticle[]>([]);
//   const [interview, setInterview]     = useState<SidebarArticle | null>(null);
//   const [meta, setMeta]               = useState<PaginationMeta | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading]         = useState(true);
//   const [pageLoading, setPageLoading] = useState(false);

//   useEffect(() => {
//     const fetchMagazines = async () => {
//       currentPage === 1 ? setLoading(true) : setPageLoading(true);
//       try {
//         const res = await api.get('/magazines/rss', {
//           params: {
//             pageSize: PAGE_SIZE,
//             page: currentPage,
//             ...(searchFilters?.query   && { search:  searchFilters.query }),
//             ...(searchFilters?.region  && { region:  searchFilters.region }),
//             ...(searchFilters?.country && { country: searchFilters.country }),
//             ...(searchFilters?.topic   && { topic:   searchFilters.topic }),
//           },
//         });
//         setMagazines(res.data?.data?.magazines ?? []);
//         setMeta(res.data?.data?.pagination ?? null);
//       } catch (error) {
//         console.error('Erreur chargement magazines:', error);
//       } finally {
//         setLoading(false);
//         setPageLoading(false);
//       }
//     };
//     fetchMagazines();
//   }, [currentPage, searchFilters]);

//   useEffect(() => { setCurrentPage(1); }, [searchFilters]);

//   useEffect(() => {
//     const fetchSidebar = async () => {
//       try {
//         const [resAnalyses, resInterview] = await Promise.all([
//           api.get('/mag/articles', {
//             params: { type: 'ARTICLE', categorySlug: 'analyses', pageSize: 4, status: 'PUBLISHED' },
//           }),
//           api.get('/mag/articles', {
//             params: { type: 'ARTICLE', categorySlug: 'interviews', pageSize: 1, status: 'PUBLISHED' },
//           }),
//         ]);
//         setAnalyses(resAnalyses.data.data ?? []);
//         setInterview(resInterview.data.data?.[0] ?? null);
//       } catch (error) {
//         console.error('Erreur sidebar:', error);
//       }
//     };
//     fetchSidebar();
//   }, []);

//   const totalPages = meta?.totalPages ?? 1;

//   const handlePageChange = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     document.getElementById('magazines-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   const getPageNumbers = (): (number | '...')[] => {
//     if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
//     const pages: (number | '...')[] = [1];
//     if (currentPage > 3)              pages.push('...');
//     for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
//       pages.push(i);
//     }
//     if (currentPage < totalPages - 2) pages.push('...');
//     pages.push(totalPages);
//     return pages;
//   };

//   if (loading) {
//     return (
//       <div className="py-20 flex justify-center">
//         <Loader2 className="animate-spin text-[#001A4D]" size={40} />
//       </div>
//     );
//   }

//   // ── Blocs sidebar extraits pour réutilisation mobile + desktop ────────────
//   const SidebarInterview = () => interview ? (
//     <div className="border-b border-gray-100 pb-6 sm:pb-8">
//       <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
//         <img
//           src={interview.coverImage || '/images/placeholder.jpg'}
//           className="object-cover w-full h-full"
//           alt={interview.title}
//         />
//         <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
//           <Play size={32} className="text-[#F39C12] fill-[#F39C12]" />
//         </div>
//       </div>
//       <h4 className="font-serif font-bold text-[#001A4D] text-sm uppercase mb-2 tracking-wide">
//         L&apos;interview à ne pas manquer
//       </h4>
//       <p className="text-sm text-gray-500 mb-3 line-clamp-2">{interview.title}</p>
//       <Link
//         href={`/actualites/${interview.slug}`}
//         className="text-[#F39C12] font-bold text-[11px] uppercase flex items-center gap-2"
//       >
//         <div className="w-5 h-5 rounded-full border border-[#F39C12] flex items-center justify-center">
//           <Play size={8} fill="currentColor" />
//         </div>
//         Lire l&apos;interview
//       </Link>
//     </div>
//   ) : null;

//   const SidebarAnalyses = () => analyses.length > 0 ? (
//     <div>
//       <div className="mb-4 sm:mb-6">
//         <h4 className="font-serif font-bold text-[#001A4D] text-sm uppercase tracking-widest">
//           Décryptage et Analyse
//         </h4>
//         <div className="w-12 h-1 bg-[#F39C12] mt-2" />
//       </div>
//       <ul className="space-y-4 sm:space-y-6">
//         {analyses.map((item) => (
//           <li key={item.id}>
//             <Link href={`/actualites/${item.slug}`} className="group block">
//               <p className="text-[14px] font-bold text-[#333] group-hover:text-[#F39C12] leading-tight mb-1 transition-colors">
//                 {item.title}
//               </p>
//               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
//                 {new Date(item.createdAt).toLocaleDateString('fr-FR')}
//                 {item.readingTime ? ` • ${item.readingTime} min` : ''}
//               </p>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   ) : null;

//   const SidebarCTA = () => (
//     <div className="bg-[#001A4D] p-6 sm:p-10 text-center rounded-lg shadow-xl">
//       <div className="flex justify-center mb-4">
//         <Handshake size={40} className="text-[#F39C12]" />
//       </div>
//       <h4 className="text-white font-serif font-bold uppercase text-base sm:text-lg mb-3 sm:mb-4">
//         Vous êtes un professionnel ?
//       </h4>
//       <p className="text-gray-300 text-xs mb-6 sm:mb-8 leading-relaxed">
//         Découvrez nos solutions de visibilité et nos partenariats média
//       </p>
//       <Link
//         href="/partenaires"
//         className="block bg-[#F39C12] text-white font-bold text-[11px] uppercase py-3 sm:py-4 rounded-md hover:bg-white hover:text-[#001A4D] transition-all"
//       >
//         Découvrez nos Partenariats
//       </Link>
//     </div>
//   );

//   return (
//     <section id="magazines-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-16 bg-white">

//       <div className="text-center mb-8 sm:mb-16">
//         <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#001A4D] uppercase tracking-widest">
//           Actualités — Explorer par source
//         </h2>
//       </div>

//       {/* ── MOBILE / TABLETTE : sidebar AVANT le flux (< lg) ─────────────── */}
//       <div className="lg:hidden space-y-6 mb-10">

//         {/* Pub mobile */}
//         <div className="w-full bg-it-gray-light flex items-center justify-center border border-gray-100 rounded-lg overflow-hidden">
//           <AdvertisingBanner
//             zoneSlug="skyscraper-sidebar"
//             showDots={true}
//             className="w-full"
//           />
//         </div>

//         {/* Interview + Analyses côte à côte sur sm, empilés sur mobile */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <div className="bg-gray-50 rounded-xl p-4">
//             <SidebarInterview />
//           </div>
//           <div className="bg-gray-50 rounded-xl p-4">
//             <SidebarAnalyses />
//           </div>
//         </div>

//         {/* CTA pleine largeur */}
//         <SidebarCTA />
//       </div>

//       {/* ── LAYOUT PRINCIPAL ─────────────────────────────────────────────── */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

//         {/* ── Flux magazines (3/4) ───────────────────────────────────────── */}
//         <div className="lg:col-span-3">
//           <div className={`relative transition-opacity duration-200 ${pageLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
//             {pageLoading && (
//               <div className="absolute inset-0 flex items-center justify-center z-10">
//                 <Loader2 className="animate-spin text-[#001A4D]" size={32} />
//               </div>
//             )}

//             {magazines.length === 0 ? (
//               <div className="py-20 text-center text-gray-400">
//                 {searchFilters?.query || searchFilters?.region || searchFilters?.country || searchFilters?.topic
//                   ? 'Aucune actualité ne correspond à vos critères de recherche.'
//                   : 'Aucune actualité disponible pour le moment.'}
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 sm:gap-6">
//                 {magazines.map((mag) => (
//                   <Link
//                     href={`/magazine/${mag.slug}`}
//                     key={mag.id}
//                     className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 active:scale-[0.98]"
//                   >
//                     {/* Cover portrait */}
//                     <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
//                       <img
//                         src={mag.coverImage || '/images/magazine-placeholder.jpg'}
//                         alt={mag.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                       <div className="absolute top-2.5 left-2.5">
//                         <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
//                           {mag.source}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Infos */}
//                     <div className="p-3 sm:p-4 flex flex-col flex-1">
//                       <h3 className="font-bold text-[#001A4D] text-[12px] sm:text-[14px] leading-snug mb-2 line-clamp-2 group-hover:text-[#F39C12] transition-colors flex-1">
//                         {mag.title}
//                       </h3>
//                       {mag.excerpt && (
//                         <p className="hidden sm:block text-gray-500 text-[12px] line-clamp-2 mb-3 leading-relaxed">
//                           {mag.excerpt}
//                         </p>
//                       )}
//                       <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
//                         <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400">
//                           <Calendar size={10} />
//                           <span className="hidden xs:inline">
//                             {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
//                               day: 'numeric', month: 'short', year: 'numeric',
//                             })}
//                           </span>
//                           <span className="xs:hidden">
//                             {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
//                               month: 'short', year: 'numeric',
//                             })}
//                           </span>
//                         </div>
//                         <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#F39C12]">
//                           Lire <ExternalLink size={9} />
//                         </span>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-10 pt-6 border-t border-gray-100">
//               <p className="text-xs text-gray-400 order-2 sm:order-1">
//                 Page {currentPage} sur {totalPages} — {meta?.total ?? 0} magazine{(meta?.total ?? 0) > 1 ? 's' : ''}
//               </p>
//               <div className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                   aria-label="Page précédente"
//                 >
//                   <ChevronLeft size={15} />
//                 </button>
//                 {getPageNumbers().map((page, idx) =>
//                   page === '...' ? (
//                     <span key={`dots-${idx}`} className="px-1.5 text-gray-400 text-sm select-none">…</span>
//                   ) : (
//                     <button
//                       key={page}
//                       onClick={() => handlePageChange(page as number)}
//                       className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
//                         currentPage === page
//                           ? 'bg-[#001A4D] text-white shadow-md'
//                           : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   )
//                 )}
//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                   aria-label="Page suivante"
//                 >
//                   <ChevronRight size={15} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── SIDEBAR desktop uniquement (1/4) ──────────────────────────── */}
//         <div className="hidden lg:flex flex-col space-y-12">
//           <div className="w-full bg-it-gray-light h-[500px] flex items-center justify-between border-b border-gray-200">
//             <AdvertisingBanner
//               zoneSlug="skyscraper-sidebar"
//               showDots={true}
//               className="w-full h-[500px] gap-3 flex"
//             />
//           </div>
//           <SidebarInterview />
//           <SidebarAnalyses />
//           <SidebarCTA />
//         </div>

//       </div>
//     </section>
//   );
// };

// export default LatestNews;






























// // src/components/news/LatestNews.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { Play, Handshake, Loader2, ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
// import api from '@/lib/api';
// import { AdvertisingBanner } from '@/components/AdvertisingBanner';

// interface Magazine {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt?: string | null;
//   coverImage: string | null;
//   source: string;
//   publishedAt: string;
// }

// interface SidebarArticle {
//   id: string;
//   slug: string;
//   title: string;
//   coverImage: string;
//   excerpt: string;
//   createdAt: string;
//   category?: { name: string };
//   author?: { name: string };
//   readingTime?: string;
// }

// interface PaginationMeta {
//   total: number;
//   page: number;
//   pageSize: number;
//   totalPages: number;
// }

// const PAGE_SIZE = 9;

// const LatestNews = ({ searchFilters }: { searchFilters?: any }) => {
//   const [magazines, setMagazines]     = useState<Magazine[]>([]);
//   const [analyses, setAnalyses]       = useState<SidebarArticle[]>([]);
//   const [interview, setInterview]     = useState<SidebarArticle | null>(null);
//   const [meta, setMeta]               = useState<PaginationMeta | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading]         = useState(true);
//   const [pageLoading, setPageLoading] = useState(false);

//   // ── Fetch magazines (réagit aux filtres ET à la page) ──────────────────────
//   useEffect(() => {
//     const fetchMagazines = async () => {
//       currentPage === 1 ? setLoading(true) : setPageLoading(true);
//       try {
//         const res = await api.get('/magazines/rss', {
//           params: {
//             pageSize: PAGE_SIZE,
//             page: currentPage,
//             // Filtres textuels transmis à l'API si supportés
//             ...(searchFilters?.query   && { search:  searchFilters.query }),
//             ...(searchFilters?.region  && { region:  searchFilters.region }),
//             ...(searchFilters?.country && { country: searchFilters.country }),
//             ...(searchFilters?.topic   && { topic:   searchFilters.topic }),
//           },
//         });
//         setMagazines(res.data?.data?.magazines ?? []);
//         setMeta(res.data?.data?.pagination ?? null);
//       } catch (error) {
//         console.error('Erreur chargement magazines:', error);
//       } finally {
//         setLoading(false);
//         setPageLoading(false);
//       }
//     };
//     fetchMagazines();
//   }, [currentPage, searchFilters]);

//   // Reset page à 1 quand les filtres changent
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchFilters]);

//   // ── Fetch sidebar (une seule fois) ─────────────────────────────────────────
//   useEffect(() => {
//     const fetchSidebar = async () => {
//       try {
//         const [resAnalyses, resInterview] = await Promise.all([
//           api.get('/mag/articles', {
//             params: { type: 'ARTICLE', categorySlug: 'analyses', pageSize: 4, status: 'PUBLISHED' },
//           }),
//           api.get('/mag/articles', {
//             params: { type: 'ARTICLE', categorySlug: 'interviews', pageSize: 1, status: 'PUBLISHED' },
//           }),
//         ]);
//         setAnalyses(resAnalyses.data.data ?? []);
//         setInterview(resInterview.data.data?.[0] ?? null);
//       } catch (error) {
//         console.error('Erreur sidebar:', error);
//       }
//     };
//     fetchSidebar();
//   }, []);

//   // ── Pagination helpers ─────────────────────────────────────────────────────
//   const totalPages = meta?.totalPages ?? 1;

//   const handlePageChange = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     document.getElementById('magazines-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   const getPageNumbers = (): (number | '...')[] => {
//     if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
//     const pages: (number | '...')[] = [1];
//     if (currentPage > 3)              pages.push('...');
//     for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
//       pages.push(i);
//     }
//     if (currentPage < totalPages - 2) pages.push('...');
//     pages.push(totalPages);
//     return pages;
//   };

//   // ── Rendu ──────────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="py-20 flex justify-center">
//         <Loader2 className="animate-spin text-[#001A4D]" size={40} />
//       </div>
//     );
//   }

//   return (
//     <section id="magazines-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 bg-white">

//       <div className="text-center mb-16">
//         <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#001A4D] uppercase tracking-widest">
//           Magazines &amp; Revues — Explorer par source
//         </h2>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

//         {/* ── FLUX PRINCIPAL magazines (3/4) ──────────────────────────────── */}
//         <div className="lg:col-span-3">

//           {/* Overlay de chargement de page */}
//           <div className={`relative transition-opacity duration-200 ${pageLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
//             {pageLoading && (
//               <div className="absolute inset-0 flex items-center justify-center z-10">
//                 <Loader2 className="animate-spin text-[#001A4D]" size={32} />
//               </div>
//             )}

//             {magazines.length === 0 ? (
//               <div className="py-20 text-center text-gray-400">
//                 {searchFilters?.query || searchFilters?.region || searchFilters?.country || searchFilters?.topic
//                   ? 'Aucun magazine ne correspond à vos critères de recherche.'
//                   : 'Aucun magazine disponible pour le moment.'}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
//                 {magazines.map((mag) => (
//                   <Link
//                     href={`/magazine/${mag.slug}`}
//                     key={mag.id}
//                     className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
//                   >
//                     {/* Cover portrait */}
//                     <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
//                       <img
//                         src={mag.coverImage || '/images/magazine-placeholder.jpg'}
//                         alt={mag.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                       <div className="absolute top-3 left-3">
//                         <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
//                           {mag.source}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Infos */}
//                     <div className="p-4 flex flex-col flex-1">
//                       <h3 className="font-bold text-[#001A4D] text-[14px] leading-snug mb-2 line-clamp-2 group-hover:text-[#F39C12] transition-colors flex-1">
//                         {mag.title}
//                       </h3>
//                       {mag.excerpt && (
//                         <p className="text-gray-500 text-[12px] line-clamp-2 mb-3 leading-relaxed">
//                           {mag.excerpt}
//                         </p>
//                       )}
//                       <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
//                         <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
//                           <Calendar size={11} />
//                           {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
//                             day: 'numeric', month: 'short', year: 'numeric',
//                           })}
//                         </div>
//                         <span className="flex items-center gap-1 text-[11px] font-bold text-[#F39C12]">
//                           Lire <ExternalLink size={10} />
//                         </span>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* ── Pagination style MagazineGrid ────────────────────────────── */}
//           {totalPages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
//               <p className="text-xs text-gray-400 order-2 sm:order-1">
//                 Page {currentPage} sur {totalPages} — {meta?.total ?? 0} magazine{(meta?.total ?? 0) > 1 ? 's' : ''}
//               </p>

//               <div className="flex items-center gap-1 order-1 sm:order-2">
//                 {/* Précédent */}
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                   aria-label="Page précédente"
//                 >
//                   <ChevronLeft size={16} />
//                 </button>

//                 {/* Numéros */}
//                 {getPageNumbers().map((page, idx) =>
//                   page === '...' ? (
//                     <span key={`dots-${idx}`} className="px-2 text-gray-400 text-sm select-none">…</span>
//                   ) : (
//                     <button
//                       key={page}
//                       onClick={() => handlePageChange(page as number)}
//                       className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
//                         currentPage === page
//                           ? 'bg-[#001A4D] text-white shadow-md'
//                           : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   )
//                 )}

//                 {/* Suivant */}
//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                   aria-label="Page suivante"
//                 >
//                   <ChevronRight size={16} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── SIDEBAR (1/4) ────────────────────────────────────────────────── */}
//         <div className="space-y-12">

//           <div className="w-full bg-it-gray-light h-[500px] flex items-center justify-between border-b border-gray-200">
//             <AdvertisingBanner
//               zoneSlug="skyscraper-sidebar"
//               showDots={true}
//               className="w-full h-[500px] gap-3 flex"
//             />
//           </div>

//           {interview && (
//             <div className="group border-b border-gray-100 pb-8">
//               <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
//                 <img
//                   src={interview.coverImage || '/images/placeholder.jpg'}
//                   className="object-cover w-full h-full"
//                   alt={interview.title}
//                 />
//                 <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
//                   <Play size={32} className="text-[#F39C12] fill-[#F39C12]" />
//                 </div>
//               </div>
//               <h4 className="font-serif font-bold text-[#001A4D] text-sm uppercase mb-2 tracking-wide">
//                 L&apos;interview à ne pas manquer
//               </h4>
//               <p className="text-sm text-gray-500 mb-3 line-clamp-2">{interview.title}</p>
//               <Link
//                 href={`/actualites/${interview.slug}`}
//                 className="text-[#F39C12] font-bold text-[11px] uppercase flex items-center gap-2"
//               >
//                 <div className="w-5 h-5 rounded-full border border-[#F39C12] flex items-center justify-center">
//                   <Play size={8} fill="currentColor" />
//                 </div>
//                 Lire l&apos;interview
//               </Link>
//             </div>
//           )}

//           {analyses.length > 0 && (
//             <div>
//               <div className="mb-6">
//                 <h4 className="font-serif font-bold text-[#001A4D] text-sm uppercase tracking-widest">
//                   Décryptage et Analyse
//                 </h4>
//                 <div className="w-12 h-1 bg-[#F39C12] mt-2" />
//               </div>
//               <ul className="space-y-6">
//                 {analyses.map((item) => (
//                   <li key={item.id} className="group">
//                     <Link href={`/actualites/${item.slug}`}>
//                       <p className="text-[14px] font-bold text-[#333] group-hover:text-[#F39C12] leading-tight mb-1">
//                         {item.title}
//                       </p>
//                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
//                         {new Date(item.createdAt).toLocaleDateString('fr-FR')}
//                         {item.readingTime ? ` • ${item.readingTime} min` : ''}
//                       </p>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <div className="bg-[#001A4D] p-10 text-center rounded-lg shadow-xl">
//             <div className="flex justify-center mb-4">
//               <Handshake size={48} className="text-[#F39C12]" />
//             </div>
//             <h4 className="text-white font-serif font-bold uppercase text-lg mb-4">
//               Vous êtes un professionnel ?
//             </h4>
//             <p className="text-gray-300 text-xs mb-8 leading-relaxed">
//               Découvrez nos solutions de visibilité et nos partenariats média
//             </p>
//             <Link
//               href="/partenaires"
//               className="block bg-[#F39C12] text-white font-bold text-[11px] uppercase py-4 rounded-md hover:bg-white hover:text-[#001A4D] transition-all"
//             >
//               Découvrez nos Partenariats
//             </Link>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default LatestNews;






















// // src/components/news/LatestNews.tsx
// "use client";
 
// import React, { useEffect, useState, useCallback } from 'react';
// import Link from 'next/link';
// import { Play, Handshake, Loader2, ChevronDown } from 'lucide-react';
// import api from '@/lib/api';
// import { AdvertisingBanner } from '@/components/AdvertisingBanner';
 
// interface NewsArticle {
//   id: string;
//   slug: string;
//   title: string;
//   coverImage: string;
//   excerpt: string;
//   createdAt: string;
//   category?: { name: string; slug?: string; color?: string };
//   author?: { name: string };
//   readingTime?: string;
// }
 
// interface PaginationMeta {
//   total: number;
//   page: number;
//   pageSize: number;
//   totalPages: number;
// }
 
// const PAGE_SIZE = 6;
 
// const LatestNews = ({ searchFilters }: { searchFilters?: any }) => {
//   const [articles, setArticles]       = useState<NewsArticle[]>([]);
//   const [analyses, setAnalyses]       = useState<NewsArticle[]>([]);
//   const [interview, setInterview]     = useState<NewsArticle | null>(null);
//   const [meta, setMeta]               = useState<PaginationMeta | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading]         = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
 
//   // ── Chargement initial ─────────────────────────────────────────────────────
//   useEffect(() => {
//     const fetchInitial = async () => {
//       try {
//         // Construire les paramètres de recherche
//         const searchParams = {
//           type: 'ARTICLE',
//           pageSize: PAGE_SIZE,
//           page: 1,
//           status: 'PUBLISHED',
//           ...(searchFilters?.query && { search: searchFilters.query }),
//           ...(searchFilters?.region && { region: searchFilters.region }),
//           ...(searchFilters?.country && { country: searchFilters.country }),
//           ...(searchFilters?.topic && { topic: searchFilters.topic }),
//         };
 
//         const [resArticles, resAnalyses, resInterview] = await Promise.all([
//           // Flux principal : articles de type ARTICLE uniquement
//           api.get('/mag/articles', { params: searchParams }),
          
//           // Sidebar : analyses (type ARTICLE + catégorie analyses)
//           api.get('/mag/articles', {
//             params: {
//               ...searchParams,
//               categorySlug: 'analyses',
//               pageSize: 4,
//             },
//           }),
          
//           // Sidebar : dernière interview (type ARTICLE + catégorie interviews)
//           api.get('/mag/articles', {
//             params: {
//               ...searchParams,
//               categorySlug: 'interviews',
//               pageSize: 1,
//             },
//           }),
//         ]);
 
//         setArticles(resArticles.data.data ?? []);
//         setMeta(resArticles.data.pagination ?? resArticles.data.meta ?? null);
//         setAnalyses(resAnalyses.data.data ?? []);
//         setInterview(resInterview.data.data?.[0] ?? null);
//       } catch (error) {
//         console.error('Erreur chargement LatestNews:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchInitial();
//   }, [searchFilters]);
 
//   // ── Charger plus ───────────────────────────────────────────────────────────
//   const handleLoadMore = useCallback(async () => {
//     if (loadingMore) return;
 
//     const nextPage = currentPage + 1;
//     setLoadingMore(true);
 
//     try {
//       // Construire les paramètres de recherche
//       const searchParams = {
//         type: 'ARTICLE',
//         pageSize: PAGE_SIZE,
//         page: nextPage,
//         status: 'PUBLISHED',
//         ...(searchFilters?.query && { search: searchFilters.query }),
//         ...(searchFilters?.region && { region: searchFilters.region }),
//         ...(searchFilters?.country && { country: searchFilters.country }),
//         ...(searchFilters?.topic && { topic: searchFilters.topic }),
//       };
 
//       const res = await api.get('/mag/articles', { params: searchParams });
 
//       const newArticles: NewsArticle[] = res.data.data ?? [];
//       const newMeta: PaginationMeta    = res.data.pagination ?? res.data.meta;
 
//       setArticles((prev) => [...prev, ...newArticles]);
//       setMeta(newMeta);
//       setCurrentPage(nextPage);
//     } catch (error) {
//       console.error('Erreur chargement supplémentaire:', error);
//     } finally {
//       setLoadingMore(false);
//     }
//   }, [currentPage, loadingMore, searchFilters]);
 
//   const hasMore = meta ? currentPage < meta.totalPages : false;
 
//   // ── Rendu ──────────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="py-20 flex justify-center">
//         <Loader2 className="animate-spin text-[#001A4D]" size={40} />
//       </div>
//     );
//   }
 
//   return (
//     <section className="max-w-[1400px] mx-auto px-6 py-16 bg-white">
 
//       <div className="text-center mb-16">
//         <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#001A4D] uppercase tracking-widest">
//           Actualités : explorer par secteur et tendance
//         </h2>
//       </div>
 
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
 
//         {/* ── FLUX PRINCIPAL (3/4) ─────────────────────────────────────────── */}
//         <div className="lg:col-span-3">
 
//           {articles.length === 0 ? (
//             <div className="py-20 text-center text-gray-400">
//               Aucun article disponible pour le moment.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
//               {articles.map((article) => (
//                 <Link
//                   href={`/actualites/${article.slug}`}
//                   key={article.id}
//                   className="group flex flex-col"
//                 >
//                   <div className="relative aspect-[16/10] w-full mb-4 overflow-hidden rounded-md">
//                     <img
//                       src={article.coverImage || '/images/placeholder.jpg'}
//                       alt={article.title}
//                       className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
//                     />
//                     <span className="absolute top-3 left-3 bg-[#F39C12] text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-tighter">
//                       {article.category?.name || 'Actualité'}
//                     </span>
//                   </div>
 
//                   <h3 className="text-lg font-bold text-[#001A4D] leading-snug mb-3 group-hover:text-[#F39C12] transition-colors line-clamp-2">
//                     {article.title}
//                   </h3>
//                   <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow leading-relaxed">
//                     {article.excerpt}
//                   </p>
 
//                   <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
//                     <span>Par {article.author?.name || 'Rédaction'}</span>
//                     <span>•</span>
//                     <span>
//                       {new Date(article.createdAt).toLocaleDateString('fr-FR', {
//                         day: 'numeric', month: 'short', year: 'numeric',
//                       })}
//                     </span>
//                     {article.readingTime && (
//                       <>
//                         <span>•</span>
//                         <span>{article.readingTime} min</span>
//                       </>
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
 
//           {/* ── Bouton "Voir plus" ────────────────────────────────────────── */}
//           <div className="flex flex-col items-center gap-3 mt-20">
//             {hasMore && (
//               <button
//                 onClick={handleLoadMore}
//                 disabled={loadingMore}
//                 className="group bg-[#001A4D] text-white px-12 py-4 rounded font-bold text-sm uppercase tracking-widest hover:bg-[#F39C12] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
//               >
//                 {loadingMore ? (
//                   <>
//                     <Loader2 size={16} className="animate-spin" />
//                     Chargement…
//                   </>
//                 ) : (
//                   <>
//                     Voir plus d&apos;actualités
//                     <ChevronDown
//                       size={16}
//                       className="group-hover:translate-y-0.5 transition-transform"
//                     />
//                   </>
//                 )}
//               </button>
//             )}
 
//             {meta && (
//               <p className="text-xs text-gray-400">
//                 {articles.length} sur {meta.total} article{meta.total > 1 ? 's' : ''}
//               </p>
//             )}
//           </div>
//         </div>
 
//         {/* ── SIDEBAR (1/4) ────────────────────────────────────────────────── */}
//         <div className="space-y-12">
 
//           {/* Publicité Skyscraper */}
//           <div className="w-full bg-it-gray-light h-[500px] flex items-center justify-between border-b border-gray-200">
//             <AdvertisingBanner
//               zoneSlug="skyscraper-sidebar"
//               showDots={true}
//               className="w-full h-[500px] gap-3 flex"
//             />
//           </div>
 
//           {/* L'interview */}
//           {interview && (
//             <div className="group border-b border-gray-100 pb-8">
//               <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
//                 <img
//                   src={interview.coverImage || '/images/placeholder.jpg'}
//                   className="object-cover w-full h-full"
//                   alt={interview.title}
//                 />
//                 <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
//                   <Play size={32} className="text-[#F39C12] fill-[#F39C12]" />
//                 </div>
//               </div>
//               <h4 className="font-serif font-bold text-[#001A4D] text-sm uppercase mb-2 tracking-wide">
//                 L&apos;interview à ne pas manquer
//               </h4>
//               <p className="text-sm text-gray-500 mb-3 line-clamp-2">{interview.title}</p>
//               <Link
//                 href={`/actualites/${interview.slug}`}
//                 className="text-[#F39C12] font-bold text-[11px] uppercase flex items-center gap-2"
//               >
//                 <div className="w-5 h-5 rounded-full border border-[#F39C12] flex items-center justify-center">
//                   <Play size={8} fill="currentColor" />
//                 </div>
//                 Lire l&apos;interview
//               </Link>
//             </div>
//           )}
 
//           {/* Décryptage & Analyse */}
//           {analyses.length > 0 && (
//             <div>
//               <div className="mb-6">
//                 <h4 className="font-serif font-bold text-[#001A4D] text-sm uppercase tracking-widest">
//                   Décryptage et Analyse
//                 </h4>
//                 <div className="w-12 h-1 bg-[#F39C12] mt-2" />
//               </div>
//               <ul className="space-y-6">
//                 {analyses.map((item) => (
//                   <li key={item.id} className="group">
//                     <Link href={`/actualites/${item.slug}`}>
//                       <p className="text-[14px] font-bold text-[#333] group-hover:text-[#F39C12] leading-tight mb-1">
//                         {item.title}
//                       </p>
//                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
//                         {new Date(item.createdAt).toLocaleDateString('fr-FR')}
//                         {item.readingTime ? ` • ${item.readingTime} min` : ''}
//                       </p>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
 
//           {/* CTA Professionnel */}
//           <div className="bg-[#001A4D] p-10 text-center rounded-lg shadow-xl">
//             <div className="flex justify-center mb-4">
//               <Handshake size={48} className="text-[#F39C12]" />
//             </div>
//             <h4 className="text-white font-serif font-bold uppercase text-lg mb-4">
//               Vous êtes un professionnel ?
//             </h4>
//             <p className="text-gray-300 text-xs mb-8 leading-relaxed">
//               Découvrez nos solutions de visibilité et nos partenariats média
//             </p>
//             <Link
//               href="/partenaires"
//               className="block bg-[#F39C12] text-white font-bold text-[11px] uppercase py-4 rounded-md hover:bg-white hover:text-[#001A4D] transition-all"
//             >
//               Découvrez nos Partenariats
//             </Link>
//           </div>
 
//         </div>
//       </div>
//     </section>
//   );
// };
 
// export default LatestNews;