// src/hooks/useCandidatDashboard.ts
// FIX SÉCURITÉ : le hook avalait silencieusement TOUTES les erreurs (y
// compris 401/403 = session invalide ou expirée) et basculait sur des
// données fictives (MOCK). Un candidat dont la session expirait en cours
// de navigation continuait donc de voir un faux tableau de bord (avec un
// nom fictif "Marie Dubois") au lieu d'être renvoyé vers la connexion —
// masquant le problème au lieu de le signaler. Le mock ne doit servir
// qu'en développement local, jamais pour dissimuler une session expirée.
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCandidatDashboard } from '@/services/emploi.service';
import { clearAuth } from '@/services/emploi-auth.service';
import type { DashboardData } from '@/types/emploi.types';

const IS_DEV = process.env.NODE_ENV === 'development';

const MOCK: DashboardData = {
  profile: {
    id: 'cand-001', firstName: 'Marie', lastName: 'Dubois',
    email: 'marie.dubois@email.com', avatar: undefined,
    title: 'Réceptionniste', sector: 'Hôtellerie', profileStrength: 65,
    profileStrengthMessage: "Ajoutez vos expériences pour attirer 3x plus de recruteurs",
  },
  stats: { applicationsCount: 12, profileViews: 47, savedJobsCount: 8, activeAlertsCount: 3 },
  recentApplications: [
    { id: 'a1', jobTitle: 'Réceptionniste',   companyName: 'Hôtel des Alpes',       sector: 'hotel',      appliedAt: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'in_progress' },
    { id: 'a2', jobTitle: 'Serveur/Serveuse',  companyName: 'Restaurant Le Panorama', sector: 'restaurant', appliedAt: new Date(Date.now() - 4 * 86400000).toISOString(), status: 'accepted'    },
    { id: 'a3', jobTitle: 'Concierge',         companyName: 'Grand Hôtel Palace',    sector: 'hotel',      appliedAt: new Date(Date.now() - 7 * 86400000).toISOString(), status: 'refused'     },
  ],
  suggestions: [
    { id: 'j1', title: 'Réceptionniste de nuit', companyName: 'Hôtel Mercure',  location: 'Paris 15ème', contractType: 'CDI', publishedAt: new Date(Date.now() - 7200000).toISOString(),   sector: 'hotel' },
    { id: 'j2', title: "Agent d'accueil",         companyName: 'Resort Spa',     location: 'Cannes',      contractType: 'CDD', publishedAt: new Date(Date.now() - 14400000).toISOString(),  sector: 'hotel' },
    { id: 'j3', title: 'Gouvernante',             companyName: 'Château Hôtel',  location: 'Lyon',        contractType: 'CDI', publishedAt: new Date(Date.now() - 21600000).toISOString(),  sector: 'hotel' },
  ],
  notifications: [
    { id: 'n1', type: 'new_offer',           title: 'Nouvelle offre correspondante', description: 'Alerte "Réceptionniste Paris" - il y a 1h', createdAt: new Date(Date.now() - 3600000).toISOString(),   read: false },
    { id: 'n2', type: 'profile_viewed',      title: 'Profil consulté',              description: 'Un recruteur a vu votre profil - il y a 3h',   createdAt: new Date(Date.now() - 10800000).toISOString(),  read: false },
    { id: 'n3', type: 'application_accepted', title: 'Candidature acceptée',        description: 'Restaurant Le Panorama - hier',                 createdAt: new Date(Date.now() - 86400000).toISOString(),  read: true  },
  ],
};

interface UseCandidatDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  setData: React.Dispatch<React.SetStateAction<DashboardData | null>>;
  refetch: () => void;
}

export function useCandidatDashboard(): UseCandidatDashboardReturn {
  const router = useRouter();

  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCandidatDashboard();
      setData(result);
    } catch (err: any) {
      const status = err?.response?.status;

      // FIX SÉCURITÉ : une 401/403 signifie que la session n'est plus valide
      // (token expiré, invalide, ou rôle refusé côté backend). On déconnecte
      // immédiatement et on renvoie vers la connexion — on ne doit JAMAIS
      // remplacer une session invalide par de fausses données.
      if (status === 401 || status === 403) {
        clearAuth();
        const current = typeof window !== 'undefined' ? window.location.pathname : '/candidat/dashboard';
        router.replace(`/auth?redirect=${encodeURIComponent(current)}`);
        return;
      }

      // Pour toute autre erreur (réseau, backend down...) : le mock ne sert
      // qu'en développement local, jamais en production. En production, une
      // vraie erreur réseau doit rester visible (data reste null), pas être
      // masquée par un faux tableau de bord.
      if (IS_DEV) {
        console.warn('[useCandidatDashboard] API inaccessible — données de démonstration', err);
        setData(MOCK);
      } else {
        setError("Impossible de charger votre tableau de bord. Vérifiez votre connexion.");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, setData, refetch: load };
}