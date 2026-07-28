// src/services/recruteur.service.ts
import { createEmploiApi, unwrap } from '@/lib/emploi-api';
import type { RecruteurDashboardData, DashboardPeriod, RecruteurProfile } from '@/types/recruteur.types';

const api = createEmploiApi('recruteur');

export async function fetchRecruteurDashboard(
  etablissementId: string | undefined,
  period: DashboardPeriod = '7d',
): Promise<RecruteurDashboardData> {
  const { data } = await api.get('/dashboard', {
    params: { ...(etablissementId ? { etablissementId } : {}), period },
  });
  return unwrap<RecruteurDashboardData>(data);
}

export async function fetchRecruteurProfile(): Promise<RecruteurProfile> {
  const { data } = await api.get('/profile');
  return unwrap<RecruteurProfile>(data);
}

export async function switchEtablissement(id: string): Promise<void> {
  await api.patch('/profile/etablissement', { etablissementId: id });
}

export async function toggleCandidatureStar(id: string, starred: boolean): Promise<void> {
  await api.patch(`/candidatures/${id}/star`, { starred });
}

export default api;
