// src/services/candidatures.service.ts
import axios from 'axios';

// ─── Re-exported Types (fixes "has no exported member" errors) ────────────────

export type ApplicationStatus =
  | 'pending'
  | 'sent'
  | 'viewed'
  | 'in_progress'
  | 'selected'
  | 'interview'
  | 'accepted'
  | 'refused'
  | 'archived';

export interface TimelineEvent {
  id: string;
  status: ApplicationStatus;
  date: string;
  note?: string;
}

export interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  sector: string;
  location: string;
  contractType: string;
  postedAt: string;
  appliedAt: string;
  status: ApplicationStatus;
  timeline: TimelineEvent[];
  cvSent?: string;
  coverLetterSent?: boolean;
  hasChat?: boolean;
}

export interface CandidaturesStats {
  total: number;
  inProgress: number;
  interviews: number;
}

export interface ApplicationsResponse {
  stats: CandidaturesStats;
  applications: Application[];
}

export type NotificationType =
  | 'new_offer'
  | 'profile_viewed'
  | 'application_accepted'
  | 'application_refused';

export interface CandidatNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}

export type FilterTab = 'all' | 'active' | 'archived';

export const FILTER_LABELS: Record<FilterTab, string> = {
  all: 'Toutes',
  active: 'Actives',
  archived: 'Archives',
};

// ─── Axios instance ───────────────────────────────────────────────────────────

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

// ─── Exported functions ───────────────────────────────────────────────────────

export async function fetchApplications(): Promise<ApplicationsResponse> {
  const { data } = await api.get<{ success: boolean; data: ApplicationsResponse }>('/applications');
  return data.data;
}

export async function fetchApplicationById(id: string): Promise<Application> {
  const { data } = await api.get<Application>(`/applications/${id}`);
  return data;
}

export async function withdrawApplication(id: string): Promise<void> {
  await api.delete(`/applications/${id}`);
}

export default api;
