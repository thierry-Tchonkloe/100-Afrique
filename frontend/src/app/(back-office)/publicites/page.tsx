// src/app/(back-office)/publicites/page.tsx
"use client";

import { useState } from 'react';
import { ProtectedRoute } from '@/components/Dashboard/ProtectedRoute';
import ErrorBanner from '@/components/shared/backoffice/ErrorBanner';
import ConfirmModal from '@/components/shared/backoffice/ConfirmModal';
import { useAdSpaceData } from '@/components/publicites/useAdSpaceData';
import { Spinner, Toast } from '@/components/publicites/ui';
import GlobalStatsSection from '@/components/publicites/GlobalStatsSection';
import AdZoneCard from '@/components/publicites/AdZoneCard';
import BannersTable from '@/components/publicites/BannersTable';
import ThirdPartyCodeSection from '@/components/publicites/ThirdPartyCodeSection';
import ZoneModal from '@/components/publicites/ZoneModal';
import BannerModal from '@/components/publicites/BannerModal';
import type { AdZone, Banner } from '@/components/publicites/types';

export default function AdSpaceManager() {
  const d = useAdSpaceData();

  const [zoneModal, setZoneModal] = useState<{ open: boolean; zone?: AdZone | null }>({ open: false });
  const [bannerModal, setBannerModal] = useState<{ open: boolean; banner?: Banner | null }>({ open: false });
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'zone' | 'banner'; id: number; name: string } | null>(null);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === 'zone') await d.deleteZone(confirmDelete.id);
      else await d.deleteBanner(confirmDelete.id);
    } catch (e) {
      d.showToast((e as Error).message, 'error');
    }
    setConfirmDelete(null);
  };

  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Gestion des Espaces Publicitaires</h1>
              <p className="text-lg text-gray-500 mt-1">
                Définition des emplacements, attribution des bannières et suivi des performances
              </p>
            </div>
            <button
              onClick={() => setZoneModal({ open: true, zone: null })}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-lg font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Définir un Nouvel Emplacement
            </button>
          </div>

          <GlobalStatsSection
            totalZones={d.zones?.length ?? '–'}
            enabledZonesCount={d.enabledZones.length}
            activeBanners={d.activeBanners}
            globalFill={d.globalFill}
          />

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Inventaire des Zones d&apos;Affichage</h2>
            {d.zonesLoading ? (
              <div className="flex justify-center py-12"><Spinner /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(d.zones ?? []).map((zone) => (
                  <AdZoneCard
                    key={zone.id}
                    zone={zone}
                    isSelected={d.selectedZone?.id === zone.id}
                    toggling={d.togglingId === zone.id}
                    onSelect={() => d.setSelectedZone(zone)}
                    onToggle={() => d.toggleZone(zone)}
                    onEdit={() => setZoneModal({ open: true, zone })}
                    onDelete={() => setConfirmDelete({ type: 'zone', id: zone.id, name: zone.name })}
                  />
                ))}
              </div>
            )}
          </section>

          {d.selectedZone && (
            <BannersTable
              selectedZone={d.selectedZone}
              zoneBanners={d.zoneBanners}
              bannersLoading={d.bannersLoading}
              onRefreshStatuses={d.refreshStatuses}
              onAddBanner={() => setBannerModal({ open: true, banner: null })}
              onEditBanner={(banner) => setBannerModal({ open: true, banner })}
              onDeleteBanner={(banner) => setConfirmDelete({ type: 'banner', id: banner.id, name: `${banner.advertiser} – ${banner.campaign}` })}
            />
          )}

          <ThirdPartyCodeSection
            thirdParty={d.thirdParty}
            onSaved={d.refetchThirdParty}
            onToast={d.showToast}
          />
        </div>
      </div>

      {zoneModal.open && (
        <ZoneModal zone={zoneModal.zone} onClose={() => setZoneModal({ open: false })} onSaved={d.refetchZones} onToast={d.showToast} />
      )}

      {bannerModal.open && d.selectedZone && (
        <BannerModal banner={bannerModal.banner} zoneId={d.selectedZone.id} onClose={() => setBannerModal({ open: false })} onSaved={d.refetchBanners} onToast={d.showToast} />
      )}

      {confirmDelete && (
        <ConfirmModal
          title={`Supprimer ${confirmDelete.type === 'zone' ? 'la zone' : 'la bannière'}`}
          message={`Êtes-vous sûr de vouloir supprimer "${confirmDelete.name}" ? Cette action est irréversible.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}

      {d.toast && <Toast msg={d.toast.msg} type={d.toast.type} onClose={() => d.setToast(null)} />}

      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.25s ease; }
      `}</style>
    </ProtectedRoute>
  );
}