// src/validators/settings.validator.ts
import { z } from 'zod';

/**
 * Schéma de modification des paramètres de taxonomie
 */
export const updateTaxonomySettingsSchema = z.object({
  body: z.object({
    maxTags: z
      .number({ message: 'Le nombre maximum de tags doit être un nombre' })
      .int({ message: 'Le nombre doit être un entier' })
      .min(1, { message: 'Le minimum est 1' })
      .max(50, { message: 'Le maximum est 50' })
      .optional(),
    tagsEnabled: z
      .boolean({ message: 'Le statut des tags doit être un booléen' })
      .optional(),
  }),
});