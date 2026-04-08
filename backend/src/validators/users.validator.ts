// src/validators/users.validator.ts
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// USER VALIDATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Schéma de modification d'un utilisateur
 */
export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
  body: z.object({
    name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }).optional(),
    email: z.string().email({ message: 'Email invalide' }).optional(),
    password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }).optional(),
    role: z.enum(['SUPER_ADMIN', 'EDITOR'], { message: 'Rôle invalide' }).optional(),
  }),
});

/**
 * Schéma pour récupérer un utilisateur par ID
 */
export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
});

/**
 * Schéma pour changer le statut d'un utilisateur
 */
export const updateUserStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
  body: z.object({
    status: z.enum(['ACTIVE', 'SUSPENDED'], { message: 'Statut invalide' }),
  }),
});