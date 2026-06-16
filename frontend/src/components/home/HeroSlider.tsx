// src/components/home/HeroSlider.tsx
"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Clock, ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface Magazine {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage: string | null;
  source: string;
  publishedAt: string;
  category?: { id: number; name: string; slug: string };
}

const DELAY = 6000;
const TICK = 50;

// ─── Skeleton loader ─────────────────────────────────────────────────────────

function HeroSkeleton() {
  return (
    <div className="relative w-full h-[100svh] min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden" style={{ background: '#0D3525' }}>
      <div className="absolute inset-0 animate-pulse" style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(26,92,67,0.6) 0%, transparent 70%)' }} />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <Loader2 size={40} className="animate-spin" style={{ color: '#C8A84B' }} />
        <p className="text-white/50 text-sm tracking-widest uppercase animate-pulse">Chargement…</p>
      </div>
    </div>
  );
}

// ─── Composant Slide ─────────────────────────────────────────────────────────

interface SlideProps {
  magazine: Magazine;
  active: boolean;
}

function Slide({ magazine, active }: SlideProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`
        absolute inset-0 transition-all duration-700 ease-in-out
        ${active ? 'opacity-100 z-10' : 'opacity-0 z-0'}
      `}
      aria-hidden={!active}
    >
      {/* Image de fond avec effet Ken Burns quand actif */}
      <div className={`absolute inset-0 transition-transform duration-[8000ms] ease-linear ${active ? 'scale-110' : 'scale-100'}`}>
        <img
          src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
          alt={magazine.title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,35,20,0.88) 0%, rgba(10,35,20,0.5) 55%, rgba(10,35,20,0.15) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.7) 0%, transparent 50%)' }} />

      {/* Contenu slide */}
      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col justify-center pt-20">

        {/* Source badge animé */}
        <div
          className={`
            inline-flex items-center gap-2 mb-6 transition-all duration-500 delay-100
            ${active ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
        >
          <span
            className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-white"
            style={{ background: '#B85C38' }}
          >
            {magazine.source}
          </span>
          {magazine.category && (
            <span
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider text-white/90"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {magazine.category.name}
            </span>
          )}
        </div>

        {/* Titre — reveal animé */}
        <h1
          className={`
            text-white font-black max-w-3xl leading-[1.05] mb-6
            transition-all duration-600 delay-200
            text-4xl md:text-5xl lg:text-6xl xl:text-7xl
            ${active ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}
          `}
          style={{ textShadow: '0 4px 24px rgba(0,0,0,0.4)', letterSpacing: '-0.02em' }}
        >
          {magazine.title}
        </h1>

        {/* Excerpt */}
        {magazine.excerpt && (
          <p
            className={`
              text-white/75 text-lg max-w-2xl mb-10 line-clamp-2 leading-relaxed
              transition-all duration-600 delay-300
              ${active ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}
            `}
          >
            {magazine.excerpt}
          </p>
        )}

        {/* Actions */}
        <div
          className={`
            flex items-center gap-6 transition-all duration-600 delay-[400ms]
            ${active ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}
          `}
        >
          <Link
            href={`/magazine/${magazine.slug}`}
            className="group flex items-center gap-3 font-bold text-sm px-7 py-3.5 rounded-full transition-all shadow-xl hover:shadow-2xl active:scale-95"
            style={{ background: '#ffffff', color: '#1A5C43' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#B85C38'; e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#1A5C43'; }}
          >
            Lire l&apos;actualité
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-2 text-sm text-white/60">
            <Clock size={14} />
            <span>{new Date(magazine.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HeroSlider principal ─────────────────────────────────────────────────────

const HeroSlider = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  // Refs pour les valeurs "vivantes" lues par l'interval sans recréer celui-ci
  const countRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    api.get('/magazines/rss', { params: { pageSize: 5, page: 1 } })
      .then((res) => {
        if (cancelled) return;
        setMagazines(res.data?.data?.magazines ?? []);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Garde-fou : si la liste change de taille, on recadre l'index courant
  useEffect(() => {
    if (magazines.length === 0) return;
    setCurrent((c) => ((c % magazines.length) + magazines.length) % magazines.length);
  }, [magazines.length]);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  // ─── Unique boucle d'autoplay : un seul setInterval, jamais dupliqué ──────
  useEffect(() => {
    if (magazines.length <= 1) return;

    countRef.current = 0;
    setProgress(0);

    const id = setInterval(() => {
      if (pausedRef.current) return;
      countRef.current += TICK;
      const pct = Math.min((countRef.current / DELAY) * 100, 100);
      setProgress(pct);

      if (countRef.current >= DELAY) {
        countRef.current = 0;
        setProgress(0);
        setCurrent((c) => (c + 1) % magazines.length);
      }
    }, TICK);

    return () => clearInterval(id);
  }, [magazines.length]);

  const resetTimer = useCallback(() => {
    countRef.current = 0;
    setProgress(0);
  }, []);

  const goTo = useCallback((idx: number) => {
    if (!magazines.length) return;
    const safeIdx = ((idx % magazines.length) + magazines.length) % magazines.length;
    setCurrent(safeIdx);
    resetTimer();
  }, [magazines.length, resetTimer]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  if (loading) return <HeroSkeleton />;
  if (!magazines.length) return null;

  // Sécurité ultime : ne jamais indexer hors bornes même en cas de timing imprévu
  const safeCurrent = ((current % magazines.length) + magazines.length) % magazines.length;

  return (
    <section
      className="relative w-full h-[100svh] min-h-[600px] max-h-[900px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {magazines.map((mag, i) => (
        <Slide key={mag.id} magazine={mag} active={i === safeCurrent} />
      ))}

      {/* Contrôles navigation */}
      {magazines.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
            aria-label="Slide précédent"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
            aria-label="Slide suivant"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Indicateurs + progress */}
      {magazines.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {magazines.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
              style={{
                width: i === safeCurrent ? 40 : 12,
                background: 'rgba(255,255,255,0.3)',
              }}
            >
              {i === safeCurrent && (
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: '#C8A84B', width: `${progress}%`, transition: 'width 50ms linear' }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Numéro slide en bas à droite */}
      <div className="absolute bottom-8 right-8 z-20 text-white/40 text-xs font-mono tracking-widest hidden md:block">
        {String(safeCurrent + 1).padStart(2, '0')} / {String(magazines.length).padStart(2, '0')}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-6 md:left-12 z-20 flex flex-col items-center gap-2 text-white/40 hidden md:flex">
        <div className="w-px h-12 overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <div className="w-full h-4 rounded-full" style={{ background: '#C8A84B', animation: 'scrollDown 2s ease-in-out infinite' }} />
        </div>
        <span className="text-[9px] tracking-[0.3em] rotate-90 origin-center mt-2">SCROLL</span>
      </div>

      <style jsx global>{`
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
















// // src/components/home/HeroSlider.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
// import { Clock, ArrowRight, Loader2 } from 'lucide-react';
// import Link from 'next/link';
// import api from '@/lib/api';

// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';

// interface Magazine {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt?: string | null;
//   coverImage: string | null;
//   source: string;
//   publishedAt: string;
//   category?: {
//     id: number;
//     name: string;
//     slug: string;
//   };
// }

// const HeroSlider = () => {
//   const [magazines, setMagazines] = useState<Magazine[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMagazines = async () => {
//       try {
//         const res = await api.get('/magazines/rss', {
//           params: { pageSize: 5, page: 1 },
//         });
//         setMagazines(res.data?.data?.magazines ?? []);
//       } catch (error) {
//         console.error('Erreur HeroSlider magazines:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMagazines();
//   }, []);

//   if (loading) {
//     return (
//       <div
//         className="h-[550px] w-full flex flex-col items-center justify-center text-white gap-4"
//         style={{ background: '#1A5C43' }}
//       >
//         <Loader2 size={40} className="animate-spin" style={{ color: '#C8A84B' }} />
//         <p className="animate-pulse">Chargement des magazines...</p>
//       </div>
//     );
//   }

//   if (magazines.length === 0) {
//     return (
//       <div
//         className="h-[550px] w-full flex items-center justify-center text-white"
//         style={{ background: '#1A5C43' }}
//       >
//         <p>Aucun magazine disponible pour le moment</p>
//       </div>
//     );
//   }

//   return (
//     <section className="relative w-full h-[550px]" style={{ background: '#1A5C43' }}>
//       <Swiper
//         modules={[Pagination, Autoplay, EffectFade]}
//         effect="fade"
//         pagination={{
//           clickable: true,
//           bulletClass: 'hero-bullet',
//           bulletActiveClass: 'hero-bullet-active',
//         }}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         className="h-full"
//       >
//         {magazines.map((magazine) => (
//           <SwiperSlide key={magazine.id}>
//             <div className="relative w-full h-full">
//               <img
//                 src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
//                 className="absolute inset-0 w-full h-full object-cover"
//                 alt={magazine.title}
//               />
//               {/* Gradient émeraude foncé au lieu du bleu */}
//               <div
//                 className="absolute inset-0"
//                 style={{
//                   background: 'linear-gradient(to right, rgba(26,92,67,0.92) 0%, rgba(26,92,67,0.45) 55%, transparent 100%)'
//                 }}
//               />

//               <div className="relative z-10 h-full max-w-[1400px] mx-auto px-8 flex flex-col justify-center items-start">
//                 {/* Badge source — terre cuite */}
//                 <span
//                   className="px-4 py-1 rounded-sm text-xs font-bold uppercase mb-4 text-white"
//                   style={{ background: '#B85C38' }}
//                 >
//                   {magazine.source}
//                 </span>

//                 <h1 className="text-white text-4xl md:text-6xl font-black max-w-3xl leading-tight mb-6 drop-shadow-lg">
//                   {magazine.title}
//                 </h1>

//                 {magazine.excerpt && (
//                   <p className="text-gray-200 text-lg max-w-2xl mb-8 line-clamp-2">
//                     {magazine.excerpt}
//                   </p>
//                 )}

//                 <div className="flex items-center gap-6">
//                   {/* Bouton CTA — blanc → terre cuite au hover */}
//                   <Link
//                     href={`/magazine/${magazine.slug}`}
//                     className="group flex items-center gap-2 px-8 py-3 rounded-md font-bold transition-all text-sm"
//                     style={{ background: '#ffffff', color: '#1A5C43' }}
//                     onMouseEnter={e => {
//                       e.currentTarget.style.background = '#B85C38';
//                       e.currentTarget.style.color = '#ffffff';
//                     }}
//                     onMouseLeave={e => {
//                       e.currentTarget.style.background = '#ffffff';
//                       e.currentTarget.style.color = '#1A5C43';
//                     }}
//                   >
//                     Lire l'actualité
//                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//                   </Link>

//                   <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
//                     <Clock size={16} />
//                     <span>
//                       Publié le{' '}
//                       {new Date(magazine.publishedAt).toLocaleDateString('fr-FR')}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       <style jsx global>{`
//         .swiper-pagination {
//           bottom: 30px !important;
//           display: flex;
//           justify-content: center;
//           gap: 12px;
//         }
//         .hero-bullet {
//           width: 12px;
//           height: 12px;
//           background: rgba(255, 255, 255, 0.4);
//           border-radius: 50%;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }
//         .hero-bullet-active {
//           background: #C8A84B !important;
//           width: 35px;
//           border-radius: 10px;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default HeroSlider;





















// // src/components/home/HeroSlider.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
// import { Clock, ArrowRight, Loader2 } from 'lucide-react';
// import Link from 'next/link';
// import api from '@/lib/api';

// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';

// interface Magazine {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt?: string | null;
//   coverImage: string | null;
//   source: string;
//   publishedAt: string;
//   category?: {
//     id: number;
//     name: string;
//     slug: string;
//   };
// }

// const HeroSlider = () => {
//   const [magazines, setMagazines] = useState<Magazine[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMagazines = async () => {
//       try {
//         const res = await api.get('/magazines/rss', {
//           params: {
//             pageSize: 5,
//             page: 1,
//           },
//         });
//         setMagazines(res.data?.data?.magazines ?? []);
//       } catch (error) {
//         console.error('Erreur HeroSlider magazines:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMagazines();
//   }, []);

//   if (loading) {
//     return (
//       <div className="h-[550px] w-full bg-it-blue flex flex-col items-center justify-center text-white gap-4">
//         <Loader2 className="animate-spin text-it-orange" size={40} />
//         <p className="animate-pulse">Chargement des magazines...</p>
//       </div>
//     );
//   }

//   if (magazines.length === 0) {
//     return (
//       <div className="h-[550px] w-full bg-it-blue flex items-center justify-center text-white">
//         <p>Aucun magazine disponible pour le moment</p>
//       </div>
//     );
//   }

//   return (
//     <section className="relative w-full h-[550px] bg-it-blue">
//       <Swiper
//         modules={[Pagination, Autoplay, EffectFade]}
//         effect="fade"
//         pagination={{
//           clickable: true,
//           bulletClass: 'hero-bullet',
//           bulletActiveClass: 'hero-bullet-active',
//         }}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         className="h-full"
//       >
//         {magazines.map((magazine) => (
//           <SwiperSlide key={magazine.id}>
//             <div className="relative w-full h-full">
//               <img
//                 src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
//                 className="absolute inset-0 w-full h-full object-cover"
//                 alt={magazine.title}
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-it-blue/90 via-it-blue/40 to-transparent" />

//               <div className="relative z-10 h-full max-w-[1400px] mx-auto px-8 flex flex-col justify-center items-start">
//                 <span className="bg-it-orange text-it-blue px-4 py-1 rounded-sm text-xs font-bold uppercase mb-4">
//                   {magazine.source}
//                 </span>

//                 <h1 className="text-white text-4xl md:text-6xl font-black max-w-3xl leading-tight mb-6 drop-shadow-lg">
//                   {magazine.title}
//                 </h1>

//                 {magazine.excerpt && (
//                   <p className="text-gray-200 text-lg max-w-2xl mb-8 line-clamp-2">
//                     {magazine.excerpt}
//                   </p>
//                 )}

//                 <div className="flex items-center gap-6">
//                   <Link
//                     href={`/magazine/${magazine.slug}`}
//                     className="bg-white text-it-blue hover:bg-it-orange hover:text-white px-8 py-3 rounded-md font-bold transition-all flex items-center gap-2 group"
//                   >
//                     Lire l'actualité
//                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//                   </Link>
//                   <div className="flex items-center gap-2 text-white/80 text-sm">
//                     <Clock size={16} />
//                     <span>
//                       Publié le{' '}
//                       {new Date(magazine.publishedAt).toLocaleDateString('fr-FR')}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       <style jsx global>{`
//         .swiper-pagination {
//           bottom: 30px !important;
//           display: flex;
//           justify-content: center;
//           gap: 12px;
//         }
//         .hero-bullet {
//           width: 12px;
//           height: 12px;
//           background: rgba(255, 255, 255, 0.4);
//           border-radius: 50%;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }
//         .hero-bullet-active {
//           background: #FF9900 !important;
//           width: 35px;
//           border-radius: 10px;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default HeroSlider;



















// // src/components/home/HeroSlider.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
// import { Clock, ArrowRight, Loader2 } from 'lucide-react';
// import Link from 'next/link';
// import api from '@/lib/api';

// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';

// interface Article {
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
// }

// const HeroSlider = () => {
//   const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFeatured = async () => {
//       try {
//         // ✅ Endpoint correct : Articles featured (mis en avant)
//         const res = await api.get('/mag/articles', {
//           params: {
//             featured: true,
//             pageSize: 3,
//             status: 'PUBLISHED'
//           }
//         });
        
//         setFeaturedArticles(res.data.data);
//       } catch (error) {
//         console.error("Erreur Hero:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFeatured();
//   }, []);

//   if (loading) {
//     return (
//       <div className="h-[550px] w-full bg-it-blue flex flex-col items-center justify-center text-white gap-4">
//         <Loader2 className="animate-spin text-it-orange" size={40} />
//         <p className="animate-pulse">Chargement de l&apos;actualité...</p>
//       </div>
//     );
//   }

//   if (featuredArticles.length === 0) {
//     return (
//       <div className="h-[550px] w-full bg-it-blue flex items-center justify-center text-white">
//         <p>Aucun article à la une pour le moment</p>
//       </div>
//     );
//   }

//   return (
//     <section className="relative w-full h-[550px] bg-it-blue">
//       <Swiper
//         modules={[Pagination, Autoplay, EffectFade]}
//         effect="fade"
//         pagination={{ 
//           clickable: true, 
//           bulletClass: 'hero-bullet', 
//           bulletActiveClass: 'hero-bullet-active' 
//         }}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         className="h-full"
//       >
//         {featuredArticles.map((article) => (
//           <SwiperSlide key={article.id}>
//             <div className="relative w-full h-full">
//               <img 
//                 src={article.coverImage} 
//                 className="absolute inset-0 w-full h-full object-cover"
//                 alt={article.title}
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-it-blue/90 via-it-blue/40 to-transparent"></div>

//               <div className="relative z-10 h-full max-w-[1400px] mx-auto px-8 flex flex-col justify-center items-start">
//                 <span className="bg-it-orange text-it-blue px-4 py-1 rounded-sm text-xs font-bold uppercase mb-4">
//                   À la une : {article.category.name}
//                 </span>
                
//                 <h1 className="text-white text-4xl md:text-6xl font-black max-w-3xl leading-tight mb-6 drop-shadow-lg">
//                   {article.title}
//                 </h1>

//                 <p className="text-gray-200 text-lg max-w-2xl mb-8 line-clamp-2">
//                   {article.excerpt}
//                 </p>

//                 <div className="flex items-center gap-6">
//                   <Link 
//                     href={`/actualites/${article.slug}`}
//                     className="bg-white text-it-blue hover:bg-it-orange hover:text-white px-8 py-3 rounded-md font-bold transition-all flex items-center gap-2 group"
//                   >
//                     Lire l&apos;article 
//                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//                   </Link>
//                   <div className="flex items-center gap-2 text-white/80 text-sm">
//                     <Clock size={16} />
//                     <span>Publié le {new Date(article.createdAt).toLocaleDateString('fr-FR')}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       <style jsx global>{`
//         .swiper-pagination {
//           bottom: 30px !important;
//           display: flex;
//           justify-content: center;
//           gap: 12px;
//         }
//         .hero-bullet {
//           width: 12px;
//           height: 12px;
//           background: rgba(255, 255, 255, 0.4);
//           border-radius: 50%;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }
//         .hero-bullet-active {
//           background: #FF9900 !important;
//           width: 35px;
//           border-radius: 10px;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default HeroSlider;