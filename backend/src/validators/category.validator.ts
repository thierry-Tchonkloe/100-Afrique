import { z } from 'zod';

/**
 * Schéma de validation pour la création d'une catégorie
 */
export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({
        message: 'Le nom est requis',
      })
      .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
      .max(100, { message: 'Le nom ne peut pas dépasser 100 caractères' }),
    description: z
      .string()
      .max(500, { message: 'La description ne peut pas dépasser 500 caractères' })
      .optional(),
    type: z.enum(['MAGAZINE', 'DESTINATION'], {
      message: 'Le type est requis',
    }),
    order: z.number().int().min(0).optional(),
  }),
});

/**
 * Schéma de validation pour la modification d'une catégorie
 */
export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
  body: z.object({
    name: z
      .string()
      .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
      .max(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
      .optional(),
    description: z
      .string()
      .max(500, { message: 'La description ne peut pas dépasser 500 caractères' })
      .optional(),
    type: z.enum(['MAGAZINE', 'DESTINATION']).optional(),
    order: z.number().int().min(0).optional(),
  }),
});

/**
 * Schéma de validation pour récupérer une catégorie par ID
 */
export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
});

/**
 * Schéma de validation pour récupérer une catégorie par slug
 */
export const getCategoryBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, { message: 'Le slug est requis' }),
  }),
});