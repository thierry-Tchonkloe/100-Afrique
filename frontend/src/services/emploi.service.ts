// src/services/emploi.service.ts
import { createEmploiApi, unwrap } from '@/lib/emploi-api';
import type { DashboardData, JobSuggestion, CandidatNotification } from '@/types/emploi.types';
// FIX : `Application` (l'objet complet avec location/contractType/timeline...)
// vit dans candidatures.types.ts, sa source unique — emploi.types.ts ne
// définit plus que `RecentApplicationSummary`, la forme allégée du dashboard.
import type { Application } from '@/types/candidatures.types';

const api = createEmploiApi('candidat');

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function fetchCandidatDashboard(): Promise<DashboardData> {
  const { data } = await api.get('/dashboard');
  return unwrap<DashboardData>(data);
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function fetchAllApplications(): Promise<Application[]> {
  const { data } = await api.get('/applications');
  return unwrap<Application[]>(data);
}

export async function applyToJob(jobId: string): Promise<{ message: string; id: string }> {
  const { data } = await api.post('/applications', { jobId });
  return unwrap<{ message: string; id: string }>(data);
}

// ─── Suggestions ──────────────────────────────────────────────────────────────

export async function fetchJobSuggestions(sector?: string): Promise<JobSuggestion[]> {
  const { data } = await api.get('/suggestions', { params: { sector } });
  return unwrap<JobSuggestion[]>(data);
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function fetchNotifications(): Promise<CandidatNotification[]> {
  const { data } = await api.get('/notifications');
  return unwrap<CandidatNotification[]>(data);
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch('/notifications/read-all');
}

export default api;
