// src/components/salons/ReportageGrid.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { Play, FileText, Image as ImageIcon, ExternalLink, Clock, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface Reportage {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
  category: { id: number; name: string };
  content: Array<{ type: string; url?: string; value?: string }>;
}

interface FilterState {
  year: string;
  region: string;
  type: string;
}

// ─── Hook reveal ─────────────────────────────────────────────────────────────

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

// ─── Hook détection touch ─────────────────────────────────────────────────────

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => { setIsTouch(window.matchMedia('(pointer: coarse)').matches); }, []);
  return isTouch;
}

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function getContentType(r: Reportage): 'video' | 'article' | 'interview' {
  if (r.content?.some((b) => b.type === 'video')) return 'video';
  if (r.category.name.toLowerCase().includes('interview')) return 'interview';
  return 'article';
}

function getCategoryStyle(n: string): { background: string } {
  const name = n.toLowerCase();
  if (name.includes('interview')) return { background: 'rgba(42,127,95,0.9)' };
  if (name.includes('video'))     return { background: 'rgba(184,92,56,0.9)' };
  if (name.includes('analyse'))   return { background: 'rgba(0,26,77,0.9)' };
  return { background: 'rgba(26,92,67,0.9)' };
}

function renderTypeIcon(type: string) {
  if (type === 'video')     return <Play size={10} className="fill-current" />;
  if (type === 'interview') return <ImageIcon size={10} />;
  return <FileText size={10} />;
}

// ─── Squelette ───────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, n) => (
        <div key={n} className="rounded-2xl bg-gray-200 animate-pulse" style={{ aspectRatio: '16/9' }} />
      ))}
    </div>
  );
}

// ─── Carte ────────────────────────────────────────────────────────────────────

function ReportageCard({ item, delay = 0 }: { item: Reportage; delay?: number }) {
  const { ref, visible } = useReveal(0.06);
  const [hovered, setHovered] = useState(false);
  const isTouch = useIsTouchDevice();
  const overlayVisible = isTouch || hovered;
  const contentType = getContentType(item);

  return (
    <div
      ref={ref as React.RefCallback<HTMLDivElement>}
      className="transition-all duration-700"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <Link
        href={`/actualites/${item.slug}`}
        className="group block relative overflow-hidden rounded-2xl active:scale-[0.98] transition-transform duration-150"
        style={{ aspectRatio: '16/9' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="absolute inset-0">
          <img
            src={item.coverImage || '/images/magazine-placeholder.jpg'}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.55) 45%, rgba(0,0,0,0.08) 100%)' }}
          />
        </div>

        {/* Badge */}
        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm z-10"
          style={getCategoryStyle(item.category.name)}
        >
          {renderTypeIcon(contentType)}
          <span className="hidden sm:inline">{item.category.name}</span>
        </span>

        {/* Overlay hover */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 transition-opacity duration-300 z-10"
          style={{
            background: 'linear-gradient(to top, rgba(26,92,67,0.97) 0%, rgba(26,92,67,0.60) 55%, transparent 100%)',
            opacity: overlayVisible ? 1 : 0,
          }}
        >
          <p className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#C8A84B' }}>
            <Clock size={8} />
            {new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <h3 className="font-bold text-[12px] sm:text-[13px] leading-snug line-clamp-2 text-white mb-1.5 sm:mb-2">
            {item.title}
          </h3>
          {item.excerpt && (
            <p className="hidden sm:block text-white/75 text-[10px] sm:text-[11px] leading-relaxed line-clamp-2 mb-2 sm:mb-3">
              {item.excerpt}
            </p>
          )}
          <div className="border-t pt-2" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold" style={{ color: '#B85C38' }}>
              Lire le reportage <ExternalLink size={8} />
            </span>
          </div>
        </div>

        {/* État par défaut */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transition-opacity duration-300 z-10"
          style={{ opacity: overlayVisible ? 0 : 1 }}
        >
          <p className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1 sm:mb-1.5" style={{ color: '#C8A84B' }}>
            <Clock size={8} />
            {new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <h3 className="font-bold text-[12px] sm:text-[13px] leading-snug line-clamp-2 text-white mb-2 sm:mb-3">{item.title}</h3>
          <div className="border-t pt-2" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold" style={{ color: '#B85C38' }}>
              Lire le reportage <ExternalLink size={8} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── FilterBar — redesignée en barre horizontale compacte ─────────────────────

function FilterBar({ filters, onChange }: { filters: FilterState; onChange: (f: FilterState) => void }) {
  const hasActive = filters.year !== 'all' || filters.region !== 'all' || filters.type !== 'all';

  const selectBase =
    'appearance-none bg-transparent border-0 text-sm font-semibold outline-none cursor-pointer pr-6 pl-1 py-0 transition-colors';

  return (
    <div
      className="flex flex-wrap items-center gap-2 px-4 py-3 rounded-2xl border border-gray-100"
      style={{ background: '#F7F9F8' }}
    >
      {/* Label gauche */}
      <div className="flex items-center gap-2 mr-1 shrink-0">
        <SlidersHorizontal size={14} style={{ color: '#1A5C43' }} />
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 hidden sm:block">
          Filtrer
        </span>
      </div>

      {/* Séparateur */}
      <div className="h-5 w-px bg-gray-200 hidden sm:block" />

      {/* Sélects inline */}
      {[
        {
          key: 'year' as const,
          label: 'Année',
          value: filters.year,
          options: [
            { value: 'all', label: 'Toutes les années' },
            { value: '2025', label: '2025' },
            { value: '2024', label: '2024' },
            { value: '2023', label: '2023' },
          ],
        },
        {
          key: 'region' as const,
          label: 'Région',
          value: filters.region,
          options: [
            { value: 'all', label: 'Toutes les régions' },
            { value: 'afrique', label: 'Afrique' },
            { value: 'europe', label: 'Europe' },
            { value: 'ameriques', label: 'Amériques' },
            { value: 'asie-pacifique', label: 'Asie-Pacifique' },
            { value: 'moyen-orient', label: 'Moyen-Orient' },
          ],
        },
        {
          key: 'type' as const,
          label: 'Format',
          value: filters.type,
          options: [
            { value: 'all', label: 'Tous les formats' },
            { value: 'article', label: 'Articles' },
            { value: 'video', label: 'Vidéos' },
            { value: 'interview', label: 'Interviews' },
          ],
        },
      ].map((f, i) => (
        <React.Fragment key={f.key}>
          {i > 0 && <div className="h-5 w-px bg-gray-200" />}
          <div className="relative flex items-center gap-1.5 px-2 py-1.5 rounded-xl transition-colors hover:bg-white">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 shrink-0 hidden md:block">
              {f.label} :
            </span>
            <div className="relative">
              <select
                value={f.value}
                onChange={(e) => onChange({ ...filters, [f.key]: e.target.value })}
                className={selectBase}
                style={{ color: f.value !== 'all' ? '#1A5C43' : '#374151' }}
              >
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: f.value !== 'all' ? '#1A5C43' : '#9CA3AF' }}
              />
            </div>
          </div>
        </React.Fragment>
      ))}

      {/* Badge actif + reset */}
      {hasActive && (
        <>
          <div className="h-5 w-px bg-gray-200" />
          <button
            onClick={() => onChange({ year: 'all', region: 'all', type: 'all' })}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all"
            style={{ color: '#B85C38', background: 'rgba(184,92,56,0.08)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(184,92,56,0.16)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(184,92,56,0.08)')}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#B85C38' }}
            />
            Réinitialiser
          </button>
        </>
      )}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const ReportageGrid = () => {
  const [reportages, setReportages] = useState<Reportage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({ year: 'all', region: 'all', type: 'all' });
  const { ref: headingRef, visible: headingVisible } = useReveal(0.1);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = { pageSize: 12, page: 1, status: 'PUBLISHED' };
    if (filters.year !== 'all')   params.year        = filters.year;
    if (filters.region !== 'all') params.region      = filters.region;
    if (filters.type !== 'all')   params.contentType = filters.type;

    api.get('/mag/articles', { params })
      .then((res) => setReportages(res.data.data ?? []))
      .catch((err: AxiosError) => { console.error('Erreur reportages:', err.message); setReportages([]); })
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <section className="space-y-6 sm:space-y-8">

      {/* Heading */}
      <div
        ref={headingRef as React.RefCallback<HTMLDivElement>}
        className="flex items-center gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-gray-100 transition-all duration-700"
        style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? 'none' : 'translateY(20px)' }}
      >
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#B85C38' }}>
          <Play size={15} fill="white" className="text-white ml-0.5" />
        </div>
        <div>
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: '#B85C38' }}>
            — Contenus exclusifs
          </p>
          <h2 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}>
            Reportages &amp; <span style={{ color: '#1A5C43' }}>Comptes-rendus</span>
          </h2>
        </div>
      </div>

      {/* Filtres */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Grille */}
      {loading ? (
        <Skeleton />
      ) : reportages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {reportages.map((item, i) => (
            <ReportageCard key={item.id} item={item} delay={i * 60} />
          ))}
        </div>
      ) : (
        <div className="py-16 sm:py-20 text-center rounded-2xl border border-dashed border-gray-200" style={{ background: '#F7F9F8' }}>
          <p className="text-gray-400 text-sm">Aucun reportage ne correspond à vos critères de recherche.</p>
        </div>
      )}

      {/* Charger plus */}
      {!loading && reportages.length >= 12 && (
        <div className="flex justify-center pt-4 sm:pt-6">
          <button
            className="font-bold text-xs uppercase tracking-[0.2em] px-8 sm:px-12 py-3.5 sm:py-4 rounded-full text-white transition-all shadow-lg active:scale-95"
            style={{ background: '#1A5C43' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
          >
            Voir plus de reportages
          </button>
        </div>
      )}
    </section>
  );
};

export default ReportageGrid;










// // src/components/salons/ReportageGrid.tsx
// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import Link from 'next/link';
// import { AxiosError } from 'axios';
// import api from '@/lib/api';
// import { Loader2, ArrowRight, Play, FileText, Image as ImageIcon } from 'lucide-react';

// interface Reportage {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   createdAt: string;
//   category: { id: number; name: string };
//   content: Array<{ type: string; url?: string; value?: string }>;
// }

// interface FilterState {
//   year: string;
//   region: string;
//   type: string;
// }

// // ─── Hook reveal avec ref callback ───────────────────────────────────────────

// function useReveal(threshold = 0.1) {
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

// // ─── Utilitaires ─────────────────────────────────────────────────────────────

// function getContentType(reportage: Reportage): 'video' | 'article' | 'interview' {
//   if (reportage.content?.some((b) => b.type === 'video')) return 'video';
//   if (reportage.category.name.toLowerCase().includes('interview')) return 'interview';
//   return 'article';
// }

// function renderTypeIcon(type: string) {
//   switch (type) {
//     case 'video':     return <Play size={13} className="fill-current" />;
//     case 'interview': return <ImageIcon size={13} />;
//     default:          return <FileText size={13} />;
//   }
// }

// function getCategoryStyle(categoryName: string): { background: string } {
//   const name = categoryName.toLowerCase();
//   if (name.includes('interview')) return { background: '#2A7F5F' };
//   if (name.includes('video'))     return { background: '#B85C38' };
//   if (name.includes('analyse'))   return { background: '#001A4D' };
//   return { background: '#1A5C43' };
// }

// // ─── Squelette de chargement ──────────────────────────────────────────────────

// function Skeleton() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {Array.from({ length: 6 }).map((_, n) => (
//         <div key={n} className="flex flex-col space-y-4 animate-pulse">
//           <div className="bg-gray-200 h-52 w-full rounded-2xl" />
//           <div className="h-3 bg-gray-200 w-1/4 rounded" />
//           <div className="h-5 bg-gray-200 w-3/4 rounded" />
//           <div className="h-16 bg-gray-200 w-full rounded" />
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Carte reportage avec reveal individuel ────────────────────────────────────

// function ReportageCard({ item, delay = 0 }: { item: Reportage; delay?: number }) {
//   const { ref, visible } = useReveal(0.08);
//   const contentType = getContentType(item);

//   return (
//     <article
//       ref={ref as React.RefCallback<HTMLElement>}
//       className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
//       style={{
//         transitionDelay: `${delay}ms`,
//         opacity: visible ? 1 : 0,
//         transform: visible ? 'translateY(0)' : 'translateY(24px)',
//       }}
//     >
//       {/* Image */}
//       <div className="relative h-52 w-full overflow-hidden bg-gray-100">
//         <img
//           src={item.coverImage}
//           alt={item.title}
//           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
//         <span
//           className="absolute bottom-4 left-4 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg"
//           style={getCategoryStyle(item.category.name)}
//         >
//           {renderTypeIcon(contentType)}
//           {item.category.name}
//         </span>
//       </div>

//       {/* Contenu */}
//       <div className="p-6 flex flex-col flex-grow">
//         <span
//           className="text-[10px] font-bold uppercase tracking-widest mb-2"
//           style={{ color: '#C8A84B' }}
//         >
//           {new Date(item.createdAt).toLocaleDateString('fr-FR', {
//             day: 'numeric', month: 'long', year: 'numeric',
//           })}
//         </span>
//         <h3
//           className="font-black text-base leading-snug mb-3 group-hover:text-[#1A5C43] transition-colors line-clamp-2"
//           style={{ color: '#0D1A10', letterSpacing: '-0.01em' }}
//         >
//           {item.title}
//         </h3>
//         <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6">
//           {item.excerpt}
//         </p>

//         <div className="mt-auto pt-4 border-t border-gray-50">
//           <Link
//             href={`/actualites/${item.slug}`}
//             className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider transition-all group/link"
//             style={{ color: '#0D1A10' }}
//           >
//             Lire le reportage
//             <ArrowRight
//               size={14}
//               className="group-hover/link:translate-x-1 transition-transform"
//               style={{ color: '#C8A84B' }}
//             />
//           </Link>
//         </div>
//       </div>
//     </article>
//   );
// }

// // ─── Barre de filtres ─────────────────────────────────────────────────────────

// function FilterBar({
//   filters,
//   onChange,
// }: {
//   filters: FilterState;
//   onChange: (f: FilterState) => void;
// }) {
//   const hasActive =
//     filters.year !== 'all' || filters.region !== 'all' || filters.type !== 'all';

//   const selectClass =
//     'bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all cursor-pointer';

//   return (
//     <div className="flex flex-wrap gap-4 p-5 rounded-2xl border border-gray-100" style={{ background: '#F7F9F8' }}>
//       <div className="flex flex-col gap-1.5">
//         <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Année</label>
//         <select
//           value={filters.year}
//           onChange={(e) => onChange({ ...filters, year: e.target.value })}
//           className={selectClass}
//           style={{ minWidth: 140 }}
//         >
//           <option value="all">Toutes les années</option>
//           <option value="2025">2025</option>
//           <option value="2024">2024</option>
//           <option value="2023">2023</option>
//         </select>
//       </div>

//       <div className="flex flex-col gap-1.5">
//         <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Région</label>
//         <select
//           value={filters.region}
//           onChange={(e) => onChange({ ...filters, region: e.target.value })}
//           className={selectClass}
//           style={{ minWidth: 160 }}
//         >
//           <option value="all">Toutes les régions</option>
//           <option value="afrique">Afrique</option>
//           <option value="europe">Europe</option>
//           <option value="ameriques">Amériques</option>
//           <option value="asie-pacifique">Asie-Pacifique</option>
//           <option value="moyen-orient">Moyen-Orient</option>
//         </select>
//       </div>

//       <div className="flex flex-col gap-1.5">
//         <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Format</label>
//         <select
//           value={filters.type}
//           onChange={(e) => onChange({ ...filters, type: e.target.value })}
//           className={selectClass}
//           style={{ minWidth: 160 }}
//         >
//           <option value="all">Tous les contenus</option>
//           <option value="article">Articles & Dossiers</option>
//           <option value="video">Vidéos & Web TV</option>
//           <option value="interview">Interviews exclusives</option>
//         </select>
//       </div>

//       {hasActive && (
//         <button
//           onClick={() => onChange({ year: 'all', region: 'all', type: 'all' })}
//           className="mt-auto mb-0.5 text-[10px] font-bold uppercase px-2 py-2 transition-colors"
//           style={{ color: '#B85C38' }}
//           onMouseEnter={e => (e.currentTarget.style.color = '#8A3E22')}
//           onMouseLeave={e => (e.currentTarget.style.color = '#B85C38')}
//         >
//           Réinitialiser
//         </button>
//       )}
//     </div>
//   );
// }

// // ─── Composant principal ──────────────────────────────────────────────────────

// const ReportageGrid = () => {
//   const [reportages, setReportages] = useState<Reportage[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState<FilterState>({
//     year: 'all', region: 'all', type: 'all',
//   });

//   // Heading reveal
//   const { ref: headingRef, visible: headingVisible } = useReveal(0.1);

//   // Seul fetch client restant : filtres dynamiques, axiosRetry géré dans api.ts
//   useEffect(() => {
//     setLoading(true);
//     const params: Record<string, string | number> = {
//       pageSize: 12, page: 1, status: 'PUBLISHED',
//     };
//     if (filters.year !== 'all')   params.year        = filters.year;
//     if (filters.region !== 'all') params.region      = filters.region;
//     if (filters.type !== 'all')   params.contentType = filters.type;

//     api
//       .get('/mag/articles', { params })
//       .then((res) => setReportages(res.data.data ?? []))
//       .catch((err: AxiosError) => {
//         console.error('Erreur reportages:', err.message);
//         setReportages([]);
//       })
//       .finally(() => setLoading(false));
//   }, [filters]);

//   return (
//     <section className="space-y-8">
//       {/* Heading */}
//       <div
//         ref={headingRef as React.RefCallback<HTMLDivElement>}
//         className="flex items-center gap-4 pb-6 border-b border-gray-100 transition-all duration-700"
//         style={{
//           opacity: headingVisible ? 1 : 0,
//           transform: headingVisible ? 'none' : 'translateY(20px)',
//         }}
//       >
//         <div
//           className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
//           style={{ background: '#B85C38' }}
//         >
//           <Play size={18} fill="white" className="text-white ml-0.5" />
//         </div>
//         <div>
//           <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: '#B85C38' }}>
//             — Contenus exclusifs
//           </p>
//           <h2
//             className="text-2xl font-black leading-tight"
//             style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}
//           >
//             Reportages &amp; <span style={{ color: '#1A5C43' }}>Comptes-rendus</span>
//           </h2>
//         </div>
//       </div>

//       {/* Filtres */}
//       <FilterBar filters={filters} onChange={setFilters} />

//       {/* Grille */}
//       {loading ? (
//         <Skeleton />
//       ) : reportages.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {reportages.map((item, i) => (
//             <ReportageCard key={item.id} item={item} delay={i * 60} />
//           ))}
//         </div>
//       ) : (
//         <div
//           className="py-20 text-center rounded-2xl border border-dashed border-gray-200"
//           style={{ background: '#F7F9F8' }}
//         >
//           <p className="text-gray-400 text-sm">
//             Aucun reportage ne correspond à vos critères de recherche.
//           </p>
//         </div>
//       )}

//       {/* Bouton "charger plus" */}
//       {!loading && reportages.length >= 12 && (
//         <div className="flex justify-center pt-6">
//           <button
//             className="font-bold text-xs uppercase tracking-[0.2em] px-12 py-4 rounded-full text-white transition-all shadow-lg active:scale-95"
//             style={{ background: '#1A5C43' }}
//             onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
//             onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
//           >
//             Voir plus de reportages
//           </button>
//         </div>
//       )}
//     </section>
//   );
// };

// export default ReportageGrid;













// // src/components/salons/ReportageGrid.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { AxiosError } from 'axios';
// import api from '@/lib/api';
// import { Loader2, ArrowRight, Play, FileText, Image as ImageIcon } from 'lucide-react';

// interface Reportage {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   createdAt: string;
//   category: {
//     id: number;
//     name: string;
//   };
//   content: Array<{
//     type: string;
//     url?: string;
//     value?: string;
//   }>;
// }

// interface FilterState {
//   year: string;
//   region: string;
//   type: string;
// }

// const ReportageGrid = () => {
//   const [reportages, setReportages] = useState<Reportage[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [filters, setFilters] = useState<FilterState>({
//     year: 'all',
//     region: 'all',
//     type: 'all'
//   });

//   useEffect(() => {
//     const fetchReportages = async () => {
//       try {
//         setLoading(true);

//         const params: Record<string, string | number> = {
//           pageSize: 12,
//           page: 1,
//           status: 'PUBLISHED'
//         };

//         if (filters.year !== 'all')   params.year        = filters.year;
//         if (filters.region !== 'all') params.region      = filters.region;
//         if (filters.type !== 'all')   params.contentType = filters.type;

//         const response = await api.get('/mag/articles', { params });
//         setReportages(response.data.data || []);
//       } catch (error) {
//         if (error instanceof AxiosError) {
//           console.error("Erreur lors de la récupération des reportages:", error.message);
//         }
//         setReportages([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReportages();
//   }, [filters]);

//   const getContentType = (reportage: Reportage): 'video' | 'article' | 'interview' => {
//     if (reportage.content && reportage.content.some(block => block.type === 'video')) return 'video';
//     if (reportage.category.name.toLowerCase().includes('interview')) return 'interview';
//     return 'article';
//   };

//   const renderTypeIcon = (type: string) => {
//     switch (type) {
//       case 'video':     return <Play size={14} className="fill-current" />;
//       case 'article':   return <FileText size={14} />;
//       case 'interview': return <ImageIcon size={14} />;
//       default:          return <FileText size={14} />;
//     }
//   };

//   /*
//    * Badges catégorie :
//    *  - interview  → bg-it-emerald      (#2A7F5F)
//    *  - video      → bg-it-terracotta   (#B85C38)
//    *  - analyse    → bg-it-blue         (#001A4D)
//    *  - défaut     → bg-it-emerald-dark (#1A5C43)
//    */
//   const getCategoryColor = (categoryName: string): string => {
//     const name = categoryName.toLowerCase();
//     if (name.includes('interview')) return 'bg-it-emerald';
//     if (name.includes('video'))     return 'bg-it-terracotta';
//     if (name.includes('analyse'))   return 'bg-it-blue';
//     return 'bg-it-emerald-dark';
//   };

//   return (
//     <section className="space-y-8">
//       <div className="flex items-center justify-between border-b border-gray-100 pb-4">
//         {/* Titre → text-it-blue */}
//         <h2 className="text-2xl font-serif font-bold text-it-blue uppercase tracking-widest">
//           Reportages et comptes-rendus
//         </h2>
//       </div>

//       {/* BARRE DE FILTRES */}
//       <div className="flex flex-wrap gap-4 p-5 bg-it-gray-light rounded-xl border border-slate-100">

//         {/* Filtre Année */}
//         <div className="flex flex-col gap-1.5">
//           <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Année</label>
//           <select
//             value={filters.year}
//             onChange={(e) => setFilters({ ...filters, year: e.target.value })}
//             /* focus ring → ring-it-gold / border-it-gold */
//             className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-it-gold/20 focus:border-it-gold transition-all cursor-pointer min-w-[140px]"
//           >
//             <option value="all">Toutes les années</option>
//             <option value="2025">2025</option>
//             <option value="2024">2024</option>
//             <option value="2023">2023</option>
//           </select>
//         </div>

//         {/* Filtre Région */}
//         <div className="flex flex-col gap-1.5">
//           <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Destination / Région</label>
//           <select
//             value={filters.region}
//             onChange={(e) => setFilters({ ...filters, region: e.target.value })}
//             className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-it-gold/20 focus:border-it-gold transition-all cursor-pointer min-w-[160px]"
//           >
//             <option value="all">Toutes les régions</option>
//             <option value="afrique">Afrique</option>
//             <option value="europe">Europe</option>
//             <option value="ameriques">Amériques</option>
//             <option value="asie-pacifique">Asie-Pacifique</option>
//             <option value="moyen-orient">Moyen-Orient</option>
//           </select>
//         </div>

//         {/* Filtre Type de contenu */}
//         <div className="flex flex-col gap-1.5">
//           <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Format</label>
//           <select
//             value={filters.type}
//             onChange={(e) => setFilters({ ...filters, type: e.target.value })}
//             className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-it-gold/20 focus:border-it-gold transition-all cursor-pointer min-w-[160px]"
//           >
//             <option value="all">Tous les contenus</option>
//             <option value="article">Articles & Dossiers</option>
//             <option value="video">Vidéos & Web TV</option>
//             <option value="interview">Interviews Exclusives</option>
//           </select>
//         </div>

//         {/* Bouton Réinitialiser → text-it-terracotta */}
//         {(filters.year !== 'all' || filters.region !== 'all' || filters.type !== 'all') && (
//           <button
//             onClick={() => setFilters({ year: 'all', region: 'all', type: 'all' })}
//             className="mt-auto mb-1 text-[10px] font-bold uppercase text-it-terracotta hover:underline px-2 py-2"
//           >
//             Réinitialiser
//           </button>
//         )}
//       </div>

//       {/* GRILLE DE CARTES */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {[1, 2, 3, 4, 5, 6].map((n) => (
//             <div key={n} className="flex flex-col space-y-4 animate-pulse">
//               <div className="bg-gray-200 h-52 w-full rounded-2xl" />
//               <div className="h-4 bg-gray-200 w-1/4 rounded" />
//               <div className="h-6 bg-gray-200 w-3/4 rounded" />
//               <div className="h-20 bg-gray-200 w-full rounded" />
//             </div>
//           ))}
//         </div>
//       ) : reportages.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {reportages.map((item) => {
//             const contentType   = getContentType(item);
//             const categoryColor = getCategoryColor(item.category.name);

//             return (
//               <article
//                 key={item.id}
//                 className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300"
//               >
//                 <div className="relative h-52 w-full overflow-hidden">
//                   <img
//                     src={item.coverImage}
//                     alt={item.title}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
//                   <span className={`absolute bottom-4 left-4 ${categoryColor} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-lg flex items-center gap-2`}>
//                     {renderTypeIcon(contentType)}
//                     {item.category.name}
//                   </span>
//                 </div>

//                 <div className="p-6 flex flex-col flex-grow">
//                   {/* Date → accent → text-it-gold */}
//                   <span className="text-[10px] text-it-gold font-bold uppercase tracking-widest mb-2">
//                     {new Date(item.createdAt).toLocaleDateString('fr-FR', {
//                       day: 'numeric',
//                       month: 'long',
//                       year: 'numeric'
//                     })}
//                   </span>
//                   {/* Titre → text-it-blue / hover → text-it-gold */}
//                   <h3 className="font-serif font-bold text-it-blue text-lg leading-snug mb-3 group-hover:text-it-gold transition-colors line-clamp-2">
//                     {item.title}
//                   </h3>
//                   <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed font-light mb-6">
//                     {item.excerpt}
//                   </p>

//                   <div className="mt-auto pt-4 border-t border-gray-50">
//                     {/* Lien → text-it-blue / icône flèche → text-it-gold */}
//                     <Link
//                       href={`/actualites/${item.slug}`}
//                       className="text-it-blue font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all"
//                     >
//                       Lire le reportage
//                       <ArrowRight size={14} className="text-it-gold" />
//                     </Link>
//                   </div>
//                 </div>
//               </article>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="py-20 text-center bg-it-gray-light rounded-2xl border border-dashed border-gray-200">
//           <p className="text-gray-400">
//             Aucun reportage ne correspond à vos critères de recherche.
//           </p>
//         </div>
//       )}

//       {/* Bouton Charger Plus → bg-it-emerald-dark / hover bg-it-terracotta */}
//       {!loading && reportages.length >= 12 && (
//         <div className="flex justify-center pt-10">
//           <button className="bg-it-emerald-dark text-white px-12 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-it-terracotta transition-colors shadow-lg active:scale-95">
//             Voir plus de reportages
//           </button>
//         </div>
//       )}
//     </section>
//   );
// };

// export default ReportageGrid;


















// // src/components/salons/ReportageGrid.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { AxiosError } from 'axios';
// import api from '@/lib/api';
// import { Loader2, ArrowRight, Play, FileText, Image as ImageIcon } from 'lucide-react';

// interface Reportage {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   createdAt: string;
//   category: {
//     id: number;
//     name: string;
//   };
//   content: Array<{
//     type: string;
//     url?: string;
//     value?: string;
//   }>;
// }

// interface FilterState {
//   year: string;
//   region: string;
//   type: string;
// }

// const ReportageGrid = () => {
//   const [reportages, setReportages] = useState<Reportage[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   const [filters, setFilters] = useState<FilterState>({
//     year: 'all',
//     region: 'all',
//     type: 'all'
//   });

//   useEffect(() => {
//     const fetchReportages = async () => {
//       try {
//         setLoading(true);
        
//         const params: Record<string, string | number> = {
//           pageSize: 12,
//           page: 1,
//           status: 'PUBLISHED'
//           // TODO Backend: Ajouter categorySlug: 'reportages-salons'
//         };

//         // Filtrage par année
//         if (filters.year !== 'all') {
//           params.year = filters.year;
//         }
        
//         // TODO Backend: Ajouter des tags pour région et type
//         if (filters.region !== 'all') {
//           params.region = filters.region;
//         }

//         if (filters.type !== 'all') {
//           params.contentType = filters.type;
//         }

//         const response = await api.get('/mag/articles', { params });
        
//         setReportages(response.data.data || []);
//       } catch (error) {
//         if (error instanceof AxiosError) {
//           console.error("Erreur lors de la récupération des reportages:", error.message);
//         }
//         setReportages([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReportages();
//   }, [filters]);

//   // Fonction pour déterminer le type de contenu
//   const getContentType = (reportage: Reportage): 'video' | 'article' | 'interview' => {
//     if (reportage.content && reportage.content.some(block => block.type === 'video')) {
//       return 'video';
//     }
//     if (reportage.category.name.toLowerCase().includes('interview')) {
//       return 'interview';
//     }
//     return 'article';
//   };

//   // Fonction pour l'icône de type de contenu
//   const renderTypeIcon = (type: string) => {
//     switch (type) {
//       case 'video': return <Play size={14} className="fill-current" />;
//       case 'article': return <FileText size={14} />;
//       case 'interview': return <ImageIcon size={14} />;
//       default: return <FileText size={14} />;
//     }
//   };

//   // Couleur du badge selon la catégorie
//   const getCategoryColor = (categoryName: string): string => {
//     const name = categoryName.toLowerCase();
//     if (name.includes('interview')) return 'bg-purple-600';
//     if (name.includes('video')) return 'bg-red-600';
//     if (name.includes('analyse')) return 'bg-blue-600';
//     return 'bg-it-blue';
//   };

//   return (
//     <section className="space-y-8">
//       <div className="flex items-center justify-between border-b border-gray-100 pb-4">
//         <h2 className="text-2xl font-serif font-bold text-it-blue uppercase tracking-widest">
//           Reportages et comptes-rendus
//         </h2>
//       </div>

//       {/* BARRE DE FILTRES */}
//       <div className="flex flex-wrap gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
//         {/* Filtre Année */}
//         <div className="flex flex-col gap-1.5">
//           <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Année</label>
//           <select 
//             value={filters.year}
//             onChange={(e) => setFilters({...filters, year: e.target.value})}
//             className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-it-orange/20 focus:border-it-orange transition-all cursor-pointer min-w-[140px]"
//           >
//             <option value="all">Toutes les années</option>
//             <option value="2025">2025</option>
//             <option value="2024">2024</option>
//             <option value="2023">2023</option>
//           </select>
//         </div>

//         {/* Filtre Région */}
//         <div className="flex flex-col gap-1.5">
//           <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Destination / Région</label>
//           <select 
//             value={filters.region}
//             onChange={(e) => setFilters({...filters, region: e.target.value})}
//             className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-it-orange/20 focus:border-it-orange transition-all cursor-pointer min-w-[160px]"
//           >
//             <option value="all">Toutes les régions</option>
//             <option value="afrique">Afrique</option>
//             <option value="europe">Europe</option>
//             <option value="ameriques">Amériques</option>
//             <option value="asie-pacifique">Asie-Pacifique</option>
//             <option value="moyen-orient">Moyen-Orient</option>
//           </select>
//         </div>

//         {/* Filtre Type de contenu */}
//         <div className="flex flex-col gap-1.5">
//           <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Format</label>
//           <select 
//             value={filters.type}
//             onChange={(e) => setFilters({...filters, type: e.target.value})}
//             className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-it-orange/20 focus:border-it-orange transition-all cursor-pointer min-w-[160px]"
//           >
//             <option value="all">Tous les contenus</option>
//             <option value="article">Articles & Dossiers</option>
//             <option value="video">Vidéos & Web TV</option>
//             <option value="interview">Interviews Exclusives</option>
//           </select>
//         </div>

//         {/* Bouton Réinitialiser */}
//         {(filters.year !== 'all' || filters.region !== 'all' || filters.type !== 'all') && (
//           <button 
//             onClick={() => setFilters({ year: 'all', region: 'all', type: 'all' })}
//             className="mt-auto mb-1 text-[10px] font-bold uppercase text-it-orange hover:underline px-2 py-2"
//           >
//             Réinitialiser
//           </button>
//         )}
//       </div>

//       {/* GRILLE DE CARTES */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {[1, 2, 3, 4, 5, 6].map((n) => (
//             <div key={n} className="flex flex-col space-y-4 animate-pulse">
//               <div className="bg-gray-200 h-52 w-full rounded-2xl" />
//               <div className="h-4 bg-gray-200 w-1/4 rounded" />
//               <div className="h-6 bg-gray-200 w-3/4 rounded" />
//               <div className="h-20 bg-gray-200 w-full rounded" />
//             </div>
//           ))}
//         </div>
//       ) : reportages.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {reportages.map((item) => {
//             const contentType = getContentType(item);
//             const categoryColor = getCategoryColor(item.category.name);

//             return (
//               <article 
//                 key={item.id} 
//                 className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300"
//               >
//                 <div className="relative h-52 w-full overflow-hidden">
//                   <img 
//                     src={item.coverImage} 
//                     alt={item.title} 
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
//                   <span className={`absolute bottom-4 left-4 ${categoryColor} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-lg flex items-center gap-2`}>
//                     {renderTypeIcon(contentType)}
//                     {item.category.name}
//                   </span>
//                 </div>

//                 <div className="p-6 flex flex-col flex-grow">
//                   <span className="text-[10px] text-it-orange font-bold uppercase tracking-widest mb-2">
//                     {new Date(item.createdAt).toLocaleDateString('fr-FR', {
//                       day: 'numeric',
//                       month: 'long',
//                       year: 'numeric'
//                     })}
//                   </span>
//                   <h3 className="font-serif font-bold text-it-blue text-lg leading-snug mb-3 group-hover:text-it-orange transition-colors line-clamp-2">
//                     {item.title}
//                   </h3>
//                   <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed font-light mb-6">
//                     {item.excerpt}
//                   </p>
                  
//                   <div className="mt-auto pt-4 border-t border-gray-50">
//                     <Link 
//                       href={`/actualites/${item.slug}`}
//                       className="text-it-blue font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all"
//                     >
//                       Lire le reportage 
//                       <ArrowRight size={14} className="text-it-orange" />
//                     </Link>
//                   </div>
//                 </div>
//               </article>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-gray-200">
//           <p className="text-gray-400">
//             Aucun reportage ne correspond à vos critères de recherche.
//           </p>
//         </div>
//       )}

//       {/* Bouton Charger Plus */}
//       {!loading && reportages.length >= 12 && (
//         <div className="flex justify-center pt-10">
//           <button 
//             className="bg-it-blue text-white px-12 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-it-orange transition-colors shadow-lg active:scale-95"
//           >
//             Voir plus de reportages
//           </button>
//         </div>
//       )}
//     </section>
//   );
// };

// export default ReportageGrid;