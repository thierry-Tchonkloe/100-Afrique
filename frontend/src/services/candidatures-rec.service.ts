// src/services/candidatures-rec.service.ts
import { createEmploiApi, unwrap } from '@/lib/emploi-api';
import type { CandidaturesRecResponse, CandidatureRecStatus } from '@/types/candidatures-rec.types';

const api = createEmploiApi('recruteur');

export async function fetchCandidaturesRec(etablissementId?: string, offerId?: string): Promise<CandidaturesRecResponse> {
  const { data } = await api.get('/candidatures', {
    params: { ...(etablissementId ? { etablissementId } : {}), ...(offerId ? { offerId } : {}) },
  });
  return unwrap<CandidaturesRecResponse>(data);
}

export async function updateCandidatureStatus(id: string, status: CandidatureRecStatus): Promise<void> {
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

export async function sendMessage(id: string, payload: { subject: string; body: string }): Promise<void> {
  await api.post(`/candidatures/${id}/message`, payload);
}

/**
 * Télécharge le CV via le proxy authentifié du backend (jamais un lien
 * direct vers cvUrl). Lève une erreur exploitable par l'appelant si le
 * candidat n'a pas de CV ou si l'accès est refusé (403 si l'offre
 * n'appartient pas à l'établissement du recruteur connecté).
 */
export async function downloadCandidatCv(id: string, suggestedFileName = 'cv.pdf'): Promise<void> {
  const response = await api.get(`/candidatures/${id}/cv`, { responseType: 'blob' });
  const blob = response.data as Blob;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = suggestedFileName;
  link.click();
  URL.revokeObjectURL(url);
}

export default api;
