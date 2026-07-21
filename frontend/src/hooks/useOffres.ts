// src/hooks/useOffres.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchOffres } from '@/services/offres.service';
import { useRecruteurContext } from '@/context/RecruteurContext';
import type { OffresResponse, Offre } from '@/types/offres.types';

// ── MOCK vide — affiché uniquement si l'API échoue, jamais avec de fausses données
const EMPTY_RESPONSE: OffresResponse = {
  stats: { online: 0, drafts: 0, archives: 0 },
  offres: [],
};

interface UseOffresReturn {
  data: OffresResponse | null;
  offres: Offre[];
  loading: boolean;
  setOffres: (offres: Offre[]) => void;
  refetch: () => void;
}

export function useOffres(): UseOffresReturn {
  // ── Source de vérité de l'établissement actif : le contexte (chargé depuis /profile)
  const { profile } = useRecruteurContext();

  const [data,    setData]    = useState<OffresResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Ref stable pour l'etablissementId — évite les dépendances circulaires dans useCallback
  const activeEtabRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (profile?.activeEtablissementId) {
      activeEtabRef.current = profile.activeEtablissementId;
    }
  }, [profile?.activeEtablissementId]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Passe l'etablissementId du recruteur connecté → le backend filtre ses propres offres
      const result = await fetchOffres(activeEtabRef.current);
      setData(result);
    } catch {
      // En cas d'erreur API : liste vide (jamais les données d'un autre compte)
      setData(EMPTY_RESPONSE);
    } finally {
      setLoading(false);
    }
  }, []); // load ne dépend pas de profile directement — on utilise le ref

  // Recharger dès que le profil est disponible (ou change d'établissement)
  useEffect(() => {
    if (profile !== null) {
      // Mettre à jour le ref avant de charger
      if (profile.activeEtablissementId) {
        activeEtabRef.current = profile.activeEtablissementId;
      }
      load();
    }
  }, [profile?.activeEtablissementId, load]); // se redéclenche si l'établissement change

  // Met à jour les offres localement sans rechargement réseau
  const setOffres = useCallback((offres: Offre[]) => {
    setData((prev) => {
      if (!prev) return prev;
      // Recalculer les stats depuis la liste mise à jour
      const stats = {
        online:   offres.filter((o) => ['active', 'paused'].includes(o.status)).length,
        drafts:   offres.filter((o) => o.status === 'draft').length,
        archives: offres.filter((o) => o.status === 'archived').length,
      };
      return { stats, offres };
    });
  }, []);

  return {
    data,
    offres: data?.offres ?? [],
    loading,
    setOffres,
    refetch: load,
  };
}
