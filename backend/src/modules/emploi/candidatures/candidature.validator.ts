// src/modules/emploi/candidatures/candidature.validator.ts
import { z } from 'zod';

export const candidatureIdParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const updateCandidatureStatusSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    status: z.enum(['new', 'in_progress', 'interview', 'accepted', 'refused', 'archived'], {
      message: 'Statut de candidature invalide',
    }),
  }),
});

export const toggleFavoriteSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({ isFavorite: z.boolean() }),
});

export const toggleStarSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({ starred: z.boolean() }),
});

export const saveNotesSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({ notes: z.string().max(5000) }),
});

export const sendMessageSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    subject: z.string().min(1, 'Le sujet est requis'),
    body: z.string().min(1, 'Le message ne peut pas être vide'),
  }),
});

export const getCandidaturesQuerySchema = z.object({
  query: z.object({
    etablissementId: z.coerce.number().int().positive().optional(),
    offerId: z.coerce.number().int().positive().optional(),
  }),
});