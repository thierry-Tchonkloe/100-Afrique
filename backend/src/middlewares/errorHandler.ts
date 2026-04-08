// src/middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { errorResponse } from '../utils/response';

/**
 * Classe d'erreur personnalisée pour les erreurs métier
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Interface pour les erreurs Prisma
 */
interface PrismaError extends Error {
  code: string;
  meta?: {
    target?: string[];
  };
  clientVersion?: string;
}

/**
 * Middleware de gestion centralisée des erreurs
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log de l'erreur
  logger.error(`Erreur sur ${req.method} ${req.path}:`, err);

  // Erreur Zod (validation)
  if (err instanceof ZodError) {
    errorResponse(res, 'Erreur de validation des données', 400, err.issues);
    return;
  }

  // Erreur Prisma (base de données)
  if (isPrismaError(err)) {
    handlePrismaError(err, res);
    return;
  }

  // Erreur applicative personnalisée
  if (err instanceof AppError) {
    errorResponse(res, err.message, err.statusCode);
    return;
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    errorResponse(res, 'Token invalide', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    errorResponse(res, 'Token expiré', 401);
    return;
  }

  // Erreur inconnue (ne pas exposer les détails en production)
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  errorResponse(
    res,
    isDevelopment ? err.message : 'Une erreur interne est survenue',
    500,
    isDevelopment ? { stack: err.stack, name: err.name } : undefined
  );
};

/**
 * Vérifie si l'erreur est une erreur Prisma
 */
function isPrismaError(err: Error): err is PrismaError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as PrismaError).code === 'string'
  );
}

/**
 * Gestion spécifique des erreurs Prisma
 */
function handlePrismaError(err: PrismaError, res: Response): void {
  switch (err.code) {
    case 'P2002':
      // Violation de contrainte d'unicité
      const field = (err.meta?.target as string[])?.join(', ') || 'champ';
      errorResponse(res, `Ce ${field} existe déjà`, 409);
      break;

    case 'P2025':
      // Enregistrement non trouvé
      errorResponse(res, 'Ressource non trouvée', 404);
      break;

    case 'P2003':
      // Violation de clé étrangère
      errorResponse(res, 'Référence invalide', 400);
      break;

    case 'P2014':
      // Relation requise manquante
      errorResponse(res, 'Relation requise manquante', 400);
      break;

    case 'P2021':
      // Table inexistante
      errorResponse(res, 'Erreur de configuration de la base de données', 500);
      break;

    default:
      // ✅ CORRECTION : Combiner les infos dans un seul message
      logger.error(`Erreur Prisma non gérée - Code: ${err.code}`, err);
      errorResponse(
        res,
        'Erreur de base de données',
        500,
        process.env.NODE_ENV === 'development' ? { code: err.code, meta: err.meta } : undefined
      );
  }
}

/**
 * Middleware pour gérer les routes non trouvées
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  errorResponse(res, `Route ${req.originalUrl} non trouvée`, 404);
};

/**
 * Wrapper async pour capturer les erreurs dans les routes async
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};