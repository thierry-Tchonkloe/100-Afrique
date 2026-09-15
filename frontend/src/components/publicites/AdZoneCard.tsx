// src/components/publicites/AdZoneCard.tsx
"use client";
import React from 'react';
import { Toggle, FillRateBar } from './ui';
import type { AdZone } from './types';

interface AdZoneCardProps {
  zone: AdZone;
  isSelected: boolean;
  toggling: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const AdZoneCard = ({ zone, isSelected, toggling, onSelect, onToggle, onEdit, onDelete }: AdZoneCardProps) => (
  <div
    onClick={onSelect}
    className={`bg-white rounded-xl border transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md ${
      isSelected ? 'border-orange-400 ring-2 ring-orange-100' : 'border-gray-200'
    }`}
  >
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-gray-800 leading-tight">{zone.name}</h3>
        <Toggle enabled={zone.isEnabled} loading={toggling} onChange={onToggle} />
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(zone.slug); }}
        title="Cliquer pour copier le slug"
        className="inline-flex items-center gap-1.5 mb-2 px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-xs font-mono text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
      >
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {zone.slug}
      </button>

      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 text-base text-gray-500">
          <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          {zone.width} × {zone.height} pixels
        </div>
        <div className="flex items-center gap-1.5 text-base text-gray-500">
          <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
          </svg>
          {zone.path}
        </div>
        <div className="flex items-center gap-1.5 text-base text-gray-500">
          <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
          </svg>
          {zone.banners?.length ?? 0} bannière{(zone.banners?.length ?? 0) > 1 ? 's' : ''}
        </div>
      </div>
      <FillRateBar value={zone.fillRate ?? 0} />
    </div>

    <div className="border-t border-gray-100 px-4 py-2.5 flex gap-2">
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="flex-1 flex items-center justify-center gap-1.5 text-base font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md py-1.5 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
        </svg>
        Modifier
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="flex-1 flex items-center justify-center gap-1.5 text-base font-medium text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-md py-1.5 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        Supprimer
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        className="flex-1 flex items-center justify-center gap-1.5 text-base font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md py-1.5 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Bannières
      </button>
    </div>
  </div>
);

export default AdZoneCard;