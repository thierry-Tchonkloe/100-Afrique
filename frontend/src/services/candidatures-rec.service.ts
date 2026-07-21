// src/services/candidatures-rec.service.ts
import axios from 'axios';
import type {
  CandidaturesRecResponse,
  CandidatureRec,
  CandidatureRecStatus,
} from '@/types/candidatures-rec.types';

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

// ── FIX: validation robuste de la réponse API
export async function fetchCandidaturesRec(offerId?: string): Promise<CandidaturesRecResponse> {
  const { data } = await api.get<{ success: boolean; data: CandidaturesRecResponse }>(
    '/candidatures',
    { params: offerId ? { offerId } : undefined },
  );

  // Le backend envoie { success: true, data: { stats, offers, candidatures } }
  const payload = data.data ?? (data as unknown as CandidaturesRecResponse);

  if (!payload || !Array.isArray(payload.candidatures)) {
    throw new Error('Format de réponse inattendu : candidatures manquantes');
  }

  return payload;
}

export async function updateCandidatureStatus(
  id: string,
  status: CandidatureRecStatus,
): Promise<void> {
  await api.patch(`/candidatures/${id}/status`, { status });
}

export async function toggleCandidatureFavorite(id: string, isFavorite: boolean): Promise<void> {
  await api.patch(`/candidatures/${id}/favorite`, { isFavorite });
}

export async function markCandidatureRead(id: string): Promise<void> {
  await api.patch(`/candidatures/${id}/read`);
}

export async function saveRecruiterNotes(id: string, notes: string): Promise<void> {
  await api.patch(`/candidatures/${id}/notes`, { notes });
}

export async function refuseCandidature(id: string): Promise<void> {
  await api.patch(`/candidatures/${id}/status`, { status: 'refused' });
}

export async function sendMessage(
  id: string,
  payload: { subject: string; body: string },
): Promise<void> {
  await api.post(`/candidatures/${id}/message`, payload);
}

export default api;
