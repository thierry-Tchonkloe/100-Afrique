// src/controllers/emploi/auth.controller.ts
import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();
const ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);

function signToken(id: number, email: string, role: string): string {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any,
  });
}

const RegisterSchema = z.object({
  email:     z.string().email(),
  password:  z.string().min(8, 'Minimum 8 caractères'),
  firstName: z.string().min(1),
  lastName:  z.string().min(1),
  role:      z.enum(['CANDIDAT', 'RECRUITER']).default('CANDIDAT'),
});

// POST /api/emploi/auth/register
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const body = RegisterSchema.parse(req.body);
    const exists = await prisma.emploiUser.findUnique({ where: { email: body.email } });
    if (exists) { res.status(409).json({ success: false, message: 'Email déjà utilisé' }); return; }

    const password = await bcrypt.hash(body.password, ROUNDS);
    const user = await prisma.emploiUser.create({
      data: {
        email: body.email, password,
        firstName: body.firstName, lastName: body.lastName,
        role: body.role,
        settings: { create: {} },
        ...(body.role === 'CANDIDAT' && { candidatProfil: { create: {} } }),
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    res.status(201).json({ success: true, data: { user, token: signToken(user.id, user.email, user.role) } });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ success: false, errors: err.issues }); return; }
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// POST /api/emploi/auth/login
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ success: false, message: 'Email et mot de passe requis' }); return; }

    const user = await prisma.emploiUser.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, firstName: true, lastName: true, role: true, isActive: true, avatar: true },
    });
    if (!user || !user.isActive || !await bcrypt.compare(password, user.password)) {
      res.status(401).json({ success: false, message: 'Identifiants incorrects' }); return;
    }
    const { password: _, ...safeUser } = user;
    res.json({ success: true, data: { user: safeUser, token: signToken(user.id, user.email, user.role) } });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// GET /api/emploi/auth/me
export async function me(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const user = await prisma.emploiUser.findUnique({
      where: { id: req.emploiUser!.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, avatar: true, createdAt: true },
    });
    res.json({ success: true, data: user });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// PATCH /api/emploi/auth/password
export async function changePassword(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) { res.status(400).json({ success: false, message: 'Nouveau mot de passe trop court' }); return; }
    const user = await prisma.emploiUser.findUnique({ where: { id: req.emploiUser!.id } });
    if (!user || !await bcrypt.compare(currentPassword, user.password)) {
      res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect' }); return;
    }
    await prisma.emploiUser.update({ where: { id: user.id }, data: { password: await bcrypt.hash(newPassword, ROUNDS) } });
    res.json({ success: true, message: 'Mot de passe mis à jour' });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}