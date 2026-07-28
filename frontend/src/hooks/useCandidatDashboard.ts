// src/hooks/useCandidatDashboard.ts
'use client';

import { useApiResource } from './useApiResource';
import { fetchCandidatDashboard } from '@/services/emploi.service';
import type { DashboardData } from '@/types/emploi.types';

const DEV_MOCK: DashboardData = {
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
    { id: 'n1', type: 'new_offer',            title: 'Nouvelle offre correspondante', description: 'Alerte "Réceptionniste Paris" - il y a 1h', createdAt: new Date(Date.now() - 3600000).toISOString(),  read: false },
    { id: 'n2', type: 'profile_viewed',       title: 'Profil consulté',              description: 'Un recruteur a vu votre profil - il y a 3h',  createdAt: new Date(Date.now() - 10800000).toISOString(), read: false },
    { id: 'n3', type: 'application_accepted', title: 'Candidature acceptée',         description: 'Restaurant Le Panorama - hier',               createdAt: new Date(Date.now() - 86400000).toISOString(), read: true  },
  ],
};

export function useCandidatDashboard() {
  return useApiResource<DashboardData>({
    fetcher: fetchCandidatDashboard,
    devFallback: DEV_MOCK,
  });
}
