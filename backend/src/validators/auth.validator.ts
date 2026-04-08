import { z } from 'zod';

/**
 * Schéma de validation pour l'inscription
 */
export const registerSchema = z.object({
  body: z.object({
    email: z
      .string({
        message: "L'email est requis",
      })
      .email({ message: 'Email invalide' }),
    password: z
      .string({
        message: 'Le mot de passe est requis',
      })
      .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
      }),
    name: z
      .string({
        message: 'Le nom est requis',
      })
      .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
      .max(100, { message: 'Le nom ne peut pas dépasser 100 caractères' }),
  }),
});

/**
 * Schéma de validation pour la connexion
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        message: "L'email est requis",
      })
      .email({ message: 'Email invalide' }),
    password: z.string({
      message: 'Le mot de passe est requis',
    }),
  }),
});