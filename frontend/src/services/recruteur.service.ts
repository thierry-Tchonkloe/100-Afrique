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

// ── FIX : etablissementId est optionnel — le backend utilise isDefault:true si absent
export async function fetchRecruteurDashboard(
  etablissementId: string | undefined,
  period: DashboardPeriod = '7d',
): Promise<RecruteurDashboardData> {
  const { data } = await api.get<{ success: boolean; data: RecruteurDashboardData }>('/dashboard', {
    params: {
      ...(etablissementId ? { etablissementId } : {}),
      period,
    },
  });

  const payload = data.data ?? (data as unknown as RecruteurDashboardData);

  if (!payload || typeof payload !== 'object') {
    throw new Error('Format de réponse inattendu');
  }

  return payload;
}

export async function fetchRecruteurProfile(): Promise<import('@/types/recruteur.types').RecruteurProfile> {
  const { data } = await api.get<{
    success: boolean;
    data: import('@/types/recruteur.types').RecruteurProfile;
  }>('/profile');
  return data.data ?? (data as unknown as import('@/types/recruteur.types').RecruteurProfile);
}

export async function switchEtablissement(id: string): Promise<void> {
  await api.patch('/profile/etablissement', { etablissementId: id });
}

export async function toggleCandidatureStar(id: string, starred: boolean): Promise<void> {
  await api.patch(`/candidatures/${id}/star`, { starred });
}

export default api;
















// // src/services/recruteur.service.ts
// import axios from 'axios';
// import type { RecruteurDashboardData, DashboardPeriod } from '@/types/recruteur.types';

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: `${BASE_URL}/emploi/recruteur`,
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   if (typeof window !== 'undefined') {
//     const token = localStorage.getItem('emploi_token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export async function fetchRecruteurDashboard(
//   etablissementId: string,
//   period: DashboardPeriod = '7d'
// ): Promise<RecruteurDashboardData> {
//   const { data } = await api.get<{ success: boolean; data: RecruteurDashboardData }>('/dashboard', {
//     params: { etablissementId, period },
//   });
//   return data.data ?? (data as unknown as RecruteurDashboardData);
// }

// export async function switchEtablissement(id: string): Promise<void> {
//   await api.patch('/profile/etablissement', { etablissementId: id });
// }

// export async function toggleCandidatureStar(id: string, starred: boolean): Promise<void> {
//   await api.patch(`/candidatures/${id}/star`, { starred });
// }

// export default api;