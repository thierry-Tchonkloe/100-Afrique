// src/validators/languages.validator.ts
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// LANGUAGE VALIDATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Schéma pour créer une langue
 */
export const createLanguageSchema = z.object({
  body: z.object({
    code: z
      .string({ message: 'Le code de langue est requis' }) // ✅ CORRECTION
      .length(2, { message: 'Le code doit contenir exactement 2 caractères (ISO 639-1)' })
      .regex(/^[A-Z]{2}$/, { message: 'Le code doit être en majuscules (ex: FR, EN, ES)' }),
    name: z
      .string({ message: 'Le nom de la langue est requis' }) // ✅ CORRECTION
      .min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    nativeName: z
      .string({ message: 'Le nom natif de la langue est requis' }) // ✅ CORRECTION
      .min(2, { message: 'Le nom natif doit contenir au moins 2 caractères' }),
    enabled: z.boolean().optional(),
  }),
});

/**
 * Schéma pour modifier une langue
 */
export const updateLanguageSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    nativeName: z.string().min(2).optional(),
    enabled: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
  }),
});

/**
 * Schéma pour activer/désactiver une langue
 */
export const toggleLanguageSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
  body: z.object({
    enabled: z.boolean({ message: 'Le statut est requis' }), // ✅ CORRECTION
  }),
});

/**
 * Schéma pour récupérer une langue par ID
 */
export const getLanguageByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
});

/**
 * Schéma pour définir la langue par défaut
 */
export const setDefaultLanguageSchema = z.object({
  body: z.object({
    defaultLanguage: z
      .string({ message: 'Le code de langue est requis' }) // ✅ CORRECTION
      .length(2, { message: 'Le code doit contenir exactement 2 caractères' })
      .regex(/^[A-Z]{2}$/, { message: 'Le code doit être en majuscules' }),
  }),
});

/**
 * Schéma pour mettre à jour les paramètres de langue
 */
export const updateLanguageSettingsSchema = z.object({
  body: z.object({
    defaultLanguage: z.string().length(2).optional(),
    translationStrategy: z.enum(['manual', 'api'], { message: 'Stratégie invalide' }).optional(),
    syncMetadata: z.boolean().optional(),
    autoPublish: z.boolean().optional(),
    untranslatedRedirect: z
      .enum(['default', 'home', '404'], { message: 'Redirection invalide' })
      .optional(),
  }),
});