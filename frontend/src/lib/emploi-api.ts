// src/lib/emploi-api.ts
import axios, { type AxiosInstance } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

/**
 * Crée un client axios pointant sur un sous-chemin de l'API emploi
 * (ex: 'candidat', 'recruteur', 'auth'), avec injection automatique du
 * token JWT sur chaque requête.
 */
export function createEmploiApi(subPath: string): AxiosInstance {
  const instance = axios.create({
    baseURL: `${BASE_URL}/emploi/${subPath}`.replace(/\/$/, ''),
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('emploi_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}

/** Unwrap générique de l'enveloppe backend { success, data, message }. */
export function unwrap<T>(payload: { success: boolean; data: T } | T): T {
  if (payload && typeof payload === 'object' && 'success' in (payload as object) && 'data' in (payload as object)) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}