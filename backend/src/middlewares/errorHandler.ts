// src/middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { errorResponse } from '../utils/response';

/**
 * Classe d'erreur de base. Les erreurs métier concrètes vivent dans
 * src/errors/http-errors.ts (BadRequestError, NotFoundError, ...) et
 * héritent de celle-ci. Les services ne doivent JAMAIS lancer un
 * `new Error("...")` brut : toujours une sous-classe d'AppError, sinon
 * on retombe dans le "tout en 500" repéré en revue.
 */
export class AppError extends Error {
  public code?: string;
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    // FIX : `new.target` référence la classe réellement instanciée
    // (ForbiddenError, ConflictError, ...), pas AppError elle-même.
    // L'ancienne version faisait `Object.setPrototypeOf(this, AppError.prototype)`
    // en dur, ce qui écrasait le prototype de TOUTE sous-classe et cassait
    // `instanceof ForbiddenError` (seul `instanceof AppError` restait vrai).
    // C'est exactement le bug révélé par les tests unitaires.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

interface PrismaError extends Error {
  code: string;
  meta?: { target?: string[]; cause?: string; field_name?: string };
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Toujours logger avec le chemin + la méthode : c'est ce qui permet de
  // "retrouver rapidement" un flux quand ça casse, comme demandé en revue.
  logger.error(`[${req.method} ${req.originalUrl}]`, err);

  if (err instanceof ZodError) {
    const details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    errorResponse(res, 'Certaines données envoyées sont invalides', 400, details, 'VALIDATION_ERROR');
    return;
  }

  if (isPrismaError(err)) {
    handlePrismaError(err, res);
    return;
  }

  if (err instanceof AppError) {
    errorResponse(res, err.message, err.statusCode, undefined, err.code);
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    errorResponse(res, 'Token invalide', 401, undefined, 'INVALID_TOKEN');
    return;
  }
  if (err.name === 'TokenExpiredError') {
    errorResponse(res, 'Session expirée, merci de vous reconnecter', 401, undefined, 'TOKEN_EXPIRED');
    return;
  }

  // Erreur vraiment non prévue : on ne masque rien en dev, on ne fuite
  // rien en prod, mais surtout on log tout pour pouvoir la classer plus
  // tard (ajouter une AppError dédiée si le cas se reproduit).
  const isDevelopment = process.env.NODE_ENV === 'development';
  errorResponse(
    res,
    isDevelopment ? err.message : 'Une erreur interne est survenue. Contactez le support si ça persiste.',
    500,
    isDevelopment ? { stack: err.stack, name: err.name } : undefined,
    'INTERNAL_ERROR'
  );
};

function isPrismaError(err: Error): err is PrismaError {
  return typeof err === 'object' && err !== null && 'code' in err && typeof (err as PrismaError).code === 'string';
}

function handlePrismaError(err: PrismaError, res: Response): void {
  switch (err.code) {
    case 'P2002': {
      const field = (err.meta?.target as string[])?.join(', ') || 'champ';
      errorResponse(res, `Cette valeur pour "${field}" est déjà utilisée`, 409, undefined, 'DUPLICATE_ENTRY');
      break;
    }
    case 'P2025':
      errorResponse(res, 'La ressource demandée est introuvable', 404, undefined, 'NOT_FOUND');
      break;
    case 'P2003':
      errorResponse(res, 'La référence fournie ne correspond à aucune ressource existante', 400, undefined, 'INVALID_REFERENCE');
      break;
    case 'P2014':
      errorResponse(res, 'Cette opération violerait une relation requise entre deux ressources', 400, undefined, 'RELATION_VIOLATION');
      break;
    case 'P2021':
      errorResponse(res, 'Erreur de configuration de la base de données', 500, undefined, 'DB_CONFIG_ERROR');
      break;
    default:
      logger.error(`Erreur Prisma non gérée explicitement — Code: ${err.code}`, err);
      errorResponse(
        res,
        'Erreur de base de données',
        500,
        process.env.NODE_ENV === 'development' ? { code: err.code, meta: err.meta } : undefined,
        'DATABASE_ERROR'
      );
  }
}

export const notFoundHandler = (req: Request, res: Response): void => {
  errorResponse(res, `Route ${req.originalUrl} introuvable`, 404, undefined, 'ROUTE_NOT_FOUND');
};

/**
 * Wrapper obligatoire pour TOUT contrôleur async. Élimine le besoin du
 * try/catch répété dans chaque fonction (c'est ce qui rendait les
 * contrôleurs longs) : toute exception (y compris venant du service ou
 * du repository) remonte automatiquement à errorHandler.
 */
export const asyncHandler = (fn: (...args: any[]) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
