// src/middlewares/auth.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AppError } from './errorHandler';
import { prisma } from '../config/database';

/**
 * Interface pour le payload JWT
 */
export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Extension de l'interface Request pour inclure l'utilisateur
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token dans le header Authorization
 */
export const authenticate = async (
  req: Request,
  _res: Response, // ← Préfixé avec _ pour indiquer qu'il n'est pas utilisé
  next: NextFunction
): Promise<void> => {
  try {
    // Récupération du token depuis le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError("Token d'authentification manquant", 401);
    }

    const token = authHeader.split(' ')[1];

    // Vérification et décodage du token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Vérification que l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 401);
    }

    // Ajout des informations utilisateur à la requête
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware pour vérifier le rôle de l'utilisateur
 * @param roles - Liste des rôles autorisés
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Non authentifié', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(
        new AppError(
          "Vous n'avez pas les permissions nécessaires pour cette action",
          403
        )
      );
      return;
    }

    next();
  };
};

/**
 * Middleware optionnel pour récupérer l'utilisateur si le token est présent
 * Ne bloque pas si le token est absent
 */
export const optionalAuth = async (
  req: Request,
  _res: Response, // ← Préfixé avec _
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      req.user = decoded;
    }

    next();
  } catch (error) {
    // On ignore les erreurs pour l'auth optionnelle
    next();
  }
};