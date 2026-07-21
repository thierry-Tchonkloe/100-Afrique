// src/components/news/LatestNewsCarousel.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Loader2, ExternalLink, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface LatestNewsCarouselProps {
  searchFilters?: {
    query: string;
    region: string;
    country: string;
    topic: string;
  };
}

const PAGE_SIZE = 6;

// ─── Hook reveal ─────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Carte mobile ─────────────────────────────────────────────────────────────

function CarouselCard({ mag, delay = 0 }: { mag: Magazine; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-600"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
      }}
    >
      <Link
        href={`/magazine/${mag.slug}`}
        className="group block relative overflow-hidden rounded-2xl active:scale-[0.98] transition-transform duration-150"
        style={{ aspectRatio: '3/4' }}
      >
        {/* Image + overlay */}
        <div className="absolute inset-0">
          <img
            src={mag.coverImage || '/images/magazine-placeholder.jpg'}
            alt={mag.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.55) 45%, rgba(0,0,0,0.08) 100%)',
            }}
          />
        </div>

        {/* Badge source */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
          style={{ background: 'rgba(26,92,67,0.9)' }}
        >
          {mag.source}
        </span>

        {/* Contenu bas */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#C8A84B' }}>
            <Clock size={9} />
            {new Date(mag.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <h3 className="font-bold text-[13px] leading-snug line-clamp-2 text-white mb-3 group-hover:text-[#C8A84B] transition-colors">
            {mag.title}
          </h3>
          <div className="border-t pt-2.5" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
            <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: '#B85C38' }}>
              Lire <ExternalLink size={9} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Pagination compacte ──────────────────────────────────────────────────────

function CompactPagination({
  currentPage,
  totalPages,
  total,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
}) {
  const getPages = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-3 pt-6 border-t border-gray-100">
      <p className="text-xs text-gray-400">
        Page {currentPage} / {totalPages} — {total} résultat{total > 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        {getPages().map((page, idx) =>
          page === '...' ? (
            <span key={`dots-${idx}`} className="px-1 text-gray-400 text-sm select-none">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const LatestNewsCarousel = ({ searchFilters }: LatestNewsCarouselProps) => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    currentPage === 1 ? setLoading(true) : setPageLoading(true);
    setError(null);
    api.get('/magazines/rss', {
      params: {
        pageSize: PAGE_SIZE, page: currentPage,
        ...(searchFilters?.query && { search: searchFilters.query }),
        ...(searchFilters?.region && { region: searchFilters.region }),
        ...(searchFilters?.country && { country: searchFilters.country }),
        ...(searchFilters?.topic && { topic: searchFilters.topic }),
      },
    })
      .then((res) => { setMagazines(res.data?.data?.magazines ?? []); setMeta(res.data?.data?.pagination ?? null); })
      .catch((err: any) => setError(err.message || 'Erreur de chargement'))
      .finally(() => { setLoading(false); setPageLoading(false); });
  }, [currentPage, searchFilters]);

  useEffect(() => { setCurrentPage(1); }, [searchFilters]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > (meta?.totalPages ?? 1)) return;
    setCurrentPage(page);
    document.getElementById('carousel-magazines-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="animate-spin" style={{ color: '#1A5C43' }} />
        <p className="text-xs uppercase tracking-widest font-semibold text-gray-400 animate-pulse">Chargement…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-sm text-gray-500">{error}</p>
        <button
          onClick={() => { setCurrentPage(1); setError(null); }}
          className="px-6 py-2.5 text-white text-sm font-bold rounded-full transition-colors"
          style={{ background: '#1A5C43' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!magazines.length) {
    return (
      <div className="py-16 text-center space-y-2">
        <p className="text-gray-500 font-medium text-sm">Aucun magazine trouvé</p>
        <p className="text-gray-400 text-xs">
          {searchFilters?.query || searchFilters?.region || searchFilters?.country || searchFilters?.topic
            ? 'Essayez de modifier vos filtres.'
            : "Aucun magazine n'est disponible pour le moment."}
        </p>
      </div>
    );
  }

  return (
    <div id="carousel-magazines-section" className="space-y-8">
      <div className={`relative transition-opacity duration-200 ${pageLoading ? 'opacity-40 pointer-events-none' : ''}`}>
        {pageLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Loader2 size={24} className="animate-spin" style={{ color: '#1A5C43' }} />
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {magazines.map((mag, i) => (
            <CarouselCard key={mag.id} mag={mag} delay={i * 50} />
          ))}
        </div>
      </div>

      {(meta?.totalPages ?? 1) > 1 && (
        <CompactPagination
          currentPage={currentPage}
          totalPages={meta?.totalPages ?? 1}
          total={meta?.total ?? 0}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default LatestNewsCarousel;
