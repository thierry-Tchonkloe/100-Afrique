// src/utils/response.ts
import type { Response } from 'express';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type ValidationErrors = Record<string, unknown> | unknown[];

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
 * @param code Code machine-readable stable (ex: 'DUPLICATE_ENTRY',
 * 'VALIDATION_ERROR'). Permet au frontend de brancher sa logique sur
 * `error.code` plutôt que de parser un message humain qui peut changer.
 */
export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: ValidationErrors,
  code?: string
): void {
  res.status(statusCode).json({
    success: false,
    message,
    ...(code && { code }),
    ...(errors && { errors }),
  });
}

export function calculatePagination(page: number, pageSize: number, totalItems: number): PaginationMeta {
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
