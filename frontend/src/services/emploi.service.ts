// src/services/emploi.service.ts
import axios from 'axios';
import type {
  DashboardData,
  Application,
  JobSuggestion,
  CandidatNotification,
} from '@/types/emploi.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const emploiApi = axios.create({
  baseURL: `${BASE_URL}/emploi`,
  withCredentials: true,
});

// Attach JWT from localStorage on every request (client-side only)
emploiApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('emploi_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function fetchCandidatDashboard(): Promise<DashboardData> {
  const { data } = await emploiApi.get<{ success: boolean; data: DashboardData }>('/candidat/dashboard');
  return data.data;
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function fetchAllApplications(): Promise<Application[]> {
  const { data } = await emploiApi.get<Application[]>('/candidat/applications');
  return data;
}

export async function applyToJob(jobId: string): Promise<{ message: string }> {
  const { data } = await emploiApi.post<{ success: boolean; data: { message: string } }>('/candidat/applications', { jobId });
  return data.data;
}

// ─── Suggestions ──────────────────────────────────────────────────────────────

export async function fetchJobSuggestions(sector?: string): Promise<JobSuggestion[]> {
  const { data } = await emploiApi.get<{ success: boolean; data: JobSuggestion[] }>('/candidat/suggestions', { params: { sector } });
  return data.data;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function fetchNotifications(): Promise<CandidatNotification[]> {
  const { data } = await emploiApi.get<{ success: boolean; data: CandidatNotification[] }>('/candidat/notifications');
  return data.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await emploiApi.patch(`/candidat/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await emploiApi.patch('/candidat/notifications/read-all');
}

export default emploiApi;