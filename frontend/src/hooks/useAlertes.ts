// src/hooks/useAlertes.ts
'use client';

import type { SetStateAction } from 'react';
import { useApiResource } from './useApiResource';
import { fetchAlertes } from '@/services/alertes.service';
import type { AlerteJob } from '@/types/alertes.types';

const DEV_MOCK: AlerteJob[] = [
  {
    id: 'alert-001', name: "Direction Hôtel Côte d'Azur", keywords: ['Directeur', 'Hébergement'],
    location: 'Nice, 06', contractTypes: ['CDI'], sector: 'Hôtellerie', frequency: 'realtime',
    isActive: true, lastSentAt: new Date('2024-01-15').toISOString(), createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'alert-002', name: 'Chef de Cuisine Restaurant', keywords: ['Chef'],
    location: 'Lyon, 69', contractTypes: ['CDI'], sector: 'Restauration', frequency: 'daily',
    isActive: false, lastSentAt: new Date('2024-01-10').toISOString(), createdAt: new Date('2023-12-15').toISOString(),
  },
  {
    id: 'alert-003', name: 'Conseiller Voyage Luxe', keywords: ['Conseiller', 'Agence Voyage'],
    location: 'Paris, 75', contractTypes: ['CDI', 'CDD'], sector: 'Agence de voyage', frequency: 'weekly',
    isActive: true, lastSentAt: new Date('2024-01-08').toISOString(), createdAt: new Date('2023-12-20').toISOString(),
  },
];

export function useAlertes() {
  const { data, loading, error, setData, refetch } = useApiResource<AlerteJob[]>({
    fetcher: fetchAlertes,
    devFallback: DEV_MOCK,
  });

  // `setData` est typé Dispatch<SetStateAction<AlerteJob[] | null>> (la
  // donnée réseau peut être null). La page utilise systématiquement la
  // forme fonctionnelle `setAlertes(prev => [...prev, x])` en supposant
  // un tableau toujours défini — ce petit adaptateur comble l'écart sans
  // dupliquer la logique de chargement.
  function setAlertes(update: SetStateAction<AlerteJob[]>) {
    setData((prev) => {
      const base = prev ?? [];
      return typeof update === 'function' ? (update as (p: AlerteJob[]) => AlerteJob[])(base) : update;
    });
  }

  return { alertes: data ?? [], loading, error, setAlertes, refetch };
}
