// src/components/publicites/GlobalStatsSection.tsx
"use client";
import React from 'react';
import { CircularProgress } from './ui';

interface GlobalStatsSectionProps {
  totalZones: number | string;
  enabledZonesCount: number;
  activeBanners: number;
  globalFill: number;
}

const GlobalStatsSection = ({ totalZones, enabledZonesCount, activeBanners, globalFill }: GlobalStatsSectionProps) => (
  <>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: 'Zones totales', value: totalZones, icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
        { label: 'Zones actives', value: enabledZonesCount, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label: 'Bannières actives', value: activeBanners, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { label: 'Remplissage global', value: `${globalFill}%`, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      ].map(({ label, value, icon }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
            </div>
            <div>
              <p className="text-xl font-black text-gray-900">{value}</p>
              <p className="text-lg text-gray-500">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
          Taux de Remplissage Global (Zones Actives)
        </p>
        <p className="text-4xl font-black text-gray-900">{globalFill}%</p>
      </div>
      <div className="relative flex items-center justify-center">
        <CircularProgress value={globalFill} />
        <span className="absolute text-sm font-bold text-orange-500">{globalFill}%</span>
      </div>
    </div>
  </>
);

export default GlobalStatsSection;