// src/hooks/useCandidatures.ts
'use client';

import { useApiResource } from './useApiResource';
import { fetchApplications, type ApplicationsResponse } from '@/services/candidatures.service';

const DEV_MOCK: ApplicationsResponse = {
  stats: { total: 24, inProgress: 8, interviews: 3 },
  applications: [
    { id: 'a1', jobTitle: 'Responsable Hébergement', companyName: 'Hôtel Le Grand Palais',       sector: 'hotel',      location: 'Paris',  contractType: 'CDI', postedAt: new Date('2024-01-14').toISOString(), appliedAt: new Date('2024-01-15').toISOString(), status: 'interview', timeline: [{ id: 't1', status: 'sent', date: new Date('2024-01-15').toISOString() }, { id: 't2', status: 'interview', date: new Date('2024-01-20').toISOString(), note: 'Invitation à un entretien' }] },
    { id: 'a2', jobTitle: 'Chef de Cuisine',          companyName: 'Restaurant La Table du Chef', sector: 'restaurant', location: 'Lyon',   contractType: 'CDI', postedAt: new Date('2024-01-11').toISOString(), appliedAt: new Date('2024-01-12').toISOString(), status: 'selected',  timeline: [{ id: 't1', status: 'sent', date: new Date('2024-01-12').toISOString() }] },
    { id: 'a3', jobTitle: 'Réceptionniste',           companyName: 'Auberge du Lac',              sector: 'hotel',      location: 'Annecy', contractType: 'CDI', postedAt: new Date('2024-01-04').toISOString(), appliedAt: new Date('2024-01-05').toISOString(), status: 'refused',   timeline: [{ id: 't1', status: 'sent', date: new Date('2024-01-05').toISOString() }, { id: 't2', status: 'refused', date: new Date('2024-01-10').toISOString(), note: 'Profil non retenu' }] },
  ],
};

export function useCandidatures() {
  return useApiResource<ApplicationsResponse>({
    fetcher: fetchApplications,
    devFallback: DEV_MOCK,
  });
}
