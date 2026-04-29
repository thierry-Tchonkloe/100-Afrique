// src/services/vitrine.service.ts
import axios from 'axios';
import type { VitrineData, SocialLinks } from '@/types/vitrine.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({
  baseURL: `${BASE_URL}/emploi/recruteur`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('emploi_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchVitrine(etablissementId?: string): Promise<VitrineData> {
  const { data } = await api.get<VitrineData>('/vitrine', { params: { etablissementId } });
  return data;
}

export async function updateVitrine(payload: Partial<VitrineData>): Promise<VitrineData> {
  const { data } = await api.patch<VitrineData>('/vitrine', payload);
  return data;
}

export async function uploadLogo(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('logo', file);
  const { data } = await api.post<{ url: string }>('/vitrine/logo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function uploadBanner(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('banner', file);
  const { data } = await api.post<{ url: string }>('/vitrine/banner', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function uploadPhoto(file: File): Promise<{ id: string; url: string }> {
  const form = new FormData();
  form.append('photo', file);
  const { data } = await api.post<{ id: string; url: string }>('/vitrine/photos', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deletePhoto(id: string): Promise<void> {
  await api.delete(`/vitrine/photos/${id}`);
}

export async function addVideo(url: string): Promise<{ id: string; url: string; thumbnailUrl: string }> {
  const { data } = await api.post('/vitrine/videos', { url });
  return data;
}

export async function deleteVideo(id: string): Promise<void> {
  await api.delete(`/vitrine/videos/${id}`);
}

export default api;