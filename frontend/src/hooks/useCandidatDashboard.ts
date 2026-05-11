// src/hooks/useCandidatDashboard.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { fetchCandidatDashboard } from '@/services/emploi.service';
import type { DashboardData } from '@/types/emploi.types';

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

export function useCandidatDashboard() {
  const [data, setData]       = useState<DashboardData>(MOCK); // ← pas null
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try   { setData(await fetchCandidatDashboard()); }
    catch { setData(MOCK); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, refetch: load };
}



















// // src/hooks/useCandidatDashboard.ts
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { fetchCandidatDashboard } from '@/services/emploi.service';
// import type { DashboardData } from '@/types/emploi.types';

// // ── Mock data (used when API is not yet available) ────────────────────────────
// const MOCK_DASHBOARD: DashboardData = {
//   profile: {
//     id: 'cand-001',
//     firstName: 'Marie',
//     lastName: 'Dubois',
//     email: 'marie.dubois@email.com',
//     avatar: undefined,
//     title: 'Réceptionniste Hôtellerie',
//     sector: 'Hôtellerie',
//     profileStrength: 65,
//     profileStrengthMessage: "Ajoutez vos expériences pour attirer 3x plus de recruteurs",
//   },
//   stats: {
//     applicationsCount: 12,
//     profileViews: 47,
//     savedJobsCount: 8,
//     activeAlertsCount: 3,
//   },
//   recentApplications: [
//     {
//       id: 'app-001',
//       jobTitle: 'Réceptionniste',
//       companyName: 'Hôtel des Alpes',
//       sector: 'hotel',
//       appliedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
//       status: 'in_progress',
//     },
//     {
//       id: 'app-002',
//       jobTitle: 'Serveur/Serveuse',
//       companyName: 'Restaurant Le Panorama',
//       sector: 'restaurant',
//       appliedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
//       status: 'accepted',
//     },
//     {
//       id: 'app-003',
//       jobTitle: 'Concierge',
//       companyName: 'Grand Hôtel Palace',
//       sector: 'hotel',
//       appliedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
//       status: 'refused',
//     },
//   ],
//   suggestions: [
//     {
//       id: 'job-001',
//       title: 'Réceptionniste de nuit',
//       companyName: 'Hôtel Mercure',
//       location: 'Paris 15ème',
//       contractType: 'CDI',
//       publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
//       sector: 'hotel',
//     },
//     {
//       id: 'job-002',
//       title: "Agent d'accueil",
//       companyName: 'Resort Spa',
//       location: 'Cannes',
//       contractType: 'CDD',
//       publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
//       sector: 'hotel',
//     },
//     {
//       id: 'job-003',
//       title: 'Gouvernante',
//       companyName: 'Château Hôtel',
//       location: 'Lyon',
//       contractType: 'CDI',
//       publishedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
//       sector: 'hotel',
//     },
//   ],
//   notifications: [
//     {
//       id: 'notif-001',
//       type: 'new_offer',
//       title: 'Nouvelle offre correspondante',
//       description: "Alerte \"Réceptionniste Paris\" - il y a 1h",
//       createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
//       read: false,
//     },
//     {
//       id: 'notif-002',
//       type: 'profile_viewed',
//       title: 'Profil consulté',
//       description: "Un recruteur a vu votre profil - il y a 3h",
//       createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
//       read: false,
//     },
//     {
//       id: 'notif-003',
//       type: 'application_accepted',
//       title: 'Candidature acceptée',
//       description: "Restaurant Le Panorama - hier",
//       createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
//       read: true,
//     },
//   ],
// };

// interface UseDashboardReturn {
//   data: DashboardData | null;
//   loading: boolean;
//   error: string | null;
//   refetch: () => void;
// }

// export function useCandidatDashboard(): UseDashboardReturn {
//   const [data, setData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await fetchCandidatDashboard();
//       setData(result);
//     } catch {
//       // API not available yet → use mock data so the UI is always functional
//       setData(MOCK_DASHBOARD);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   return { data, loading, error, refetch: load };
// }