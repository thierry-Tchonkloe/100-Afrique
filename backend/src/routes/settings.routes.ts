// src/routes/settings.routes.ts
import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth';
import { updateTaxonomySettingsSchema } from '../validators/settings.validator';

const router = Router();

/**
 * Toutes les routes nécessitent une authentification
 */
router.use(authenticate);

/**
 * @route   GET /api/admin/settings/taxonomy
 * @desc    Récupérer les paramètres de taxonomie
 * @access  Private (SUPER_ADMIN uniquement)
 */
router.get('/taxonomy', authorize('SUPER_ADMIN'), settingsController.getTaxonomySettings);

/**
 * @route   PUT /api/admin/settings/taxonomy
 * @desc    Sauvegarder les paramètres de taxonomie
 * @access  Private (SUPER_ADMIN uniquement)
 */
router.put(
  '/taxonomy',
  authorize('SUPER_ADMIN'),
  validate(updateTaxonomySettingsSchema),
  settingsController.updateTaxonomySettings
);

export default router;