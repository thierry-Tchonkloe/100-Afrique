// src/components/salons/AgendaSection.tsx
"use client";

import React, { useState } from 'react';
import { Calendar, MapPin, Globe, Plane, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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

const AgendaSection = ({ events }: AgendaSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!events || events.length === 0) {
    return (
      <div className="py-10 text-center border border-dashed border-gray-200 rounded-lg">
        <p className="text-gray-400 text-sm font-light">
          Aucun événement programmé pour le moment.
        </p>
      </div>
    );
  }

  const totalPages    = Math.ceil(events.length / PAGE_SIZE);
  const startIndex    = (currentPage - 1) * PAGE_SIZE;
  const visibleEvents = events.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document.getElementById('agenda-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderIcon = (event: Event) => {
    const iconProps = { className: 'text-white', size: 24 };
    const t = event.title.toLowerCase();
    if (t.includes('wtm') || t.includes('world travel market')) return <Globe {...iconProps} />;
    if (t.includes('iftm') || t.includes('itb'))               return <Plane {...iconProps} />;
    return <Calendar {...iconProps} />;
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

  return (
    <section id="agenda-section" className="space-y-10">
      <div className="flex items-center justify-between">
        {/* Titre → text-it-blue (texte courant sur fond blanc) */}
        <h2 className="text-it-blue text-2xl font-serif font-bold uppercase tracking-widest">
          Agenda des prochains événements
        </h2>
        <span className="text-xs text-gray-400 font-medium">
          {events.length} événement{events.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {visibleEvents.map((event) => (
          <div
            key={event.id}
            className="flex flex-col md:flex-row gap-6 border border-gray-100 rounded-xl p-8 bg-white shadow-sm hover:shadow-lg transition-shadow"
          >
            {/* Icône → fond sombre section → bg-it-emerald-dark */}
            <div className="w-16 h-16 shrink-0 rounded-lg flex items-center justify-center bg-it-emerald-dark">
              {renderIcon(event)}
            </div>

            <div className="flex-1 space-y-3">
              {/* Titre carte → text-it-blue, hover → text-it-gold */}
              <h3 className="text-xl font-bold text-it-blue hover:text-it-gold transition-colors">
                {event.title}
              </h3>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-500">
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-600" />
                  <DateRange startDate={event.startDate} endDate={event.endDate} />
                </span>

                {event.location && (
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-600" />
                    {event.location}
                    {event.city    && `, ${event.city}`}
                    {event.country && ` — ${event.country}`}
                  </span>
                )}
              </div>

              <p className="text-gray-500 text-[15px] leading-relaxed font-light max-w-4xl line-clamp-2">
                {event.description}
              </p>

              {/* Lien accent → text-it-gold */}
              <Link
                href={`/evenements/${event.slug}`}
                className="inline-flex items-center gap-1 text-it-gold font-bold text-sm hover:underline transition-all group"
              >
                Consulter la Fiche Salon
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Page {currentPage} sur {totalPages} — {events.length} événement{events.length > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Page précédente"
            >
              <ChevronLeft size={16} />
            </button>
            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-400 text-sm select-none">…</span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                    currentPage === page
                      /* Page active → bg-it-emerald-dark text-white */
                      ? 'bg-it-emerald-dark text-white shadow-md'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Page suivante"
            >
              <ChevronRight size={16} />
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