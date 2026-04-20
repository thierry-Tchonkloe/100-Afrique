'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ExternalLink, Calendar, ChevronLeft, ChevronRight,
  Loader2, Search, ArrowLeft, Tag, Layers,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Secteur metadata (labels, descriptions, couleur d'accent) ──────────────

// ─── Source de vérité unique des slugs ───────────────────────────────────────
// Ces clés DOIVENT correspondre exactement aux slugs utilisés dans le Footer
// et dans megaMenuData (SubBar) : 'voyages-affaires', 'mice-evenements', 'tourisme-durable'.

const SECTEUR_META: Record<
  string,
  { label: string; description: string; accent: string; emoji: string }
> = {
  hotellerie: {
    label: 'Hôtellerie',
    description:
      'Actualités, tendances et analyses du secteur hôtelier en Afrique et dans le monde.',
    accent: '#1A56DB',
    emoji: '🏨',
  },
  transport: {
    label: 'Transport',
    description:
      'Tout sur le transport aérien, ferroviaire et routier dédié au tourisme.',
    accent: '#0E9F6E',
    emoji: '✈️',
  },
  restauration: {
    label: 'Restauration',
    description:
      'Gastronomie africaine et mondiale, actualités culinaires et chefs.',
    accent: '#E3A008',
    emoji: '🍽️',
  },
  'voyages-affaires': {
    label: "Voyages d'Affaires",
    description:
      'MICE, voyages corporate, réunions internationales et tendances business travel.',
    accent: '#7E3AF2',
    emoji: '💼',
  },
  'mice-evenements': {
    label: 'MICE & Événements',
    description:
      'Congrès, salons, incentives et événements professionnels à travers le monde.',
    accent: '#E74694',
    emoji: '🎪',
  },
  divertissement: {
    label: 'Divertissement',
    description:
      'Parcs, attractions, culture, festivals et loisirs liés au tourisme.',
    accent: '#F05252',
    emoji: '🎭',
  },
  'tourisme-durable': {
    label: 'Tourisme Durable',
    description:
      'Éco-tourisme, développement responsable et tourisme vert en Afrique.',
    accent: '#31C48D',
    emoji: '🌿',
  },
};

const PAGE_SIZE = 9;

// ─── Skeleton card ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-gray-100 bg-white animate-pulse">
      <div className="aspect-[3/4] bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-2.5 bg-gray-50 rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}

// ─── Magazine card ────────────────────────────────────────────────────────────

function MagazineCard({ mag }: { mag: Magazine }) {
  return (
    <Link
      href={`/magazine/${mag.slug}`}
      className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 active:scale-[0.98]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={mag.coverImage || '/images/magazine-placeholder.jpg'}
          alt={mag.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
            {mag.source}
          </span>
        </div>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-bold text-[#001A4D] text-[12px] sm:text-[14px] leading-snug mb-2 line-clamp-2 group-hover:text-[#F39C12] transition-colors flex-1">
          {mag.title}
        </h3>
        {mag.excerpt && (
          <p className="hidden sm:block text-gray-500 text-[12px] line-clamp-2 mb-3 leading-relaxed">
            {mag.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400">
            <Calendar size={10} />
            <span>
              {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#F39C12]">
            Lire <ExternalLink size={9} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SecteurPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = SECTEUR_META[slug] ?? {
    label: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: `Actualités du secteur ${slug}.`,
    accent: '#001A4D',
    emoji: '📰',
  };

  const [magazines, setMagazines]     = useState<Magazine[]>([]);
  const [pagination, setPagination]   = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery]             = useState('');
  const [draftQuery, setDraftQuery]   = useState('');
  const [loading, setLoading]         = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  // Fetch
  const fetchMagazines = useCallback(
    async (page: number, search: string) => {
      page === 1 && !search ? setLoading(true) : setPageLoading(true);
      try {
        const res = await api.get('/magazines/rss', {
          params: {
            category: slug,
            pageSize: PAGE_SIZE,
            page,
            ...(search ? { search } : {}),
          },
        });
        setMagazines(res.data?.data?.magazines ?? []);
        setPagination(res.data?.data?.pagination ?? null);
      } catch (err) {
        console.error('Erreur chargement secteur:', err);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    },
    [slug],
  );

  useEffect(() => { fetchMagazines(1, ''); }, [fetchMagazines]);

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

  const totalPages = pagination?.totalPages ?? 1;

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
    <main className="min-h-screen bg-[#F8FAFC]">

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div
        className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6"
        style={{
          background: `linear-gradient(135deg, #001A4D 0%, ${meta.accent} 100%)`,
        }}
      >
        <div className="max-w-[1400px] mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-white/60 text-[11px] font-semibold uppercase tracking-wider">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/secteurs" className="hover:text-white transition-colors">Secteurs</Link>
            <span>/</span>
            <span className="text-white">{meta.label}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="flex-1">
              <div className="text-5xl sm:text-6xl mb-4">{meta.emoji}</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight leading-tight mb-3">
                {meta.label}
              </h1>
              <p className="text-white/70 text-sm sm:text-base max-w-xl leading-relaxed">
                {meta.description}
              </p>
            </div>

            {/* Stats badge */}
            {pagination && (
              <div className="shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-center">
                <p className="text-white text-3xl font-extrabold">{pagination.total}</p>
                <p className="text-white/60 text-[11px] uppercase tracking-widest font-bold mt-1">
                  Article{pagination.total > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Search bar */}
          <div className="mt-8 flex gap-2 max-w-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder={`Rechercher dans ${meta.label}…`}
                value={draftQuery}
                onChange={(e) => setDraftQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 bg-white shadow-sm text-sm outline-none focus:ring-2 focus:ring-white/40 transition"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-5 py-3 bg-[#F39C12] hover:bg-[#D97706] text-white font-bold rounded-xl transition-colors text-sm"
            >
              Chercher
            </button>
          </div>
        </div>
      </div>

      {/* ── Retour + filtres rapides ──────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Link
          href="/actualites"
          className="flex items-center gap-1.5 text-[#001A4D] text-[12px] font-bold hover:text-[#F39C12] transition-colors"
        >
          <ArrowLeft size={14} />
          Toutes les actualités
        </Link>

        <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
          <span className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
            <Layers size={12} /> Autres secteurs :
          </span>
          {Object.entries(SECTEUR_META)
            .filter(([s]) => s !== slug)
            .map(([s, m]) => (
              <Link
                key={s}
                href={`/secteurs/${s}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-semibold text-gray-600 hover:bg-[#001A4D] hover:text-white hover:border-[#001A4D] transition-all"
              >
                <span>{m.emoji}</span> {m.label}
              </Link>
            ))}
        </div>
      </div>

      {/* ── Grille magazines ─────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-16">

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : magazines.length === 0 ? (
          <div className="py-24 text-center">
            <Tag size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm italic">
              {query
                ? `Aucun résultat pour « ${query} » dans ce secteur.`
                : 'Aucune actualité disponible dans ce secteur pour le moment.'}
            </p>
            {query && (
              <button
                onClick={() => { setDraftQuery(''); setQuery(''); fetchMagazines(1, ''); }}
                className="mt-4 px-4 py-2 bg-[#001A4D] text-white text-xs font-bold rounded-lg"
              >
                Voir toutes les actualités
              </button>
            )}
          </div>
        ) : (
          <div
            className={`relative transition-opacity duration-200 ${pageLoading ? 'opacity-40 pointer-events-none' : ''}`}
          >
            {pageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-[#001A4D]" size={32} />
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {magazines.map((mag) => <MagazineCard key={mag.id} mag={mag} />)}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 order-2 sm:order-1">
              Page {currentPage} sur {totalPages} — {pagination?.total ?? 0} article
              {(pagination?.total ?? 0) > 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Page précédente"
              >
                <ChevronLeft size={15} />
              </button>
              {getPageNumbers().map((page, idx) =>
                page === '...' ? (
                  <span key={`dots-${idx}`} className="px-1.5 text-gray-400 text-sm select-none">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-[#001A4D] text-white shadow-md'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Page suivante"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}