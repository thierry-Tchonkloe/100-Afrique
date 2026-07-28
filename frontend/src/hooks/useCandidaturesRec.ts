// src/hooks/useCandidaturesRec.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchCandidaturesRec } from '@/services/candidatures-rec.service';
import { useRecruteurContext } from '@/context/RecruteurContext';
import { toApiError } from '@/lib/api-error';
import type { CandidaturesRecResponse } from '@/types/candidatures-rec.types';

const IS_DEV = process.env.NODE_ENV === 'development';

const EMPTY_RESPONSE: CandidaturesRecResponse = {
  stats: { new: 0, in_progress: 0, interview: 0, favorite: 0, refused: 0 },
  offers: [],
  candidatures: [],
};

const DEV_MOCK: CandidaturesRecResponse = {
  stats: { new: 12, in_progress: 8, interview: 5, favorite: 3, refused: 15 },
  offers: [
    { id: 'o1', title: 'Réceptionniste H/F' },
    { id: 'o2', title: 'Chef de Cuisine' },
  ],
  candidatures: [
    {
      id: 'c-001', candidatName: 'Sophie Martin', candidatTitle: 'Réceptionniste Expérimentée',
      matchScore: 95, offerId: 'o1', offerTitle: 'Réceptionniste H/F',
      receivedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      status: 'new', isRead: false, isFavorite: false,
      experiences: [{ jobTitle: 'Réceptionniste Senior', company: 'Hôtel Le Bristol', period: '2021-2024', description: 'Opera PMS, accueil VIP' }],
      formations: [{ diploma: 'BTS Tourisme', school: 'Lycée Jean Monnet', year: '2019' }],
      skills: ['Opera PMS', 'Anglais fluent'],
      location: 'Paris 8ème', mobility: 'Île-de-France', availability: 'Immédiate',
      recruiterNotes: '',
    },
  ],
};

interface UseCandidaturesRecReturn {
  data: CandidaturesRecResponse;
  loading: boolean;
  error: string | null;
  setData: React.Dispatch<React.SetStateAction<CandidaturesRecResponse>>;
  refetch: () => void;
}

export function useCandidaturesRec(): UseCandidaturesRecReturn {
  // FIX : source de vérité de l'établissement actif = le contexte recruteur,
  // exactement comme useOffres/useVitrine/useRecruteurDashboard. Sans ça,
  // changer d'établissement via le sélecteur du header n'avait aucun effet
  // sur cette page (bug de scoping repéré en revue).
  const { profile } = useRecruteurContext();

  const [data, setData] = useState<CandidaturesRecResponse>(EMPTY_RESPONSE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeEtabRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (profile?.activeEtablissementId) activeEtabRef.current = profile.activeEtablissementId;
  }, [profile?.activeEtablissementId]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCandidaturesRec(activeEtabRef.current);
      setData(result);
    } catch (err) {
      // FIX : ne masque plus une session invalide derrière du mock — le
      // RecruteurContext gère déjà la redirection 401/403 en amont ; si on
      // arrive ici avec ce statut, c'est un cas limite (token expiré entre
      // deux appels) qu'on ne doit pas non plus cacher silencieusement.
      const apiError = toApiError(err);
      if (IS_DEV && !apiError.isAuthError) {
        console.warn('[useCandidaturesRec] API indisponible — données de démonstration', apiError);
        setData(DEV_MOCK);
      } else {
        setError(apiError.message);
        setData(EMPTY_RESPONSE);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profile !== null) {
      if (profile.activeEtablissementId) activeEtabRef.current = profile.activeEtablissementId;
      load();
    }
    // Se redéclenche quand l'établissement actif change (même dépendance
    // que useOffres/useVitrine).
  }, [profile?.activeEtablissementId, load]);

  return { data, loading, error, setData, refetch: load };
}
