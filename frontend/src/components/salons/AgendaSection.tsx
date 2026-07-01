// src/components/salons/AgendaSection.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plane, ArrowRight,
  ChevronLeft, ChevronRight, Clock,
} from 'lucide-react';
import { AgendaMark, RoutePlanet, LocaleMark } from '@/components/icons/CustomIcons';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  city?: string;
  country?: string;
  description: string;
  type?: 'calendar' | 'globe' | 'plane';
  slug: string;
}

interface AgendaSectionProps {
  events: Event[];
}

const PAGE_SIZE = 4;

// ─── Hook reveal avec ref callback ───────────────────────────────────────────

function useReveal(threshold = 0.1) {
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

// ─── Utilitaires ─────────────────────────────────────────────────────────────

const DateRange = ({ startDate, endDate }: { startDate: string; endDate?: string }) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const fmt = (d: Date) =>
    d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  if (!end || start.toDateString() === end.toDateString()) return <span>{fmt(start)}</span>;
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear())
    return <span>{start.getDate()} – {fmt(end)}</span>;
  return <span>{fmt(start)} – {fmt(end)}</span>;
};

function renderIcon(event: Event) {
  const iconProps = { className: 'text-white', size: 48 };
  const t = event.title.toLowerCase();
  if (t.includes('wtm') || t.includes('world travel market')) return <RoutePlanet {...iconProps} />;
  if (t.includes('iftm') || t.includes('itb')) return <Plane {...iconProps} />;
  return <AgendaMark {...iconProps} />;
}

// ─── Carte événement avec reveal individuel ───────────────────────────────────

function EventCard({ event, delay = 0 }: { event: Event; delay?: number }) {
  const { ref, visible } = useReveal(0.08);

  return (
    <div
      ref={ref as React.RefCallback<HTMLDivElement>}
      className="transition-all duration-700"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      <div className="group flex flex-col md:flex-row gap-5 border border-gray-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl hover:border-[#1A5C43]/20 transition-all duration-300">

        {/* Icône date */}
        <div className="shrink-0 flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ background: '#0D2B1A' }}
          >
            {renderIcon(event)}
          </div>
          {event.startDate && (
            <div className="mt-2 text-center">
              <p className="text-lg font-black leading-none" style={{ color: '#0D1A10' }}>
                {new Date(event.startDate).getDate()}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {new Date(event.startDate).toLocaleDateString('fr-FR', { month: 'short' })}
              </p>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0 space-y-2.5">
          <h3
            className="text-lg font-black leading-snug group-hover:text-[#1A5C43] transition-colors"
            style={{ color: '#0D1A10', letterSpacing: '-0.01em' }}
          >
            {event.title}
          </h3>

          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500">
              <Clock size={12} style={{ color: '#C8A84B' }} />
              <DateRange startDate={event.startDate} endDate={event.endDate} />
            </span>
            {(event.location || event.city || event.country) && (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500">
                <LocaleMark size={12} style={{ color: '#B85C38' }} />
                {[event.location, event.city, event.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>

          {event.description && (
            <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-2">
              {event.description}
            </p>
          )}

          <Link
            href={`/evenements/${event.slug}`}
            className="inline-flex items-center gap-1.5 font-bold text-[12px] uppercase tracking-wider group/link transition-all"
            style={{ color: '#1A5C43' }}
          >
            Consulter la fiche salon
            <ArrowRight
              size={14}
              className="group-hover/link:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Heading avec reveal ──────────────────────────────────────────────────────

function AgendaHeading({ count, visible }: { count: number; visible: boolean }) {
  return (
    <div
      className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100 transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: '#0D2B1A' }}
        >
          <AgendaMark size={36} style={{ color: '#C8A84B' }} />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: '#B85C38' }}>
            — Prochains rendez-vous
          </p>
          <h2
            className="text-2xl font-bold leading-tight"
            style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}
          >
            Agenda des <span style={{ color: '#1A5C43' }}>Événements</span>
          </h2>
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium hidden sm:block">
        {count} événement{count > 1 ? 's' : ''}
      </span>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const AgendaSection = ({ events }: AgendaSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { setHeadingVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeadingVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!events || events.length === 0) {
    return (
      <section id="agenda-section" className="space-y-8">
        <div ref={headingRef}>
          <AgendaHeading count={0} visible={headingVisible} />
        </div>
        <div className="py-14 text-center border border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400 text-sm">Aucun événement programmé pour le moment.</p>
        </div>
      </section>
    );
  }

  const totalPages    = Math.ceil(events.length / PAGE_SIZE);
  const startIndex    = (currentPage - 1) * PAGE_SIZE;
  const visibleEvents = events.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document
      .getElementById('agenda-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <section id="agenda-section" className="space-y-5">
      <div ref={headingRef}>
        <AgendaHeading count={events.length} visible={headingVisible} />
      </div>

      {/* Cartes avec stagger reveal individuel */}
      <div className="space-y-4">
        {visibleEvents.map((event, i) => (
          <EventCard key={event.id} event={event} delay={i * 80} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Page {currentPage} sur {totalPages} — {events.length} événement{events.length > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="px-1 text-gray-400 text-sm select-none">…</span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className="w-9 h-9 rounded-xl text-sm font-bold transition-all border"
                  style={currentPage === page
                    ? { background: '#1A5C43', color: '#fff', borderColor: '#1A5C43', boxShadow: '0 2px 8px rgba(26,92,67,0.3)' }
                    : { background: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AgendaSection;











// // src/components/salons/AgendaSection.tsx
// "use client";

// import React, { useState } from 'react';
// import { Calendar, MapPin, Globe, Plane, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
// import Link from 'next/link';

// interface Event {
//   id: string;
//   title: string;
//   startDate: string;
//   endDate?: string;
//   location?: string;
//   city?: string;
//   country?: string;
//   description: string;
//   type?: 'calendar' | 'globe' | 'plane';
//   slug: string;
// }

// interface AgendaSectionProps {
//   events: Event[];
// }

// const PAGE_SIZE = 4;

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

// const AgendaSection = ({ events }: AgendaSectionProps) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   if (!events || events.length === 0) {
//     return (
//       <div className="py-10 text-center border border-dashed border-gray-200 rounded-lg">
//         <p className="text-gray-400 text-sm font-light">
//           Aucun événement programmé pour le moment.
//         </p>
//       </div>
//     );
//   }

//   const totalPages    = Math.ceil(events.length / PAGE_SIZE);
//   const startIndex    = (currentPage - 1) * PAGE_SIZE;
//   const visibleEvents = events.slice(startIndex, startIndex + PAGE_SIZE);

//   const handlePageChange = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     document.getElementById('agenda-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   const renderIcon = (event: Event) => {
//     const iconProps = { className: 'text-white', size: 24 };
//     const t = event.title.toLowerCase();
//     if (t.includes('wtm') || t.includes('world travel market')) return <Globe {...iconProps} />;
//     if (t.includes('iftm') || t.includes('itb'))               return <Plane {...iconProps} />;
//     return <Calendar {...iconProps} />;
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

//   return (
//     <section id="agenda-section" className="space-y-10">
//       <div className="flex items-center justify-between">
//         {/* Titre → text-it-blue (texte courant sur fond blanc) */}
//         <h2 className="text-it-blue text-2xl font-serif font-bold uppercase tracking-widest">
//           Agenda des prochains événements
//         </h2>
//         <span className="text-xs text-gray-400 font-medium">
//           {events.length} événement{events.length > 1 ? 's' : ''}
//         </span>
//       </div>

//       <div className="space-y-4">
//         {visibleEvents.map((event) => (
//           <div
//             key={event.id}
//             className="flex flex-col md:flex-row gap-6 border border-gray-100 rounded-xl p-8 bg-white shadow-sm hover:shadow-lg transition-shadow"
//           >
//             {/* Icône → fond sombre section → bg-it-emerald-dark */}
//             <div className="w-16 h-16 shrink-0 rounded-lg flex items-center justify-center bg-it-emerald-dark">
//               {renderIcon(event)}
//             </div>

//             <div className="flex-1 space-y-3">
//               {/* Titre carte → text-it-blue, hover → text-it-gold */}
//               <h3 className="text-xl font-bold text-it-blue hover:text-it-gold transition-colors">
//                 {event.title}
//               </h3>

//               <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-500">
//                 <span className="flex items-center gap-2">
//                   <Calendar size={16} className="text-gray-600" />
//                   <DateRange startDate={event.startDate} endDate={event.endDate} />
//                 </span>

//                 {event.location && (
//                   <span className="flex items-center gap-2">
//                     <MapPin size={16} className="text-gray-600" />
//                     {event.location}
//                     {event.city    && `, ${event.city}`}
//                     {event.country && ` — ${event.country}`}
//                   </span>
//                 )}
//               </div>

//               <p className="text-gray-500 text-[15px] leading-relaxed font-light max-w-4xl line-clamp-2">
//                 {event.description}
//               </p>

//               {/* Lien accent → text-it-gold */}
//               <Link
//                 href={`/evenements/${event.slug}`}
//                 className="inline-flex items-center gap-1 text-it-gold font-bold text-sm hover:underline transition-all group"
//               >
//                 Consulter la Fiche Salon
//                 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Pagination ── */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Page {currentPage} sur {totalPages} — {events.length} événement{events.length > 1 ? 's' : ''}
//           </p>
//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//               aria-label="Page précédente"
//             >
//               <ChevronLeft size={16} />
//             </button>
//             {getPageNumbers().map((page, idx) =>
//               page === '...' ? (
//                 <span key={`dots-${idx}`} className="px-2 text-gray-400 text-sm select-none">…</span>
//               ) : (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page as number)}
//                   className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
//                     currentPage === page
//                       /* Page active → bg-it-emerald-dark text-white */
//                       ? 'bg-it-emerald-dark text-white shadow-md'
//                       : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               )
//             )}
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//               aria-label="Page suivante"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default AgendaSection;


















// // src/components/salons/AgendaSection.tsx
// "use client";

// import React, { useState } from 'react';
// import { Calendar, MapPin, Globe, Plane, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
// import Link from 'next/link';

// interface Event {
//   id: string;
//   title: string;
//   startDate: string;   // ← remplace "date: string"
//   endDate?: string;    // ← nouveau
//   location?: string;
//   city?: string;       // ← nouveau
//   country?: string;    // ← nouveau
//   description: string;
//   type?: 'calendar' | 'globe' | 'plane';
//   slug: string;
// }

// interface AgendaSectionProps {
//   events: Event[];
// }

// const PAGE_SIZE = 4;

// // ── Identique à la page slug ──────────────────────────────────────────────────
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

// const AgendaSection = ({ events }: AgendaSectionProps) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   if (!events || events.length === 0) {
//     return (
//       <div className="py-10 text-center border border-dashed border-gray-200 rounded-lg">
//         <p className="text-gray-400 text-sm font-light">
//           Aucun événement programmé pour le moment.
//         </p>
//       </div>
//     );
//   }

//   const totalPages    = Math.ceil(events.length / PAGE_SIZE);
//   const startIndex    = (currentPage - 1) * PAGE_SIZE;
//   const visibleEvents = events.slice(startIndex, startIndex + PAGE_SIZE);

//   const handlePageChange = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     document.getElementById('agenda-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   const renderIcon = (event: Event) => {
//     const iconProps = { className: 'text-white', size: 24 };
//     const t = event.title.toLowerCase();
//     if (t.includes('wtm') || t.includes('world travel market')) return <Globe {...iconProps} />;
//     if (t.includes('iftm') || t.includes('itb'))               return <Plane {...iconProps} />;
//     return <Calendar {...iconProps} />;
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

//   return (
//     <section id="agenda-section" className="space-y-10">
//       <div className="flex items-center justify-between">
//         <h2 className="text-[#001A4D] text-2xl font-serif font-bold uppercase tracking-widest">
//           Agenda des prochains événements
//         </h2>
//         <span className="text-xs text-gray-400 font-medium">
//           {events.length} événement{events.length > 1 ? 's' : ''}
//         </span>
//       </div>

//       <div className="space-y-4">
//         {visibleEvents.map((event) => (
//           <div
//             key={event.id}
//             className="flex flex-col md:flex-row gap-6 border border-gray-100 rounded-xl p-8 bg-white shadow-sm hover:shadow-lg transition-shadow"
//           >
//             <div className="w-16 h-16 shrink-0 rounded-lg flex items-center justify-center bg-[#1E3A8A]">
//               {renderIcon(event)}
//             </div>

//             <div className="flex-1 space-y-3">
//               <h3 className="text-xl font-bold text-[#333] hover:text-[#F39C12] transition-colors">
//                 {event.title}
//               </h3>

//               <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-500">
//                 {/* ── Date période ── */}
//                 <span className="flex items-center gap-2">
//                   <Calendar size={16} className="text-gray-600" />
//                   <DateRange startDate={event.startDate} endDate={event.endDate} />
//                 </span>

//                 {/* ── Localisation complète ── */}
//                 {event.location && (
//                   <span className="flex items-center gap-2">
//                     <MapPin size={16} className="text-gray-600" />
//                     {event.location}
//                     {event.city    && `, ${event.city}`}
//                     {event.country && ` — ${event.country}`}
//                   </span>
//                 )}
//               </div>

//               <p className="text-gray-500 text-[15px] leading-relaxed font-light max-w-4xl line-clamp-2">
//                 {event.description}
//               </p>

//               <Link
//                 href={`/evenements/${event.slug}`}
//                 className="inline-flex items-center gap-1 text-[#F39C12] font-bold text-sm hover:underline transition-all group"
//               >
//                 Consulter la Fiche Salon
//                 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Pagination (inchangée) ── */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Page {currentPage} sur {totalPages} — {events.length} événement{events.length > 1 ? 's' : ''}
//           </p>
//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//               aria-label="Page précédente"
//             >
//               <ChevronLeft size={16} />
//             </button>
//             {getPageNumbers().map((page, idx) =>
//               page === '...' ? (
//                 <span key={`dots-${idx}`} className="px-2 text-gray-400 text-sm select-none">…</span>
//               ) : (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page as number)}
//                   className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
//                     currentPage === page
//                       ? 'bg-[#001A4D] text-white shadow-md'
//                       : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               )
//             )}
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//               aria-label="Page suivante"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default AgendaSection;