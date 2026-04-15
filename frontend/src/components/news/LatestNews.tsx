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

// const LatestNews = () => {
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
//         const [resArticles, resAnalyses, resInterview] = await Promise.all([
//           // Flux principal : articles de type ARTICLE uniquement
//           api.get('/mag/articles', {
//             params: {
//               type: 'ARTICLE',     // ✅ filtre strict sur le type
//               pageSize: PAGE_SIZE,
//               page: 1,
//               status: 'PUBLISHED',
//             },
//           }),
//           // Sidebar : analyses (type ARTICLE + catégorie analyses)
//           api.get('/mag/articles', {
//             params: {
//               type: 'ARTICLE',
//               categorySlug: 'analyses',
//               pageSize: 4,
//               status: 'PUBLISHED',
//             },
//           }),
//           // Sidebar : dernière interview (type ARTICLE + catégorie interviews)
//           api.get('/mag/articles', {
//             params: {
//               type: 'ARTICLE',
//               categorySlug: 'interviews',
//               pageSize: 1,
//               status: 'PUBLISHED',
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
//   }, []);

//   // ── Charger plus ───────────────────────────────────────────────────────────
//   const handleLoadMore = useCallback(async () => {
//     if (loadingMore) return;

//     const nextPage = currentPage + 1;
//     setLoadingMore(true);

//     try {
//       const res = await api.get('/mag/articles', {
//         params: {
//           type: 'ARTICLE',     // ✅ on conserve le filtre type à chaque page suivante
//           pageSize: PAGE_SIZE,
//           page: nextPage,
//           status: 'PUBLISHED',
//         },
//       });

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
//   }, [currentPage, loadingMore]);

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
//           <div className="bg-[#E5E7EB] w-full rounded-sm flex flex-col items-center justify-center text-center border border-gray-200">
//             <AdvertisingBanner
//               zoneSlug="skyscraper-actualite"
//               showDots={true}
//               className="w-full"
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



// src/components/news/LatestNews.tsx
"use client";
 
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Play, Handshake, Loader2, ChevronDown } from 'lucide-react';
import api from '@/lib/api';
import { AdvertisingBanner } from '@/components/AdvertisingBanner';
 
interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  excerpt: string;
  createdAt: string;
  category?: { name: string; slug?: string; color?: string };
  author?: { name: string };
  readingTime?: string;
}
 
interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
 
const PAGE_SIZE = 6;
 
const LatestNews = ({ searchFilters }: { searchFilters?: any }) => {
  const [articles, setArticles]       = useState<NewsArticle[]>([]);
  const [analyses, setAnalyses]       = useState<NewsArticle[]>([]);
  const [interview, setInterview]     = useState<NewsArticle | null>(null);
  const [meta, setMeta]               = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
 
  // ── Chargement initial ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        // Construire les paramètres de recherche
        const searchParams = {
          type: 'ARTICLE',
          pageSize: PAGE_SIZE,
          page: 1,
          status: 'PUBLISHED',
          ...(searchFilters?.query && { search: searchFilters.query }),
          ...(searchFilters?.region && { region: searchFilters.region }),
          ...(searchFilters?.country && { country: searchFilters.country }),
          ...(searchFilters?.topic && { topic: searchFilters.topic }),
        };
 
        const [resArticles, resAnalyses, resInterview] = await Promise.all([
          // Flux principal : articles de type ARTICLE uniquement
          api.get('/mag/articles', { params: searchParams }),
          
          // Sidebar : analyses (type ARTICLE + catégorie analyses)
          api.get('/mag/articles', {
            params: {
              ...searchParams,
              categorySlug: 'analyses',
              pageSize: 4,
            },
          }),
          
          // Sidebar : dernière interview (type ARTICLE + catégorie interviews)
          api.get('/mag/articles', {
            params: {
              ...searchParams,
              categorySlug: 'interviews',
              pageSize: 1,
            },
          }),
        ]);
 
        setArticles(resArticles.data.data ?? []);
        setMeta(resArticles.data.pagination ?? resArticles.data.meta ?? null);
        setAnalyses(resAnalyses.data.data ?? []);
        setInterview(resInterview.data.data?.[0] ?? null);
      } catch (error) {
        console.error('Erreur chargement LatestNews:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchInitial();
  }, [searchFilters]);
 
  // ── Charger plus ───────────────────────────────────────────────────────────
  const handleLoadMore = useCallback(async () => {
    if (loadingMore) return;
 
    const nextPage = currentPage + 1;
    setLoadingMore(true);
 
    try {
      // Construire les paramètres de recherche
      const searchParams = {
        type: 'ARTICLE',
        pageSize: PAGE_SIZE,
        page: nextPage,
        status: 'PUBLISHED',
        ...(searchFilters?.query && { search: searchFilters.query }),
        ...(searchFilters?.region && { region: searchFilters.region }),
        ...(searchFilters?.country && { country: searchFilters.country }),
        ...(searchFilters?.topic && { topic: searchFilters.topic }),
      };
 
      const res = await api.get('/mag/articles', { params: searchParams });
 
      const newArticles: NewsArticle[] = res.data.data ?? [];
      const newMeta: PaginationMeta    = res.data.pagination ?? res.data.meta;
 
      setArticles((prev) => [...prev, ...newArticles]);
      setMeta(newMeta);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Erreur chargement supplémentaire:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, loadingMore, searchFilters]);
 
  const hasMore = meta ? currentPage < meta.totalPages : false;
 
  // ── Rendu ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin text-[#001A4D]" size={40} />
      </div>
    );
  }
 
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-16 bg-white">
 
      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#001A4D] uppercase tracking-widest">
          Actualités : explorer par secteur et tendance
        </h2>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
 
        {/* ── FLUX PRINCIPAL (3/4) ─────────────────────────────────────────── */}
        <div className="lg:col-span-3">
 
          {articles.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              Aucun article disponible pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {articles.map((article) => (
                <Link
                  href={`/actualites/${article.slug}`}
                  key={article.id}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[16/10] w-full mb-4 overflow-hidden rounded-md">
                    <img
                      src={article.coverImage || '/images/placeholder.jpg'}
                      alt={article.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-[#F39C12] text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-tighter">
                      {article.category?.name || 'Actualité'}
                    </span>
                  </div>
 
                  <h3 className="text-lg font-bold text-[#001A4D] leading-snug mb-3 group-hover:text-[#F39C12] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow leading-relaxed">
                    {article.excerpt}
                  </p>
 
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                    <span>Par {article.author?.name || 'Rédaction'}</span>
                    <span>•</span>
                    <span>
                      {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                    {article.readingTime && (
                      <>
                        <span>•</span>
                        <span>{article.readingTime} min</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
 
          {/* ── Bouton "Voir plus" ────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-3 mt-20">
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="group bg-[#001A4D] text-white px-12 py-4 rounded font-bold text-sm uppercase tracking-widest hover:bg-[#F39C12] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {loadingMore ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Chargement…
                  </>
                ) : (
                  <>
                    Voir plus d&apos;actualités
                    <ChevronDown
                      size={16}
                      className="group-hover:translate-y-0.5 transition-transform"
                    />
                  </>
                )}
              </button>
            )}
 
            {meta && (
              <p className="text-xs text-gray-400">
                {articles.length} sur {meta.total} article{meta.total > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
 
        {/* ── SIDEBAR (1/4) ────────────────────────────────────────────────── */}
        <div className="space-y-12">
 
          {/* Publicité Skyscraper */}
          <div className="w-full bg-it-gray-light h-[500px] flex items-center justify-between border-b border-gray-200">
            <AdvertisingBanner
              zoneSlug="skyscraper-sidebar"
              showDots={true}
              className="w-full h-[500px] gap-3 flex"
            />
          </div>
 
          {/* L'interview */}
          {interview && (
            <div className="group border-b border-gray-100 pb-8">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={interview.coverImage || '/images/placeholder.jpg'}
                  className="object-cover w-full h-full"
                  alt={interview.title}
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <Play size={32} className="text-[#F39C12] fill-[#F39C12]" />
                </div>
              </div>
              <h4 className="font-serif font-bold text-[#001A4D] text-sm uppercase mb-2 tracking-wide">
                L&apos;interview à ne pas manquer
              </h4>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{interview.title}</p>
              <Link
                href={`/actualites/${interview.slug}`}
                className="text-[#F39C12] font-bold text-[11px] uppercase flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full border border-[#F39C12] flex items-center justify-center">
                  <Play size={8} fill="currentColor" />
                </div>
                Lire l&apos;interview
              </Link>
            </div>
          )}
 
          {/* Décryptage & Analyse */}
          {analyses.length > 0 && (
            <div>
              <div className="mb-6">
                <h4 className="font-serif font-bold text-[#001A4D] text-sm uppercase tracking-widest">
                  Décryptage et Analyse
                </h4>
                <div className="w-12 h-1 bg-[#F39C12] mt-2" />
              </div>
              <ul className="space-y-6">
                {analyses.map((item) => (
                  <li key={item.id} className="group">
                    <Link href={`/actualites/${item.slug}`}>
                      <p className="text-[14px] font-bold text-[#333] group-hover:text-[#F39C12] leading-tight mb-1">
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
          )}
 
          {/* CTA Professionnel */}
          <div className="bg-[#001A4D] p-10 text-center rounded-lg shadow-xl">
            <div className="flex justify-center mb-4">
              <Handshake size={48} className="text-[#F39C12]" />
            </div>
            <h4 className="text-white font-serif font-bold uppercase text-lg mb-4">
              Vous êtes un professionnel ?
            </h4>
            <p className="text-gray-300 text-xs mb-8 leading-relaxed">
              Découvrez nos solutions de visibilité et nos partenariats média
            </p>
            <Link
              href="/partenaires"
              className="block bg-[#F39C12] text-white font-bold text-[11px] uppercase py-4 rounded-md hover:bg-white hover:text-[#001A4D] transition-all"
            >
              Découvrez nos Partenariats
            </Link>
          </div>
 
        </div>
      </div>
    </section>
  );
};
 
export default LatestNews;