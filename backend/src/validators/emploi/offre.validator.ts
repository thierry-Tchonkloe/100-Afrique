// src/validators/emploi/offre.validator.ts
import { z } from 'zod';

const step1Schema = z.object({
  title: z.string().min(1, "Le titre de l'offre est requis"),
  sector: z.string().min(1, 'Le secteur est requis'),
  contractType: z.string().min(1, 'Le type de contrat est requis'),
  location: z.string().min(1, 'La localisation est requise'),
  salaryMin: z.coerce.number().int().nonnegative().nullable().optional(),
  salaryMax: z.coerce.number().int().nonnegative().nullable().optional(),
  remote: z.string().default('none'),
});

const step2Schema = z.object({
  missions: z.string().nullable().optional(),
  profile: z.string().nullable().optional(),
  advantages: z.string().nullable().optional(),
});

const step3Schema = z.object({
  requiredSkills: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  softwares: z.array(z.string()).default([]),
});

// Le front peut envoyer soit le format "wizard" (step1/step2/step3), soit un
// payload à plat. On valide les deux formes possibles plutôt que d'ouvrir
// la porte à `z.any()`.
export const createOffreSchema = z.object({
  body: z
    .object({
      step1: step1Schema.optional(),
      step2: step2Schema.optional(),
      step3: step3Schema.optional(),
    })
    .catchall(z.unknown())
    .refine((data) => data.step1 || data.title, {
      message: "Les informations de l'offre (step1 ou champs à plat) sont requises",
    }),
});

export const updateOffreSchema = z.object({
  body: createOffreSchema.shape.body,
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const updateOffreStatusSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'paused', 'draft', 'archived'], {
      message: 'Statut invalide : active, paused, draft ou archived attendu',
    }),
  }),
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const offreIdParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const publicJobsQuerySchema = z.object({
  query: z.object({
    sector: z.string().optional(),
    location: z.string().optional(),
    contractType: z.string().optional(),
    remote: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
  }),
});