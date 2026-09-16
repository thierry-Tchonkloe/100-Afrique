// src/components/salons/ReportageGrid.tsx
'use client';

import React from 'react';
import { Loader2, Play } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { useReportages } from './reportages/useReportages';
import ReportageFilterBar from './reportages/ReportageFilterBar';
import ReportageCard from './reportages/ReportageCard';
import { PAGE_SIZE } from './reportages/reportageUtils';

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, n) => (
        <div key={n} className="rounded-2xl bg-gray-200 animate-pulse" style={{ aspectRatio: '16/9' }} />
      ))}
    </div>
  );
}

const ReportageGrid = () => {
  const { reportages, loading, loadingMore, hasMore, filters, setFilters, handleLoadMore } = useReportages();
  const { ref: headingRef, visible: headingVisible } = useReveal<HTMLDivElement>(0.1);

  return (
    <section className="space-y-6 sm:space-y-8">

      {/* Heading */}
      <div
        ref={headingRef}
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

      <ReportageFilterBar filters={filters} onChange={setFilters} disabled={loading} />

      {loading ? (
        <Skeleton />
      ) : reportages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {reportages.map((item, i) => (
            <ReportageCard key={item.id} item={item} delay={i < PAGE_SIZE ? i * 60 : 0} />
          ))}
        </div>
      ) : (
        <div className="py-16 sm:py-20 text-center rounded-2xl border border-dashed border-gray-200" style={{ background: '#F7F9F8' }}>
          <p className="text-gray-400 text-sm">Aucun reportage ne correspond à vos critères de recherche.</p>
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center pt-4 sm:pt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 font-bold text-xs uppercase tracking-[0.2em] px-8 sm:px-12 py-3.5 sm:py-4 rounded-full text-white transition-all shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: '#1A5C43' }}
            onMouseEnter={e => { if (!loadingMore) e.currentTarget.style.background = '#B85C38'; }}
            onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
          >
            {loadingMore ? (
              <><Loader2 size={14} className="animate-spin" /> Chargement...</>
            ) : (
              'Voir plus de reportages'
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default ReportageGrid;