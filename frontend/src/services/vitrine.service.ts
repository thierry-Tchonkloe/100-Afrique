// src/services/vitrine.service.ts
import axios, { AxiosError } from 'axios';
import type { VitrineData } from '@/types/vitrine.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({
  baseURL: `${BASE_URL}/emploi/recruteur`,
  // Pas de withCredentials — on utilise Bearer token, pas de cookie
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('emploi_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    console.error(
      `[vitrine.service] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      `→ HTTP ${error.response?.status}`,
      error.response?.data,
    );
    return Promise.reject(error);
  },
);

function unwrap<T>(raw: unknown, label: string): T {
  if (raw && typeof raw === 'object') {
    if ('data' in raw) {
      const inner = (raw as { data: unknown }).data;
      if (inner !== undefined && inner !== null) return inner as T;
    }
    if ('success' in raw && !(raw as any).success) {
      throw new Error(`[${label}] ${(raw as any).message ?? 'Erreur API'}`);
    }
  }
  return raw as T;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET vitrine
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchVitrine(etablissementId?: string): Promise<VitrineData> {
  const { data } = await api.get('/vitrine', {
    params: etablissementId ? { etablissementId } : undefined,
  });
  return unwrap<VitrineData>(data, 'fetchVitrine');
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH vitrine
//
// On cast en Record<string, unknown> pour éviter les erreurs TS sur les champs
// que Partial<VitrineData> ne connaît pas (completionScore, views ajoutés par
// le backend). On exclut aussi id et etablissementId qui ne doivent pas être
// envoyés en PATCH.
// ─────────────────────────────────────────────────────────────────────────────

export async function updateVitrine(payload: VitrineData): Promise<VitrineData> {
  // Extraire uniquement les champs éditables — sans les champs read-only du backend
  const {
    id,              // clé interne DB → jamais envoyée
    etablissementId, // clé FK → jamais envoyée
    // completionScore et views ne sont pas dans VitrineData (calculés côté backend)
    // donc pas besoin de les destructurer
    ...editableFields
  } = payload as VitrineData & Record<string, unknown>;

  const safeFields: Record<string, unknown> = { ...editableFields };

  // Sécurité : ne jamais envoyer une blob: URL (upload en cours)
  if (typeof safeFields.logoUrl   === 'string' && safeFields.logoUrl.startsWith('blob:'))   delete safeFields.logoUrl;
  if (typeof safeFields.bannerUrl === 'string' && safeFields.bannerUrl.startsWith('blob:')) delete safeFields.bannerUrl;

  const { data } = await api.patch('/vitrine', safeFields);
  return unwrap<VitrineData>(data, 'updateVitrine');
}

// ─────────────────────────────────────────────────────────────────────────────
// Uploads
// ─────────────────────────────────────────────────────────────────────────────

export async function uploadLogo(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('logo', file);
  const { data } = await api.post('/vitrine/logo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrap<{ url: string }>(data, 'uploadLogo');
}

export async function uploadBanner(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('banner', file);
  const { data } = await api.post('/vitrine/banner', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrap<{ url: string }>(data, 'uploadBanner');
}

export async function uploadPhoto(file: File): Promise<{ id: string; url: string }> {
  const form = new FormData();
  form.append('photo', file);
  const { data } = await api.post('/vitrine/photos', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrap<{ id: string; url: string }>(data, 'uploadPhoto');
}

export async function deletePhoto(id: string): Promise<void> {
  await api.delete(`/vitrine/photos/${id}`);
}

export async function addVideo(
  url: string,
  title?: string,
): Promise<{ id: string; url: string; thumbnailUrl: string }> {
  const { data } = await api.post('/vitrine/videos', { url, title });
  return unwrap<{ id: string; url: string; thumbnailUrl: string }>(data, 'addVideo');
}

export async function deleteVideo(id: string): Promise<void> {
  await api.delete(`/vitrine/videos/${id}`);
}

export default api;
