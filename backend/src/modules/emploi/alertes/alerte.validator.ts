// src/validators/emploi/alerte.validator.ts
import { z } from 'zod';

export const createAlerteSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Le nom de l'alerte est requis"),
    keywords: z.array(z.string()).default([]),
    location: z.string().optional(),
    radius: z.coerce.number().int().positive().optional(),
    contractTypes: z.array(z.string()).default([]),
    sector: z.string().optional(),
    frequency: z.enum(['realtime', 'daily', 'weekly']).default('daily'),
    isActive: z.boolean().default(true),
  }),
});

export const updateAlerteSchema = z.object({
  body: createAlerteSchema.shape.body.partial(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const toggleAlerteSchema = z.object({
  body: z.object({ isActive: z.boolean() }),
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const alerteIdParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});