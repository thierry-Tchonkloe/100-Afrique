// src/services/vitrine.service.ts
import { createEmploiApi, unwrap } from '@/lib/emploi-api';
import type { VitrineData } from '@/types/vitrine.types';

const api = createEmploiApi('recruteur');

export async function fetchVitrine(etablissementId?: string): Promise<VitrineData> {
  const { data } = await api.get('/vitrine', { params: etablissementId ? { etablissementId } : undefined });
  return unwrap<VitrineData>(data);
}

/**
 * On extrait uniquement les champs éditables — `id` et `etablissementId`
 * ne doivent jamais être envoyés en PATCH (clés internes gérées côté
 * backend), et une URL `blob:` (upload en cours, pas encore terminé) ne
 * doit jamais être persistée.
 */
export async function updateVitrine(payload: VitrineData): Promise<VitrineData> {
  const { id, etablissementId, ...editableFields } = payload as VitrineData & Record<string, unknown>;
  const safeFields: Record<string, unknown> = { ...editableFields };

  if (typeof safeFields.logoUrl === 'string' && safeFields.logoUrl.startsWith('blob:')) delete safeFields.logoUrl;
  if (typeof safeFields.bannerUrl === 'string' && safeFields.bannerUrl.startsWith('blob:')) delete safeFields.bannerUrl;

  const { data } = await api.patch('/vitrine', safeFields);
  return unwrap<VitrineData>(data);
}

export async function uploadLogo(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('logo', file);
  const { data } = await api.post('/vitrine/logo', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return unwrap<{ url: string }>(data);
}

export async function uploadBanner(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('banner', file);
  const { data } = await api.post('/vitrine/banner', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return unwrap<{ url: string }>(data);
}

export async function uploadPhoto(file: File): Promise<{ id: string; url: string }> {
  const form = new FormData();
  form.append('photo', file);
  const { data } = await api.post('/vitrine/photos', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return unwrap<{ id: string; url: string }>(data);
}

export async function deletePhoto(id: string): Promise<void> {
  await api.delete(`/vitrine/photos/${id}`);
}

export async function addVideo(url: string, title?: string): Promise<{ id: string; url: string; thumbnailUrl: string }> {
  const { data } = await api.post('/vitrine/videos', { url, title });
  return unwrap<{ id: string; url: string; thumbnailUrl: string }>(data);
}

export async function deleteVideo(id: string): Promise<void> {
  await api.delete(`/vitrine/videos/${id}`);
}

export default api;
