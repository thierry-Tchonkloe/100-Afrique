// src/services/profil.service.ts
import { createEmploiApi, unwrap } from '@/lib/emploi-api';
import type { CandidatProfil, Experience, Formation, Language } from '@/types/profil.types';

const api = createEmploiApi('candidat');

// ─── Profil ───────────────────────────────────────────────────────────────────

export async function fetchProfil(): Promise<CandidatProfil> {
  const { data } = await api.get('/profil');
  return unwrap<CandidatProfil>(data);
}

export async function updateProfilIdentity(
  payload: Partial<Pick<CandidatProfil, 'firstName' | 'lastName' | 'headline' | 'city' | 'mobility' | 'bio'>>
): Promise<void> {
  await api.patch('/profil/identity', payload);
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const form = new FormData();
  form.append('avatar', file);
  const { data } = await api.post('/profil/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return unwrap<{ avatarUrl: string }>(data);
}

// ─── Expériences ──────────────────────────────────────────────────────────────

export async function createExperience(payload: Omit<Experience, 'id'>): Promise<Experience> {
  const { data } = await api.post('/profil/experiences', payload);
  return unwrap<Experience>(data);
}

export async function updateExperience(id: string, payload: Partial<Experience>): Promise<Experience> {
  const { data } = await api.patch(`/profil/experiences/${id}`, payload);
  return unwrap<Experience>(data);
}

export async function deleteExperience(id: string): Promise<void> {
  await api.delete(`/profil/experiences/${id}`);
}

// ─── Formations ───────────────────────────────────────────────────────────────

export async function createFormation(payload: Omit<Formation, 'id'>): Promise<Formation> {
  const { data } = await api.post('/profil/formations', payload);
  return unwrap<Formation>(data);
}

export async function updateFormation(id: string, payload: Partial<Formation>): Promise<Formation> {
  const { data } = await api.patch(`/profil/formations/${id}`, payload);
  return unwrap<Formation>(data);
}

export async function deleteFormation(id: string): Promise<void> {
  await api.delete(`/profil/formations/${id}`);
}

// ─── Compétences & Langues ────────────────────────────────────────────────────

export async function updateSkills(payload: {
  hardSkills?: string[];
  softSkills?: string[];
  languages?: Language[];
}): Promise<void> {
  await api.patch('/profil/skills', payload);
}

// ─── CV & Visibilité ──────────────────────────────────────────────────────────

export async function uploadCv(file: File): Promise<{ fileName: string; updatedAt: string }> {
  const form = new FormData();
  form.append('cv', file);
  const { data } = await api.post('/profil/cv', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return unwrap<{ fileName: string; updatedAt: string }>(data);
}

export async function deleteCv(): Promise<void> {
  await api.delete('/profil/cv');
}

export async function updateVisibility(payload: { isVisible?: boolean; availability?: string }): Promise<void> {
  await api.patch('/profil/visibility', payload);
}

export default api;
