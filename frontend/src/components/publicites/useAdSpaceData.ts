// src/components/publicites/useAdSpaceData.ts
"use client";
import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/backoffice/apiFetch';
import type { AdZone, Banner, ThirdPartyCode } from './types';

export function useApi<T>(path: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ success: boolean; data: T }>(path);
      setData(res.data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps]);

  useEffect(() => { fetch_(); }, [fetch_]);
  return { data, loading, error, refetch: fetch_ };
}

export function useAdSpaceData() {
  const { data: zones, loading: zonesLoading, refetch: refetchZones } = useApi<AdZone[]>('/admin/advertising/zones');
  const [selectedZone, setSelectedZone] = useState<AdZone | null>(null);
  const { data: zoneBanners, loading: bannersLoading, refetch: refetchBanners } = useApi<Banner[]>(
    selectedZone ? `/admin/advertising/zones/${selectedZone.id}/banners` : null,
    [selectedZone?.id]
  );
  const { data: thirdParty, refetch: refetchThirdParty } = useApi<ThirdPartyCode>('/admin/advertising/third-party');

  useEffect(() => {
    if (zones?.length && !selectedZone) setSelectedZone(zones[0]);
  }, [zones, selectedZone]);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = useCallback((msg: string, type: 'success' | 'error') => setToast({ msg, type }), []);

  const [togglingId, setTogglingId] = useState<number | null>(null);
  async function toggleZone(zone: AdZone) {
    setTogglingId(zone.id);
    try {
      await apiFetch(`/admin/advertising/zones/${zone.id}/toggle`, { method: 'PATCH' });
      await refetchZones();
      if (selectedZone?.id === zone.id) {
        setSelectedZone((z) => (z ? { ...z, isEnabled: !z.isEnabled } : z));
      }
    } catch (e) {
      showToast((e as Error).message, 'error');
    } finally {
      setTogglingId(null);
    }
  }

  async function deleteZone(id: number) {
    await apiFetch(`/admin/advertising/zones/${id}`, { method: 'DELETE' });
    showToast('Zone supprimée', 'success');
    if (selectedZone?.id === id) setSelectedZone(null);
    await refetchZones();
  }

  async function deleteBanner(id: number) {
    await apiFetch(`/admin/advertising/banners/${id}`, { method: 'DELETE' });
    showToast('Bannière supprimée', 'success');
    await refetchBanners();
  }

  async function refreshStatuses() {
    try {
      await apiFetch('/admin/advertising/banners/refresh-statuses', { method: 'POST' });
      showToast('Statuts mis à jour', 'success');
      await refetchBanners();
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  }

  const enabledZones = zones?.filter((z) => z.isEnabled) ?? [];
  const globalFill = enabledZones.length > 0
    ? Math.round(enabledZones.reduce((acc, z) => acc + (z.fillRate ?? 0), 0) / enabledZones.length)
    : 0;
  const activeBanners = zones?.flatMap((z) => z.banners).filter((b) => b.status === 'ACTIF').length ?? 0;

  return {
    zones, zonesLoading, refetchZones,
    selectedZone, setSelectedZone,
    zoneBanners, bannersLoading, refetchBanners,
    thirdParty, refetchThirdParty,
    toast, showToast, setToast,
    togglingId, toggleZone,
    deleteZone, deleteBanner, refreshStatuses,
    enabledZones, globalFill, activeBanners,
  };
}