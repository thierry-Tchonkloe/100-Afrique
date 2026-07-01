// src/components/home/EventsDestinationsSection.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { AgendaMark, RoutePlanet, LocaleMark } from '@/components/icons/CustomIcons';
import type { Salon, DestinationArticle } from '@/lib/server-data';

function useReveal(threshold = 0.1) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  const ref = useCallback((node: HTMLDivElement | null) => {
    setEl(node);
  }, []);

  useEffect(() => {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);

  return { ref, visible };
}

function DateRange({ startDate, endDate }: { startDate: string; endDate?: string }) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  if (!end || start.toDateString() === end.toDateString()) return <span>{fmt(start)}</span>;
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear())
    return <span>{start.getDate()} – {fmt(end)}</span>;
  return <span>{fmt(start)} – {fmt(end)}</span>;
}

function SalonCard({ salon, delay = 0 }: { salon: Salon; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-600"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)' }}
    >
      <Link
        href={`/evenements/${salon.slug}`}
        className="group flex gap-4 p-4 rounded-2xl border border-transparent hover:border-[#1A5C43]/15 hover:bg-[#F0FAF5] transition-all duration-200"
      >
        <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl text-white" style={{ background: '#1A5C43' }}>
          {salon.startDate && (
            <>
              <span className="text-lg font-black leading-none">
                {new Date(salon.startDate).getDate()}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                {new Date(salon.startDate).toLocaleDateString('fr-FR', { month: 'short' })}
              </span>
            </>
          )}
          {!salon.startDate && <AgendaMark size={40} />}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[14px] leading-snug text-gray-900 line-clamp-2 group-hover:text-[#1A5C43] transition-colors">
            {salon.title}
          </h4>

          <div className="flex flex-wrap gap-3 mt-2">
            {salon.startDate && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                <Clock size={11} className="text-[#C8A84B]" />
                <DateRange startDate={salon.startDate} endDate={salon.endDate} />
              </span>
            )}
            {(salon.city || salon.country) && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                <LocaleMark size={11} className="text-[#B85C38]" />
                {[salon.city, salon.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>

          {salon.excerpt && (
            <p className="text-[12px] text-gray-400 mt-1.5 line-clamp-1">{salon.excerpt}</p>
          )}
        </div>

        <ArrowRight
          size={16}
          className="shrink-0 self-center text-gray-300 group-hover:text-[#1A5C43] group-hover:translate-x-1 transition-all"
        />
      </Link>
    </div>
  );
}

function DestinationCard({ dest, index = 0 }: { dest: DestinationArticle; index?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{ transitionDelay: `${index * 100}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
    >
      <Link
        href={`/articles/${dest.slug}`}
        className="group relative block overflow-hidden rounded-2xl"
        style={{ aspectRatio: index === 0 ? '16/7' : '16/6' }}
      >
        <img
          src={dest.coverImage}
          alt={dest.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,35,20,0.8) 0%, rgba(10,35,20,0.2) 60%, transparent 100%)' }} />

        <div
          className="absolute top-1/2 -translate-y-1/2 right-5 w-9 h-9 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2"
          style={{ background: '#B85C38' }}
        >
          <ArrowRight size={16} />
        </div>

        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-1">Destination</p>
          <h3 className="text-white font-black text-lg group-hover:text-[#C8A84B] transition-colors">{dest.title}</h3>
        </div>
      </Link>
    </div>
  );
}

interface EventsDestinationsSectionProps {
  salons: Salon[];
  destinations: DestinationArticle[];
}

const EventsDestinationsSection = ({ salons, destinations }: EventsDestinationsSectionProps) => {
  const { ref: headingRef, visible: headingVisible } = useReveal(0.2);

  return (
    <section className="py-12 md:py-18 bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-6">

        <div
          ref={headingRef}
          className="text-center mb-14 transition-all duration-700"
          style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? 'none' : 'translateY(20px)' }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: '#C8A84B' }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: '#B85C38' }}>
              Agenda & Voyages
            </span>
            <div className="h-px w-10" style={{ background: '#C8A84B' }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold leading-none" style={{ color: '#0D1A10', letterSpacing: '-0.03em' }}>
            Événements & <span style={{ color: '#1A5C43' }}>Destinations</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: '#1A5C43' }}>
                  <AgendaMark size={26} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Salons & Événements</h3>
              </div>
              <Link href="/evenements" className="text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: '#B85C38' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1A5C43')}
                onMouseLeave={e => (e.currentTarget.style.color = '#B85C38')}
              >
                Tout l&apos;agenda →
              </Link>
            </div>

            {salons.length === 0
              ? <p className="text-gray-400 text-sm italic px-4">Aucun événement pour le moment.</p>
              : (
                <div className="flex flex-col gap-1">
                  {salons.map((salon, i) => <SalonCard key={salon.id} salon={salon} delay={i * 60} />)}
                </div>
              )
            }
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: '#B85C38' }}>
                  <RoutePlanet size={30} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Destinations Phares</h3>
              </div>
              <Link href="/destinations" className="text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: '#B85C38' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1A5C43')}
                onMouseLeave={e => (e.currentTarget.style.color = '#B85C38')}
              >
                Explorer →
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {destinations.map((dest, i) => (
                <DestinationCard key={dest.id} dest={dest} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsDestinationsSection;












// // src/components/home/EventsDestinationsSection.tsx
// "use client";

// import React, { useEffect, useState, useRef, useCallback  } from 'react';
// import Link from 'next/link';
// import { ArrowRight, Loader2, Calendar, Globe, MapPin, Clock } from 'lucide-react';
// import api from '@/lib/api';

// interface Salon {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   createdAt: string;
//   startDate?: string;
//   endDate?: string;
//   location?: string;
//   city?: string;
//   country?: string;
// }

// interface DestinationArticle {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string;
// }

// // ─── Hook reveal ─────────────────────────────────────────────────────────────

// function useReveal(threshold = 0.1) {
//   const [el, setEl] = useState<HTMLDivElement | null>(null);
//   const [visible, setVisible] = useState(false);

//   const ref = useCallback((node: HTMLDivElement | null) => {
//     setEl(node);
//   }, []);

//   useEffect(() => {
//     if (!el) return;
//     const obs = new IntersectionObserver(
//       ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
//       { threshold }
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [el, threshold]);

//   return { ref, visible };
// }

// // ─── DateRange ────────────────────────────────────────────────────────────────

// function DateRange({ startDate, endDate }: { startDate: string; endDate?: string }) {
//   const start = new Date(startDate);
//   const end = endDate ? new Date(endDate) : null;
//   const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
//   if (!end || start.toDateString() === end.toDateString()) return <span>{fmt(start)}</span>;
//   if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear())
//     return <span>{start.getDate()} – {fmt(end)}</span>;
//   return <span>{fmt(start)} – {fmt(end)}</span>;
// }

// // ─── Carte Salon ──────────────────────────────────────────────────────────────

// function SalonCard({ salon, delay = 0 }: { salon: Salon; delay?: number }) {
//   const { ref, visible } = useReveal();
//   return (
//     <div
//       ref={ref}
//       className="transition-all duration-600"
//       style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)' }}
//     >
//       <Link
//         href={`/evenements/${salon.slug}`}
//         className="group flex gap-4 p-4 rounded-2xl border border-transparent hover:border-[#1A5C43]/15 hover:bg-[#F0FAF5] transition-all duration-200"
//       >
//         {/* Icône date */}
//         <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl text-white" style={{ background: '#1A5C43' }}>
//           {salon.startDate && (
//             <>
//               <span className="text-lg font-black leading-none">
//                 {new Date(salon.startDate).getDate()}
//               </span>
//               <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
//                 {new Date(salon.startDate).toLocaleDateString('fr-FR', { month: 'short' })}
//               </span>
//             </>
//           )}
//           {!salon.startDate && <Calendar size={20} />}
//         </div>

//         {/* Contenu */}
//         <div className="flex-1 min-w-0">
//           <h4 className="font-bold text-[14px] leading-snug text-gray-900 line-clamp-2 group-hover:text-[#1A5C43] transition-colors">
//             {salon.title}
//           </h4>

//           <div className="flex flex-wrap gap-3 mt-2">
//             {salon.startDate && (
//               <span className="flex items-center gap-1 text-[11px] text-gray-500">
//                 <Clock size={11} className="text-[#C8A84B]" />
//                 <DateRange startDate={salon.startDate} endDate={salon.endDate} />
//               </span>
//             )}
//             {(salon.city || salon.country) && (
//               <span className="flex items-center gap-1 text-[11px] text-gray-500">
//                 <MapPin size={11} className="text-[#B85C38]" />
//                 {[salon.city, salon.country].filter(Boolean).join(', ')}
//               </span>
//             )}
//           </div>

//           {salon.excerpt && (
//             <p className="text-[12px] text-gray-400 mt-1.5 line-clamp-1">{salon.excerpt}</p>
//           )}
//         </div>

//         <ArrowRight
//           size={16}
//           className="shrink-0 self-center text-gray-300 group-hover:text-[#1A5C43] group-hover:translate-x-1 transition-all"
//         />
//       </Link>
//     </div>
//   );
// }

// // ─── Carte Destination ────────────────────────────────────────────────────────

// function DestinationCard({ dest, index = 0 }: { dest: DestinationArticle; index?: number }) {
//   const { ref, visible } = useReveal();
//   return (
//     <div
//       ref={ref}
//       className="transition-all duration-700"
//       style={{ transitionDelay: `${index * 100}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
//     >
//       <Link
//         href={`/articles/${dest.slug}`}
//         className="group relative block overflow-hidden rounded-2xl"
//         style={{ aspectRatio: index === 0 ? '16/7' : '16/6' }}
//       >
//         <img
//           src={dest.coverImage}
//           alt={dest.title}
//           className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//         />
//         <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,35,20,0.8) 0%, rgba(10,35,20,0.2) 60%, transparent 100%)' }} />

//         {/* Indicateur flèche */}
//         <div
//           className="absolute top-1/2 -translate-y-1/2 right-5 w-9 h-9 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2"
//           style={{ background: '#B85C38' }}
//         >
//           <ArrowRight size={16} />
//         </div>

//         <div className="absolute inset-0 flex flex-col justify-center px-6">
//           <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-1">Destination</p>
//           <h3 className="text-white font-black text-lg group-hover:text-[#C8A84B] transition-colors">{dest.title}</h3>
//         </div>
//       </Link>
//     </div>
//   );
// }

// // ─── Section principale ───────────────────────────────────────────────────────

// const EventsDestinationsSection = () => {
//   const [salons, setSalons] = useState<Salon[]>([]);
//   const [destinations, setDestinations] = useState<DestinationArticle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { ref: headingRef, visible: headingVisible } = useReveal(0.2);

//   useEffect(() => {
//     Promise.all([
//       api.get('/mag/articles', { params: { type: 'SALON', pageSize: 4, page: 1, status: 'PUBLISHED', sortBy: 'startDate:asc' } }),
//       api.get('/destinations/featured', { params: { limit: 3 } }),
//     ])
//       .then(([resSalons, resDest]) => {
//         setSalons(resSalons.data.data ?? []);
//         setDestinations(resDest.data.data ?? []);
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-24 flex justify-center items-center">
//         <Loader2 size={36} className="animate-spin" style={{ color: '#C8A84B' }} />
//       </div>
//     );
//   }

//   return (
//     <section className="py-20 md:py-18 bg-white overflow-hidden">
//       <div className="max-w-[1300px] mx-auto px-6">
        
//         {/* Heading */}
//       <div
//         ref={headingRef}
//         className="text-center mb-14 transition-all duration-700"
//         style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? 'none' : 'translateY(20px)' }}
//       >
//         <div className="flex items-center justify-center gap-3 mb-4">
//           <div className="h-px w-10" style={{ background: '#C8A84B' }} />
//           <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: '#B85C38' }}>
//             Agenda & Voyages
//           </span>
//           <div className="h-px w-10" style={{ background: '#C8A84B' }} />
//         </div>
//         <h2 className="text-3xl md:text-5xl font-black leading-none" style={{ color: '#0D1A10', letterSpacing: '-0.03em' }}>
//           Événements & <span style={{ color: '#1A5C43' }}>Destinations</span>
//         </h2>
//       </div>

//         {/* Grid deux colonnes */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

//           {/* ── SALONS ── */}
//           <div>
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: '#1A5C43' }}>
//                   <Calendar size={16} />
//                 </div>
//                 <h3 className="text-xl font-black text-gray-900">Salons & Événements</h3>
//               </div>
//               <Link href="/evenements" className="text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: '#B85C38' }}
//                 onMouseEnter={e => (e.currentTarget.style.color = '#1A5C43')}
//                 onMouseLeave={e => (e.currentTarget.style.color = '#B85C38')}
//               >
//                 Tout l&apos;agenda →
//               </Link>
//             </div>

//             {salons.length === 0
//               ? <p className="text-gray-400 text-sm italic px-4">Aucun événement pour le moment.</p>
//               : (
//                 <div className="flex flex-col gap-1">
//                   {salons.map((salon, i) => <SalonCard key={salon.id} salon={salon} delay={i * 60} />)}
//                 </div>
//               )
//             }
//           </div>

//           {/* ── DESTINATIONS ── */}
//           <div>
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: '#B85C38' }}>
//                   <Globe size={16} />
//                 </div>
//                 <h3 className="text-xl font-black text-gray-900">Destinations Phares</h3>
//               </div>
//               <Link href="/destinations" className="text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: '#B85C38' }}
//                 onMouseEnter={e => (e.currentTarget.style.color = '#1A5C43')}
//                 onMouseLeave={e => (e.currentTarget.style.color = '#B85C38')}
//               >
//                 Explorer →
//               </Link>
//             </div>

//             <div className="flex flex-col gap-3">
//               {destinations.map((dest, i) => (
//                 <DestinationCard key={dest.id} dest={dest} index={i} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default EventsDestinationsSection;










// // src/components/home/EventsDestinationsSection.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { ArrowRight, Loader2, Calendar, Globe, MapPin } from 'lucide-react';
// import api from '@/lib/api';
// import { AdvertisingBanner } from "@/components/AdvertisingBanner";

// interface Salon {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   createdAt: string;
//   startDate?: string;
//   endDate?: string;
//   location?: string;
//   city?: string;
//   country?: string;
// }

// interface DestinationArticle {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string;
// }

// const DateRange = ({ startDate, endDate }: { startDate: string; endDate?: string }) => {
//   const start = new Date(startDate);
//   const end = endDate ? new Date(endDate) : null;
//   const fmt = (d: Date) =>
//     d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

//   if (!end || start.toDateString() === end.toDateString()) return <span>{fmt(start)}</span>;
//   if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear())
//     return <span>{start.getDate()} – {fmt(end)}</span>;
//   return <span>{fmt(start)} – {fmt(end)}</span>;
// };

// const EventsDestinationsSection = () => {
//   const [salons, setSalons] = useState<Salon[]>([]);
//   const [destinations, setDestinations] = useState<DestinationArticle[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [resSalons, resDest] = await Promise.all([
//           api.get('/mag/articles', {
//             params: { type: 'SALON', pageSize: 4, page: 1, status: 'PUBLISHED', sortBy: 'startDate:asc' },
//           }),
//           api.get('/destinations/featured', { params: { limit: 3 } }),
//         ]);
//         setSalons(resSalons.data.data ?? []);
//         setDestinations(resDest.data.data ?? []);
//       } catch (error) {
//         console.error('Erreur Section Mixte:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-20 flex justify-center items-center">
//         <Loader2 size={40} className="animate-spin" style={{ color: '#C8A84B' }} />
//       </div>
//     );
//   }

//   return (
//     <section className="py-12 bg-[#F8FAFC]">
//       <div className="max-w-[1200px] mx-auto px-6">

//         <div className="w-full bg-[#F0F2F5] flex items-center justify-between border-b border-gray-200">
//           <AdvertisingBanner zoneSlug="leaderboards-footer" showDots={true} className="" />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

//           {/* ── SALONS ET ÉVÉNEMENTS ── */}
//           <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-50 h-full">
//             <div className="flex items-center justify-between mb-8">
//               <h2 className="text-2xl font-bold uppercase tracking-tight" style={{ color: '#001A4D' }}>
//                 Salons et Événements
//               </h2>
//               {/* Icône — or doux */}
//               <Calendar size={24} style={{ color: '#C8A84B' }} />
//             </div>

//             {salons.length === 0 ? (
//               <p className="text-gray-400 text-sm italic">
//                 Aucun événement disponible pour le moment.
//               </p>
//             ) : (
//               <div className="space-y-5">
//                 {salons.map((salon) => (
//                   <div
//                     key={salon.id}
//                     className="flex gap-4 border border-gray-100 rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
//                   >
//                     {/* Icône salon — émeraude */}
//                     <div
//                       className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center"
//                       style={{ background: '#2A7F5F' }}
//                     >
//                       <Calendar className="text-white" size={20} />
//                     </div>

//                     <div className="flex-1 min-w-0 space-y-1.5">
//                       <h3
//                         className="font-bold text-[14px] leading-snug line-clamp-2 transition-colors"
//                         style={{ color: '#333333' }}
//                         onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
//                         onMouseLeave={e => (e.currentTarget.style.color = '#333333')}
//                       >
//                         {salon.title}
//                       </h3>

//                       <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-medium">
//                         <Calendar size={12} className="text-gray-400 shrink-0" />
//                         <DateRange
//                           startDate={salon.startDate ?? salon.createdAt}
//                           endDate={salon.endDate}
//                         />
//                       </div>

//                       {salon.location && (
//                         <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
//                           <MapPin size={12} className="shrink-0" />
//                           <span className="truncate">
//                             {salon.location}
//                             {salon.city && `, ${salon.city}`}
//                             {salon.country && ` — ${salon.country}`}
//                           </span>
//                         </div>
//                       )}

//                       <p className="text-gray-500 text-[12px] leading-relaxed line-clamp-2">
//                         {salon.excerpt}
//                       </p>

//                       {/* Lien "Consulter" — or doux */}
//                       <Link
//                         href={`/evenements/${salon.slug}`}
//                         className="inline-flex items-center gap-1 font-bold text-[11px] hover:underline group"
//                         style={{ color: '#C8A84B' }}
//                       >
//                         Consulter la fiche
//                         <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Bouton "Agenda complet" — hover émeraude clair */}
//             <Link
//               href="/evenements"
//               className="mt-8 inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all group"
//               style={{ color: '#001A4D', background: '#F0F2F5' }}
//               onMouseEnter={e => (e.currentTarget.style.background = '#D4EDE5')}
//               onMouseLeave={e => (e.currentTarget.style.background = '#F0F2F5')}
//             >
//               Voir l&apos;Agenda Complet
//               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>

//           {/* ── NOS DESTINATIONS PHARES ── */}
//           <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-50 h-full">
//             <div className="flex items-center justify-between mb-10">
//               <h2 className="text-2xl font-bold uppercase tracking-tight" style={{ color: '#001A4D' }}>
//                 Nos Destinations Phares
//               </h2>
//               {/* Icône — or doux */}
//               <Globe size={24} style={{ color: '#C8A84B' }} />
//             </div>

//             <div className="space-y-4">
//               {destinations.map((dest) => (
//                 <Link
//                   href={`/articles/${dest.slug}`}
//                   key={dest.id}
//                   className="relative h-28 rounded-xl overflow-hidden group cursor-pointer block"
//                 >
//                   <img
//                     src={dest.coverImage}
//                     alt={dest.title}
//                     className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                   />
//                   <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
//                   <div className="absolute inset-0 flex flex-col justify-center px-6">
//                     <h3 className="text-white font-bold text-lg">{dest.title}</h3>
//                     <p className="text-white/80 text-xs">Découvrir la destination</p>
//                   </div>
//                 </Link>
//               ))}
//             </div>

//             {/* Bouton "Explorer" — hover émeraude clair */}
//             <Link
//               href="/destinations"
//               className="mt-8 inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all group"
//               style={{ color: '#001A4D', background: '#F0F2F5' }}
//               onMouseEnter={e => (e.currentTarget.style.background = '#D4EDE5')}
//               onMouseLeave={e => (e.currentTarget.style.background = '#F0F2F5')}
//             >
//               Explorer toutes les destinations
//               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default EventsDestinationsSection;






















// // src/components/home/EventsDestinationsSection.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { ArrowRight, Loader2, Calendar, Globe, MapPin } from 'lucide-react';
// import api from '@/lib/api';
// import { AdvertisingBanner } from "@/components/AdvertisingBanner";

// interface Salon {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   createdAt: string;
//   startDate?: string;
//   endDate?: string;
//   location?: string;
//   city?: string;
//   country?: string;
// }

// interface DestinationArticle {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string;
// }

// // ── Même composant DateRange que dans AgendaSection ──────────────────────────
// const DateRange = ({ startDate, endDate }: { startDate: string; endDate?: string }) => {
//   const start = new Date(startDate);
//   const end = endDate ? new Date(endDate) : null;
//   const fmt = (d: Date) =>
//     d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

//   if (!end || start.toDateString() === end.toDateString()) return <span>{fmt(start)}</span>;

//   if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear())
//     return <span>{start.getDate()} – {fmt(end)}</span>;

//   return <span>{fmt(start)} – {fmt(end)}</span>;
// };

// // ─────────────────────────────────────────────────────────────────────────────

// const EventsDestinationsSection = () => {
//   const [salons, setSalons] = useState<Salon[]>([]);
//   const [destinations, setDestinations] = useState<DestinationArticle[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [resSalons, resDest] = await Promise.all([
//           api.get('/mag/articles', {
//             params: {
//               type: 'SALON',
//               pageSize: 4,
//               page: 1,
//               status: 'PUBLISHED',
//               sortBy: 'startDate:asc',
//             },
//           }),
//           api.get('/destinations/featured', {
//             params: { limit: 3 },
//           }),
//         ]);

//         setSalons(resSalons.data.data ?? []);
//         setDestinations(resDest.data.data ?? []);
//       } catch (error) {
//         console.error('Erreur Section Mixte:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-20 flex justify-center items-center">
//         <Loader2 className="animate-spin text-[#F39C12]" size={40} />
//       </div>
//     );
//   }

//   return (
//     <section className="py-12 bg-[#F8FAFC]">
//       <div className="max-w-[1200px] mx-auto px-6">

//         <div className="w-full bg-it-gray-light flex items-center justify-between border-b border-gray-200">
//           <AdvertisingBanner zoneSlug="leaderboards-footer" showDots={true} className="" />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

//           {/* ── SALONS ET ÉVÉNEMENTS ─────────────────────────────────────── */}
//           <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-50 h-full">
//             <div className="flex items-center justify-between mb-8">
//               <h2 className="text-[#1A365D] text-2xl font-bold uppercase tracking-tight">
//                 Salons et Événements
//               </h2>
//               <Calendar className="text-[#F39C12]" size={24} />
//             </div>

//             {salons.length === 0 ? (
//               <p className="text-gray-400 text-sm italic">
//                 Aucun événement disponible pour le moment.
//               </p>
//             ) : (
//               <div className="space-y-5">
//                 {salons.map((salon) => (
//                   <div
//                     key={salon.id}
//                     className="flex gap-4 border border-gray-100 rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
//                   >
//                     {/* Icône */}
//                     <div className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center bg-[#1E3A8A]">
//                       <Calendar className="text-white" size={20} />
//                     </div>

//                     {/* Contenu */}
//                     <div className="flex-1 min-w-0 space-y-1.5">
//                       <h3 className="font-bold text-[#333] text-[14px] leading-snug line-clamp-2 hover:text-[#F39C12] transition-colors">
//                         {salon.title}
//                       </h3>

//                       {/* Date */}
//                       <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-medium">
//                         <Calendar size={12} className="text-gray-400 shrink-0" />
//                         <DateRange
//                           startDate={salon.startDate ?? salon.createdAt}
//                           endDate={salon.endDate}
//                         />
//                       </div>

//                       {/* Localisation */}
//                       {salon.location && (
//                         <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
//                           <MapPin size={12} className="shrink-0" />
//                           <span className="truncate">
//                             {salon.location}
//                             {salon.city && `, ${salon.city}`}
//                             {salon.country && ` — ${salon.country}`}
//                           </span>
//                         </div>
//                       )}

//                       {/* Extrait */}
//                       <p className="text-gray-500 text-[12px] leading-relaxed line-clamp-2">
//                         {salon.excerpt}
//                       </p>

//                       <Link
//                         href={`/evenements/${salon.slug}`}
//                         className="inline-flex items-center gap-1 text-[#F39C12] font-bold text-[11px] hover:underline group"
//                       >
//                         Consulter la fiche
//                         <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <Link
//               href="/evenements"
//               className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#1A365D] bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all group"
//             >
//               Voir l&apos;Agenda Complet
//               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>

//           {/* ── NOS DESTINATIONS PHARES ──────────────────────────────────── */}
//           <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-50 h-full">
//             <div className="flex items-center justify-between mb-10">
//               <h2 className="text-[#1A365D] text-2xl font-bold uppercase tracking-tight">
//                 Nos Destinations Phares
//               </h2>
//               <Globe className="text-[#F39C12]" size={24} />
//             </div>

//             <div className="space-y-4">
//               {destinations.map((dest) => (
//                 <Link
//                   href={`/articles/${dest.slug}`}
//                   key={dest.id}
//                   className="relative h-28 rounded-xl overflow-hidden group cursor-pointer block"
//                 >
//                   <img
//                     src={dest.coverImage}
//                     alt={dest.title}
//                     className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                   />
//                   <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
//                   <div className="absolute inset-0 flex flex-col justify-center px-6">
//                     <h3 className="text-white font-bold text-lg">{dest.title}</h3>
//                     <p className="text-white/80 text-xs">Découvrir la destination</p>
//                   </div>
//                 </Link>
//               ))}
//             </div>

//             <Link
//               href="/destinations"
//               className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#1A365D] bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all group"
//             >
//               Explorer toutes les destinations
//               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default EventsDestinationsSection;































// // src/components/home/EventsDestinationsSection.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { ArrowRight, Loader2, Calendar, Globe } from 'lucide-react';
// import api from '@/lib/api';
// import { AdvertisingBanner } from "@/components/AdvertisingBanner";

// interface Event {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   createdAt: string;
// }

// interface Destination {
//   id: number;
//   name: string;
//   slug: string;
//   description?: string;
// }

// interface DestinationArticle {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string;
// }

// interface TopBarProps {
//   /** Slug de la zone défini dans l'admin — défaut: "top-banner-accueil" */
//   zoneSlug?: string;
//   /** Afficher les points de pagination */
//   showDots?: boolean;
//   className?: string;
// }

// const EventsDestinationsSection = () => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [destinations, setDestinations] = useState<DestinationArticle[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // ✅ Appels parallèles pour optimiser
//         const [resEvents, resDest] = await Promise.all([
//           // TODO: Créer une catégorie "Salons & Événements" dans l'API
//           api.get('/mag/articles', {
//             params: {
//               pageSize: 4,
//               page: 1,
//               status: 'PUBLISHED'
//               // categoryId: ID_CATEGORY_SALONS (à ajouter)
//             }
//           }),
          
//           // ✅ Endpoint correct : Destinations featured
//           api.get('/destinations/featured', {
//             params: {
//               limit: 3
//             }
//           })
//         ]);
        
//         setEvents(resEvents.data.data || []);
//         setDestinations(resDest.data.data || []);
//       } catch (error) {
//         console.error("Erreur Section Mixte:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-20 flex justify-center items-center">
//         <Loader2 className="animate-spin text-[#F39C12]" size={40} />
//       </div>
//     );
//   }

//   return (
//     <section className="py-12 bg-[#F8FAFC]">
//       <div className="max-w-[1200px] mx-auto px-6">
        
//         {/* Espace publicitaire (à implémenter) */}
//         <div className="w-full bg-it-gray-light flex items-center justify-between border-b border-gray-200">
//           {/* <span className="text-gray-500 text-sm font-medium italic">
//             Espace Publicitaire Leaderboard 728×90
//           </span> */}
//           <AdvertisingBanner zoneSlug="leaderboards-footer" showDots={true} className="" />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
//           {/* SALONS ET ÉVÉNEMENTS */}
//           <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-50 h-full">
//             <div className="flex items-center justify-between mb-10">
//               <h2 className="text-[#1A365D] text-2xl font-bold uppercase tracking-tight">
//                 Salons et Événements
//               </h2>
//               <Calendar className="text-[#F39C12]" size={24} />
//             </div>
            
//             <div className="space-y-8">
//               {events.map((event) => (
//                 <Link 
//                   href={`/articles/${event.slug}`}
//                   key={event.id} 
//                   className="pl-4 border-l-4 border-[#F39C12] group cursor-pointer block"
//                 >
//                   <h3 className="font-bold text-[#333] text-lg group-hover:text-[#F39C12] transition-colors">
//                     {event.title}
//                   </h3>
//                   <p className="text-gray-400 text-sm mt-1 line-clamp-1">
//                     {event.excerpt}
//                   </p>
//                   <p className="text-[#1A365D] font-bold text-sm mt-1">
//                     {new Date(event.createdAt).toLocaleDateString('fr-FR', { 
//                       day: 'numeric', 
//                       month: 'long', 
//                       year: 'numeric' 
//                     })}
//                   </p>
//                 </Link>
//               ))}
//             </div>

//             <Link 
//               href="/evenements" 
//               className="mt-12 inline-flex items-center gap-2 text-sm font-bold text-[#1A365D] bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all group"
//             >
//               Voir l&apos;Agenda Complet 
//               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>

//           {/* NOS DESTINATIONS PHARES */}
//           <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-50 h-full">
//             <div className="flex items-center justify-between mb-10">
//               <h2 className="text-[#1A365D] text-2xl font-bold uppercase tracking-tight">
//                 Nos Destinations Phares
//               </h2>
//               <Globe className="text-[#F39C12]" size={24} />
//             </div>

//             <div className="space-y-4">
//               {destinations.map((dest) => (
//                 <Link 
//                   href={`/articles/${dest.slug}`}
//                   key={dest.id} 
//                   className="relative h-28 rounded-xl overflow-hidden group cursor-pointer block"
//                 >
//                   <img 
//                     src={dest.coverImage} 
//                     alt={dest.title}
//                     className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
//                   />
//                   <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
//                   <div className="absolute inset-0 flex flex-col justify-center px-6">
//                     <h3 className="text-white font-bold text-lg">{dest.title}</h3>
//                     <p className="text-white/80 text-xs">Découvrir la destination</p>
//                   </div>
//                 </Link>
//               ))}
//             </div>

//             <Link 
//               href="/destinations" 
//               className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#1A365D] bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all group"
//             >
//               Explorer toutes les destinations 
//               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default EventsDestinationsSection;