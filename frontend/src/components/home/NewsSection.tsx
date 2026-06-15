"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Loader2, Clock, ArrowRight, ExternalLink } from 'lucide-react';
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

// ─── Hook reveal on scroll ────────────────────────────────────────────────────

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Carte article featured (grande) ─────────────────────────────────────────

function FeaturedCard({ magazine, delay = 0 }: { magazine: Magazine; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
      }}
    >
      <Link href={`/magazine/${magazine.slug}`} className="group block relative overflow-hidden rounded-2xl" style={{ aspectRatio: '4/5' }}>
        {/* Image */}
        <MagazineImage
          src={magazine.coverImage}
          alt={magazine.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.95) 0%, rgba(10,35,20,0.4) 50%, transparent 100%)' }} />

        {/* Badge source */}
        <span
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
          style={{ background: '#B85C38' }}
        >
          {magazine.source}
        </span>

        {/* Contenu bas */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-[#C8A84B] text-[11px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
            <Clock size={11} />
            {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h3 className="text-white font-black text-xl leading-snug line-clamp-3 mb-4 group-hover:text-[#C8A84B] transition-colors">
            {magazine.title}
          </h3>
          <span className="inline-flex items-center gap-1.5 text-white/70 text-xs font-semibold uppercase tracking-widest group-hover:text-white transition-colors">
            Lire <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </div>
  );
}

// ─── Carte article secondaire (petite) ───────────────────────────────────────

function SecondaryCard({ magazine, delay = 0 }: { magazine: Magazine; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(24px)',
      }}
    >
      <Link
        href={`/magazine/${magazine.slug}`}
        className="group flex gap-4 items-start p-4 rounded-2xl hover:bg-[#F0FAF5] transition-colors"
      >
        {/* Miniature */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden">
          <MagazineImage
            src={magazine.coverImage}
            alt={magazine.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Texte */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#B85C38' }}>
            {magazine.source}
          </span>
          <h4 className="font-bold text-sm leading-snug text-gray-900 line-clamp-2 mt-0.5 group-hover:text-[#1A5C43] transition-colors">
            {magazine.title}
          </h4>
          <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
            <Clock size={10} />
            {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </Link>
    </div>
  );
}

// ─── Carte article bas de page (grille 3 colonnes) ───────────────────────────

function BottomCard({ magazine, delay = 0 }: { magazine: Magazine; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <Link href={`/magazine/${magazine.slug}`} className="group block">
        <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4">
          <MagazineImage
            src={magazine.coverImage}
            alt={magazine.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#B85C38' }}>
          {magazine.source}
        </span>
        <h4 className="font-bold text-base leading-snug mt-1 line-clamp-2 text-gray-900 group-hover:text-[#1A5C43] transition-colors">
          {magazine.title}
        </h4>
        <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
          <Clock size={10} />
          {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </Link>
    </div>
  );
}

// ─── Section principale ───────────────────────────────────────────────────────

const NewsSection = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: headingRef, visible: headingVisible } = useReveal(0.3);

  useEffect(() => {
    api.get('/magazines/rss', { params: { pageSize: 7, page: 1 } })
      .then((res) => setMagazines(res.data?.data?.magazines ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4">
        <Loader2 size={36} className="animate-spin" style={{ color: '#1A5C43' }} />
        <p className="text-xs uppercase tracking-widest font-semibold text-gray-400 animate-pulse">Chargement des actualités…</p>
      </div>
    );
  }
  if (!magazines.length) return null;

  const [featured, ...rest] = magazines;

  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-6">

        {/* Heading */}
        <div
          ref={headingRef}
          className="flex items-end justify-between mb-14 transition-all duration-700"
          style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? 'none' : 'translateY(20px)' }}
        >
          <div>
            {/* Eyebrow */}
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

        {/* Layout éditorial — featured + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 mb-16">

          {/* Featured */}
          {featured && <FeaturedCard magazine={featured} delay={0} />}

          {/* Sidebar articles secondaires */}
          <div className="flex flex-col divide-y divide-gray-100">
            {rest.slice(0, 4).map((mag, i) => (
              <SecondaryCard key={mag.id} magazine={mag} delay={i * 80 + 100} />
            ))}
          </div>
        </div>

        {/* Grille bas — 3 articles */}
        {rest.length > 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.slice(4, 7).map((mag, i) => (
              <BottomCard key={mag.id} magazine={mag} delay={i * 100} />
            ))}
          </div>
        )}

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