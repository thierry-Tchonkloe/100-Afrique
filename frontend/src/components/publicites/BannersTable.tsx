// src/components/publicites/BannersTable.tsx
"use client";
import React from 'react';
import { Spinner, StatusBadge, TypeBadge } from './ui';
import { fmtDate } from './types';
import type { AdZone, Banner } from './types';

interface BannersTableProps {
  selectedZone: AdZone;
  zoneBanners: Banner[] | null;
  bannersLoading: boolean;
  onRefreshStatuses: () => void;
  onAddBanner: () => void;
  onEditBanner: (b: Banner) => void;
  onDeleteBanner: (b: Banner) => void;
}

const BannersTable = ({
  selectedZone, zoneBanners, bannersLoading,
  onRefreshStatuses, onAddBanner, onEditBanner, onDeleteBanner,
}: BannersTableProps) => (
  <section>
    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
      <div>
        <h2 className="text-base font-bold text-gray-800">
          Bannières — <span className="text-orange-500">{selectedZone.name}</span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {selectedZone.width} × {selectedZone.height} px · {selectedZone.path}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefreshStatuses}
          className="flex items-center gap-1.5 text-base font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
          title="Mettre à jour les statuts selon les dates"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser statuts
        </button>
        <button
          onClick={onAddBanner}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Ajouter une Bannière
        </button>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {bannersLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 w-14">Aperçu</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Annonceur / Campagne</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Période d&apos;Affichage</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Statut</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(zoneBanners ?? []).map((banner) => (
              <tr key={banner.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3">
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt={banner.advertiser} className="w-10 h-10 rounded-lg object-cover border border-gray-200" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                      </svg>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-800">{banner.advertiser}</p>
                  <p className="text-xs text-gray-500">{banner.campaign}</p>
                </td>
                <td className="px-4 py-3"><TypeBadge type={banner.type} /></td>
                <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                  {fmtDate(banner.startDate)} – {fmtDate(banner.endDate)}
                </td>
                <td className="px-4 py-3"><StatusBadge status={banner.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEditBanner(banner)} className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors" title="Modifier">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                    </button>
                    <button onClick={() => onDeleteBanner(banner)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Supprimer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(zoneBanners ?? []).length === 0 && !bannersLoading && (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-base text-gray-400">Aucune bannière pour cette zone</p>
                    <button onClick={onAddBanner} className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                      Ajouter la première bannière →
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  </section>
);

export default BannersTable;