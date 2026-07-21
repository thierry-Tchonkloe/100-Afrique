// src/components/news/LatestNews.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Play, Handshake, Loader2, ExternalLink,
  ChevronLeft, ChevronRight, Clock, ArrowRight,
  BookOpen, Newspaper, Filter,
} from 'lucide-react';
import api from '@/lib/api';
import { AdvertisingBanner } from '@/components/AdvertisingBanner';
import MagazineImage from '@/components/shared/MagazineImage';
import type { Magazine, SidebarArticle } from '@/lib/server-data';

interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const PAGE_SIZE = 9;

// ─── Hook reveal ─────────────────────────────────────────────────────────────

function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;

    // Fallback : si le ref n'est pas encore attaché, forcer visible après 100ms
    if (!el) {
      const t = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(t);
    }

    // Fallback : déjà dans le viewport au montage
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Heading ──────────────────────────────────────────────────────────────────

function SectionHeading({
  total,
}: {
  total: number | null;
}) {
  return (
    <div
      className="flex items-start justify-between gap-6 flex-wrap pb-7 mb-10 border-b border-gray-100"
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: '#0D2B1A' }}
        >
          <Newspaper size={22} style={{ color: '#C8A84B' }} />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: '#B85C38' }}>
            — Explorer par source
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-none" style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}>
            Toutes les <span style={{ color: '#1A5C43' }}>Actualités</span>
          </h2>
        </div>
      </div>

      {total !== null && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50">
          <Filter size={15} className="text-gray-400" />
          <span className="text-sm text-gray-500">
            {total} article{total > 1 ? 's' : ''} indexé{total > 1 ? 's' : ''}
          </span>
        </div>
      )}
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
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      <Link
        href={`/magazine/${mag.slug}`}
        className="group block relative overflow-hidden rounded-2xl h-full active:scale-[0.98] transition-transform duration-150"
        style={{ aspectRatio: '3/4' }}
      >
        <div className="absolute inset-0">
          <MagazineImage
            src={mag.coverImage}
            alt={mag.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.55) 45%, rgba(0,0,0,0.08) 100%)',
            }}
          />
        </div>

        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
          style={{ background: 'rgba(26,92,67,0.9)' }}
        >
          {mag.source}
        </span>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1.5"
            style={{ color: '#C8A84B' }}
          >
            <Clock size={9} />
            {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </p>
          <h3 className="font-bold text-[13px] sm:text-[14px] leading-snug line-clamp-2 text-white mb-3 group-hover:text-[#C8A84B] transition-colors">
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

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
      <p className="text-xs text-gray-400 order-2 sm:order-1">
        Page {currentPage} sur {totalPages} — {total} résultat{total > 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-1.5 order-1 sm:order-2 flex-wrap justify-center">
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

// ─── Sidebar blocs ────────────────────────────────────────────────────────────

function SidebarInterview({ interview }: { interview: SidebarArticle | null }) {
  if (!interview) return null;
  return (
    <div className="pb-8 border-b border-gray-100">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#B85C38' }}>
        — Interview
      </p>
      <Link href={`/actualites/${interview.slug}`} className="group block">
        <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
          <MagazineImage
            src={interview.coverImage}
            alt={interview.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(10,35,20,0.35)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: '#B85C38', boxShadow: '0 4px 16px rgba(184,92,56,0.4)' }}
            >
              <Play size={18} fill="white" className="text-white ml-0.5" />
            </div>
          </div>
        </div>
        <h4 className="font-bold text-sm leading-snug text-gray-900 line-clamp-2 group-hover:text-[#1A5C43] transition-colors mb-2">
          {interview.title}
        </h4>
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider"
          style={{ color: '#C8A84B' }}
        >
          <BookOpen size={11} /> Lire l&apos;interview
        </span>
      </Link>
    </div>
  );
}

function SidebarAnalyses({ analyses }: { analyses: SidebarArticle[] }) {
  if (!analyses.length) return null;
  return (
    <div className="pb-8 border-b border-gray-100">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: '#B85C38' }}>
        — Décryptage
      </p>
      <h4 className="font-black text-base text-gray-900 mb-5">Analyses</h4>
      <ul className="space-y-5">
        {analyses.map((item) => (
          <li key={item.id}>
            <Link href={`/actualites/${item.slug}`} className="group block">
              <p className="text-[13px] font-bold leading-snug text-gray-800 line-clamp-2 group-hover:text-[#1A5C43] transition-colors mb-1">
                {item.title}
              </p>
              <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                <Clock size={9} />
                {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                {item.readingTime ? ` · ${item.readingTime} min` : ''}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SidebarCTA() {
  return (
    <div
      className="rounded-2xl p-7 text-center relative overflow-hidden"
      style={{ background: '#0D2B1A' }}
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="relative z-10">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: '#1A5C43' }}
        >
          <Handshake size={22} style={{ color: '#C8A84B' }} />
        </div>
        <h4 className="text-white font-black text-base mb-2 leading-tight">
          Vous êtes professionnel ?
        </h4>
        <p className="text-white/50 text-xs mb-6 leading-relaxed">
          Découvrez nos solutions de visibilité et nos partenariats média
        </p>
        <Link
          href="/partenaires"
          className="block font-bold text-xs uppercase tracking-widest py-3 px-5 rounded-full text-white transition-all"
          style={{ background: '#B85C38' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
          onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
        >
          Nos Partenariats →
        </Link>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

interface LatestNewsProps {
  searchFilters?: {
    query: string;
    region: string;
    country: string;
    topic: string;
  };
  /** Données sidebar pré-fetchées côté serveur — plus aucun fetch client ici. */
  sidebarAnalyses: SidebarArticle[];
  sidebarInterview: SidebarArticle | null;
}

const LatestNews = ({ searchFilters, sidebarAnalyses, sidebarInterview }: LatestNewsProps) => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  // ── FIX : le heading est toujours visible dès le montage.
  // L'utilisation de useReveal(0.01) + display:none parent (lg:hidden/lg:block)
  // provoquait une opacity:0 permanente car l'IntersectionObserver ne se
  // déclenchait pas sur un élément initialement masqué par Tailwind.
  // Le heading étant en haut de section, aucune animation reveal n'est nécessaire.

  // Seul fetch client restant : la liste paginée avec filtres dynamiques.
  useEffect(() => {
    currentPage === 1 ? setLoading(true) : setPageLoading(true);
    api
      .get('/magazines/rss', {
        params: {
          pageSize: PAGE_SIZE,
          page: currentPage,
          ...(searchFilters?.query && { search: searchFilters.query }),
          ...(searchFilters?.region && { region: searchFilters.region }),
          ...(searchFilters?.country && { country: searchFilters.country }),
          ...(searchFilters?.topic && { topic: searchFilters.topic }),
        },
      })
      .then((res) => {
        setMagazines(res.data?.data?.magazines ?? []);
        setMeta(res.data?.data?.pagination ?? null);
      })
      .catch(() => {})
      .finally(() => { setLoading(false); setPageLoading(false); });
  }, [currentPage, searchFilters]);

  useEffect(() => { setCurrentPage(1); }, [searchFilters]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > (meta?.totalPages ?? 1)) return;
    setCurrentPage(page);
    document
      .getElementById('magazines-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4">
        <Loader2 size={36} className="animate-spin" style={{ color: '#1A5C43' }} />
        <p className="text-xs uppercase tracking-widest font-semibold text-gray-400 animate-pulse">
          Chargement…
        </p>
      </div>
    );
  }

  return (
    <section id="magazines-section" className="max-w-[1300px] mx-auto px-4 sm:px-6 py-16 md:py-24">

      {/* FIX : SectionHeading sans ref/visible — toujours affiché, jamais opacity:0 */}
      <SectionHeading total={meta?.total ?? null} />

      {/* ── Mobile sidebar ── */}
      <div className="lg:hidden space-y-6 mb-12">
        <div className="rounded-2xl overflow-hidden border border-gray-100">
          <AdvertisingBanner zoneSlug="skyscraper-sidebar" showDots className="w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl p-5">
            <SidebarInterview interview={sidebarInterview} />
          </div>
          <div className="bg-gray-50 rounded-2xl p-5">
            <SidebarAnalyses analyses={sidebarAnalyses} />
          </div>
        </div>
        <SidebarCTA />
      </div>

      {/* ── Layout 3/4 + 1/4 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

        {/* Flux magazines */}
        <div className="lg:col-span-3">
          <div
            className={`relative transition-opacity duration-200 ${
              pageLoading ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            {pageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 size={28} className="animate-spin" style={{ color: '#1A5C43' }} />
              </div>
            )}

            {!magazines.length ? (
              <div className="py-20 text-center">
                <p className="text-gray-400 text-sm">
                  {searchFilters?.query || searchFilters?.region || searchFilters?.country || searchFilters?.topic
                    ? 'Aucune actualité ne correspond à vos critères.'
                    : 'Aucune actualité disponible pour le moment.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {magazines.map((mag, i) => (
                  <MagazineCard key={mag.id} mag={mag} delay={i * 40} />
                ))}
              </div>
            )}
          </div>

          {(meta?.totalPages ?? 1) > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={meta?.totalPages ?? 1}
              total={meta?.total ?? 0}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Sidebar desktop — données SSR, aucun loader */}
        <aside className="hidden lg:flex flex-col gap-8">
          <div className="rounded-2xl overflow-hidden border border-gray-100">
            <AdvertisingBanner zoneSlug="skyscraper-sidebar" showDots className="w-full" />
          </div>
          <SidebarInterview interview={sidebarInterview} />
          <SidebarAnalyses analyses={sidebarAnalyses} />
          <SidebarCTA />
        </aside>
      </div>
    </section>
  );
};

export default LatestNews;
