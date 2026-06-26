'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ExternalLink, Calendar, ChevronLeft, ChevronRight,
  Loader2, Search, ArrowLeft, ArrowRight, Clock, X,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Magazine {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage: string | null;
  source: string;
  publishedAt: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Secteurs metadata ────────────────────────────────────────────────────────

const SECTEUR_META: Record<string, {
  label: string; description: string;
  accentFrom: string; accentTo: string; emoji: string;
}> = {
  hotellerie: {
    label: 'Hôtellerie',
    description: 'Actualités, tendances et analyses du secteur hôtelier en Afrique et dans le monde.',
    accentFrom: '#1A5C43', accentTo: '#2A7F5F', emoji: '🏨',
  },
  transport: {
    label: 'Transport',
    description: 'Tout sur le transport aérien, ferroviaire et routier dédié au tourisme.',
    accentFrom: '#0D2B1A', accentTo: '#1A5C43', emoji: '✈️',
  },
  restauration: {
    label: 'Restauration',
    description: 'Gastronomie africaine et mondiale, actualités culinaires et chefs.',
    accentFrom: '#B85C38', accentTo: '#C8A84B', emoji: '🍽️',
  },
  'voyages-affaires': {
    label: "Voyages d'Affaires",
    description: 'MICE, voyages corporate, réunions internationales et tendances business travel.',
    accentFrom: '#1A2B5C', accentTo: '#2A3F8A', emoji: '💼',
  },
  'mice-evenements': {
    label: 'MICE & Événements',
    description: 'Congrès, salons, incentives et événements professionnels à travers le monde.',
    accentFrom: '#5C1A4A', accentTo: '#8A2A6E', emoji: '🎪',
  },
  divertissement: {
    label: 'Divertissement',
    description: 'Parcs, attractions, culture, festivals et loisirs liés au tourisme.',
    accentFrom: '#5C1A1A', accentTo: '#8A2A2A', emoji: '🎭',
  },
  'tourisme-durable': {
    label: 'Tourisme Durable',
    description: 'Éco-tourisme, développement responsable et tourisme vert en Afrique.',
    accentFrom: '#1A4D2B', accentTo: '#2A7A45', emoji: '🌿',
  },
};

const PAGE_SIZE = 9;

// ─── Hook reveal ──────────────────────────────────────────────────────────────

function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white animate-pulse">
      <div className="aspect-[3/4] bg-gray-100" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 bg-gray-100 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-3/4" />
        <div className="h-2 bg-gray-50 rounded-full w-1/3 mt-3" />
      </div>
    </div>
  );
}

// ─── Carte magazine ───────────────────────────────────────────────────────────

function MagazineCard({ mag, delay = 0 }: { mag: Magazine; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-600"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
    >
      <Link
        href={`/magazine/${mag.slug}`}
        className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#1A5C43]/20 hover:shadow-xl transition-all duration-300 active:scale-[0.98] h-full"
      >
        {/* Image portrait */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={mag.coverImage || '/images/magazine-placeholder.jpg'}
            alt={mag.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
            style={{ background: 'rgba(26,92,67,0.88)' }}
          >
            {mag.source}
          </span>
        </div>

        {/* Texte */}
        <div className="p-4 flex flex-col flex-1">
          <h3
            className="font-bold text-[13px] leading-snug line-clamp-2 flex-1 mb-3 transition-colors"
            style={{ color: '#0D1A10' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1A5C43')}
            onMouseLeave={e => (e.currentTarget.style.color = '#0D1A10')}
          >
            {mag.title}
          </h3>
          {mag.excerpt && (
            <p className="hidden sm:block text-gray-400 text-[11px] line-clamp-2 mb-3 leading-relaxed">
              {mag.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <Clock size={9} />
              {new Date(mag.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: '#B85C38' }}>
              Lire <ExternalLink size={9} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const getPages = (): (number | '...')[] => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  };
  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      <button onClick={() => onChange(current - 1)} disabled={current === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft size={15} />
      </button>
      {getPages().map((p, idx) =>
        p === '...' ? (
          <span key={`d${idx}`} className="px-1 text-gray-400 text-sm select-none">…</span>
        ) : (
          <button key={p} onClick={() => onChange(p as number)}
            className="w-9 h-9 rounded-xl text-sm font-bold transition-all border"
            style={current === p
              ? { background: '#1A5C43', color: '#fff', borderColor: '#1A5C43', boxShadow: '0 2px 8px rgba(26,92,67,0.3)' }
              : { background: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onChange(current + 1)} disabled={current === total}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function SecteurPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = SECTEUR_META[slug] ?? {
    label: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Secteur',
    description: `Actualités du secteur ${slug}.`,
    accentFrom: '#1A5C43', accentTo: '#2A7F5F', emoji: '📰',
  };

  const [magazines, setMagazines]       = useState<Magazine[]>([]);
  const [pagination, setPagination]     = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage]   = useState(1);
  const [query, setQuery]               = useState('');
  const [draftQuery, setDraftQuery]     = useState('');
  const [loading, setLoading]           = useState(true);
  const [pageLoading, setPageLoading]   = useState(false);
  const [heroVisible, setHeroVisible]   = useState(false);

  const fetchMagazines = useCallback(async (page: number, search: string) => {
    page === 1 && !search ? setLoading(true) : setPageLoading(true);
    try {
      const res = await api.get('/magazines/rss', {
        params: { category: slug, pageSize: PAGE_SIZE, page, ...(search ? { search } : {}) },
      });
      setMagazines(res.data?.data?.magazines ?? []);
      setPagination(res.data?.data?.pagination ?? null);
    } catch {}
    finally { setLoading(false); setPageLoading(false); }
  }, [slug]);

  useEffect(() => {
    fetchMagazines(1, '');
    setTimeout(() => setHeroVisible(true), 80);
  }, [fetchMagazines]);

  const handleSearch = () => {
    setQuery(draftQuery);
    setCurrentPage(1);
    fetchMagazines(1, draftQuery);
  };

  const handlePageChange = (page: number) => {
    if (!pagination || page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
    fetchMagazines(page, query);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const otherSecteurs = Object.entries(SECTEUR_META).filter(([s]) => s !== slug);

  return (
    <main className="min-h-screen" style={{ background: '#F7F9F8' }}>

      {/* ══════════════════════════════════════════════════════
          HERO IMMERSIF
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${meta.accentFrom} 0%, ${meta.accentTo} 100%)`,
          minHeight: 380,
        }}
      >
        {/* Pattern de points */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        {/* Lumière ambiante */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20"
          style={{ background: 'radial-gradient(ellipse at 100% 30%, rgba(200,168,75,0.5) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 py-16 md:py-24">

          {/* Breadcrumb */}
          <div
            className="flex items-center gap-2 mb-8 text-white/50 text-[11px] font-semibold uppercase tracking-wider transition-all duration-500"
            style={{ opacity: heroVisible ? 1 : 0, transitionDelay: '80ms' }}
          >
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/actualites" className="hover:text-white transition-colors">Actualités</Link>
            <span>/</span>
            <span className="text-white/80">{meta.label}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">

            {/* Gauche : titre + description */}
            <div className="flex-1">
              {/* Emoji */}
              <div
                className="text-5xl sm:text-6xl mb-5 transition-all duration-700"
                style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(16px)', transitionDelay: '120ms' }}
              >
                {meta.emoji}
              </div>

              {/* Eyebrow */}
              <div
                className="flex items-center gap-3 mb-3 transition-all duration-500"
                style={{ opacity: heroVisible ? 1 : 0, transitionDelay: '180ms' }}
              >
                <div className="h-px w-8" style={{ background: '#C8A84B' }} />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#C8A84B' }}>Secteur</span>
              </div>

              <h1
                className="text-white font-black text-4xl md:text-5xl lg:text-6xl leading-none mb-5 transition-all duration-700"
                style={{
                  letterSpacing: '-0.03em',
                  textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'none' : 'translateY(20px)',
                  transitionDelay: '240ms',
                }}
              >
                {meta.label}
              </h1>

              <p
                className="text-white/60 text-base max-w-lg leading-relaxed transition-all duration-500"
                style={{ opacity: heroVisible ? 1 : 0, transitionDelay: '340ms' }}
              >
                {meta.description}
              </p>
            </div>

            {/* Droite : stat + recherche */}
            <div
              className="flex flex-col gap-4 lg:min-w-[340px] transition-all duration-700"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateX(20px)', transitionDelay: '300ms' }}
            >
              {/* Badge stat */}
              {pagination && (
                <div
                  className="inline-flex items-baseline gap-2 px-6 py-4 rounded-2xl self-start"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <span className="text-3xl font-black text-white">{pagination.total.toLocaleString('fr-FR')}</span>
                  <span className="text-white/50 text-[11px] font-bold uppercase tracking-widest">article{pagination.total > 1 ? 's' : ''}</span>
                </div>
              )}

              {/* Barre de recherche */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={`Rechercher dans ${meta.label}…`}
                    value={draftQuery}
                    onChange={e => setDraftQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-0 bg-white text-sm outline-none shadow-sm font-medium"
                    style={{ color: '#0D1A10' }}
                  />
                  {draftQuery && (
                    <button onClick={() => { setDraftQuery(''); setQuery(''); fetchMagazines(1, ''); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                      <X size={13} />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-3 rounded-xl font-bold text-sm text-white transition-all hover:shadow-lg active:scale-95"
                  style={{ background: '#B85C38' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
                >
                  <Search size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          NAVIGATION SECTEURS + RETOUR
      ══════════════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link
          href="/actualites"
          className="flex items-center gap-1.5 text-[12px] font-bold transition-colors"
          style={{ color: '#1A5C43' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#B85C38')}
          onMouseLeave={e => (e.currentTarget.style.color = '#1A5C43')}
        >
          <ArrowLeft size={13} /> Toutes les actualités
        </Link>

        <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0">Autres :</span>
          {otherSecteurs.map(([s, m]) => (
            <Link
              key={s}
              href={`/secteurs/${s}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
              style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1A5C43';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#1A5C43';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6B7280';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              {m.emoji} {m.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          GRILLE MAGAZINES
      ══════════════════════════════════════════════════════ */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-6 pb-20">

        {/* Filtre actif */}
        {query && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-gray-500">Résultats pour</span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
              style={{ background: 'rgba(26,92,67,0.08)', color: '#1A5C43', border: '1px solid rgba(26,92,67,0.15)' }}
            >
              «&nbsp;{query}&nbsp;»
              <button onClick={() => { setDraftQuery(''); setQuery(''); fetchMagazines(1, ''); }}
                className="hover:text-[#B85C38] transition-colors ml-0.5">
                <X size={11} />
              </button>
            </span>
            {pagination && <span className="text-xs text-gray-400">— {pagination.total} résultat{pagination.total > 1 ? 's' : ''}</span>}
          </div>
        )}

        {/* Contenu */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : !magazines.length ? (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-sm font-medium">
              {query
                ? `Aucun résultat pour « ${query} » dans ce secteur.`
                : 'Aucune actualité disponible dans ce secteur pour le moment.'}
            </p>
            {query && (
              <button
                onClick={() => { setDraftQuery(''); setQuery(''); fetchMagazines(1, ''); }}
                className="mt-5 px-6 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ background: '#1A5C43' }}
              >
                Voir toutes les actualités du secteur
              </button>
            )}
          </div>
        ) : (
          <div className={`relative transition-opacity duration-200 ${pageLoading ? 'opacity-40 pointer-events-none' : ''}`}>
            {pageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 size={28} className="animate-spin" style={{ color: '#1A5C43' }} />
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {magazines.map((mag, i) => <MagazineCard key={mag.id} mag={mag} delay={i * 35} />)}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && (pagination?.totalPages ?? 1) > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 order-2 sm:order-1">
              Page {currentPage} sur {pagination?.totalPages} — {pagination?.total ?? 0} article{(pagination?.total ?? 0) > 1 ? 's' : ''}
            </p>
            <div className="order-1 sm:order-2">
              <Pagination
                current={currentPage}
                total={pagination?.totalPages ?? 1}
                onChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════
          MINI CTA NEWSLETTER
      ══════════════════════════════════════════════════════ */}
      <NewsletterMiniCTA sectionLabel={meta.label} />
    </main>
  );
}

// ─── Mini CTA newsletter ──────────────────────────────────────────────────────

function NewsletterMiniCTA({ sectionLabel }: { sectionLabel: string }) {
  const { ref, visible } = useReveal(0.2);
  return (
    <section
      ref={ref}
      className="py-16 px-4 relative overflow-hidden"
      style={{ background: '#0D2B1A' }}
    >
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)', backgroundSize: '20px 20px' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"
        style={{ background: 'radial-gradient(ellipse at 100% 0%, #B85C38, transparent 70%)' }} />
      <div
        className="relative z-10 max-w-xl mx-auto text-center transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)' }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: '#C8A84B' }}>
          — Ne manquez rien
        </p>
        <h3 className="text-2xl md:text-3xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
          Abonnez-vous pour suivre <span style={{ color: '#C8A84B' }}>{sectionLabel}</span>
        </h3>
        <p className="text-white/40 text-sm mb-8">
          Les actualités du secteur directement dans votre boîte mail.
        </p>
        <Link
          href="/actualites#newsletter"
          className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full text-white transition-all hover:shadow-xl active:scale-95"
          style={{ background: '#B85C38' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
          onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
        >
          S&apos;abonner gratuitement <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}












// // src/app/(front-office)/secteurs/[slug]/page.tsx
// 'use client';

// import React, { useEffect, useState, useCallback } from 'react';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import {
//   ExternalLink, Calendar, ChevronLeft, ChevronRight,
//   Loader2, Search, ArrowLeft, Tag, Layers,
// } from 'lucide-react';
// import api from '@/lib/api';

// // ─── Types ───────────────────────────────────────────────────────────────────

// interface Magazine {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt?: string | null;
//   coverImage: string | null;
//   source: string;
//   publishedAt: string;
// }

// interface PaginationMeta {
//   total: number;
//   page: number;
//   pageSize: number;
//   totalPages: number;
// }

// // ─── Secteur metadata (labels, descriptions, couleur d'accent) ──────────────

// // ─── Source de vérité unique des slugs ───────────────────────────────────────
// // Ces clés DOIVENT correspondre exactement aux slugs utilisés dans le Footer
// // et dans megaMenuData (SubBar) : 'voyages-affaires', 'mice-evenements', 'tourisme-durable'.

// const SECTEUR_META: Record<
//   string,
//   { label: string; description: string; accent: string; emoji: string }
// > = {
//   hotellerie: {
//     label: 'Hôtellerie',
//     description:
//       'Actualités, tendances et analyses du secteur hôtelier en Afrique et dans le monde.',
//     accent: '#1A56DB',
//     emoji: '🏨',
//   },
//   transport: {
//     label: 'Transport',
//     description:
//       'Tout sur le transport aérien, ferroviaire et routier dédié au tourisme.',
//     accent: '#0E9F6E',
//     emoji: '✈️',
//   },
//   restauration: {
//     label: 'Restauration',
//     description:
//       'Gastronomie africaine et mondiale, actualités culinaires et chefs.',
//     accent: '#E3A008',
//     emoji: '🍽️',
//   },
//   'voyages-affaires': {
//     label: "Voyages d'Affaires",
//     description:
//       'MICE, voyages corporate, réunions internationales et tendances business travel.',
//     accent: '#7E3AF2',
//     emoji: '💼',
//   },
//   'mice-evenements': {
//     label: 'MICE & Événements',
//     description:
//       'Congrès, salons, incentives et événements professionnels à travers le monde.',
//     accent: '#E74694',
//     emoji: '🎪',
//   },
//   divertissement: {
//     label: 'Divertissement',
//     description:
//       'Parcs, attractions, culture, festivals et loisirs liés au tourisme.',
//     accent: '#F05252',
//     emoji: '🎭',
//   },
//   'tourisme-durable': {
//     label: 'Tourisme Durable',
//     description:
//       'Éco-tourisme, développement responsable et tourisme vert en Afrique.',
//     accent: '#31C48D',
//     emoji: '🌿',
//   },
// };

// const PAGE_SIZE = 9;

// // ─── Skeleton card ───────────────────────────────────────────────────────────

// function SkeletonCard() {
//   return (
//     <div className="flex flex-col rounded-xl overflow-hidden border border-gray-100 bg-white animate-pulse">
//       <div className="aspect-[3/4] bg-gray-100" />
//       <div className="p-4 space-y-2">
//         <div className="h-3 bg-gray-100 rounded w-full" />
//         <div className="h-3 bg-gray-100 rounded w-2/3" />
//         <div className="h-2.5 bg-gray-50 rounded w-1/3 mt-3" />
//       </div>
//     </div>
//   );
// }

// // ─── Magazine card ────────────────────────────────────────────────────────────

// function MagazineCard({ mag }: { mag: Magazine }) {
//   return (
//     <Link
//       href={`/magazine/${mag.slug}`}
//       className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 active:scale-[0.98]"
//     >
//       <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
//         <img
//           src={mag.coverImage || '/images/magazine-placeholder.jpg'}
//           alt={mag.title}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//         />
//         <div className="absolute top-2.5 left-2.5">
//           <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
//             {mag.source}
//           </span>
//         </div>
//       </div>
//       <div className="p-3 sm:p-4 flex flex-col flex-1">
//         <h3 className="font-bold text-[#001A4D] text-[12px] sm:text-[14px] leading-snug mb-2 line-clamp-2 group-hover:text-[#F39C12] transition-colors flex-1">
//           {mag.title}
//         </h3>
//         {mag.excerpt && (
//           <p className="hidden sm:block text-gray-500 text-[12px] line-clamp-2 mb-3 leading-relaxed">
//             {mag.excerpt}
//           </p>
//         )}
//         <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
//           <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400">
//             <Calendar size={10} />
//             <span>
//               {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
//                 day: 'numeric', month: 'short', year: 'numeric',
//               })}
//             </span>
//           </div>
//           <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#F39C12]">
//             Lire <ExternalLink size={9} />
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // ─── Main page ────────────────────────────────────────────────────────────────

// export default function SecteurPage() {
//   const { slug } = useParams<{ slug: string }>();
//   const meta = SECTEUR_META[slug] ?? {
//     label: slug.charAt(0).toUpperCase() + slug.slice(1),
//     description: `Actualités du secteur ${slug}.`,
//     accent: '#001A4D',
//     emoji: '📰',
//   };

//   const [magazines, setMagazines]     = useState<Magazine[]>([]);
//   const [pagination, setPagination]   = useState<PaginationMeta | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [query, setQuery]             = useState('');
//   const [draftQuery, setDraftQuery]   = useState('');
//   const [loading, setLoading]         = useState(true);
//   const [pageLoading, setPageLoading] = useState(false);

//   // Fetch
//   const fetchMagazines = useCallback(
//     async (page: number, search: string) => {
//       page === 1 && !search ? setLoading(true) : setPageLoading(true);
//       try {
//         const res = await api.get('/magazines/rss', {
//           params: {
//             category: slug,
//             pageSize: PAGE_SIZE,
//             page,
//             ...(search ? { search } : {}),
//           },
//         });
//         setMagazines(res.data?.data?.magazines ?? []);
//         setPagination(res.data?.data?.pagination ?? null);
//       } catch (err) {
//         console.error('Erreur chargement secteur:', err);
//       } finally {
//         setLoading(false);
//         setPageLoading(false);
//       }
//     },
//     [slug],
//   );

//   useEffect(() => { fetchMagazines(1, ''); }, [fetchMagazines]);

//   const handleSearch = () => {
//     setQuery(draftQuery);
//     setCurrentPage(1);
//     fetchMagazines(1, draftQuery);
//   };

//   const handlePageChange = (page: number) => {
//     if (!pagination || page < 1 || page > pagination.totalPages) return;
//     setCurrentPage(page);
//     fetchMagazines(page, query);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const totalPages = pagination?.totalPages ?? 1;

//   const getPageNumbers = (): (number | '...')[] => {
//     if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
//     const pages: (number | '...')[] = [1];
//     if (currentPage > 3) pages.push('...');
//     for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
//       pages.push(i);
//     }
//     if (currentPage < totalPages - 2) pages.push('...');
//     pages.push(totalPages);
//     return pages;
//   };

//   return (
//     <main className="min-h-screen bg-[#F8FAFC]">

//       {/* ── Hero banner ──────────────────────────────────────────────────── */}
//       <div
//         className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6"
//         style={{
//           background: `linear-gradient(135deg, #001A4D 0%, ${meta.accent} 100%)`,
//         }}
//       >
//         <div className="max-w-[1400px] mx-auto">

//           {/* Breadcrumb */}
//           <div className="flex items-center gap-2 mb-6 text-white/60 text-[11px] font-semibold uppercase tracking-wider">
//             <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
//             <span>/</span>
//             <Link href="/secteurs" className="hover:text-white transition-colors">Secteurs</Link>
//             <span>/</span>
//             <span className="text-white">{meta.label}</span>
//           </div>

//           <div className="flex flex-col sm:flex-row sm:items-end gap-6">
//             <div className="flex-1">
//               <div className="text-5xl sm:text-6xl mb-4">{meta.emoji}</div>
//               <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight leading-tight mb-3">
//                 {meta.label}
//               </h1>
//               <p className="text-white/70 text-sm sm:text-base max-w-xl leading-relaxed">
//                 {meta.description}
//               </p>
//             </div>

//             {/* Stats badge */}
//             {pagination && (
//               <div className="shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-center">
//                 <p className="text-white text-3xl font-extrabold">{pagination.total}</p>
//                 <p className="text-white/60 text-[11px] uppercase tracking-widest font-bold mt-1">
//                   Article{pagination.total > 1 ? 's' : ''}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Search bar */}
//           <div className="mt-8 flex gap-2 max-w-xl">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
//               <input
//                 type="text"
//                 placeholder={`Rechercher dans ${meta.label}…`}
//                 value={draftQuery}
//                 onChange={(e) => setDraftQuery(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                 className="w-full pl-10 pr-4 py-3 rounded-xl border-0 bg-white shadow-sm text-sm outline-none focus:ring-2 focus:ring-white/40 transition"
//               />
//             </div>
//             <button
//               onClick={handleSearch}
//               className="px-5 py-3 bg-[#F39C12] hover:bg-[#D97706] text-white font-bold rounded-xl transition-colors text-sm"
//             >
//               Chercher
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Retour + filtres rapides ──────────────────────────────────────── */}
//       <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
//         <Link
//           href="/actualites"
//           className="flex items-center gap-1.5 text-[#001A4D] text-[12px] font-bold hover:text-[#F39C12] transition-colors"
//         >
//           <ArrowLeft size={14} />
//           Toutes les actualités
//         </Link>

//         <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
//           <span className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
//             <Layers size={12} /> Autres secteurs :
//           </span>
//           {Object.entries(SECTEUR_META)
//             .filter(([s]) => s !== slug)
//             .map(([s, m]) => (
//               <Link
//                 key={s}
//                 href={`/secteurs/${s}`}
//                 className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-semibold text-gray-600 hover:bg-[#001A4D] hover:text-white hover:border-[#001A4D] transition-all"
//               >
//                 <span>{m.emoji}</span> {m.label}
//               </Link>
//             ))}
//         </div>
//       </div>

//       {/* ── Grille magazines ─────────────────────────────────────────────── */}
//       <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-16">

//         {loading ? (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
//             {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
//           </div>
//         ) : magazines.length === 0 ? (
//           <div className="py-24 text-center">
//             <Tag size={48} className="text-gray-200 mx-auto mb-4" />
//             <p className="text-gray-400 text-sm italic">
//               {query
//                 ? `Aucun résultat pour « ${query} » dans ce secteur.`
//                 : 'Aucune actualité disponible dans ce secteur pour le moment.'}
//             </p>
//             {query && (
//               <button
//                 onClick={() => { setDraftQuery(''); setQuery(''); fetchMagazines(1, ''); }}
//                 className="mt-4 px-4 py-2 bg-[#001A4D] text-white text-xs font-bold rounded-lg"
//               >
//                 Voir toutes les actualités
//               </button>
//             )}
//           </div>
//         ) : (
//           <div
//             className={`relative transition-opacity duration-200 ${pageLoading ? 'opacity-40 pointer-events-none' : ''}`}
//           >
//             {pageLoading && (
//               <div className="absolute inset-0 flex items-center justify-center z-10">
//                 <Loader2 className="animate-spin text-[#001A4D]" size={32} />
//               </div>
//             )}
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
//               {magazines.map((mag) => <MagazineCard key={mag.id} mag={mag} />)}
//             </div>
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading && totalPages > 1 && (
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
//             <p className="text-xs text-gray-400 order-2 sm:order-1">
//               Page {currentPage} sur {totalPages} — {pagination?.total ?? 0} article
//               {(pagination?.total ?? 0) > 1 ? 's' : ''}
//             </p>
//             <div className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                 aria-label="Page précédente"
//               >
//                 <ChevronLeft size={15} />
//               </button>
//               {getPageNumbers().map((page, idx) =>
//                 page === '...' ? (
//                   <span key={`dots-${idx}`} className="px-1.5 text-gray-400 text-sm select-none">…</span>
//                 ) : (
//                   <button
//                     key={page}
//                     onClick={() => handlePageChange(page as number)}
//                     className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
//                       currentPage === page
//                         ? 'bg-[#001A4D] text-white shadow-md'
//                         : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ),
//               )}
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                 aria-label="Page suivante"
//               >
//                 <ChevronRight size={15} />
//               </button>
//             </div>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }