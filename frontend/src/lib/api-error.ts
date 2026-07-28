// src/lib/api-error.ts
import type { AxiosError } from 'axios';

export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string | null;
  readonly details: unknown;

  constructor(message: string, status: number | null, code: string | null, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype); // même piège que côté backend, même fix
  }

  /** Session invalide/expirée/role refusé — le seul cas où l'appelant doit déconnecter + rediriger. */
  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /** Panne réseau, backend injoignable — distinct d'une erreur métier propre. */
  get isNetworkError(): boolean {
    return this.status === null;
  }
}

/** Convertit n'importe quelle erreur (Axios ou non) en ApiError exploitable. */
export function toApiError(err: unknown): ApiError {
  const axiosErr = err as AxiosError<{ message?: string; code?: string; errors?: unknown }>;

  if (axiosErr?.response) {
    const { status, data } = axiosErr.response;
    return new ApiError(
      data?.message ?? 'Une erreur est survenue',
      status,
      data?.code ?? null,
      data?.errors,
    );
  }

  if (axiosErr?.request) {
    return new ApiError('Impossible de contacter le serveur. Vérifiez votre connexion.', null, 'NETWORK_ERROR');
  }

  return new ApiError(err instanceof Error ? err.message : 'Erreur inconnue', null, null);
}