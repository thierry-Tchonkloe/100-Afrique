// src/hooks/useAlertes.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAlertes } from '@/services/alertes.service';
import type { AlerteJob } from '@/types/alertes.types';

const MOCK_ALERTES: AlerteJob[] = [
  {
    id: 'alert-001',
    name: 'Direction Hôtel Côte d\'Azur',
    keywords: ['Directeur', 'Hébergement'],
    location: 'Nice, 06',
    contractTypes: ['CDI'],
    sector: 'Hôtellerie',
    frequency: 'realtime',
    isActive: true,
    lastSentAt: new Date('2024-01-15').toISOString(),
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'alert-002',
    name: 'Chef de Cuisine Restaurant',
    keywords: ['Chef'],
    location: 'Lyon, 69',
    contractTypes: ['CDI'],
    sector: 'Restauration',
    frequency: 'daily',
    isActive: false,
    lastSentAt: new Date('2024-01-10').toISOString(),
    createdAt: new Date('2023-12-15').toISOString(),
  },
  {
    id: 'alert-003',
    name: 'Conseiller Voyage Luxe',
    keywords: ['Conseiller', 'Agence Voyage'],
    location: 'Paris, 75',
    contractTypes: ['CDI', 'CDD'],
    sector: 'Agence de voyage',
    frequency: 'weekly',
    isActive: true,
    lastSentAt: new Date('2024-01-08').toISOString(),
    createdAt: new Date('2023-12-20').toISOString(),
  },
];

interface UseAlertesReturn {
  alertes: AlerteJob[];
  loading: boolean;
  setAlertes: React.Dispatch<React.SetStateAction<AlerteJob[]>>;
  refetch: () => void;
}

export function useAlertes(): UseAlertesReturn {
  const [alertes, setAlertes] = useState<AlerteJob[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAlertes();
      setAlertes(data);
    } catch {
      setAlertes(MOCK_ALERTES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { alertes, loading, setAlertes, refetch: load };
}