// src/validators/roles.validator.ts
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// ROLE VALIDATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Schéma pour récupérer un rôle
 */
export const getRoleSchema = z.object({
  params: z.object({
    role: z.enum(['SUPER_ADMIN', 'EDITOR'], { message: 'Rôle invalide' }),
  }),
});

/**
 * Schéma pour mettre à jour les permissions d'un rôle
 */
export const updateRolePermissionsSchema = z.object({
  params: z.object({
    role: z.enum(['SUPER_ADMIN', 'EDITOR'], { message: 'Rôle invalide' }),
  }),
  body: z.object({
    permissions: z.array(z.string(), { message: 'Les permissions doivent être un tableau de chaînes' }),
  }),
});