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

export async function fetchOffres(etablissementId?: string): Promise<OffresResponse> {
  const { data } = await api.get<OffresResponse>('/offres', {
    params: { etablissementId },
  });
  return data;
}

export async function createOffre(payload: OffreFormData): Promise<Offre> {
  const { data } = await api.post<Offre>('/offres', payload);
  return data;
}

export async function updateOffre(id: string, payload: Partial<OffreFormData>): Promise<Offre> {
  const { data } = await api.patch<Offre>(`/offres/${id}`, payload);
  return data;
}

export async function updateOffreStatus(id: string, status: OffreStatus): Promise<Offre> {
  const { data } = await api.patch<Offre>(`/offres/${id}/status`, { status });
  return data;
}

export async function duplicateOffre(id: string): Promise<Offre> {
  const { data } = await api.post<Offre>(`/offres/${id}/duplicate`);
  return data;
}

export async function archiveOffre(id: string): Promise<void> {
  await api.delete(`/offres/${id}`);
}

export default api;