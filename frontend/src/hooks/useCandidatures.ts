// src/hooks/useCandidatures.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { fetchApplications, type ApplicationsResponse } from '@/services/candidatures.service';

const MOCK: ApplicationsResponse = {
  stats: { total: 24, inProgress: 8, interviews: 3 },
  applications: [
    { id: 'a1', jobTitle: 'Responsable Hébergement', companyName: 'Hôtel Le Grand Palais',     sector: 'hotel',      location: 'Paris', contractType: 'CDI', postedAt: new Date('2024-01-14').toISOString(), appliedAt: new Date('2024-01-15').toISOString(), status: 'interview', timeline: [{ id: 't1', status: 'sent', date: new Date('2024-01-15').toISOString() }, { id: 't2', status: 'interview', date: new Date('2024-01-20').toISOString(), note: 'Invitation à un entretien' }] },
    { id: 'a2', jobTitle: 'Chef de Cuisine',          companyName: 'Restaurant La Table du Chef', sector: 'restaurant', location: 'Lyon',  contractType: 'CDI', postedAt: new Date('2024-01-11').toISOString(), appliedAt: new Date('2024-01-12').toISOString(), status: 'selected',  timeline: [{ id: 't1', status: 'sent', date: new Date('2024-01-12').toISOString() }] },
    { id: 'a3', jobTitle: 'Réceptionniste',           companyName: 'Auberge du Lac',              sector: 'hotel',      location: 'Annecy',contractType: 'CDI', postedAt: new Date('2024-01-04').toISOString(), appliedAt: new Date('2024-01-05').toISOString(), status: 'refused',   timeline: [{ id: 't1', status: 'sent', date: new Date('2024-01-05').toISOString() }, { id: 't2', status: 'refused', date: new Date('2024-01-10').toISOString(), note: 'Profil non retenu' }] },
  ],
};

export function useCandidatures() {
  const [data, setData]       = useState<ApplicationsResponse>(MOCK); // ← pas null
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try   { setData(await fetchApplications()); }
    catch { setData(MOCK); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { data, loading, refetch: load };
}


















// // src/hooks/useCandidatures.ts
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { fetchApplications, type ApplicationsResponse } from '../services/candidatures.service';

// const MOCK_DATA: ApplicationsResponse = {
//   stats: { total: 24, inProgress: 8, interviews: 3 },
//   applications: [
//     {
//       id: 'app-001',
//       jobTitle: 'Responsable Hébergement',
//       companyName: 'Hôtel Le Grand Palais',
//       sector: 'hotel',
//       location: 'Paris',
//       contractType: 'CDI',
//       postedAt: new Date('2024-01-14').toISOString(),
//       appliedAt: new Date('2024-01-15').toISOString(),
//       status: 'interview',
//       hasChat: true,
//       cvSent: 'CV_Marie_Dubois.pdf',
//       coverLetterSent: true,
//       timeline: [
//         { id: 't1', status: 'sent',      date: new Date('2024-01-15').toISOString(), note: 'Candidature envoyée' },
//         { id: 't2', status: 'viewed',    date: new Date('2024-01-17').toISOString(), note: 'Profil consulté par le recruteur' },
//         { id: 't3', status: 'interview', date: new Date('2024-01-20').toISOString(), note: 'Invitation à un entretien' },
//       ],
//     },
//     {
//       id: 'app-002',
//       jobTitle: 'Chef de Cuisine',
//       companyName: 'Restaurant La Table du Chef',
//       sector: 'restaurant',
//       location: 'Lyon',
//       contractType: 'CDI',
//       postedAt: new Date('2024-01-11').toISOString(),
//       appliedAt: new Date('2024-01-12').toISOString(),
//       status: 'selected',
//       cvSent: 'CV_Marie_Dubois.pdf',
//       timeline: [
//         { id: 't1', status: 'sent',     date: new Date('2024-01-12').toISOString() },
//         { id: 't2', status: 'viewed',   date: new Date('2024-01-14').toISOString() },
//         { id: 't3', status: 'selected', date: new Date('2024-01-16').toISOString(), note: 'Profil retenu' },
//       ],
//     },
//     {
//       id: 'app-003',
//       jobTitle: 'Guide Touristique',
//       companyName: 'Agence Découverte Plus',
//       sector: 'tourism',
//       location: 'Nice',
//       contractType: 'CDD',
//       postedAt: new Date('2024-01-09').toISOString(),
//       appliedAt: new Date('2024-01-10').toISOString(),
//       status: 'viewed',
//       cvSent: 'CV_Marie_Dubois.pdf',
//       timeline: [
//         { id: 't1', status: 'sent',   date: new Date('2024-01-10').toISOString() },
//         { id: 't2', status: 'viewed', date: new Date('2024-01-12').toISOString() },
//       ],
//     },
//     {
//       id: 'app-004',
//       jobTitle: 'Barman',
//       companyName: 'Bar Le Sunset',
//       sector: 'bar',
//       location: 'Cannes',
//       contractType: 'Saisonnier',
//       postedAt: new Date('2024-01-07').toISOString(),
//       appliedAt: new Date('2024-01-08').toISOString(),
//       status: 'sent',
//       cvSent: 'CV_Marie_Dubois.pdf',
//       timeline: [
//         { id: 't1', status: 'sent', date: new Date('2024-01-08').toISOString() },
//       ],
//     },
//     {
//       id: 'app-005',
//       jobTitle: 'Réceptionniste',
//       companyName: 'Auberge du Lac',
//       sector: 'hotel',
//       location: 'Annecy',
//       contractType: 'CDI',
//       postedAt: new Date('2024-01-04').toISOString(),
//       appliedAt: new Date('2024-01-05').toISOString(),
//       status: 'refused',
//       cvSent: 'CV_Marie_Dubois.pdf',
//       timeline: [
//         { id: 't1', status: 'sent',   date: new Date('2024-01-05').toISOString() },
//         { id: 't2', status: 'viewed', date: new Date('2024-01-07').toISOString() },
//         { id: 't3', status: 'refused', date: new Date('2024-01-10').toISOString(), note: 'Profil non retenu' },
//       ],
//     },
//   ],
// };

// interface UseCandidaturesReturn {
//   data: ApplicationsResponse | null;
//   loading: boolean;
//   refetch: () => void;
// }

// export function useCandidatures(): UseCandidaturesReturn {
//   const [data, setData] = useState<ApplicationsResponse | null>(null);
//   const [loading, setLoading] = useState(true);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const result = await fetchApplications();
//       setData(result);
//     } catch {
//       setData(MOCK_DATA);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(); }, [load]);
//   return { data, loading, refetch: load };
// }