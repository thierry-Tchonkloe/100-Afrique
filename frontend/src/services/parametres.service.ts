import axios from 'axios';
import type {
  CandidatSettings,
  ChangePasswordPayload,
  PrivacySettings,
  NotificationPrefs,
} from '../types/parametres.types';

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

// ─── Fetch all settings ───────────────────────────────────────────────────────
export async function fetchSettings(): Promise<CandidatSettings> {
  const { data } = await api.get<CandidatSettings>('/settings');
  return data;
}

// ─── Email ────────────────────────────────────────────────────────────────────
export async function updateEmail(email: string, currentPassword: string): Promise<void> {
  await api.patch('/settings/email', { email, currentPassword });
}

// ─── Password ─────────────────────────────────────────────────────────────────
export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await api.patch('/settings/password', payload);
}

// ─── 2FA ──────────────────────────────────────────────────────────────────────
export async function toggleTwoFactor(enabled: boolean): Promise<void> {
  await api.patch('/settings/2fa', { enabled });
}

// ─── Privacy ──────────────────────────────────────────────────────────────────
export async function updatePrivacy(payload: Partial<PrivacySettings>): Promise<void> {
  await api.patch('/settings/privacy', payload);
}

// ─── Notifications ────────────────────────────────────────────────────────────
export async function updateNotifications(payload: Partial<NotificationPrefs>): Promise<void> {
  await api.patch('/settings/notifications', payload);
}

// ─── LinkedIn ─────────────────────────────────────────────────────────────────
export async function linkLinkedIn(): Promise<{ authUrl: string }> {
  const { data } = await api.post<{ authUrl: string }>('/settings/linkedin/link');
  return data;
}

export async function unlinkLinkedIn(): Promise<void> {
  await api.delete('/settings/linkedin');
}

// ─── Danger zone ─────────────────────────────────────────────────────────────
export async function pauseAccount(): Promise<void> {
  await api.patch('/settings/pause');
}

export async function exportData(): Promise<Blob> {
  const { data } = await api.get('/settings/export', { responseType: 'blob' });
  return data;
}

export async function deleteAccount(password: string): Promise<void> {
  await api.delete('/settings/account', { data: { password } });
}

export default api;