// src/services/recruteur.service.ts
import axios from 'axios';
import type { RecruteurDashboardData, DashboardPeriod } from '@/types/recruteur.types';

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

export async function fetchRecruteurDashboard(
  etablissementId: string,
  period: DashboardPeriod = '7d'
): Promise<RecruteurDashboardData> {
  const { data } = await api.get<RecruteurDashboardData>('/dashboard', {
    params: { etablissementId, period },
  });
  return data;
}

export async function switchEtablissement(id: string): Promise<void> {
  await api.patch('/profile/etablissement', { etablissementId: id });
}

export async function toggleCandidatureStar(id: string, starred: boolean): Promise<void> {
  await api.patch(`/candidatures/${id}/star`, { starred });
}

export default api;