// src/validators/article.validator.ts
import { z } from 'zod';

/**
 * Schéma pour le contenu de l'article (tableau d'objets)
 */
const contentBlockSchema = z.object({
  type: z.enum(['text', 'image', 'video', 'quote', 'code', 'heading']),
  value: z.string().optional(),
  url: z.string().url().optional(),
  caption: z.string().optional(),
  language: z.string().optional(),
});


/**
 * Schéma pour la création rapide depuis le modal (sans contenu ni image)
 */
// export const quickCreateArticleSchema = z.object({
//   body: z.object({
//     title: z
//       .string({ message: 'Le titre est requis' })
//       .min(5, { message: 'Le titre doit contenir au moins 5 caractères' })
//       .max(200, { message: 'Le titre ne peut pas dépasser 200 caractères' }),
//     status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'], {
//       message: 'Statut invalide',
//     }).optional().default('DRAFT'),
//     categoryId: z
//       .number({ message: 'La catégorie est requise' })
//       .int()
//       .positive(),
//     // authorId vient de req.user, pas du body — pas besoin ici
//   }),
// });

export const quickCreateArticleSchema = z.object({
  body: z.object({
    title: z
      .string({ message: 'Le titre est requis' })
      .min(5, { message: 'Le titre doit contenir au moins 5 caractères' })
      .max(200, { message: 'Le titre ne peut pas dépasser 200 caractères' }),

    status: z
      .enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'], {
        message: 'Statut invalide',
      })
      .optional()
      .default('DRAFT'),

    categoryId: z
      .number({ message: 'La catégorie est requise' })
      .int({ message: 'La catégorie doit être un entier' })
      .positive({ message: 'La catégorie doit être un entier positif' }),

    authorId: z
      .number({ message: "L'auteur est requis" })
      .int({ message: "L'auteur doit être un entier" })
      .positive({ message: "L'auteur doit être un entier positif" }),

    type: z
      .enum(['ARTICLE', 'VIDEO', 'PAGE', 'SALON', 'DESTINATION'], { message: 'Type invalide' })
      .default('ARTICLE'),

    location: z.string().optional().nullable(),
    startDate: z.string().datetime({ message: 'Date de début invalide' }).optional().nullable(),
    endDate: z.string().datetime({ message: 'Date de fin invalide' }).optional().nullable(),

    // ✅ NOUVEAU — association optionnelle à une destination existante.
    // Le garde-fou anti self-link (type !== 'DESTINATION') reste géré
    // côté article.service.ts → quickCreateArticle(), pas ici.
    destinationId: z.number().int().positive().optional(),
  }),
});

/**
 * Schéma de validation pour la création d'un article
 */
export const createArticleSchema = z.object({
  body: z.object({
    title: z
      .string({
        message: 'Le titre est requis',
      })
      .min(5, { message: 'Le titre doit contenir au moins 5 caractères' })
      .max(200, { message: 'Le titre ne peut pas dépasser 200 caractères' }),
    content: z
      .array(contentBlockSchema, {
        message: 'Le contenu est requis',
      })
      .min(1, { message: 'Le contenu doit contenir au moins un bloc' }),
    excerpt: z
      .string()
      .max(500, { message: "L'extrait ne peut pas dépasser 500 caractères" })
      .optional(),
    coverImage: z
      .string({
        message: "L'image de couverture est requise",
      })
      .url({ message: "L'URL de l'image est invalide" }),
    categoryId: z
      .number({
        message: 'La catégorie est requise',
      })
      .int()
      .positive(),
    status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
    featured: z.boolean().optional(),
    metaTitle: z
      .string()
      .max(60, { message: 'Le meta titre ne peut pas dépasser 60 caractères' })
      .optional(),
    metaDescription: z
      .string()
      .max(160, { message: 'La meta description ne peut pas dépasser 160 caractères' })
      .optional(),
    type: z
      .enum(['ARTICLE', 'VIDEO', 'PAGE', 'SALON', 'DESTINATION'], { message: 'Type invalide' })
      .default('ARTICLE'),
    destinationId: z.number().int().positive().optional(),

    // ── Champs VIDEO ──────────────────────────────────────────
    sourceUrl: z.string().url({ message: "L'URL de la vidéo est invalide" }).optional(),
    duration: z.string().optional(),
    videoType: z
      .enum(['Interview', 'Tutoriel', 'Présentation', 'Reportage', 'Autre'])
      .optional(),
    // ── Champs PAGE ───────────────────────────────────────────
    visibility: z.enum(['public', 'private']).optional(),
    pageTemplate: z
      .enum(['Modèle Standard', 'Modèle Pleine Largeur', 'Modèle Blog'])
      .optional(),
    includeInMainMenu: z.boolean().optional(),
    includeInFooter: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
    linkGroup: z.enum(["Hôtellerie", "Transport", "Restauration", "Voyages d'Affaires", "MICE & Événements", "Divertissement", "Tourisme Durable"]).optional(),

    // ── Champs SALON ──────────────────────────────────────────
    location: z.string().optional(),
    startDate: z.string().datetime({ message: 'Date de début invalide' }).optional(),
    endDate: z.string().datetime({ message: 'Date de fin invalide' }).optional(),
    website: z.string().url({ message: "L'URL du site est invalide" }).optional(),
  }),
});

/**
 * Schéma de validation pour la modification d'un article
 */
export const updateArticleSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
  body: z.object({
    title: z
      .string()
      .min(5, { message: 'Le titre doit contenir au moins 5 caractères' })
      .max(200, { message: 'Le titre ne peut pas dépasser 200 caractères' })
      .optional(),
    content: z
      .array(contentBlockSchema)
      .min(1, { message: 'Le contenu doit contenir au moins un bloc' })
      .optional(),
    excerpt: z
      .string()
      .max(500, { message: "L'extrait ne peut pas dépasser 500 caractères" })
      .optional(),
    coverImage: z.string().url({ message: "L'URL de l'image est invalide" }).optional(),
    categoryId: z.number().int().positive().optional(),
    status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
    featured: z.boolean().optional(),
    tags: z.array(z.number()).optional(),
    metaTitle: z
      .string()
      .max(60, { message: 'Le meta titre ne peut pas dépasser 60 caractères' })
      .optional(),
    metaDescription: z
      .string()
      .max(160, { message: 'La meta description ne peut pas dépasser 160 caractères' })
      .optional(),
    destinationId: z.number().int().positive().optional().nullable(),

    // ── Champs VIDEO ──────────────────────────────────────────
    sourceUrl: z.string().url({ message: "L'URL de la vidéo est invalide" }).optional().nullable(),
    duration: z.string().optional().nullable(),
    videoType: z
      .enum(['Interview', 'Tutoriel', 'Présentation', 'Reportage', 'Autre'])
      .optional()
      .nullable(),
    // ── Champs PAGE ───────────────────────────────────────────
    visibility: z.enum(['public', 'private']).optional().nullable(),
    pageTemplate: z
      .enum(['Modèle Standard', 'Modèle Pleine Largeur', 'Modèle Blog'])
      .optional()
      .nullable(),
    includeInMainMenu: z.boolean().optional(),
    includeInFooter: z.boolean().optional(),
    sortOrder: z.number().int().optional().nullable(),
    linkGroup: z.enum(["Hôtellerie", "Transport", "Restauration", "Voyages d'Affaires", "MICE & Événements", "Divertissement", "Tourisme Durable"]).optional().nullable(),

    // ── Champs SALON ──────────────────────────────────────────
    location: z.string().optional().nullable(),
    startDate: z.string().datetime({ message: 'Date de début invalide' }).optional().nullable(),
    endDate: z.string().datetime({ message: 'Date de fin invalide' }).optional().nullable(),
    website: z.string().url({ message: "L'URL du site est invalide" }).optional().nullable(),
    relatedContentIds: z.array(z.number().int().positive()).optional(),
  }),
});

/**
 * Schéma de validation pour récupérer un article par ID
 */
export const getArticleByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID invalide' }),
  }),
});

/**
 * Schéma de validation pour récupérer un article par slug
 */
export const getArticleBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, { message: 'Le slug est requis' }),
  }),
});