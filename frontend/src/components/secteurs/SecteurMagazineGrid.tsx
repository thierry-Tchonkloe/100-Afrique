// src/components/secteurs/SecteurMagazineGrid.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { Clock, ExternalLink, X } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import Pagination from '@/components/shared/Pagination';
import type { SecteurMagazine } from './useSecteurMagazines';

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

function MagazineCard({ mag, delay = 0 }: { mag: SecteurMagazine; delay?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
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

interface SecteurMagazineGridProps {
  magazines: SecteurMagazine[];
  loading: boolean;
  pageLoading: boolean;
  query: string;
  currentPage: number;
  totalPages: number;
  total: number;
  onClearSearch: () => void;
  onPageChange: (page: number) => void;
}

const PAGE_SIZE = 9;

const SecteurMagazineGrid = ({
  magazines, loading, pageLoading, query,
  currentPage, totalPages, total,
  onClearSearch, onPageChange,
}: SecteurMagazineGridProps) => (
  <>
    {/* Filtre actif */}
    {query && (
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm text-gray-500">Résultats pour</span>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
          style={{ background: 'rgba(26,92,67,0.08)', color: '#1A5C43', border: '1px solid rgba(26,92,67,0.15)' }}
        >
          «&nbsp;{query}&nbsp;»
          <button onClick={onClearSearch} className="hover:text-[#B85C38] transition-colors ml-0.5">
            <X size={11} />
          </button>
        </span>
        {total > 0 && <span className="text-xs text-gray-400">— {total} résultat{total > 1 ? 's' : ''}</span>}
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
            onClick={onClearSearch}
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
            <div
              className="animate-spin rounded-full"
              style={{ width: 28, height: 28, border: '3px solid rgba(26,92,67,0.2)', borderTopColor: '#1A5C43' }}
            />
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {magazines.map((mag, i) => <MagazineCard key={mag.id} mag={mag} delay={i * 35} />)}
        </div>
      </div>
    )}

    {/* Pagination */}
    {!loading && totalPages > 1 && (
      <Pagination currentPage={currentPage} totalPages={totalPages} total={total} onPageChange={onPageChange} />
    )}
  </>
);

export default SecteurMagazineGrid;