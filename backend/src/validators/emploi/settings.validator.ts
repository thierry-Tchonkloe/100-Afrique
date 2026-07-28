// src/validators/emploi/settings.validator.ts
import { z } from 'zod';

export const updateEmailSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  }),
});

export const updatePrivacySchema = z.object({
  body: z.object({
    profileVisible: z.boolean().optional(),
    hideLastName: z.boolean().optional(),
    hidePhoto: z.boolean().optional(),
    hideContactInfo: z.boolean().optional(),
  }),
});

export const updateNotificationsSchema = z.object({
  body: z.object({ newsletter: z.boolean().optional() }),
});

export const updateTwoFactorSchema = z.object({
  body: z.object({ enabled: z.boolean() }),
});

export const deleteAccountSchema = z.object({
  body: z.object({ password: z.string().min(1, 'Le mot de passe est requis') }),
});