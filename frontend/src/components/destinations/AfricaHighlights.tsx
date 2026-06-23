// src/components/destinations/AfricaHighlights.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Heart } from 'lucide-react';
import type { Highlight } from '@/lib/server-data';

interface AfricaHighlightsProps {
  /** Highlights pré-fetchés côté serveur — plus aucun fetch client ici. */
  highlights: Highlight[];
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

// ─── Carte highlight ──────────────────────────────────────────────────────────

function HighlightCard({ item, delay = 0 }: { item: Highlight; delay?: number }) {
  const { ref, visible } = useReveal(0.06);

  return (
    <div
      ref={ref as React.RefCallback<HTMLDivElement>}
      className="group transition-all duration-700"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
      }}
    >
      <Link
        href={`/actualites/${item.slug}`}
        className="block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
        style={{ background: '#F8FAF9' }}
      >
        {/* Image */}
        <div className="relative h-52 sm:h-60 overflow-hidden">
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(13,43,26,0.5) 0%, transparent 60%)' }}
          />
          {item.category && (
            <span
              className="absolute top-3 left-3 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm"
              style={{ background: 'rgba(184,92,56,0.88)' }}
            >
              {item.category.name}
            </span>
          )}
        </div>

        {/* Contenu */}
        <div className="p-6 sm:p-7 space-y-3">
          <h3
            className="font-bold text-base sm:text-lg leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-[#1A5C43]"
            style={{ color: '#0D1A10', letterSpacing: '-0.01em' }}
          >
            {item.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
            {item.excerpt}
          </p>
          <div className="pt-2 border-t border-gray-100">
            <span
              className="inline-flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider transition-colors group-hover:gap-3"
              style={{ color: '#B85C38' }}
            >
              Lire le dossier
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const AfricaHighlights = ({ highlights }: AfricaHighlightsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref: sectionRef, visible: sectionVisible } = useReveal(0.08);

  if (!highlights.length) return null;

  const handlePrevious = () => setCurrentIndex((p) => Math.max(0, p - 3));
  const handleNext     = () => setCurrentIndex((p) => Math.min(highlights.length - 3, p + 3));
  const canGoPrevious  = currentIndex > 0;
  const canGoNext      = currentIndex + 3 < highlights.length;
  const visibleItems   = highlights.slice(currentIndex, currentIndex + 3);

  return (
    <section className="py-16 sm:py-20 px-5 sm:px-6 bg-white">
      <div
        ref={sectionRef as React.RefCallback<HTMLDivElement>}
        className="max-w-7xl mx-auto"
      >
        {/* ── Heading ── */}
        <div
          className="flex items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-gray-100 mb-8 sm:mb-10 transition-all duration-700"
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'none' : 'translateY(20px)',
          }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: '#B85C38' }}
            >
              <Heart size={15} fill="white" className="text-white" />
            </div>
            <div>
              <p
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5"
                style={{ color: '#B85C38' }}
              >
                — Sélection éditoriale
              </p>
              <h2
                className="text-xl sm:text-2xl font-bold leading-tight"
                style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}
              >
                Coups de cœur <span style={{ color: '#1A5C43' }}>Afrique</span>
              </h2>
            </div>
          </div>

          {/* Contrôles navigation */}
          {highlights.length > 3 && (
            <div
              className="flex gap-2 shrink-0 transition-all duration-700"
              style={{ transitionDelay: '150ms', opacity: sectionVisible ? 1 : 0 }}
            >
              <button
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: canGoPrevious ? '#1A5C43' : 'white',
                  color: canGoPrevious ? 'white' : '#9CA3AF',
                  borderColor: canGoPrevious ? '#1A5C43' : '#E5E7EB',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: canGoNext ? '#1A5C43' : 'white',
                  color: canGoNext ? 'white' : '#9CA3AF',
                  borderColor: canGoNext ? '#1A5C43' : '#E5E7EB',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ── Grille — données SSR, pas de spinner ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {visibleItems.map((item, i) => (
            <HighlightCard key={item.id} item={item} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AfricaHighlights;











// // src/components/destinations/AfricaHighlights.tsx
// "use client";

// import React, { useState, useEffect, useCallback } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ChevronLeft, ChevronRight, ArrowRight, Heart } from 'lucide-react';
// import { AxiosError } from 'axios';
// import api from '@/lib/api';

// interface Highlight {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   category?: { name: string };
// }

// // ─── Hook reveal ──────────────────────────────────────────────────────────────

// function useReveal(threshold = 0.08) {
//   const [el, setEl] = useState<HTMLElement | null>(null);
//   const [visible, setVisible] = useState(false);
//   const ref = useCallback((node: HTMLElement | null) => setEl(node), []);

//   useEffect(() => {
//     if (!el) return;
//     const rect = el.getBoundingClientRect();
//     if (rect.top < window.innerHeight && rect.bottom > 0) { setVisible(true); return; }
//     const obs = new IntersectionObserver(
//       ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
//       { threshold }
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [el, threshold]);

//   return { ref, visible };
// }

// // ─── Carte highlight ──────────────────────────────────────────────────────────

// function HighlightCard({ item, delay = 0 }: { item: Highlight; delay?: number }) {
//   const { ref, visible } = useReveal(0.06);

//   return (
//     <div
//       ref={ref as React.RefCallback<HTMLDivElement>}
//       className="group transition-all duration-700"
//       style={{
//         transitionDelay: `${delay}ms`,
//         opacity: visible ? 1 : 0,
//         transform: visible ? 'translateY(0)' : 'translateY(28px)',
//       }}
//     >
//       <div
//         className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
//         style={{ background: '#F8FAF9' }}
//       >
//         {/* Image */}
//         <div className="relative h-52 sm:h-60 overflow-hidden">
//           <Image
//             src={item.coverImage}
//             alt={item.title}
//             fill
//             className="object-cover transition-transform duration-700 group-hover:scale-105"
//           />
//           <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,43,26,0.5) 0%, transparent 60%)' }} />
//           {item.category && (
//             <span
//               className="absolute top-3 left-3 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm"
//               style={{ background: 'rgba(184,92,56,0.88)' }}
//             >
//               {item.category.name}
//             </span>
//           )}
//         </div>

//         {/* Contenu */}
//         <div className="p-6 sm:p-7 space-y-3">
//           <h3
//             className="font-serif font-bold text-base sm:text-lg leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-[#1A5C43]"
//             style={{ color: '#0D1A10' }}
//           >
//             {item.title}
//           </h3>
//           <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
//             {item.excerpt}
//           </p>
//           <div className="pt-2 border-t border-gray-100">
//             <Link
//               href={`/actualites/${item.slug}`}
//               className="inline-flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider transition-colors group/link"
//               style={{ color: '#B85C38' }}
//             >
//               Lire le dossier
//               <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Composant principal ──────────────────────────────────────────────────────

// const AfricaHighlights = () => {
//   const [highlights, setHighlights] = useState<Highlight[]>([]);
//   const [loading, setLoading]       = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const { ref: sectionRef, visible: sectionVisible } = useReveal(0.08);

//   useEffect(() => {
//     const fetchHighlights = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get('/destinations/featured', {
//           params: { limit: 6, region: 'AFRIQUE' },
//         });
//         setHighlights(response.data.data || response.data);
//       } catch (error) {
//         if (error instanceof AxiosError) console.error('Erreur highlights:', error.message);
//         setHighlights([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHighlights();
//   }, []);

//   const handlePrevious = () => setCurrentIndex((p) => Math.max(0, p - 3));
//   const handleNext     = () => setCurrentIndex((p) => Math.min(highlights.length - 3, p + 3));
//   const canGoPrevious  = currentIndex > 0;
//   const canGoNext      = currentIndex + 3 < highlights.length;
//   const visibleHighlights = highlights.slice(currentIndex, currentIndex + 3);

//   if (loading) {
//     return (
//       <section className="py-16 sm:py-20 px-5 sm:px-6 bg-white">
//         <div className="max-w-7xl mx-auto">
//           {/* Skeleton heading */}
//           <div className="flex items-center gap-4 pb-6 border-b border-gray-100 mb-10">
//             <div className="w-11 h-11 rounded-xl bg-gray-200 animate-pulse shrink-0" />
//             <div className="space-y-2">
//               <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
//               <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse">
//                 <div className="h-56 bg-gray-200" />
//                 <div className="p-7 space-y-3">
//                   <div className="h-5 bg-gray-200 rounded w-3/4" />
//                   <div className="h-4 bg-gray-200 rounded w-full" />
//                   <div className="h-4 bg-gray-200 rounded w-2/3" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (highlights.length === 0) return null;

//   return (
//     <section className="py-16 sm:py-20 px-5 sm:px-6 bg-white">
//       <div
//         ref={sectionRef as React.RefCallback<HTMLDivElement>}
//         className="max-w-7xl mx-auto"
//       >
//         {/* ── Heading ── */}
//         <div
//           className="flex items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-gray-100 mb-8 sm:mb-10 transition-all duration-700"
//           style={{ opacity: sectionVisible ? 1 : 0, transform: sectionVisible ? 'none' : 'translateY(20px)' }}
//         >
//           <div className="flex items-center gap-3 sm:gap-4">
//             <div
//               className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
//               style={{ background: '#B85C38' }}
//             >
//               <Heart size={15} fill="white" className="text-white" />
//             </div>
//             <div>
//               <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: '#B85C38' }}>
//                 — Sélection éditoriale
//               </p>
//               <h2 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}>
//                 Coups de cœur <span style={{ color: '#1A5C43' }}>Afrique</span>
//               </h2>
//             </div>
//           </div>

//           {/* Contrôles navigation */}
//           {highlights.length > 3 && (
//             <div
//               className="flex gap-2 transition-all duration-700 shrink-0"
//               style={{ transitionDelay: '150ms', opacity: sectionVisible ? 1 : 0 }}
//             >
//               <button
//                 onClick={handlePrevious}
//                 disabled={!canGoPrevious}
//                 className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
//                 style={{ background: canGoPrevious ? '#1A5C43' : 'white', color: canGoPrevious ? 'white' : '#9CA3AF' }}
//               >
//                 <ChevronLeft size={16} />
//               </button>
//               <button
//                 onClick={handleNext}
//                 disabled={!canGoNext}
//                 className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
//                 style={{ background: canGoNext ? '#1A5C43' : 'white', color: canGoNext ? 'white' : '#9CA3AF' }}
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* ── Grille ── */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
//           {visibleHighlights.map((item, i) => (
//             <HighlightCard key={item.id} item={item} delay={i * 100} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AfricaHighlights;















// // src/components/destinations/AfricaHighlights.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ChevronLeft, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
// import { AxiosError } from 'axios';
// import api from '@/lib/api';

// interface Highlight {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   category?: {
//     name: string;
//   };
// }

// const AfricaHighlights = () => {
//   const [highlights, setHighlights] = useState<Highlight[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const fetchHighlights = async () => {
//       try {
//         setLoading(true);
        
//         // ✅ Endpoint : Destinations coup de cœur Afrique
//         const response = await api.get('/destinations/featured', {
//           params: {
//             limit: 6,
//             region: 'AFRIQUE'
//             // OU utiliser /mag/articles avec categorySlug: 'destinations-afrique'
//           }
//         });
        
//         setHighlights(response.data.data || response.data);
//       } catch (error) {
//         if (error instanceof AxiosError) {
//           console.error("Erreur lors du chargement des coups de cœur:", error.message);
//         }
//         // En cas d'erreur, afficher quand même quelque chose
//         setHighlights([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHighlights();
//   }, []);

//   const handlePrevious = () => {
//     setCurrentIndex((prev) => Math.max(0, prev - 3));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => Math.min(highlights.length - 3, prev + 3));
//   };

//   const visibleHighlights = highlights.slice(currentIndex, currentIndex + 3);
//   const canGoPrevious = currentIndex > 0;
//   const canGoNext = currentIndex + 3 < highlights.length;

//   if (loading) {
//     return (
//       <section className="py-20 px-6 bg-white">
//         <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
//           <Loader2 className="animate-spin text-[#F19300]" size={40} />
//         </div>
//       </section>
//     );
//   }

//   if (highlights.length === 0) {
//     return null; // Ne rien afficher si pas de résultats
//   }

//   return (
//     <section className="py-20 px-6 bg-white">
//       <div className="max-w-7xl mx-auto">
        
//         {/* HEADER DE SECTION AVEC PAGINATION */}
//         <div className="flex justify-between items-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2D3E50] uppercase tracking-[0.15em]">
//             Nos coups de cœur Afrique
//           </h2>
          
//           {highlights.length > 3 && (
//             <div className="flex gap-3">
//               <button 
//                 onClick={handlePrevious}
//                 disabled={!canGoPrevious}
//                 className="p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-[#1D3A8A] hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
//               >
//                 <ChevronLeft size={24} />
//               </button>
//               <button 
//                 onClick={handleNext}
//                 disabled={!canGoNext}
//                 className="p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-[#1D3A8A] hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
//               >
//                 <ChevronRight size={24} />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* GRILLE DES DOSSIERS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {visibleHighlights.map((item) => (
//             <div 
//               key={item.id} 
//               className="bg-[#F9F9F7] rounded-2xl overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] group transition-all duration-300 hover:shadow-2xl"
//             >
//               {/* Image avec Tag */}
//               <div className="relative h-64 w-full">
//                 <Image
//                   src={item.coverImage}
//                   alt={item.title}
//                   fill
//                   className="object-cover transition-transform duration-500 group-hover:scale-105"
//                 />
//                 {item.category && (
//                   <div className="absolute top-4 left-4 bg-[#F19300] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
//                     {item.category.name}
//                   </div>
//                 )}
//               </div>

//               {/* Contenu */}
//               <div className="p-8 space-y-4">
//                 <h3 className="text-xl font-serif font-bold text-[#2D3E50] leading-snug group-hover:text-[#1D3A8A] transition-colors line-clamp-2">
//                   {item.title}
//                 </h3>
//                 <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-3">
//                   {item.excerpt}
//                 </p>
                
//                 <Link 
//                   href={`/actualites/${item.slug}`}
//                   className="inline-flex items-center gap-2 text-[#F19300] font-bold text-xs uppercase tracking-widest pt-2 group/link"
//                 >
//                   Lire le dossier
//                   <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default AfricaHighlights;