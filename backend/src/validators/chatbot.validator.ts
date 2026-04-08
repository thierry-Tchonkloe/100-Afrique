// src/validators/chatbot.validator.ts
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// CHATBOT SETTINGS VALIDATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Schéma de modification des paramètres du chatbot
 */
export const updateChatbotSettingsSchema = z.object({
  body: z.object({
    isActive: z.boolean({ message: 'Le statut doit être un booléen' }).optional(),
    defaultLanguage: z.enum(['fr', 'en'], { message: 'La langue doit être "fr" ou "en"' }).optional(),
    welcomeMessage: z
      .string({ message: 'Le message de bienvenue est requis' })
      .min(10, { message: 'Le message de bienvenue doit contenir au moins 10 caractères' })
      .max(500, { message: 'Le message de bienvenue ne peut pas dépasser 500 caractères' })
      .optional(),
    escalationKeywords: z
      .array(z.string(), { message: 'Les mots-clés doivent être un tableau de chaînes' })
      .optional(),
    // ✅ CORRECTION: Accepter les URLs complètes ET les chemins relatifs
    contactFormUrl: z
      .string({ message: 'L\'URL du formulaire est requise' })
      .min(1, { message: 'L\'URL du formulaire ne peut pas être vide' })
      .refine(
        (val) => {
          // Accepter les URLs complètes (http/https) OU les chemins relatifs commençant par /
          return val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/');
        },
        { message: 'L\'URL doit être une URL complète (http://...) ou un chemin relatif (/...)' }
      )
      .optional(),
    contactFormEnabled: z.boolean({ message: 'L\'activation du formulaire doit être un booléen' }).optional(),
    whatsappNumber: z.string().optional(),
    whatsappEnabled: z.boolean({ message: 'L\'activation WhatsApp doit être un booléen' }).optional(),
    failureMessage: z
      .string({ message: 'Le message d\'échec est requis' })
      .min(10, { message: 'Le message d\'échec doit contenir au moins 10 caractères' })
      .max(500, { message: 'Le message d\'échec ne peut pas dépasser 500 caractères' })
      .optional(),
  }),
});

// ═══════════════════════════════════════════════════════════════════════════
// CHATBOT FAQ VALIDATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Schéma de création d'une FAQ
 */
export const createFAQSchema = z.object({
  body: z.object({
    question: z
      .string({ message: 'La question est requise' })
      .min(5, { message: 'La question doit contenir au moins 5 caractères' })
      .max(500, { message: 'La question ne peut pas dépasser 500 caractères' }),
    answer: z
      .string({ message: 'La réponse est requise' })
      .min(10, { message: 'La réponse doit contenir au moins 10 caractères' }),
    priority: z
      .enum(['HIGH', 'MEDIUM', 'LOW'], { message: 'La priorité doit être HIGH, MEDIUM ou LOW' })
      .default('MEDIUM'),
    isActive: z.boolean({ message: 'Le statut doit être un booléen' }).default(true),
    order: z
      .number({ message: 'L\'ordre doit être un nombre' })
      .int({ message: 'L\'ordre doit être un entier' })
      .min(0, { message: 'L\'ordre doit être positif' })
      .default(0),
  }),
});

/**
 * Schéma de modification d'une FAQ
 */
export const updateFAQSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
  body: z.object({
    question: z
      .string({ message: 'La question est requise' })
      .min(5, { message: 'La question doit contenir au moins 5 caractères' })
      .max(500, { message: 'La question ne peut pas dépasser 500 caractères' })
      .optional(),
    answer: z
      .string({ message: 'La réponse est requise' })
      .min(10, { message: 'La réponse doit contenir au moins 10 caractères' })
      .optional(),
    priority: z
      .enum(['HIGH', 'MEDIUM', 'LOW'], { message: 'La priorité doit être HIGH, MEDIUM ou LOW' })
      .optional(),
    isActive: z.boolean({ message: 'Le statut doit être un booléen' }).optional(),
    order: z
      .number({ message: 'L\'ordre doit être un nombre' })
      .int({ message: 'L\'ordre doit être un entier' })
      .min(0, { message: 'L\'ordre doit être positif' })
      .optional(),
  }),
});

/**
 * Schéma pour récupérer une FAQ par ID
 */
export const getFAQByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
});