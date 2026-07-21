// src/hooks/useRecruteurDashboard.ts — v2: profil depuis RecruteurContext
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchRecruteurDashboard } from '@/services/recruteur.service';
import { useRecruteurContext } from '@/context/RecruteurContext';
import type { RecruteurDashboardData, DashboardPeriod } from '@/types/recruteur.types';

// ── MOCK stats uniquement — jamais le profil (il vient du RecruteurContext)
const MOCK_STATS: Omit<RecruteurDashboardData, 'profile'> = {
  stats: {
    porteeGlobale:      0,
    porteeEvolution:    0,
    candidatures:       0,
    candidaturesEvol:   0,
    offresActives:      0,
    tauxConversion:     0,
    tauxConversionEvol: 0,
  },
  chartData: Array.from({ length: 7 }, (_, i) => ({
    date: `Jour ${i + 1}`,
    value: 0,
  })),
  metierParts: [
    { name: 'Hôtellerie',    value: 0, color: '#E8622A' },
    { name: 'Restauration',  value: 0, color: '#1E2A3A' },
    { name: 'MICE',          value: 0, color: '#3B5BDB' },
    { name: 'Tech Tourisme', value: 0, color: '#4CAF50' },
    { name: 'Autres',        value: 0, color: '#9E9E9E' },
  ],
  recentCandidatures:  [],
  vitrineHealth: { completionScore: 0, views: 0, engagementRate: 0 },
  newCandidaturesCount: 0,
};

interface UseRecruteurDashboardReturn {
  data: RecruteurDashboardData | null;
  loading: boolean;
  period: DashboardPeriod;
  setPeriod: (p: DashboardPeriod) => void;
  setData: React.Dispatch<React.SetStateAction<RecruteurDashboardData | null>>;
  refetch: () => void;
}

export function useRecruteurDashboard(): UseRecruteurDashboardReturn {
  // ── Source de vérité du profil : le contexte (chargé depuis /profile)
  const { profile } = useRecruteurContext();

  const [data,    setData]    = useState<RecruteurDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState<DashboardPeriod>('7d');

  // Ref stable pour l'etablissementId actif — évite de mettre `profile`
  // dans useCallback tout en lisant sa valeur la plus récente
  const activeEtabRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (profile?.activeEtablissementId) {
      activeEtabRef.current = profile.activeEtablissementId;
    }
  }, [profile?.activeEtablissementId]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // etablissementId est string | undefined : le backend utilise isDefault:true si absent
      const result = await fetchRecruteurDashboard(activeEtabRef.current, period);
      setData(result);
    } catch {
      // Fallback : stats vides mais avec le VRAI profil du recruteur connecté
      // → la salutation affichera toujours le bon nom
      if (profile) {
        setData({ profile, ...MOCK_STATS });
      }
    } finally {
      setLoading(false);
    }
  }, [period, profile]); // profile dans deps : nouveau recruteur = nouveau fetch

  // Déclencher le fetch uniquement quand le profil est disponible
  useEffect(() => {
    if (profile !== null) {
      load();
    }
  }, [load, profile]);

  return { data, loading, period, setPeriod, setData, refetch: load };
}
