// src/components/destinations/DestinationGrid.tsx
"use client";

import React from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { LocaleMark } from '@/components/icons/CustomIcons';
import { useReveal } from '@/hooks/useReveal';
import { useDestinationsList } from './grid/useDestinationsList';
import DestinationGridCard from './grid/DestinationGridCard';
import DestinationGridFilterBar from './grid/DestinationGridFilterBar';

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-gray-200 animate-pulse" style={{ aspectRatio: '4/3' }} />
      ))}
    </div>
  );
}

const DestinationGrid = () => {
  const {
    destinations, filter, searchQuery, loading, hasMore, regionFilter,
    setSearchQuery, clearRegionFilter, handleContinentClick, loadMore,
  } = useDestinationsList();

  const { ref: headingRef, visible: headingVisible } = useReveal<HTMLDivElement>(0.1);
  const { ref: filterRef,  visible: filterVisible  } = useReveal<HTMLDivElement>(0.05);
  const { ref: gridRef,    visible: gridVisible    } = useReveal<HTMLDivElement>(0.03);

  return (
    <section className="py-12 sm:py-16 px-5 sm:px-6" style={{ background: '#F7F9F8' }}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Heading */}
        <div
          ref={headingRef}
          className="flex items-center gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-gray-200 transition-all duration-700"
          style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? 'none' : 'translateY(20px)' }}
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#1A5C43' }}>
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

        {/* Filtres */}
        <div
          ref={filterRef}
          className="space-y-3 transition-all duration-700"
          style={{ opacity: filterVisible ? 1 : 0, transform: filterVisible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <DestinationGridFilterBar
            filter={filter}
            searchQuery={searchQuery}
            loading={loading}
            regionFilter={regionFilter}
            destinationsCount={destinations.length}
            onSearchChange={setSearchQuery}
            onContinentClick={handleContinentClick}
            onClearRegion={clearRegionFilter}
          />
        </div>

        {/* Grille */}
        <div ref={gridRef}>
          {loading && destinations.length === 0 ? (
            <Skeleton />
          ) : destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {destinations.map((dest, i) => (
                <DestinationGridCard key={dest.id} dest={dest} delay={Math.min(i, 7) * 70} />
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

        {/* Voir plus */}
        {hasMore && destinations.length > 0 && (
          <div className="flex justify-center pt-2">
            <button
              onClick={loadMore}
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