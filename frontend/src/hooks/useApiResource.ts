// src/hooks/useApiResource.ts
//
// AVANT : useCandidatDashboard gérait correctement le cas 401/403 (déconnexion
// + redirection), mais useCandidatures, useProfil, useAlertes et useSettings
// avalaient TOUTES les erreurs (y compris 401/403) dans un `catch { setData(MOCK) }`
// — exactement le bug de sécurité déjà corrigé sur le dashboard, mais pas
// répliqué ailleurs. "Même logique" = un seul hook générique, utilisé partout.
//
// Règles appliquées uniformément :
//  - 401/403  -> déconnexion + redirection vers /auth (JAMAIS de données mock)
//  - autre erreur, en dev  -> log + fallback sur des données de démo (si fournies)
//  - autre erreur, en prod -> état d'erreur visible, données restent null

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth } from '@/services/emploi-auth.service';
import { toApiError } from '@/lib/api-error';

const IS_DEV = process.env.NODE_ENV === 'development';

interface UseApiResourceOptions<T> {
  /** Fonction qui va chercher la donnée réelle depuis l'API. */
  fetcher: () => Promise<T>;
  /** Donnée de démonstration, utilisée UNIQUEMENT en dev et UNIQUEMENT
   *  pour les erreurs non liées à l'authentification. */
  devFallback?: T;
  /** Dépendances déclenchant un rechargement (comme le tableau de useEffect). */
  deps?: unknown[];
}

interface UseApiResourceReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  refetch: () => void;
}

export function useApiResource<T>({ fetcher, devFallback, deps = [] }: UseApiResourceOptions<T>): UseApiResourceReturn<T> {
  const router = useRouter();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      const apiError = toApiError(err);

      // Règle non négociable, partout : une session invalide ne doit
      // JAMAIS être masquée par des données factices.
      if (apiError.isAuthError) {
        clearAuth();
        const current = typeof window !== 'undefined' ? window.location.pathname : '/';
        router.replace(`/auth?redirect=${encodeURIComponent(current)}`);
        return;
      }

      if (IS_DEV && devFallback !== undefined) {
        console.warn('[useApiResource] API indisponible — données de démonstration', apiError);
        setData(devFallback);
      } else {
        setError(apiError.message);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, setData, refetch: load };
}