// src/middlewares/emploi-auth.middleware.ts
import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface EmploiRequest extends Request {
  emploiUser?: {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

export async function emploiAuth(
  req: EmploiRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, message: 'Token manquant' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number; email: string; role: string;
    };
    const user = await prisma.emploiUser.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, firstName: true, lastName: true, isActive: true },
    });
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'Utilisateur inactif' });
      return;
    }
    req.emploiUser = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
}

export function requireCandidat(
  req: EmploiRequest, res: Response, next: NextFunction
): void {
  if (req.emploiUser?.role !== 'CANDIDAT') {
    res.status(403).json({ success: false, message: 'Accès réservé aux candidats' });
    return;
  }
  next();
}

export function requireRecruiter(
  req: EmploiRequest, res: Response, next: NextFunction
): void {
  if (req.emploiUser?.role !== 'RECRUITER') {
    res.status(403).json({ success: false, message: 'Accès réservé aux recruteurs' });
    return;
  }
  next();
}