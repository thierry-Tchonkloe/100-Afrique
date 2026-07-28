// src/services/offres.service.ts
import { createEmploiApi, unwrap } from '@/lib/emploi-api';
import type { OffresResponse, Offre, OffreFormData, OffreStatus } from '@/types/offres.types';

const api = createEmploiApi('recruteur');

// etablissementId est obligatoire pour isoler les données du bon compte
// (voir resolveActiveEtablissementId côté backend — même logique de scoping
// que useOffres/useVitrine/useRecruteurDashboard côté front).
export async function fetchOffres(etablissementId?: string): Promise<OffresResponse> {
  const { data } = await api.get('/offres', { params: etablissementId ? { etablissementId } : undefined });
  return unwrap<OffresResponse>(data);
}

export async function createOffre(payload: OffreFormData): Promise<Offre> {
  const { data } = await api.post('/offres', payload);
  return unwrap<Offre>(data);
}

export async function updateOffre(id: string, payload: Partial<OffreFormData>): Promise<Offre> {
  const { data } = await api.patch(`/offres/${id}`, payload);
  return unwrap<Offre>(data);
}

export async function updateOffreStatus(id: string, status: OffreStatus): Promise<Offre> {
  const { data } = await api.patch(`/offres/${id}/status`, { status });
  return unwrap<Offre>(data);
}

export async function duplicateOffre(id: string): Promise<Offre> {
  const { data } = await api.post(`/offres/${id}/duplicate`);
  return unwrap<Offre>(data);
}

export async function archiveOffre(id: string): Promise<void> {
  await api.delete(`/offres/${id}`);
}

export default api;
