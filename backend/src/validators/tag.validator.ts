// src/validators/tag.validator.ts
import { z } from 'zod';

/**
 * Schéma de création d'un tag
 */
export const createTagSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Le nom du tag est requis' })
      .min(1, { message: 'Le nom ne peut pas être vide' }),
    slug: z
      .string({ message: 'Le slug est requis' })
      .min(1, { message: 'Le slug ne peut pas être vide' })
      .regex(/^[a-z0-9-]+$/, { message: 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets' }),
  }),
});

/**
 * Schéma de modification d'un tag
 */
export const updateTagSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
  body: z.object({
    name: z
      .string({ message: 'Le nom du tag est requis' })
      .min(1, { message: 'Le nom ne peut pas être vide' })
      .optional(),
    slug: z
      .string({ message: 'Le slug est requis' })
      .min(1, { message: 'Le slug ne peut pas être vide' })
      .regex(/^[a-z0-9-]+$/, { message: 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets' })
      .optional(),
  }),
});

/**
 * Schéma pour récupérer un tag par ID
 */
export const getTagByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
});