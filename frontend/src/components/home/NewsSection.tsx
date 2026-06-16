// src/components/home/NewsSection.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
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

function formatDate(iso: string, monthStyle: 'long' | 'short' = 'long') {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: monthStyle, year: 'numeric' });
}

// ─── Carte article featured (assombrissement type NewsHero) ─────────────────

function FeaturedCard({ magazine, visible }: { magazine: Magazine; visible: boolean }) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="group block relative overflow-hidden rounded-2xl"
      style={{
        aspectRatio: '16/11',
        transition: 'opacity 0.7s, transform 0.7s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <MagazineImage
        src={magazine.coverImage}
        alt={magazine.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.4) 50%, transparent 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,35,20,0.3) 0%, transparent 60%)' }} />

      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span
          className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-white"
          style={{ background: '#B85C38' }}
        >
          À la une
        </span>
        <span
          className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white/90"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          {magazine.source}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[#C8A84B] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
          <Clock size={10} />
          {formatDate(magazine.publishedAt)}
        </p>
        <h3 className="text-white font-black text-base md:text-lg leading-snug line-clamp-2 group-hover:text-[#C8A84B] transition-colors" style={{ letterSpacing: '-0.01em' }}>
          {magazine.title}
        </h3>
      </div>
    </Link>
  );
}

// ─── Carte article secondaire — image assombrie, type SideCard de NewsHero ──

function SecondaryCard({ magazine, delay = 0, visible }: { magazine: Magazine; delay?: number; visible: boolean }) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="group block relative overflow-hidden rounded-2xl"
      style={{
        aspectRatio: '16/10',
        transition: `opacity 0.6s ${delay}ms, transform 0.6s ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(24px)',
      }}
    >
      {/* Image */}
      <div className="absolute inset-0 overflow-hidden">
        <MagazineImage
          src={magazine.coverImage}
          alt={magazine.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.95) 0%, rgba(10,35,20,0.3) 60%, transparent 100%)' }} />
      </div>

      {/* Badge source */}
      <span
        className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
        style={{ background: 'rgba(42,127,95,0.9)' }}
      >
        {magazine.source}
      </span>

      {/* Contenu bas */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <p className="text-[#C8A84B] text-[10px] font-bold uppercase tracking-wider mb-1">
          {formatDate(magazine.publishedAt, 'short')}
        </p>
        <h4 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#C8A84B] transition-colors">
          {magazine.title}
        </h4>
      </div>
    </Link>
  );
}

// ─── Section principale ───────────────────────────────────────────────────────

const NewsSection = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    api.get('/magazines/rss', { params: { pageSize: 5, page: 1 } })
      .then((res) => { if (!cancelled) setMagazines(res.data?.data?.magazines ?? []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (loading) return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4">
        <Loader2 size={36} className="animate-spin" style={{ color: '#1A5C43' }} />
        <p className="text-xs uppercase tracking-widest font-semibold text-gray-400 animate-pulse">Chargement des actualités…</p>
      </div>
    );
  }
  if (!magazines.length) return null;

  const featured = magazines[0];
  const secondary = magazines.slice(1, 5);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-6">

        {/* Heading */}
        <div
          className="flex items-end justify-between mb-10 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: '#B85C38' }}>
              — Actualités
            </p>
            <h2 className="text-3xl md:text-5xl font-black leading-none" style={{ color: '#0D1A10', letterSpacing: '-0.03em' }}>
              Dernières<br />
              <span style={{ color: '#1A5C43' }}>Nouveautés</span>
            </h2>
          </div>

          <Link
            href="/actualites"
            className="hidden md:inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all hover:shadow-lg active:scale-95 text-white"
            style={{ background: '#1A5C43' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
          >
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured + grille de cartes secondaires en image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeaturedCard magazine={featured} visible={visible} />

          <div className="grid grid-cols-2 gap-4">
            {secondary.map((mag, i) => (
              <SecondaryCard key={mag.id} magazine={mag} delay={i * 100 + 150} visible={visible} />
            ))}
          </div>
        </div>

        {/* CTA mobile */}
        <div className="mt-12 flex justify-center md:hidden">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full text-white transition-all"
            style={{ background: '#1A5C43' }}
          >
            Voir toutes les actualités <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;










// // src/components/home/NewsSection.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { Loader2, Clock, ExternalLink } from 'lucide-react';
// import api from '@/lib/api';
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

// const NewsSection = () => {
//   const [magazines, setMagazines] = useState<Magazine[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMagazines = async () => {
//       try {
//         const res = await api.get('/magazines/rss', {
//           params: { pageSize: 6, page: 1 },
//         });
//         setMagazines(res.data?.data?.magazines ?? []);
//       } catch (error) {
//         console.error('Erreur NewsSection magazines:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMagazines();
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-20 flex flex-col items-center justify-center gap-4">
//         <Loader2 size={40} className="animate-spin" style={{ color: '#B85C38' }} />
//         <p className="font-medium text-sm uppercase tracking-widest" style={{ color: '#001A4D' }}>
//           Chargement des magazines...
//         </p>
//       </div>
//     );
//   }

//   if (magazines.length === 0) return null;

//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-[1300px] mx-auto px-6">
//         <h2
//           className="text-center text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest mb-12"
//           style={{ color: '#001A4D' }}
//         >
//           Dernières Nouveautés
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
//           {magazines.map((magazine) => (
//             <Link
//               href={`/magazine/${magazine.slug}`}
//               key={magazine.id}
//               className="group flex flex-col"
//             >
//               {/* Cover portrait */}
//               <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-6 bg-gray-100">
//                 <MagazineImage
//                   src={magazine.coverImage}
//                   alt={magazine.title}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                 />
//                 {/* Badge source — émeraude */}
//                 <span
//                   className="absolute top-3 left-3 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm"
//                   style={{ background: 'rgba(42,127,95,0.9)' }}
//                 >
//                   {magazine.source}
//                 </span>
//               </div>

//               <div className="flex flex-col flex-grow">
//                 {/* Titre — hover or doux */}
//                 <h3
//                   className="text-xl font-bold leading-snug mb-3 line-clamp-2 transition-colors"
//                   style={{ color: '#001A4D' }}
//                   onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
//                   onMouseLeave={e => (e.currentTarget.style.color = '#001A4D')}
//                 >
//                   {magazine.title}
//                 </h3>

//                 {magazine.excerpt && (
//                   <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-4">
//                     {magazine.excerpt}
//                   </p>
//                 )}

//                 <div className="flex items-center gap-2 text-gray-400 text-[11px] mb-4">
//                   <Clock size={12} />
//                   <span>
//                     {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
//                       day: 'numeric',
//                       month: 'short',
//                       year: 'numeric',
//                     })}
//                   </span>
//                 </div>

//                 {/* Lien "Lire" — terre cuite */}
//                 <div
//                   className="flex items-center font-bold text-[11px] uppercase tracking-[0.15em] mt-auto"
//                   style={{ color: '#B85C38' }}
//                 >
//                   Lire l&apos;actualité
//                   <ExternalLink size={12} className="ml-1.5" />
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         <div className="mt-16 flex justify-center">
//           {/* Bouton principal — émeraude foncé → terre cuite au hover */}
//           <Link
//             href="/actualites"
//             className="text-white px-8 py-3.5 rounded font-bold text-xs uppercase tracking-[0.2em] transition-colors shadow-sm"
//             style={{ background: '#1A5C43' }}
//             onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
//             onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
//           >
//             Voir toutes les actualités
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsSection;



















// // src/components/home/NewsSection.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { Loader2, Clock, ExternalLink } from 'lucide-react';
// import api from '@/lib/api';
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

// const NewsSection = () => {
//   const [magazines, setMagazines] = useState<Magazine[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMagazines = async () => {
//       try {
//         const res = await api.get('/magazines/rss', {
//           params: { pageSize: 6, page: 1 },
//         });
//         setMagazines(res.data?.data?.magazines ?? []);
//       } catch (error) {
//         console.error('Erreur NewsSection magazines:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMagazines();
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-20 flex flex-col items-center justify-center gap-4">
//         <Loader2 className="animate-spin text-it-orange" size={40} />
//         <p className="text-it-blue font-medium text-sm uppercase tracking-widest">
//           Chargement des magazines...
//         </p>
//       </div>
//     );
//   }

//   if (magazines.length === 0) return null;

//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-[1300px] mx-auto px-6">
//         <h2 className="text-center text-[#001A4D] text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest mb-12">
//           Dernières Nouveautés
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
//           {magazines.map((magazine) => (
//             <Link
//               href={`/magazine/${magazine.slug}`}
//               key={magazine.id}
//               className="group flex flex-col"
//             >
//               {/* Cover portrait — ✅ fallback automatique */}
//               <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-6 bg-gray-100">
//                 <MagazineImage
//                   src={magazine.coverImage}
//                   alt={magazine.title}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                 />
//                 <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
//                   {magazine.source}
//                 </span>
//               </div>

//               <div className="flex flex-col flex-grow">
//                 <h3 className="text-xl font-bold text-[#1A365D] leading-snug mb-3 group-hover:text-[#E67E22] transition-colors line-clamp-2">
//                   {magazine.title}
//                 </h3>

//                 {magazine.excerpt && (
//                   <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-4">
//                     {magazine.excerpt}
//                   </p>
//                 )}

//                 <div className="flex items-center gap-2 text-gray-400 text-[11px] mb-4">
//                   <Clock size={12} />
//                   <span>
//                     {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
//                       day: 'numeric',
//                       month: 'short',
//                       year: 'numeric',
//                     })}
//                   </span>
//                 </div>

//                 <div className="flex items-center text-[#E67E22] font-bold text-[11px] uppercase tracking-[0.15em] mt-auto">
//                   Lire l&apos;actualité
//                   <ExternalLink size={12} className="ml-1.5" />
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         <div className="mt-16 flex justify-center">
//           <Link
//             href="/actualites"
//             className="bg-[#001A4D] text-white px-8 py-3.5 rounded font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#E67E22] transition-colors shadow-sm"
//           >
//             Voir toutes les actualités
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsSection;
























// // src/components/home/NewsSection.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { ChevronRight, Loader2, Clock, ExternalLink } from 'lucide-react';
// import api from '@/lib/api';

// interface Magazine {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt?: string | null;
//   coverImage: string | null;
//   source: string;
//   publishedAt: string;
// }

// const NewsSection = () => {
//   const [magazines, setMagazines] = useState<Magazine[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMagazines = async () => {
//       try {
//         const res = await api.get('/magazines/rss', {
//           params: { pageSize: 6, page: 1 },
//         });
//         setMagazines(res.data?.data?.magazines ?? []);
//       } catch (error) {
//         console.error('Erreur NewsSection magazines:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMagazines();
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-20 flex flex-col items-center justify-center gap-4">
//         <Loader2 className="animate-spin text-it-orange" size={40} />
//         <p className="text-it-blue font-medium text-sm uppercase tracking-widest">
//           Chargement des magazines...
//         </p>
//       </div>
//     );
//   }

//   if (magazines.length === 0) return null;

//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-[1300px] mx-auto px-6">
//         <h2 className="text-center text-[#001A4D] text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest mb-12">
//           Dernières Nouveautés
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
//           {magazines.map((magazine) => (
//             <Link
//               href={`/magazine/${magazine.slug}`}
//               key={magazine.id}
//               className="group flex flex-col"
//             >
//               {/* Cover portrait */}
//               <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-6 bg-gray-100">
//                 <img
//                   src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
//                   alt={magazine.title}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                 />
//                 <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
//                   {magazine.source}
//                 </span>
//               </div>

//               <div className="flex flex-col flex-grow">
//                 <h3 className="text-xl font-bold text-[#1A365D] leading-snug mb-3 group-hover:text-[#E67E22] transition-colors line-clamp-2">
//                   {magazine.title}
//                 </h3>

//                 {magazine.excerpt && (
//                   <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-4">
//                     {magazine.excerpt}
//                   </p>
//                 )}

//                 <div className="flex items-center gap-2 text-gray-400 text-[11px] mb-4">
//                   <Clock size={12} />
//                   <span>
//                     {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
//                       day: 'numeric',
//                       month: 'short',
//                       year: 'numeric',
//                     })}
//                   </span>
//                 </div>

//                 <div className="flex items-center text-[#E67E22] font-bold text-[11px] uppercase tracking-[0.15em] mt-auto">
//                   Lire l'actualité
//                   <ExternalLink size={12} className="ml-1.5" />
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         <div className="mt-16 flex justify-center">
//           <Link
//             href="/actualites"
//             className="bg-[#001A4D] text-white px-8 py-3.5 rounded font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#E67E22] transition-colors shadow-sm"
//           >
//             Voir toutes les actualités
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsSection;

























// // src/components/home/NewsSection.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { ChevronRight, Loader2 } from 'lucide-react';
// import api from '@/lib/api';

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
// }

// const NewsSection = () => {
//   const [news, setNews] = useState<NewsArticle[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const res = await api.get('/mag/articles', {
//           params: {
//             pageSize: 6,
//             page: 1,
//             status: 'PUBLISHED',
//             type: 'ARTICLE',   // ✅ uniquement les articles (pas les vidéos, salons, etc.)
//           },
//         });
//         setNews(res.data.data ?? []);
//       } catch (error) {
//         console.error('Erreur NewsSection:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNews();
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-20 flex flex-col items-center justify-center gap-4">
//         <Loader2 className="animate-spin text-it-orange" size={40} />
//         <p className="text-it-blue font-medium text-sm uppercase tracking-widest">
//           Chargement des nouveautés...
//         </p>
//       </div>
//     );
//   }

//   if (news.length === 0) return null;

//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-[1300px] mx-auto px-6">
//         <h2 className="text-center text-[#001A4D] text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest mb-12">
//           Dernières Nouveautés
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
//           {news.map((article) => (
//             <Link
//               href={`/actualites/${article.slug}`}
//               key={article.id}
//               className="group flex flex-col"
//             >
//               <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-6">
//                 <img
//                   src={article.coverImage || '/images/placeholder.jpg'}
//                   alt={article.title}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                 />
//                 <span className="absolute top-3 left-3 bg-[#E67E22] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider">
//                   {article.category?.name || 'Actualité'}
//                 </span>
//               </div>

//               <div className="flex flex-col flex-grow">
//                 <h3 className="text-xl font-bold text-[#1A365D] leading-snug mb-3 group-hover:text-[#E67E22] transition-colors line-clamp-2">
//                   {article.title}
//                 </h3>

//                 <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-4">
//                   {article.excerpt}
//                 </p>

//                 <div className="flex items-center gap-2 text-gray-400 text-[11px] mb-4">
//                   <span>
//                     {new Date(article.createdAt).toLocaleDateString('fr-FR', {
//                       day: 'numeric',
//                       month: 'short',
//                       year: 'numeric',
//                     })}
//                   </span>
//                   <span>•</span>
//                   <span>Par {article.author?.name || 'Rédaction'}</span>
//                 </div>

//                 <div className="flex items-center text-[#E67E22] font-bold text-[11px] uppercase tracking-[0.15em] mt-auto">
//                   Lire l&apos;article
//                   <ChevronRight
//                     size={14}
//                     className="ml-1 group-hover:translate-x-1 transition-transform"
//                   />
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         <div className="mt-16 flex justify-center">
//           <Link
//             href="/actualites"
//             className="bg-[#001A4D] text-white px-8 py-3.5 rounded font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#E67E22] transition-colors shadow-sm"
//           >
//             Voir toutes les actualités
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsSection;