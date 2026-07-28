// src/validators/emploi/candidat.validator.ts
import { z } from 'zod';

export const updateIdentitySchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'Le prénom est requis'),
    lastName: z.string().min(1, 'Le nom est requis'),
    headline: z.string().max(150).optional(),
    city: z.string().optional(),
    mobility: z.string().optional(),
    bio: z.string().max(2000).optional(),
  }),
});

export const updateSkillsSchema = z.object({
  body: z.object({
    hardSkills: z.array(z.string()).optional(),
    softSkills: z.array(z.string()).optional(),
    languages: z.array(z.object({ name: z.string(), level: z.string() })).optional(),
  }),
});

export const updateVisibilitySchema = z.object({
  body: z.object({
    isVisible: z.boolean().optional(),
    availability: z.enum(['immediate', '1month', '2months', '3months']).optional(),
  }),
});

const experienceBase = {
  jobTitle: z.string().min(1, 'Le titre du poste est requis'),
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  location: z.string().optional(),
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().optional(),
  contractType: z.string().default('CDI'),
  missions: z.array(z.string()).default([]),
};

export const createExperienceSchema = z.object({ body: z.object(experienceBase) });
export const updateExperienceSchema = z.object({
  body: z.object(experienceBase).partial(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});

const formationBase = {
  diploma: z.string().min(1, 'Le diplôme est requis'),
  school: z.string().min(1, "L'établissement est requis"),
  year: z.string().min(4, "L'année est requise"),
};

export const createFormationSchema = z.object({ body: z.object(formationBase) });
export const updateFormationSchema = z.object({
  body: z.object(formationBase).partial(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const applyToJobSchema = z.object({
  body: z.object({ jobId: z.coerce.number().int().positive({ message: "L'identifiant de l'offre est invalide" }) }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});