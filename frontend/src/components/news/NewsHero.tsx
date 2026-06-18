// src/components/news/NewsHero.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import type { Magazine } from '@/lib/server-data';

// ─── Carte principale (grande) ────────────────────────────────────────────────

function MainCard({ magazine, visible }: { magazine: Magazine; visible: boolean }) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="lg:col-span-2 group block relative overflow-hidden rounded-2xl"
      style={{
        transition: 'opacity 0.7s, transform 0.7s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
      }}
    >
      <div className="relative h-[300px] sm:h-[380px] md:h-[460px] w-full overflow-hidden">
        <Image
          src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
          alt={magazine.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.4) 50%, transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,35,20,0.3) 0%, transparent 60%)' }} />
      </div>

      <div className="absolute top-5 left-5 flex items-center gap-2">
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

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <p className="text-[#C8A84B] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
          <Clock size={11} />
          {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
        <h2
          className="text-white font-black text-xl md:text-2xl lg:text-3xl leading-tight line-clamp-3 mb-4 group-hover:text-[#C8A84B] transition-colors"
          style={{ letterSpacing: '-0.02em' }}
        >
          {magazine.title}
        </h2>
        {magazine.excerpt && (
          <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-5 max-w-xl hidden sm:block">
            {magazine.excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-widest group-hover:text-white group-hover:gap-3 transition-all">
          Lire l&apos;article <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}

// ─── Carte secondaire ─────────────────────────────────────────────────────────

function SideCard({
  magazine,
  delay = 0,
  visible,
}: {
  magazine: Magazine;
  delay?: number;
  visible: boolean;
}) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="group flex-1 block relative overflow-hidden rounded-2xl min-h-[180px]"
      style={{
        transition: `opacity 0.6s ${delay}ms, transform 0.6s ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(24px)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
          alt={magazine.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.95) 0%, rgba(10,35,20,0.3) 60%, transparent 100%)' }}
        />
      </div>

      <span
        className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
        style={{ background: 'rgba(42,127,95,0.9)' }}
      >
        {magazine.source}
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <p className="text-[#C8A84B] text-[10px] font-bold uppercase tracking-wider mb-1.5">
          {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short',
          })}
        </p>
        <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#C8A84B] transition-colors">
          {magazine.title}
        </h3>
      </div>
    </Link>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

interface NewsHeroProps {
  /** Magazines pré-fetchés côté serveur — plus aucun fetch client ici. */
  magazines: Magazine[];
}

const NewsHero = ({ magazines }: NewsHeroProps) => {
  const [visible, setVisible] = useState(false);

  // Les données arrivent déjà rendues côté serveur ;
  // il ne reste qu'à déclencher l'animation d'entrée au montage.
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (!magazines.length) {
    return (
      <section className="py-16 px-4" style={{ background: '#0D2B1A' }}>
        <div className="max-w-[1300px] mx-auto text-center">
          <h1 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tight">
            Actualités du Tourisme
          </h1>
          <p className="text-white/50 mt-4">Aucune actualité disponible pour le moment.</p>
        </div>
      </section>
    );
  }

  const displayMags = [...magazines];
  while (displayMags.length < 3) displayMags.push(magazines[0]);
  const [main, ...sides] = displayMags;

  return (
    <section
      className="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden"
      style={{ background: '#0D2B1A' }}
    >
      {/* Décorations fond */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="absolute top-0 left-0 w-1/2 h-full opacity-20"
        style={{ background: 'radial-gradient(ellipse at 0% 50%, #1A5C43 0%, transparent 70%)' }}
      />

      <div className="max-w-[1300px] mx-auto relative z-10">

        {/* Heading */}
        <div
          className="text-center mb-12 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: '#C8A84B' }} />
            <span
              className="text-[11px] font-bold uppercase tracking-[0.25em]"
              style={{ color: '#C8A84B' }}
            >
              Tourisme africain & mondial
            </span>
            <div className="h-px w-10" style={{ background: '#C8A84B' }} />
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase leading-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Actualités
          </h1>
        </div>

        {/* Grid articles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <MainCard magazine={main} visible={visible} />
          <div className="flex flex-row lg:flex-col gap-4 sm:gap-5">
            {sides.slice(0, 2).map((mag, i) => (
              <SideCard key={mag.id} magazine={mag} delay={i * 100 + 150} visible={visible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsHero;











// // src/components/news/NewsHero.tsx
// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Clock, ArrowRight } from 'lucide-react';
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

// // ─── Skeleton ─────────────────────────────────────────────────────────────────

// function NewsHeroSkeleton() {
//   return (
//     <section className="py-16 md:py-24 px-4 sm:px-6" style={{ background: '#0D2B1A' }}>
//       <div className="max-w-[1300px] mx-auto">
//         <div className="h-8 w-48 rounded-full bg-white/10 animate-pulse mb-4 mx-auto" />
//         <div className="h-12 w-2/3 rounded-lg bg-white/10 animate-pulse mb-12 mx-auto" />
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//           <div className="lg:col-span-2 rounded-2xl bg-white/10 animate-pulse" style={{ height: 460 }} />
//           <div className="flex flex-col gap-5">
//             <div className="rounded-2xl bg-white/10 animate-pulse flex-1" />
//             <div className="rounded-2xl bg-white/10 animate-pulse flex-1" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Carte principale (grande) ────────────────────────────────────────────────

// function MainCard({ magazine, visible }: { magazine: Magazine; visible: boolean }) {
//   return (
//     <Link
//       href={`/magazine/${magazine.slug}`}
//       className="lg:col-span-2 group block relative overflow-hidden rounded-2xl"
//       style={{
//         transition: 'opacity 0.7s, transform 0.7s',
//         opacity: visible ? 1 : 0,
//         transform: visible ? 'translateY(0)' : 'translateY(28px)',
//       }}
//     >
//       {/* Image */}
//       <div className="relative h-[300px] sm:h-[380px] md:h-[460px] w-full overflow-hidden">
//         <Image
//           src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
//           alt={magazine.title}
//           fill
//           className="object-cover transition-transform duration-700 group-hover:scale-105"
//           priority
//         />
//         {/* Overlays */}
//         <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.4) 50%, transparent 100%)' }} />
//         <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,35,20,0.3) 0%, transparent 60%)' }} />
//       </div>

//       {/* Badge "À LA UNE" */}
//       <div className="absolute top-5 left-5 flex items-center gap-2">
//         <span
//           className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-white"
//           style={{ background: '#B85C38' }}
//         >
//           À la une
//         </span>
//         <span
//           className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white/90"
//           style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
//         >
//           {magazine.source}
//         </span>
//       </div>

//       {/* Contenu bas */}
//       <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
//         <p className="text-[#C8A84B] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
//           <Clock size={11} />
//           {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
//         </p>
//         <h2 className="text-white font-black text-xl md:text-2xl lg:text-3xl leading-tight line-clamp-3 mb-4 group-hover:text-[#C8A84B] transition-colors" style={{ letterSpacing: '-0.02em' }}>
//           {magazine.title}
//         </h2>
//         {magazine.excerpt && (
//           <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-5 max-w-xl hidden sm:block">
//             {magazine.excerpt}
//           </p>
//         )}
//         <span className="inline-flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-widest group-hover:text-white group-hover:gap-3 transition-all">
//           Lire l&apos;article <ArrowRight size={13} />
//         </span>
//       </div>
//     </Link>
//   );
// }

// // ─── Carte secondaire ─────────────────────────────────────────────────────────

// function SideCard({ magazine, delay = 0, visible }: { magazine: Magazine; delay?: number; visible: boolean }) {
//   return (
//     <Link
//       href={`/magazine/${magazine.slug}`}
//       className="group flex-1 block relative overflow-hidden rounded-2xl min-h-[180px]"
//       style={{
//         transition: `opacity 0.6s ${delay}ms, transform 0.6s ${delay}ms`,
//         opacity: visible ? 1 : 0,
//         transform: visible ? 'translateX(0)' : 'translateX(24px)',
//       }}
//     >
//       {/* Image */}
//       <div className="absolute inset-0 overflow-hidden">
//         <Image
//           src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
//           alt={magazine.title}
//           fill
//           className="object-cover transition-transform duration-700 group-hover:scale-110"
//         />
//         <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.95) 0%, rgba(10,35,20,0.3) 60%, transparent 100%)' }} />
//       </div>

//       {/* Badge source */}
//       <span
//         className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
//         style={{ background: 'rgba(42,127,95,0.9)' }}
//       >
//         {magazine.source}
//       </span>

//       {/* Contenu bas */}
//       <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
//         <p className="text-[#C8A84B] text-[10px] font-bold uppercase tracking-wider mb-1.5">
//           {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
//         </p>
//         <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#C8A84B] transition-colors">
//           {magazine.title}
//         </h3>
//       </div>
//     </Link>
//   );
// }

// // ─── Composant principal ──────────────────────────────────────────────────────

// const NewsHero = () => {
//   const [magazines, setMagazines] = useState<Magazine[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [visible, setVisible] = useState(false);
//   const sectionRef = useRef<HTMLElement>(null);

//   useEffect(() => {
//     api.get('/magazines/rss', { params: { pageSize: 3, page: 1 } })
//       .then((res) => setMagazines(res.data?.data?.magazines ?? []))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     if (loading) return;
//     const t = setTimeout(() => setVisible(true), 80);
//     return () => clearTimeout(t);
//   }, [loading]);

//   if (loading) return <NewsHeroSkeleton />;

//   if (!magazines.length) {
//     return (
//       <section className="py-16 px-4" style={{ background: '#0D2B1A' }}>
//         <div className="max-w-[1300px] mx-auto text-center">
//           <h1 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tight">
//             Actualités du Tourisme
//           </h1>
//           <p className="text-white/50 mt-4">Aucune actualité disponible pour le moment.</p>
//         </div>
//       </section>
//     );
//   }

//   const displayMags = [...magazines];
//   while (displayMags.length < 3) displayMags.push(magazines[0]);
//   const [main, ...sides] = displayMags;

//   return (
//     <section
//       ref={sectionRef}
//       className="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden"
//       style={{ background: '#0D2B1A' }}
//     >
//       {/* Décorations fond */}
//       <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)', backgroundSize: '28px 28px' }} />
//       <div className="absolute top-0 left-0 w-1/2 h-full opacity-20" style={{ background: 'radial-gradient(ellipse at 0% 50%, #1A5C43 0%, transparent 70%)' }} />

//       <div className="max-w-[1300px] mx-auto relative z-10">

//         {/* Heading */}
//         <div
//           className="text-center mb-12 transition-all duration-700"
//           style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
//         >
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div className="h-px w-10" style={{ background: '#C8A84B' }} />
//             <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: '#C8A84B' }}>
//               Tourisme africain & mondial
//             </span>
//             <div className="h-px w-10" style={{ background: '#C8A84B' }} />
//           </div>
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase leading-tight" style={{ letterSpacing: '-0.02em' }}>
//             Actualités
//           </h1>
//         </div>

//         {/* Grid articles */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
//           <MainCard magazine={main} visible={visible} />
//           <div className="flex flex-row lg:flex-col gap-4 sm:gap-5">
//             {sides.slice(0, 2).map((mag, i) => (
//               <SideCard key={mag.id} magazine={mag} delay={i * 100 + 150} visible={visible} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsHero;














// // src/components/news/NewsHero.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
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

// const NewsHero = () => {
//   const [magazines, setMagazines] = useState<Magazine[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const res = await api.get('/magazines/rss', {
//           params: { pageSize: 3, page: 1 },
//         });
//         setMagazines(res.data?.data?.magazines ?? []);
//       } catch (error) {
//         console.error('Erreur NewsHero magazines:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetch();
//   }, []);

//   if (loading) {
//     return (
//       /* Fond — émeraude foncé */
//       <section className="py-8 sm:py-12 md:py-20 px-4" style={{ background: '#1A5C43' }}>
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8">
//             <div className="h-8 sm:h-12 bg-white/10 rounded animate-pulse mb-4" />
//             <div className="h-4 sm:h-6 bg-white/10 rounded animate-pulse w-3/4 mx-auto" />
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//             <div className="lg:col-span-2 bg-white/10 rounded-3xl h-[300px] sm:h-[400px] md:h-[450px] animate-pulse" />
//             <div className="space-y-4 sm:space-y-6">
//               <div className="bg-white/10 rounded-3xl h-36 sm:h-48 animate-pulse" />
//               <div className="bg-white/10 rounded-3xl h-36 sm:h-48 animate-pulse" />
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (magazines.length === 0) {
//     return (
//       <section className="py-8 sm:py-12 md:py-20 px-4" style={{ background: '#1A5C43' }}>
//         <div className="max-w-7xl mx-auto text-center">
//           <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
//             Actualités du Tourisme
//           </h1>
//           <p className="text-white/70 text-sm sm:text-base">
//             Aucune actualité disponible pour le moment
//           </p>
//         </div>
//       </section>
//     );
//   }

//   const displayMags = [...magazines];
//   while (displayMags.length < 3) displayMags.push(magazines[0]);

//   const main  = displayMags[0];
//   const sides = displayMags.slice(1, 3);

//   return (
//     /* Fond — émeraude foncé */
//     <section className="py-8 sm:py-12 md:py-20 px-4 sm:px-6" style={{ background: '#1A5C43' }}>
//       <div className="max-w-7xl mx-auto">

//         <h1 className="text-center text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-8 sm:mb-12 max-w-4xl mx-auto leading-tight">
//           Actualités — Tourisme Africain et Mondial
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

//           {/* Magazine principal */}
//           <Link href={`/magazine/${main.slug}`} className="lg:col-span-2 group">
//             <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-[1.01] h-full flex flex-col">
//               <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full">
//                 <Image
//                   src={main.coverImage || '/images/magazine-placeholder.jpg'}
//                   alt={main.title}
//                   fill
//                   className="object-cover"
//                   priority
//                 />
//               </div>
//               <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex-1">
//                 {/* Badge "À LA UNE" — terre cuite */}
//                 <span
//                   className="text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full uppercase mb-3 sm:mb-4 inline-block"
//                   style={{ background: '#B85C38' }}
//                 >
//                   À LA UNE
//                 </span>
//                 <h2
//                   className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 line-clamp-3 transition-colors"
//                   style={{ color: '#001A4D' }}
//                   onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
//                   onMouseLeave={e => (e.currentTarget.style.color = '#001A4D')}
//                 >
//                   {main.title}
//                 </h2>
//                 {main.excerpt && (
//                   <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
//                     {main.excerpt}
//                   </p>
//                 )}
//                 <div className="flex items-center text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider gap-2">
//                   {/* Badge source — émeraude */}
//                   <span
//                     className="px-2 py-0.5 rounded-full font-bold text-white"
//                     style={{ background: '#2A7F5F' }}
//                   >
//                     {main.source}
//                   </span>
//                   <span>•</span>
//                   <span>
//                     {new Date(main.publishedAt).toLocaleDateString('fr-FR', {
//                       day: 'numeric', month: 'short', year: 'numeric',
//                     })}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </Link>

//           {/* Magazines latéraux */}
//           <div className="flex flex-col gap-4 sm:gap-6">
//             {sides.map((mag) => (
//               <Link key={mag.id} href={`/magazine/${mag.slug}`} className="group flex-1">
//                 <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-[1.01] h-full flex flex-col">
//                   <div className="relative h-40 sm:h-44 md:h-48 w-full">
//                     <Image
//                       src={mag.coverImage || '/images/magazine-placeholder.jpg'}
//                       alt={mag.title}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="p-4 sm:p-6">
//                     {/* Badge source — émeraude */}
//                     <span
//                       className="text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-md uppercase mb-2 sm:mb-3 inline-block"
//                       style={{ background: '#2A7F5F' }}
//                     >
//                       {mag.source}
//                     </span>
//                     <h3
//                       className="text-base sm:text-lg font-bold mb-2 sm:mb-3 leading-snug line-clamp-2 transition-colors"
//                       style={{ color: '#001A4D' }}
//                       onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
//                       onMouseLeave={e => (e.currentTarget.style.color = '#001A4D')}
//                     >
//                       {mag.title}
//                     </h3>
//                     <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">
//                       {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
//                         day: 'numeric', month: 'short',
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsHero;


















// // src/components/news/NewsHero.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
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

// const NewsHero = () => {
//   const [magazines, setMagazines] = useState<Magazine[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const res = await api.get('/magazines/rss', {
//           params: { pageSize: 3, page: 1 },
//         });
//         setMagazines(res.data?.data?.magazines ?? []);
//       } catch (error) {
//         console.error('Erreur NewsHero magazines:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetch();
//   }, []);

//   // ── États ──────────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <section className="bg-[#1A3A8A] py-8 sm:py-12 md:py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8">
//             <div className="h-8 sm:h-12 bg-gray-600 rounded animate-pulse mb-4" />
//             <div className="h-4 sm:h-6 bg-gray-600 rounded animate-pulse w-3/4 mx-auto" />
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//             <div className="lg:col-span-2 bg-gray-700 rounded-3xl h-[300px] sm:h-[400px] md:h-[450px] animate-pulse" />
//             <div className="space-y-4 sm:space-y-6">
//               <div className="bg-gray-700 rounded-3xl h-36 sm:h-48 animate-pulse" />
//               <div className="bg-gray-700 rounded-3xl h-36 sm:h-48 animate-pulse" />
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (magazines.length === 0) {
//     return (
//       <section className="bg-[#1A3A8A] py-8 sm:py-12 md:py-20 px-4">
//         <div className="max-w-7xl mx-auto text-center">
//           <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
//             Actualités du Tourisme
//           </h1>
//           <p className="text-gray-300 text-sm sm:text-base">
//             Aucune actualité disponible pour le moment
//           </p>
//         </div>
//       </section>
//     );
//   }

//   const displayMags = [...magazines];
//   while (displayMags.length < 3) displayMags.push(magazines[0]);

//   const main = displayMags[0];
//   const sides = displayMags.slice(1, 3);

//   return (
//     <section className="bg-[#1A3A8A] py-8 sm:py-12 md:py-20 px-4 sm:px-6">
//       <div className="max-w-7xl mx-auto">

//         <h1 className="text-center text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-8 sm:mb-12 max-w-4xl mx-auto leading-tight">
//           Actualités — Tourisme Africain et Mondial
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

//           {/* ── Magazine principal ──────────────────────────────────────── */}
//           <Link href={`/magazine/${main.slug}`} className="lg:col-span-2 group">
//             <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-[1.01] h-full flex flex-col">
//               <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full">
//                 <Image
//                   src={main.coverImage || '/images/magazine-placeholder.jpg'}
//                   alt={main.title}
//                   fill
//                   className="object-cover"
//                   priority
//                 />
//               </div>
//               <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex-1">
//                 <span className="bg-[#F19300] text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full uppercase mb-3 sm:mb-4 inline-block">
//                   À LA UNE
//                 </span>
//                 <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#001A4D] mb-3 sm:mb-4 group-hover:text-[#F19300] transition-colors line-clamp-3">
//                   {main.title}
//                 </h2>
//                 {main.excerpt && (
//                   <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
//                     {main.excerpt}
//                   </p>
//                 )}
//                 <div className="flex items-center text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider gap-2">
//                   <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
//                     {main.source}
//                   </span>
//                   <span>•</span>
//                   <span>
//                     {new Date(main.publishedAt).toLocaleDateString('fr-FR', {
//                       day: 'numeric', month: 'short', year: 'numeric',
//                     })}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </Link>

//           {/* ── Magazines latéraux ──────────────────────────────────────── */}
//           <div className="flex flex-col gap-4 sm:gap-6">
//             {sides.map((mag) => (
//               <Link key={mag.id} href={`/magazine/${mag.slug}`} className="group flex-1">
//                 <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-[1.01] h-full flex flex-col">
//                   {/* Portrait cover */}
//                   <div className="relative h-40 sm:h-44 md:h-48 w-full">
//                     <Image
//                       src={mag.coverImage || '/images/magazine-placeholder.jpg'}
//                       alt={mag.title}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="p-4 sm:p-6">
//                     <span className="bg-blue-700 text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-md uppercase mb-2 sm:mb-3 inline-block">
//                       {mag.source}
//                     </span>
//                     <h3 className="text-base sm:text-lg font-bold text-[#001A4D] mb-2 sm:mb-3 leading-snug group-hover:text-[#F19300] transition-colors line-clamp-2">
//                       {mag.title}
//                     </h3>
//                     <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">
//                       {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
//                         day: 'numeric', month: 'short',
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsHero;























// // src/components/news/NewsHero.tsx
// 'use client';
 
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
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
//   views: number;
// }
 
// const NewsHero = () => {
//   const [articles, setArticles] = useState<NewsArticle[]>([]);
//   const [loading, setLoading] = useState(true);
 
//   useEffect(() => {
//     const fetchHeroArticles = async () => {
//       try {
//         // 1ère tentative : articles featured de type ARTICLE
//         const response = await api.get('/mag/articles', {
//           params: {
//             type: 'ARTICLE',   // ✅ uniquement les articles
//             featured: true,
//             pageSize: 3,
//             page: 1,
//             status: 'PUBLISHED',
//           },
//         });
//         setArticles(response.data.data || []);
//       } catch (error) {
//         console.error('Erreur NewsHero:', error);
//         setArticles([]);
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchHeroArticles();
//   }, []);
 
//   const calculateReadingTime = (excerpt: string): string => {
//     const words   = excerpt?.split(' ').length ?? 0;
//     const minutes = Math.max(1, Math.ceil(words / 200));
//     return `${minutes} min`;
//   };
 
//   // ── États ──────────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <section className="bg-[#1A3A8A] py-8 sm:py-12 md:py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8">
//             <div className="h-8 sm:h-12 bg-gray-600 rounded animate-pulse mb-4"></div>
//             <div className="h-4 sm:h-6 bg-gray-600 rounded animate-pulse w-3/4 mx-auto"></div>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//             <div className="lg:col-span-2 bg-gray-700 rounded-3xl h-[300px] sm:h-[400px] md:h-[450px] animate-pulse"></div>
//             <div className="space-y-4 sm:space-y-6">
//               <div className="bg-gray-700 rounded-3xl h-36 sm:h-48 animate-pulse"></div>
//               <div className="bg-gray-700 rounded-3xl h-36 sm:h-48 animate-pulse"></div>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }
 
//   if (articles.length === 0) {
//     return (
//       <section className="bg-[#1A3A8A] py-8 sm:py-12 md:py-20 px-4">
//         <div className="max-w-7xl mx-auto text-center">
//           <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
//             Actualités du Tourisme
//           </h1>
//           <p className="text-gray-300 text-sm sm:text-base">
//             Aucun article en vedette disponible pour le moment
//           </p>
//         </div>
//       </section>
//     );
//   }
 
//   // Si moins de 3 articles, dupliquer le premier pour remplir l'espace
//   const displayArticles = [...articles];
//   while (displayArticles.length < 3) {
//     displayArticles.push(articles[0]);
//   }
 
//   const mainArticle  = displayArticles[0];
//   const sideArticles = displayArticles.slice(1, 3);
 
//   return (
//     <section className="bg-[#1A3A8A] py-8 sm:py-12 md:py-20 px-4 sm:px-6">
//       <div className="max-w-7xl mx-auto">
 
//         <h1 className="text-center text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-8 sm:mb-12 max-w-4xl mx-auto leading-tight">
//           Actualités du Tourisme : Afrique, Europe et Monde
//         </h1>
 
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
 
//           {/* ── Article principal ─────────────────────────────────────────── */}
//           <Link href={`/actualites/${mainArticle.slug}`} className="lg:col-span-2 group">
//             <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-[1.01] h-full flex flex-col">
//               <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full">
//                 <Image
//                   src={mainArticle.coverImage || '/images/placeholder.jpg'}
//                   alt={mainArticle.title}
//                   fill
//                   className="object-cover"
//                   priority
//                 />
//               </div>
//               <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex-1">
//                 <span className="bg-[#F19300] text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full uppercase mb-3 sm:mb-4 inline-block">
//                   À LA UNE
//                 </span>
//                 <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#001A4D] mb-3 sm:mb-4 group-hover:text-[#F19300] transition-colors line-clamp-3">
//                   {mainArticle.title}
//                 </h2>
//                 <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
//                   {mainArticle.excerpt}
//                 </p>
//                 <div className="flex flex-col sm:flex-row sm:items-center text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider gap-2 sm:gap-0">
//                   <span>Par {mainArticle.author?.name || 'Rédaction'}</span>
//                   <span className="hidden sm:inline">•</span>
//                   <span>
//                     {new Date(mainArticle.createdAt).toLocaleDateString('fr-FR', {
//                       day: 'numeric', month: 'short', year: 'numeric',
//                     })}
//                   </span>
//                   <span className="hidden sm:inline">•</span>
//                   <span>{calculateReadingTime(mainArticle.excerpt ?? '')} min</span>
//                 </div>
//               </div>
//             </div>
//           </Link>
 
//           {/* ── Articles latéraux ─────────────────────────────────────────── */}
//           <div className="flex flex-col gap-4 sm:gap-6">
//             {sideArticles.map((article) => (
//               <Link
//                 key={article.id}
//                 href={`/actualites/${article.slug}`}
//                 className="group flex-1"
//               >
//                 <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-[1.01] h-full flex flex-col">
//                   <div className="relative h-40 sm:h-44 md:h-48 w-full">
//                     <Image
//                       src={article.coverImage || '/images/placeholder.jpg'}
//                       alt={article.title}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="p-4 sm:p-6">
//                     <span className="bg-blue-700 text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-md uppercase mb-2 sm:mb-3 inline-block">
//                       {article.category?.name || 'Actualité'}
//                     </span>
//                     <h3 className="text-base sm:text-lg font-bold text-[#001A4D] mb-2 sm:mb-3 leading-snug group-hover:text-[#F19300] transition-colors line-clamp-2">
//                       {article.title}
//                     </h3>
//                     <div className="flex flex-col sm:flex-row sm:items-center text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider gap-2 sm:gap-0">
//                       <span>Par {article.author?.name || 'Rédaction'}</span>
//                       <span className="hidden sm:inline">•</span>
//                       <span>
//                         {new Date(article.createdAt).toLocaleDateString('fr-FR', {
//                           day: 'numeric', month: 'short',
//                         })}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
 
//         </div>
//       </div>
//     </section>
//   );
// };
 
// export default NewsHero;