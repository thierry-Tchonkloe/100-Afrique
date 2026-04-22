// src/services/profil.service.ts
import axios from 'axios';
import type { CandidatProfil, Experience, Formation, Language } from '@/types/profil.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const profilApi = axios.create({
  baseURL: `${BASE_URL}/emploi/candidat`,
  withCredentials: true,
});

profilApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('emploi_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Profil ───────────────────────────────────────────────────────────────────

export async function fetchProfil(): Promise<CandidatProfil> {
  const { data } = await profilApi.get<CandidatProfil>('/profil');
  return data;
}

export async function updateProfilIdentity(
  payload: Partial<Pick<CandidatProfil, 'firstName' | 'lastName' | 'headline' | 'city' | 'mobility' | 'bio'>>
): Promise<CandidatProfil> {
  const { data } = await profilApi.patch<CandidatProfil>('/profil/identity', payload);
  return data;
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const form = new FormData();
  form.append('avatar', file);
  const { data } = await profilApi.post<{ avatarUrl: string }>('/profil/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// ─── Expériences ──────────────────────────────────────────────────────────────

export async function createExperience(payload: Omit<Experience, 'id'>): Promise<Experience> {
  const { data } = await profilApi.post<Experience>('/profil/experiences', payload);
  return data;
}

export async function updateExperience(id: string, payload: Partial<Experience>): Promise<Experience> {
  const { data } = await profilApi.patch<Experience>(`/profil/experiences/${id}`, payload);
  return data;
}

export async function deleteExperience(id: string): Promise<void> {
  await profilApi.delete(`/profil/experiences/${id}`);
}

export async function reorderExperiences(orderedIds: string[]): Promise<void> {
  await profilApi.patch('/profil/experiences/reorder', { orderedIds });
}

// ─── Formations ───────────────────────────────────────────────────────────────

export async function createFormation(payload: Omit<Formation, 'id'>): Promise<Formation> {
  const { data } = await profilApi.post<Formation>('/profil/formations', payload);
  return data;
}

export async function updateFormation(id: string, payload: Partial<Formation>): Promise<Formation> {
  const { data } = await profilApi.patch<Formation>(`/profil/formations/${id}`, payload);
  return data;
}

export async function deleteFormation(id: string): Promise<void> {
  await profilApi.delete(`/profil/formations/${id}`);
}

// ─── Compétences & Langues ────────────────────────────────────────────────────

export async function updateSkills(payload: {
  hardSkills?: string[];
  softSkills?: string[];
  languages?: Language[];
}): Promise<CandidatProfil> {
  const { data } = await profilApi.patch<CandidatProfil>('/profil/skills', payload);
  return data;
}

// ─── CV & Visibilité ──────────────────────────────────────────────────────────

export async function uploadCv(file: File): Promise<{ fileName: string; updatedAt: string }> {
  const form = new FormData();
  form.append('cv', file);
  const { data } = await profilApi.post<{ fileName: string; updatedAt: string }>('/profil/cv', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteCv(): Promise<void> {
  await profilApi.delete('/profil/cv');
}

export async function updateVisibility(payload: {
  isVisible?: boolean;
  availability?: string;
}): Promise<CandidatProfil> {
  const { data } = await profilApi.patch<CandidatProfil>('/profil/visibility', payload);
  return data;
}

export default profilApi;