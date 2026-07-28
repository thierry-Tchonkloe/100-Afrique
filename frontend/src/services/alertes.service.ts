// src/services/alertes.service.ts
import { createEmploiApi, unwrap } from '@/lib/emploi-api';
import type { AlerteJob, AlerteFormData } from '@/types/alertes.types';

const api = createEmploiApi('candidat');

export async function fetchAlertes(): Promise<AlerteJob[]> {
  const { data } = await api.get('/alertes');
  return unwrap<AlerteJob[]>(data) ?? [];
}

export async function createAlerte(payload: AlerteFormData): Promise<AlerteJob> {
  const { data } = await api.post('/alertes', payload);
  return unwrap<AlerteJob>(data);
}

export async function updateAlerte(id: string, payload: Partial<AlerteFormData>): Promise<AlerteJob> {
  const { data } = await api.patch(`/alertes/${id}`, payload);
  return unwrap<AlerteJob>(data);
}

export async function toggleAlerte(id: string, isActive: boolean): Promise<AlerteJob> {
  const { data } = await api.patch(`/alertes/${id}/toggle`, { isActive });
  return unwrap<AlerteJob>(data);
}

export async function deleteAlerte(id: string): Promise<void> {
  await api.delete(`/alertes/${id}`);
}

export default api;
