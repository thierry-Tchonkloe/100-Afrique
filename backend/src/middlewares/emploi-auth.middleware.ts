// src/middlewares/emploi-auth.middleware.ts
import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedError, ForbiddenError } from '../errors/http-errors';

const prisma = new PrismaClient();

export interface EmploiRequest extends Request {
  emploiUser?: {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

export async function emploiAuth(req: EmploiRequest, _res: Response, next: NextFunction): Promise<void> {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    next(new UnauthorizedError('Token manquant'));
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; role: string };
    const user = await prisma.emploiUser.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, firstName: true, lastName: true, isActive: true, avatar: true },
    });
    if (!user || !user.isActive) {
      next(new UnauthorizedError('Compte utilisateur inactif'));
      return;
    }
    req.emploiUser = user;
    next();
  } catch {
    // Toute erreur jwt.verify (signature invalide, expiré...) est gérée
    // de façon centralisée par errorHandler via ses `err.name` dédiés,
    // mais ici on l'attrape nous-même pour renvoyer un message uniforme.
    next(new UnauthorizedError('Token invalide ou expiré'));
  }
}

export function requireCandidat(req: EmploiRequest, _res: Response, next: NextFunction): void {
  if (req.emploiUser?.role !== 'CANDIDAT') {
    next(new ForbiddenError('Accès réservé aux candidats'));
    return;
  }
  next();
}

export function requireRecruiter(req: EmploiRequest, _res: Response, next: NextFunction): void {
  if (req.emploiUser?.role !== 'RECRUITER') {
    next(new ForbiddenError('Accès réservé aux recruteurs'));
    return;
  }
  next();
}
