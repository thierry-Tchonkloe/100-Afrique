// src/errors/http-errors.ts

import { AppError } from '../middlewares/errorHandler';

export class BadRequestError extends AppError {
  constructor(message = 'Requête invalide', public code = 'BAD_REQUEST', public details?: unknown) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentification requise ou invalide', public code = 'UNAUTHORIZED') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Vous n'avez pas accès à cette ressource", public code = 'FORBIDDEN') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Ressource introuvable', public code = 'NOT_FOUND') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflit avec une ressource existante', public code = 'CONFLICT') {
    super(message, 409);
  }
}

export class UnprocessableError extends AppError {
  constructor(message = 'Impossible de traiter la demande', public code = 'UNPROCESSABLE') {
    super(message, 422);
  }
}

/**
 * À utiliser UNIQUEMENT pour les cas vraiment inattendus (bug, panne de
 * dépendance externe). Si tu te retrouves à jeter ça souvent, c'est le
 * signe qu'il manque une erreur plus spécifique dans cette liste.
 */
export class InternalError extends AppError {
  constructor(message = 'Une erreur interne est survenue', public code = 'INTERNAL_ERROR') {
    super(message, 500);
  }
}