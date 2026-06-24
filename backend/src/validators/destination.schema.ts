// src/validators/destination.schema.ts
import { z } from 'zod';

/**
 * Schéma de création d'une destination
 */
export const createDestinationSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Le nom est requis' })
      .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
      .max(150, { message: 'Le nom ne peut pas dépasser 150 caractères' }),
    description: z.string().optional(),
    coverImage: z
      .string({ message: "L'image de couverture est requise" })
      .url({ message: "L'URL de l'image est invalide" }),
    continent: z
      .enum(['Afrique', 'Amérique', 'Asie', 'Europe', 'Océanie', 'Moyen-Orient'], {
        message: 'Continent invalide',
      })
      .optional(),
    featured: z.boolean().optional().default(false),
    status: z
      .enum(['PUBLISHED', 'DRAFT', 'ARCHIVED'], { message: 'Statut invalide' })
      .optional()
      .default('PUBLISHED'),

    // ── Champs enrichis ──────────────────────────────────────
    slogan: z
      .string()
      .max(200, { message: 'Le slogan ne peut pas dépasser 200 caractères' })
      .optional(),
    typeZone: z
      .enum(['Pays', 'Région', 'Ville', 'Site', 'Île'], { message: 'Type de zone invalide' })
      .optional(),
    niveauGeographique: z
      .enum(['National', 'Régional', 'Local'], { message: 'Niveau géographique invalide' })
      .optional(),
    regionAssociee: z.string().optional(),
    langue: z.string().optional(),
    monnaie: z.string().optional(),
    fuseauHoraire: z.string().optional(),
    officeTourisme: z
      .string()
      .url({ message: "L'URL de l'office de tourisme est invalide" })
      .optional(),
    climatDominant: z
      .enum([
        'Tropical',
        'Subtropical',
        'Tempéré',
        'Continental',
        'Aride',
        'Polaire',
        'Méditerranéen',
        'Océanique',
      ])
      .optional(),
    population: z.string().optional(),
    codeTel: z
      .string()
      .regex(/^\+\d{1,4}$/, { message: 'Code téléphonique invalide (ex: +212)' })
      .optional(),
    meillerePeriode: z.string().optional(),
  }),
});

/**
 * Schéma de modification d'une destination
 */
export const updateDestinationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
  body: z.object({
    name: z
      .string()
      .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
      .max(150, { message: 'Le nom ne peut pas dépasser 150 caractères' })
      .optional(),
    description: z.string().optional().nullable(),
    coverImage: z
      .string()
      .url({ message: "L'URL de l'image est invalide" })
      .optional(),
    continent: z
      .enum(['Afrique', 'Amérique', 'Asie', 'Europe', 'Océanie', 'Moyen-Orient'])
      .optional()
      .nullable(),
    featured: z.boolean().optional(),
    status: z.enum(['PUBLISHED', 'DRAFT', 'ARCHIVED']).optional(),

    // ── Champs enrichis ──────────────────────────────────────
    slogan: z.string().max(200).optional().nullable(),
    typeZone: z
      .enum(['Pays', 'Région', 'Ville', 'Site', 'Île'])
      .optional()
      .nullable(),
    niveauGeographique: z
      .enum(['National', 'Régional', 'Local'])
      .optional()
      .nullable(),
    regionAssociee: z.string().optional().nullable(),
    langue: z.string().optional().nullable(),
    monnaie: z.string().optional().nullable(),
    fuseauHoraire: z.string().optional().nullable(),
    officeTourisme: z
      .string()
      .url({ message: "L'URL de l'office de tourisme est invalide" })
      .optional()
      .nullable(),
    climatDominant: z
      .enum([
        'Tropical',
        'Subtropical',
        'Tempéré',
        'Continental',
        'Aride',
        'Polaire',
        'Méditerranéen',
        'Océanique',
      ])
      .optional()
      .nullable(),
    population: z.string().optional().nullable(),
    codeTel: z
      .string()
      .regex(/^\+\d{1,4}$/, { message: 'Code téléphonique invalide (ex: +212)' })
      .optional()
      .nullable(),
    meillerePeriode: z.string().optional().nullable(),
  }),
});

/**
 * Schéma pour récupérer par slug ou ID
 */
export const getDestinationBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, { message: 'Le slug est requis' }),
  }),
});

export const getDestinationByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
});