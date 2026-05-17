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
















// // src/hooks/useOffres.ts
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { fetchOffres } from '../services/offres.service';
// import type { OffresResponse, Offre } from '@/types/offres.types';

// const MOCK: OffresResponse = {
//   stats: { online: 5, drafts: 3, archives: 15 },
//   offres: [
//     {
//       id: 'offre-001', title: 'Chef de Réception H/F',
//       sector: 'hotel', contractType: 'CDI', location: 'Paris 8ème',
//       publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
//       expiresAt:   new Date(Date.now() + 25 * 86400000).toISOString(),
//       status: 'active', isPremium: true, views: 342, candidatesCount: 18, newCandidatesCount: 3,
//     },
//     {
//       id: 'offre-002', title: 'Chef de Partie - Restaurant Gastronomique',
//       sector: 'restaurant', contractType: 'CDI', location: 'Paris 16ème',
//       publishedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
//       expiresAt:   new Date(Date.now() + 18 * 86400000).toISOString(),
//       status: 'active', isPremium: false, views: 521, candidatesCount: 27, newCandidatesCount: 0,
//     },
//     {
//       id: 'offre-003', title: 'Spa Manager - Wellness Center',
//       sector: 'spa', contractType: 'CDD', location: 'Cannes',
//       publishedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
//       expiresAt:   new Date(Date.now() + 22 * 86400000).toISOString(),
//       status: 'active', isPremium: false, views: 198, candidatesCount: 9, newCandidatesCount: 2,
//     },
//     {
//       id: 'offre-004', title: 'Concierge de Luxe H/F',
//       sector: 'hotel', contractType: 'CDI', location: 'Monaco',
//       publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
//       expiresAt:   new Date(Date.now() + 27 * 86400000).toISOString(),
//       status: 'active', isPremium: true, views: 687, candidatesCount: 34, newCandidatesCount: 7,
//     },
//     {
//       id: 'offre-005', title: 'Barman / Barmaid - Bar à Cocktails',
//       sector: 'bar', contractType: 'CDD Saisonnier', location: 'Saint-Tropez',
//       publishedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
//       expiresAt:   new Date(Date.now() + 15 * 86400000).toISOString(),
//       status: 'active', isPremium: false, views: 412, candidatesCount: 21, newCandidatesCount: 0,
//     },
//     // Drafts
//     {
//       id: 'offre-006', title: 'Directeur F&B',
//       sector: 'restaurant', contractType: 'CDI', location: 'Paris',
//       publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
//       expiresAt:   new Date(Date.now() + 30 * 86400000).toISOString(),
//       status: 'draft', isPremium: false, views: 0, candidatesCount: 0, newCandidatesCount: 0,
//     },
//     {
//       id: 'offre-007', title: 'Revenue Manager',
//       sector: 'hotel', contractType: 'CDI', location: 'Lyon',
//       publishedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
//       expiresAt:   new Date(Date.now() + 30 * 86400000).toISOString(),
//       status: 'draft', isPremium: false, views: 0, candidatesCount: 0, newCandidatesCount: 0,
//     },
//     {
//       id: 'offre-008', title: 'Gouvernante Générale',
//       sector: 'hotel', contractType: 'CDI', location: 'Nice',
//       publishedAt: new Date().toISOString(),
//       expiresAt:   new Date(Date.now() + 30 * 86400000).toISOString(),
//       status: 'draft', isPremium: false, views: 0, candidatesCount: 0, newCandidatesCount: 0,
//     },
//   ],
// };

// interface UseOffresReturn {
//   data: OffresResponse | null;
//   offres: Offre[];
//   loading: boolean;
//   setOffres: (offres: Offre[]) => void;
//   refetch: () => void;
// }

// export function useOffres(): UseOffresReturn {
//   const [data, setData] = useState<OffresResponse>(MOCK);
//   const [loading, setLoading] = useState(true);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const result = await fetchOffres();
//       setData(result);
//     } catch {
//       setData(MOCK);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const setOffres = useCallback((offres: Offre[]) => {
//     setData((prev) => prev ? { ...prev, offres } : prev);
//   }, []);

//   return {
//     data,
//     offres: data?.offres ?? [],
//     loading,
//     setOffres,
//     refetch: load,
//   };
// }