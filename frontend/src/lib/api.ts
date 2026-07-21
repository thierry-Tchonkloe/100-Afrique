// src/lib/api.ts
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getToken } from '@/lib/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // 10s était trop court pour un cold start Render ; les calls clients
  // restants (ads, chatbot, pagination magazines) ont maintenant 20s.
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Réessaie automatiquement en cas de timeout / coupure réseau, avec un
// backoff exponentiel (~1s, 2s, 4s). N'intervient pas sur les vraies
// erreurs fonctionnelles (4xx/5xx avec réponse du serveur).
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.code === 'ECONNABORTED',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
