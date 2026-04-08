// src/utils/response.ts
import type { Response } from 'express';

/**
 * Interface pour les réponses paginées
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Type pour les erreurs de validation
 */
export type ValidationErrors = Record<string, unknown> | unknown[];

/**
 * Réponse de succès standardisée
 */
export function successResponse<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): void {
  res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    data,
  });
}

/**
 * Réponse de succès avec pagination
 */
export function paginatedResponse<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message?: string
): void {
  res.status(200).json({
    success: true,
    ...(message && { message }),
    data,
    pagination,
  });
}

/**
 * Réponse d'erreur standardisée
 */
export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: ValidationErrors
): void {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
}

/**
 * Calcule les métadonnées de pagination
 */
export function calculatePagination(
  page: number,
  pageSize: number,
  totalItems: number
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}