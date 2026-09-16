// src/components/destinations/grid/DestinationGridFilterBar.tsx
"use client";
import React from 'react';
import { MapPinned, Search, SlidersHorizontal, X as XIcon } from 'lucide-react';
import { CONTINENTS } from './useDestinationsList';

interface DestinationGridFilterBarProps {
  filter: string;
  searchQuery: string;
  loading: boolean;
  regionFilter: string | null;
  destinationsCount: number;
  onSearchChange: (v: string) => void;
  onContinentClick: (c: string) => void;
  onClearRegion: () => void;
}

const DestinationGridFilterBar = ({
  filter, searchQuery, loading, regionFilter, destinationsCount,
  onSearchChange, onContinentClick, onClearRegion,
}: DestinationGridFilterBarProps) => (
  <>
    {/* Chip région active (venant du header) */}
    {regionFilter && (
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl border"
        style={{ background: 'rgba(26,92,67,0.06)', borderColor: 'rgba(26,92,67,0.2)' }}
      >
        <MapPinned size={15} style={{ color: '#1A5C43' }} className="shrink-0" />
        <span className="text-sm font-semibold" style={{ color: '#0D1A10' }}>
          Région : <span style={{ color: '#1A5C43' }}>{regionFilter}</span>
        </span>
        <button
          onClick={onClearRegion}
          className="ml-auto flex items-center gap-1 text-xs font-bold uppercase tracking-wide transition-colors"
          style={{ color: '#B85C38' }}
        >
          <XIcon size={13} /> Effacer le filtre
        </button>
      </div>
    )}

    {/* Barre filtres compacte */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Ligne 1 — recherche */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <SlidersHorizontal size={14} style={{ color: '#1A5C43' }} />
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une destination..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={loading}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none transition-all focus:border-[#1A5C43] disabled:opacity-50"
          />
        </div>
        {!loading && destinationsCount > 0 && (
          <span className="ml-auto text-[10px] font-medium text-gray-400 shrink-0">
            {destinationsCount} destination{destinationsCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Ligne 2 — pills continents */}
      <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {CONTINENTS.map((c) => {
          const isActive = !regionFilter && filter === c;
          return (
            <button
              key={c}
              onClick={() => onContinentClick(c)}
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
  </>
);

export default DestinationGridFilterBar;