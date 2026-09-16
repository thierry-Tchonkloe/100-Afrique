// src/components/videos/explorer/VideoExplorerFilterBar.tsx
"use client";
import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { CATEGORY_FILTERS, type SortOption } from './videoExplorerConstants';

interface VideoExplorerFilterBarProps {
  activeCategory: string;
  sortBy: SortOption;
  totalItems: number;
  loading: boolean;
  onCategoryChange: (id: string) => void;
  onSortChange: (value: string) => void;
}

const VideoExplorerFilterBar = ({
  activeCategory, sortBy, totalItems, loading, onCategoryChange, onSortChange,
}: VideoExplorerFilterBarProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    {/* Ligne 1 — filtres principaux */}
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
      <SlidersHorizontal size={14} style={{ color: '#1A5C43' }} />
      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mr-1 hidden sm:block shrink-0">
        Filtrer
      </span>
      <div className="h-5 w-px bg-gray-200 hidden sm:block" />

      <div className="relative flex items-center gap-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:block shrink-0">Trier :</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            disabled={loading}
            className="appearance-none bg-transparent border-0 text-sm font-semibold outline-none cursor-pointer pr-6 pl-1 py-0 text-gray-700 disabled:opacity-50"
          >
            <option value="createdAt:desc">Plus récent</option>
            <option value="createdAt:asc">Plus ancien</option>
            <option value="views:desc">Plus vu</option>
          </select>
          <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </div>

      {!loading && (
        <span className="ml-auto text-[10px] font-medium text-gray-400 shrink-0">
          {totalItems} vidéo{totalItems > 1 ? 's' : ''}
        </span>
      )}
    </div>

    {/* Ligne 2 — pills catégories scrollables */}
    <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
      {CATEGORY_FILTERS.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
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
            {cat.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default VideoExplorerFilterBar;