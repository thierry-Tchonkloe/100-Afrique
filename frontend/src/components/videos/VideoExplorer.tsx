// src/components/videos/VideoExplorer.tsx
"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { useVideoExplorer } from './explorer/useVideoExplorer';
import VideoExplorerFilterBar from './explorer/VideoExplorerFilterBar';
import VideoExplorerCard from './explorer/VideoExplorerCard';
import { PAGE_SIZE } from './explorer/videoExplorerConstants';

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(PAGE_SIZE).fill(0).map((_, i) => (
        <div key={i} className="rounded-2xl bg-gray-200 animate-pulse" style={{ aspectRatio: '16/9' }} />
      ))}
    </div>
  );
}

const VideoExplorer = () => {
  const {
    videos, activeCategory, sortBy, currentPage, totalPages, totalItems, loading,
    handleCategoryChange, handleSortChange, handlePageChange, getPageNumbers,
  } = useVideoExplorer();

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
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#B85C38' }}>
            <Play size={15} fill="white" className="text-white ml-0.5" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: '#B85C38' }}>
              — Explorer
            </p>
            <h2 className="text-xl sm:text-2xl font-black leading-tight" style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}>
              Toutes les <span style={{ color: '#1A5C43' }}>vidéos</span>
            </h2>
          </div>
        </div>

        {/* Filtres */}
        <div
          ref={filterRef}
          className="transition-all duration-700"
          style={{ opacity: filterVisible ? 1 : 0, transform: filterVisible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <VideoExplorerFilterBar
            activeCategory={activeCategory}
            sortBy={sortBy}
            totalItems={totalItems}
            loading={loading}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Grille */}
        <div ref={gridRef}>
          {loading ? (
            <Skeleton />
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              {videos.map((video, i) => (
                <VideoExplorerCard key={video.id} video={video} delay={i * 60} />
              ))}
            </div>
          ) : (
            <div
              className="py-16 sm:py-20 text-center rounded-2xl border border-dashed border-gray-200"
              style={{ background: '#F7F9F8' }}
            >
              <p className="text-gray-400 text-sm">
                Aucune vidéo disponible{activeCategory !== 'all' ? ' dans cette catégorie' : ''}.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-2 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {getPageNumbers().map((n) => (
              <button
                key={n}
                onClick={() => handlePageChange(n)}
                disabled={loading}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-bold transition-all disabled:cursor-not-allowed"
                style={{
                  background: currentPage === n ? '#1A5C43' : 'white',
                  color: currentPage === n ? 'white' : '#374151',
                  border: currentPage === n ? 'none' : '1px solid #E5E7EB',
                  boxShadow: currentPage === n ? '0 4px 12px rgba(26,92,67,0.3)' : 'none',
                }}
              >
                {n}
              </button>
            ))}

            {totalPages > 4 && currentPage < totalPages - 2 && (
              <>
                <span className="px-1 text-gray-400 text-sm">…</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={loading}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-2 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default VideoExplorer;