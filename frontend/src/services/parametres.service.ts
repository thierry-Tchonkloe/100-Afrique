// src/services/parametres.service.ts
import axios from 'axios';
import type {
  CandidatSettings,
  ChangePasswordPayload,
  PrivacySettings,
  NotificationPrefs,
} from '../types/parametres.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

// ── Instance candidat settings ─────────────────────────────────────────────
const api = axios.create({
  baseURL: `${BASE_URL}/emploi/candidat`,
  withCredentials: true,
});

// ── Instance auth (pour changer le mot de passe) ───────────────────────────
const authApi = axios.create({
  baseURL: `${BASE_URL}/emploi/auth`,
  withCredentials: true,
});

function attachToken(config: any) {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('emploi_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

api.interceptors.request.use(attachToken);
authApi.interceptors.request.use(attachToken);

// ─── Fetch all settings ──────────────────────────────────────────────────────
export async function fetchSettings(): Promise<CandidatSettings> {
  const { data } = await api.get<{ success: boolean; data: CandidatSettings }>('/settings');
  return data.data;
}

// ─── Email ───────────────────────────────────────────────────────────────────
// Route backend : PATCH /api/emploi/candidat/settings/email
export async function updateEmail(email: string, currentPassword: string): Promise<void> {
  await api.patch('/settings/email', { email, currentPassword });
}

// ─── Password ────────────────────────────────────────────────────────────────
// Route backend : PATCH /api/emploi/auth/password  ← correction ici
export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await authApi.patch('/password', {
    currentPassword: payload.currentPassword,
    newPassword:     payload.newPassword,
  });
}

// ─── 2FA ─────────────────────────────────────────────────────────────────────
// Route backend : PATCH /api/emploi/candidat/settings/2fa
export async function toggleTwoFactor(enabled: boolean): Promise<void> {
  await api.patch('/settings/2fa', { enabled });
}

// ─── Privacy ─────────────────────────────────────────────────────────────────
// Route backend : PATCH /api/emploi/candidat/settings/privacy
export async function updatePrivacy(payload: Partial<PrivacySettings>): Promise<void> {
  await api.patch('/settings/privacy', payload);
}

// ─── Notifications ───────────────────────────────────────────────────────────
// Route backend : PATCH /api/emploi/candidat/settings/notifications
export async function updateNotifications(payload: Partial<NotificationPrefs>): Promise<void> {
  await api.patch('/settings/notifications', payload);
}

// ─── LinkedIn ────────────────────────────────────────────────────────────────
// Route backend : POST /api/emploi/candidat/settings/linkedin/link
export async function linkLinkedIn(): Promise<{ authUrl: string }> {
  const { data } = await api.post<{ success: boolean; data: { authUrl: string } }>(
    '/settings/linkedin/link'
  );
  return data.data ?? (data as unknown as { authUrl: string });
}

export async function unlinkLinkedIn(): Promise<void> {
  await api.delete('/settings/linkedin');
}

// ─── Danger zone ─────────────────────────────────────────────────────────────
// Route backend : PATCH /api/emploi/candidat/settings/pause
export async function pauseAccount(): Promise<void> {
  await api.patch('/settings/pause');
}

// Route backend : GET /api/emploi/candidat/settings/export
export async function exportData(): Promise<Blob> {
  const { data } = await api.get('/settings/export', { responseType: 'blob' });
  return data;
}

// Route backend : DELETE /api/emploi/candidat/settings/account
export async function deleteAccount(password: string): Promise<void> {
  await api.delete('/settings/account', { data: { password } });
}

export default api;
