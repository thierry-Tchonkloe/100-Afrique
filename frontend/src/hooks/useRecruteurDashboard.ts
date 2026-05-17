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


















// // src/hooks/useRecruteurDashboard.ts
// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { fetchRecruteurDashboard } from '@/services/recruteur.service';
// import type { RecruteurDashboardData, DashboardPeriod } from '@/types/recruteur.types';

// const MOCK: RecruteurDashboardData = {
//   profile: {
//     id: 'rec-001',
//     firstName: 'Marie',
//     lastName: 'Dubois',
//     email: 'marie.dubois@grandhotel.fr',
//     role: 'RECRUITER',
//     etablissements: [
//       { id: 'etab-001', name: 'Grand Hôtel de Paris',    sector: 'Hôtellerie', city: 'Paris' },
//       { id: 'etab-002', name: "Spa Resort Côte d'Azur",  sector: 'Bien-être',  city: 'Nice'  },
//     ],
//     activeEtablissementId: 'etab-001',
//   },
//   stats: {
//     porteeGlobale:      2847,
//     porteeEvolution:    15,
//     candidatures:       47,
//     candidaturesEvol:   12,
//     offresActives:      8,
//     tauxConversion:     1.65,
//     tauxConversionEvol: 3,
//   },
//   chartData: [
//     { date: '1 Jan', value: 4  },
//     { date: '2 Jan', value: 7  },
//     { date: '3 Jan', value: 5  },
//     { date: '4 Jan', value: 9  },
//     { date: '5 Jan', value: 11 },
//     { date: '6 Jan', value: 14 },
//     { date: '7 Jan', value: 15 },
//   ],
//   metierParts: [
//     { name: 'Hôtellerie',    value: 45, color: '#E8622A' },
//     { name: 'Restauration',  value: 25, color: '#1E2A3A' },
//     { name: 'MICE',          value: 15, color: '#3B5BDB' },
//     { name: 'Tech Tourisme', value: 10, color: '#4CAF50' },
//     { name: 'Autres',        value: 5,  color: '#9E9E9E' },
//   ],
//   recentCandidatures: [
//     { id: 'c-001', candidatName: 'Sophie Martin', jobTitle: 'Réceptionniste',  receivedAt: new Date(Date.now() - 2 * 3600000).toISOString(), starred: false },
//     { id: 'c-002', candidatName: 'Thomas Durand', jobTitle: 'Chef de Cuisine', receivedAt: new Date(Date.now() - 4 * 3600000).toISOString(), starred: false },
//     { id: 'c-003', candidatName: 'Emma Rousseau', jobTitle: 'Gouvernante',     receivedAt: new Date(Date.now() - 6 * 3600000).toISOString(), starred: false },
//   ],
//   vitrineHealth: {
//     completionScore: 75,
//     views:           1245,
//     engagementRate:  8,
//   },
//   newCandidaturesCount: 5,
// };

// interface UseRecruteurDashboardReturn {
//   data: RecruteurDashboardData | null;
//   loading: boolean;
//   period: DashboardPeriod;
//   setPeriod: (p: DashboardPeriod) => void;
//   setData: React.Dispatch<React.SetStateAction<RecruteurDashboardData | null>>;
//   refetch: () => void;
// }

// export function useRecruteurDashboard(): UseRecruteurDashboardReturn {
//   const [data,    setData]    = useState<RecruteurDashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [period,  setPeriod]  = useState<DashboardPeriod>('7d');

//   // Ref pour l'établissement actif : évite de mettre `data` dans les
//   // dépendances de useCallback (ce qui causerait une boucle infinie)
//   const activeEtabRef = useRef<string | undefined>(undefined);

//   useEffect(() => {
//     if (data?.profile.activeEtablissementId) {
//       activeEtabRef.current = data.profile.activeEtablissementId;
//     }
//   }, [data?.profile.activeEtablissementId]);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Si l'établissement actif est connu, on le passe ; sinon le backend
//       // utilisera le isDefault:true de RecruteurEtablissement
//       const result = await fetchRecruteurDashboard(activeEtabRef.current, period);
//       setData(result);
//     } catch {
//       setData(MOCK);
//     } finally {
//       setLoading(false);
//     }
//   }, [period]); // ← uniquement `period`, pas `data`

//   useEffect(() => { load(); }, [load]);

//   return { data, loading, period, setPeriod, setData, refetch: load };
// }

















// // src/hooks/useRecruteurDashboard.ts
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { fetchRecruteurDashboard } from '@/services/recruteur.service';
// import type { RecruteurDashboardData, DashboardPeriod } from '@/types/recruteur.types';

// const MOCK: RecruteurDashboardData = {
//   profile: {
//     id: 'rec-001',
//     firstName: 'Marie',
//     lastName: 'Dubois',
//     email: 'marie.dubois@grandhotel.fr',
//     role: 'RECRUITER',
//     etablissements: [
//       { id: 'etab-001', name: 'Grand Hôtel de Paris',    sector: 'Hôtellerie', city: 'Paris' },
//       { id: 'etab-002', name: "Spa Resort Côte d'Azur",  sector: 'Bien-être',  city: 'Nice'  },
//     ],
//     activeEtablissementId: 'etab-001',
//   },
//   stats: {
//     porteeGlobale:      2847,
//     porteeEvolution:    15,
//     candidatures:       47,
//     candidaturesEvol:   12,
//     offresActives:      8,
//     tauxConversion:     1.65,
//     tauxConversionEvol: 3,
//   },
//   chartData: [
//     { date: '1 Jan', value: 4  },
//     { date: '2 Jan', value: 7  },
//     { date: '3 Jan', value: 5  },
//     { date: '4 Jan', value: 9  },
//     { date: '5 Jan', value: 11 },
//     { date: '6 Jan', value: 14 },
//     { date: '7 Jan', value: 15 },
//   ],
//   metierParts: [
//     { name: 'Hôtellerie',    value: 45, color: '#E8622A' },
//     { name: 'Restauration',  value: 25, color: '#1E2A3A' },
//     { name: 'MICE',          value: 15, color: '#3B5BDB' },
//     { name: 'Tech Tourisme', value: 10, color: '#4CAF50' },
//     { name: 'Autres',        value: 5,  color: '#9E9E9E'  },
//   ],
//   recentCandidatures: [
//     {
//       id: 'c-001',
//       candidatName: 'Sophie Martin',
//       jobTitle: 'Réceptionniste',
//       receivedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
//       starred: false,
//     },
//     {
//       id: 'c-002',
//       candidatName: 'Thomas Durand',
//       jobTitle: 'Chef de Cuisine',
//       receivedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
//       starred: false,
//     },
//     {
//       id: 'c-003',
//       candidatName: 'Emma Rousseau',
//       jobTitle: 'Gouvernante',
//       receivedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
//       starred: false,
//     },
//   ],
//   vitrineHealth: {
//     completionScore: 75,
//     views: 1245,
//     engagementRate: 8,
//   },
//   newCandidaturesCount: 5,
// };

// interface UseRecruteurDashboardReturn {
//   data: RecruteurDashboardData | null;
//   loading: boolean;
//   period: DashboardPeriod;
//   setPeriod: (p: DashboardPeriod) => void;
//   setData: React.Dispatch<React.SetStateAction<RecruteurDashboardData | null>>;
//   refetch: () => void;
// }

// export function useRecruteurDashboard(): UseRecruteurDashboardReturn {
//   const [data, setData]       = useState<RecruteurDashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [period, setPeriod]   = useState<DashboardPeriod>('7d');

//   // ── FIX: on stocke l'etablissementId dans un state séparé pour éviter
//   // la dépendance circulaire data → load → data dans useCallback.
//   const [etablissementId, setEtablissementId] = useState<string>('etab-001');

//   // Quand le profil chargé fournit un etablissementId réel, on le synchronise.
//   useEffect(() => {
//     if (data?.profile.activeEtablissementId) {
//       setEtablissementId(data.profile.activeEtablissementId);
//     }
//   }, [data?.profile.activeEtablissementId]);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const result = await fetchRecruteurDashboard(etablissementId, period);
//       setData(result);
//     } catch {
//       setData(MOCK);
//     } finally {
//       setLoading(false);
//     }
//   }, [etablissementId, period]); // ← dépendances stables, pas de référence à data

//   useEffect(() => { load(); }, [load]);

//   return { data, loading, period, setPeriod, setData, refetch: load };
// }

















// // src/hooks/useRecruteurDashboard.ts
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { fetchRecruteurDashboard } from '@/services/recruteur.service';
// import type { RecruteurDashboardData, DashboardPeriod } from '@/types/recruteur.types';

// const MOCK: RecruteurDashboardData = {
//   profile: {
//     id: 'rec-001',
//     firstName: 'Marie',
//     lastName: 'Dubois',
//     email: 'marie.dubois@grandhotel.fr',
//     role: 'RECRUITER',
//     etablissements: [
//       { id: 'etab-001', name: 'Grand Hôtel de Paris',  sector: 'Hôtellerie', city: 'Paris' },
//       { id: 'etab-002', name: 'Spa Resort Côte d\'Azur', sector: 'Bien-être', city: 'Nice' },
//     ],
//     activeEtablissementId: 'etab-001',
//   },
//   stats: {
//     porteeGlobale:      2847,
//     porteeEvolution:    15,
//     candidatures:       47,
//     candidaturesEvol:   12,
//     offresActives:      8,
//     tauxConversion:     1.65,
//     tauxConversionEvol: 3,
//   },
//   chartData: [
//     { date: '1 Jan', value: 4  },
//     { date: '2 Jan', value: 7  },
//     { date: '3 Jan', value: 5  },
//     { date: '4 Jan', value: 9  },
//     { date: '5 Jan', value: 11 },
//     { date: '6 Jan', value: 14 },
//     { date: '7 Jan', value: 15 },
//   ],
//   metierParts: [
//     { name: 'Hôtellerie',     value: 45, color: '#E8622A' },
//     { name: 'Restauration',   value: 25, color: '#1E2A3A' },
//     { name: 'MICE',           value: 15, color: '#3B5BDB' },
//     { name: 'Tech Tourisme',  value: 10, color: '#4CAF50' },
//     { name: 'Autres',         value: 5,  color: '#9E9E9E'  },
//   ],
//   recentCandidatures: [
//     { id: 'c-001', candidatName: 'Sophie Martin',  jobTitle: 'Réceptionniste', receivedAt: new Date(Date.now() - 2  * 3600000).toISOString(), starred: false },
//     { id: 'c-002', candidatName: 'Thomas Durand',  jobTitle: 'Chef de Cuisine', receivedAt: new Date(Date.now() - 4  * 3600000).toISOString(), starred: false },
//     { id: 'c-003', candidatName: 'Emma Rousseau',  jobTitle: 'Gouvernante',     receivedAt: new Date(Date.now() - 6  * 3600000).toISOString(), starred: false },
//   ],
//   vitrineHealth: {
//     completionScore: 75,
//     views: 1245,
//     engagementRate: 8,
//   },
//   newCandidaturesCount: 5,
// };

// interface UseRecruteurDashboardReturn {
//   data: RecruteurDashboardData | null;
//   loading: boolean;
//   period: DashboardPeriod;
//   setPeriod: (p: DashboardPeriod) => void;
//   setData: React.Dispatch<React.SetStateAction<RecruteurDashboardData | null>>;
//   refetch: () => void;
// }

// export function useRecruteurDashboard(): UseRecruteurDashboardReturn {
//   const [data, setData]     = useState<RecruteurDashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [period, setPeriod]  = useState<DashboardPeriod>('7d');

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const result = await fetchRecruteurDashboard(
//         data?.profile.activeEtablissementId ?? 'etab-001',
//         period
//       );
//       setData(result);
//     } catch {
//       setData(MOCK);
//     } finally {
//       setLoading(false);
//     }
//   }, [period]);

//   useEffect(() => { load(); }, [load]);

//   return { data, loading, period, setPeriod, setData, refetch: load };
// }