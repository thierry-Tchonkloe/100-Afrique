// src/services/parametres.service.ts
import { createEmploiApi, unwrap } from '@/lib/emploi-api';
import type { CandidatSettings, ChangePasswordPayload } from '@/types/parametres.types';

const api = createEmploiApi('candidat');
const authApi = createEmploiApi('auth');

// ─── Fetch all settings ──────────────────────────────────────────────────────
export async function fetchSettings(): Promise<CandidatSettings> {
  const { data } = await api.get('/settings');
  return unwrap<CandidatSettings>(data);
}

// ─── Email ───────────────────────────────────────────────────────────────────
export async function updateEmail(email: string, currentPassword: string): Promise<void> {
  await api.patch('/settings/email', { email, currentPassword });
}

// ─── Password ────────────────────────────────────────────────────────────────
// Route backend : PATCH /api/emploi/auth/password
export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await authApi.patch('/password', {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  });
}

// ─── 2FA ─────────────────────────────────────────────────────────────────────
export async function toggleTwoFactor(enabled: boolean): Promise<void> {
  await api.patch('/settings/2fa', { enabled });
}

// ─── Privacy ─────────────────────────────────────────────────────────────────
export async function updatePrivacy(payload: Partial<CandidatSettings['privacy']>): Promise<void> {
  await api.patch('/settings/privacy', payload);
}

// ─── Notifications ───────────────────────────────────────────────────────────
export async function updateNotifications(payload: Partial<CandidatSettings['notifications']>): Promise<void> {
  await api.patch('/settings/notifications', payload);
}

// ─── LinkedIn ────────────────────────────────────────────────────────────────
export async function linkLinkedIn(): Promise<{ authUrl: string }> {
  const { data } = await api.post('/settings/linkedin/link');
  return unwrap<{ authUrl: string }>(data);
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
