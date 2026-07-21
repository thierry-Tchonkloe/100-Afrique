// src/services/offres.service.ts
import axios from 'axios';
import type { OffresResponse, Offre, OffreFormData, OffreStatus } from '@/types/offres.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({
  baseURL: `${BASE_URL}/emploi/recruteur`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('emploi_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Helper de désenveloppement robuste ────────────────────────────────────────
function unwrap<T>(data: { success?: boolean; data?: T } | T): T {
  if (data && typeof data === 'object' && 'data' in data && (data as any).data !== undefined) {
    return (data as { data: T }).data;
  }
  return data as T;
}

// GET /api/emploi/recruteur/offres?etablissementId=...
// etablissementId est obligatoire pour isoler les données du bon compte
export async function fetchOffres(etablissementId?: string): Promise<OffresResponse> {
  const { data } = await api.get<{ success: boolean; data: OffresResponse }>('/offres', {
    params: etablissementId ? { etablissementId } : undefined,
  });

  const payload = unwrap(data);

  if (!payload || !Array.isArray(payload.offres)) {
    throw new Error('Format de réponse inattendu');
  }

  return payload;
}

// POST /api/emploi/recruteur/offres
export async function createOffre(payload: OffreFormData): Promise<Offre> {
  const { data } = await api.post<{ success: boolean; data: Offre }>('/offres', payload);
  return unwrap(data);
}

// PATCH /api/emploi/recruteur/offres/:id
export async function updateOffre(id: string, payload: Partial<OffreFormData>): Promise<Offre> {
  const { data } = await api.patch<{ success: boolean; data: Offre }>(`/offres/${id}`, payload);
  return unwrap(data);
}

// PATCH /api/emploi/recruteur/offres/:id/status
export async function updateOffreStatus(id: string, status: OffreStatus): Promise<Offre> {
  const { data } = await api.patch<{ success: boolean; data: Offre }>(
    `/offres/${id}/status`,
    { status },
  );
  return unwrap(data);
}

// POST /api/emploi/recruteur/offres/:id/duplicate
export async function duplicateOffre(id: string): Promise<Offre> {
  const { data } = await api.post<{ success: boolean; data: Offre }>(`/offres/${id}/duplicate`);
  return unwrap(data);
}

// DELETE /api/emploi/recruteur/offres/:id → archive côté backend
export async function archiveOffre(id: string): Promise<void> {
  await api.delete(`/offres/${id}`);
}

export default api;
