// src/services/alertes.service.ts
import axios from 'axios';
import type { AlerteJob, AlerteFormData } from '@/types/alertes.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({
  baseURL: `${BASE_URL}/emploi/candidat`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('emploi_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchAlertes(): Promise<AlerteJob[]> {
  const { data } = await api.get<AlerteJob[]>('/alertes');
  return data;
}

export async function createAlerte(payload: AlerteFormData): Promise<AlerteJob> {
  const { data } = await api.post<AlerteJob>('/alertes', payload);
  return data;
}

export async function updateAlerte(id: string, payload: Partial<AlerteFormData>): Promise<AlerteJob> {
  const { data } = await api.patch<AlerteJob>(`/alertes/${id}`, payload);
  return data;
}

export async function toggleAlerte(id: string, isActive: boolean): Promise<AlerteJob> {
  const { data } = await api.patch<AlerteJob>(`/alertes/${id}/toggle`, { isActive });
  return data;
}

export async function deleteAlerte(id: string): Promise<void> {
  await api.delete(`/alertes/${id}`);
}

export default api;