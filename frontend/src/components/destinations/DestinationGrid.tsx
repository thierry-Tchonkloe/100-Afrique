// src/components/destinations/DestinationGrid.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, FileText, ChevronDown, SlidersHorizontal, Loader2 } from 'lucide-react';
import { LocaleMark } from '@/components/icons/CustomIcons';
import { AxiosError } from 'axios';
import api from '@/lib/api';

interface Destination {
  id: number;
  name: string;
  slug: string;
  description?: string;
  coverImage: string;
  continent?: string;
  articleCount?: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    data: Destination[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      pageSize: number;
    };
  };
}

// ─── Hook reveal ──────────────────────────────────────────────────────────────

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

// ─── Carte destination — style ReportageGrid ──────────────────────────────────

function DestinationCard({ dest, delay = 0 }: { dest: Destination; delay?: number }) {
  const { ref, visible } = useReveal(0.06);
  const [hovered, setHovered] = useState(false);
  const isTouch = useIsTouchDevice();
  const overlayVisible = isTouch || hovered;

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
        href={`/destinations/${dest.slug}`}
        className="group block relative overflow-hidden rounded-2xl active:scale-[0.98] transition-transform duration-150"
        style={{ aspectRatio: '4/3' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="absolute inset-0">
          <Image
            src={dest.coverImage || '/images/placeholder-dest.jpg'}
            alt={dest.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Dégradé de base */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.45) 50%, rgba(0,0,0,0.05) 100%)' }}
          />
        </div>

        {/* Badge continent */}
        {dest.continent && (
          <span
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm z-10"
            style={{ background: 'rgba(26,92,67,0.88)' }}
          >
            <LocaleMark size={12} />
            <span className="hidden sm:inline">{dest.continent}</span>
          </span>
        )}

        {/* ── Overlay hover émeraude ── */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5 transition-opacity duration-300 z-10"
          style={{
            background: 'linear-gradient(to top, rgba(26,92,67,0.97) 0%, rgba(26,92,67,0.60) 55%, transparent 100%)',
            opacity: overlayVisible ? 1 : 0,
          }}
        >
          <h3 className="font-bold text-base sm:text-lg leading-tight text-white mb-1 uppercase tracking-wide">
            {dest.name}
          </h3>
          {dest.description && (
            <p className="hidden sm:block text-white/75 text-[11px] leading-relaxed line-clamp-2 mb-2">
              {dest.description}
            </p>
          )}
          <div className="border-t pt-2.5" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
            <span className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: '#C8A84B' }}>
              <FileText size={9} />
              {dest.articleCount ?? 0} articles &amp; vidéos
            </span>
          </div>
        </div>

        {/* ── État par défaut ── */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 transition-opacity duration-300 z-10"
          style={{ opacity: overlayVisible ? 0 : 1 }}
        >
          <h3 className="font-bold text-base sm:text-lg leading-tight text-white uppercase tracking-wide mb-1">
            {dest.name}
          </h3>
          <p className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em' }}>
            {dest.articleCount ?? 0} articles &amp; vidéos
          </p>
        </div>
      </Link>
    </div>
  );
}

// ─── Squelette ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-gray-200 animate-pulse" style={{ aspectRatio: '4/3' }} />
      ))}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const CONTINENTS = ['TOUTES', 'AFRIQUE', 'EUROPE', 'AMÉRIQUES', 'ASIE/MOYEN-ORIENT', 'OCÉANIE'];

const DestinationGrid = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filter, setFilter]             = useState('TOUTES');
  const [searchQuery, setSearchQuery]   = useState('');
  const [loading, setLoading]           = useState(false);
  const [page, setPage]                 = useState(1);
  const [hasMore, setHasMore]           = useState(true);

  const { ref: headingRef, visible: headingVisible } = useReveal(0.1);
  const { ref: filterRef,  visible: filterVisible  } = useReveal(0.05);
  const { ref: gridRef,    visible: gridVisible    } = useReveal(0.03);

  const fetchDestinations = useCallback(async (isNewFilter = false) => {
    if (loading) return;
    try {
      setLoading(true);
      const currentPage = isNewFilter ? 1 : page;
      const response = await api.get<ApiResponse>('/destinations', {
        params: {
          continent: filter !== 'TOUTES' ? filter : undefined,
          search: searchQuery || undefined,
          page: currentPage,
          pageSize: 8,
          status: 'PUBLISHED',
        },
      });
      const apiData = response.data.data;
      const newDestinations = apiData.data || [];
      const pagination = apiData.pagination;

      if (isNewFilter) {
        setDestinations(newDestinations);
        setPage(2);
      } else {
        setDestinations((prev) => [...prev, ...newDestinations]);
        setPage((prev) => prev + 1);
      }
      setHasMore(pagination ? pagination.currentPage < pagination.totalPages : newDestinations.length >= 8);
    } catch (error) {
      if (error instanceof AxiosError) console.error('Erreur destinations:', error.response?.data || error.message);
      if (isNewFilter) setDestinations([]);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchQuery, page]);

  useEffect(() => {
    const t = setTimeout(() => fetchDestinations(true), 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchQuery]);

  return (
    <section className="py-12 sm:py-16 px-5 sm:px-6" style={{ background: '#F7F9F8' }}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Heading ── */}
        <div
          ref={headingRef as React.RefCallback<HTMLDivElement>}
          className="flex items-center gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-gray-200 transition-all duration-700"
          style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? 'none' : 'translateY(20px)' }}
        >
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#1A5C43' }}
          >
            <LocaleMark size={32} className="shrink-0 text-white" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: '#B85C38' }}>
              — Explorer
            </p>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}>
              Toutes les <span style={{ color: '#1A5C43' }}>destinations</span>
            </h2>
          </div>
        </div>

        {/* ── Barre filtres compacte ── */}
        <div
          ref={filterRef as React.RefCallback<HTMLDivElement>}
          className="transition-all duration-700"
          style={{ opacity: filterVisible ? 1 : 0, transform: filterVisible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Ligne 1 — recherche + filtre tri */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <SlidersHorizontal size={14} style={{ color: '#1A5C43' }} />
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none transition-all focus:border-[#1A5C43] disabled:opacity-50"
                />
              </div>
              {!loading && destinations.length > 0 && (
                <span className="ml-auto text-[10px] font-medium text-gray-400 shrink-0">
                  {destinations.length} destination{destinations.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Ligne 2 — pills continents scrollables */}
            <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {CONTINENTS.map((c) => {
                const isActive = filter === c;
                return (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    disabled={loading}
                    className="shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: isActive ? '#1A5C43' : 'rgba(0,0,0,0.04)',
                      color: isActive ? '#fff' : '#6B7280',
                      boxShadow: isActive ? '0 2px 8px rgba(26,92,67,0.3)' : 'none',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(26,92,67,0.08)'; e.currentTarget.style.color = '#1A5C43'; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#6B7280'; } }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Grille ── */}
        <div ref={gridRef as React.RefCallback<HTMLDivElement>}>
          {loading && destinations.length === 0 ? (
            <Skeleton />
          ) : destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {destinations.map((dest, i) => (
                <DestinationCard key={dest.id} dest={dest} delay={Math.min(i, 7) * 70} />
              ))}
            </div>
          ) : (
            <div
              className="py-16 text-center rounded-2xl border border-dashed border-gray-200"
              style={{ background: '#F7F9F8' }}
            >
              <p className="text-gray-400 text-sm">Aucune destination ne correspond à vos critères.</p>
            </div>
          )}
        </div>

        {/* ── Voir plus ── */}
        {hasMore && destinations.length > 0 && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => fetchDestinations(false)}
              disabled={loading}
              className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-[0.2em] px-10 py-4 rounded-full text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#1A5C43' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#B85C38'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1A5C43'; }}
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={14} /> Chargement...</>
              ) : (
                <><ChevronDown size={14} /> Voir plus de destinations</>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DestinationGrid;
