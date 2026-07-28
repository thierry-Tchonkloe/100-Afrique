// src/services/candidatures.service.ts
import { createEmploiApi, unwrap } from '@/lib/emploi-api';
import type { Application, CandidaturesStats } from '@/types/candidatures.types';

export interface ApplicationsResponse {
  stats: CandidaturesStats;
  applications: Application[];
}

const api = createEmploiApi('candidat');

export async function fetchApplications(): Promise<ApplicationsResponse> {
  const { data } = await api.get('/applications');
  return unwrap<ApplicationsResponse>(data);
}

export async function fetchApplicationById(id: string): Promise<Application> {
  const { data } = await api.get(`/applications/${id}`);
  return unwrap<Application>(data);
}

export async function withdrawApplication(id: string): Promise<void> {
  await api.delete(`/applications/${id}`);
}

export default api;
