// src/validators/emploi/auth.validator.ts
import { z } from 'zod';

export const registerSchema = z.object({
  body: z
    .object({
      email: z.string().email({ message: 'Email invalide' }),
      password: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
      firstName: z.string().min(1, { message: 'Le prénom est requis' }),
      lastName: z.string().min(1, { message: 'Le nom est requis' }),
      role: z.enum(['CANDIDAT', 'RECRUITER']).default('CANDIDAT'),
      etablissementId: z.coerce.number().int().positive().optional(),
      companyName: z.string().trim().min(1).optional(),
      etablissementSector: z.string().optional(),
      etablissementCity: z.string().optional(),
    })
    .refine((data) => data.role !== 'RECRUITER' || Boolean(data.etablissementId || data.companyName), {
      message: "Le nom de l'entreprise (ou un établissement existant) est requis pour un compte recruteur",
      path: ['companyName'],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Email invalide' }),
    password: z.string().min(1, { message: 'Le mot de passe est requis' }),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, { message: 'Le mot de passe actuel est requis' }),
    newPassword: z.string().min(8, { message: 'Le nouveau mot de passe doit contenir au moins 8 caractères' }),
  }),
});