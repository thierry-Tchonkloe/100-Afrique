// src/routes/languages.routes.ts
import { Router } from 'express';
import { languagesController } from '../controllers/languages.controller';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth';
import {
  createLanguageSchema,
  updateLanguageSchema,
  toggleLanguageSchema,
  getLanguageByIdSchema,
  setDefaultLanguageSchema,
  updateLanguageSettingsSchema,
} from '../validators/languages.validator';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════
// Toutes les routes nécessitent une authentification
// ═══════════════════════════════════════════════════════════════════════════

router.use(authenticate);

// ═══════════════════════════════════════════════════════════════════════════
// LANGUAGES (SUPER_ADMIN uniquement)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/admin/languages/settings
 * @desc    Récupérer les paramètres de langue
 * @access  Private (SUPER_ADMIN)
 */
router.get('/settings', authorize('SUPER_ADMIN'), languagesController.getSettings);

/**
 * @route   PUT /api/admin/languages/settings
 * @desc    Mettre à jour les paramètres de langue
 * @access  Private (SUPER_ADMIN)
 */
router.put(
  '/settings',
  authorize('SUPER_ADMIN'),
  validate(updateLanguageSettingsSchema),
  languagesController.updateSettings
);

/**
 * @route   PATCH /api/admin/languages/default
 * @desc    Définir la langue par défaut
 * @access  Private (SUPER_ADMIN)
 */
router.patch(
  '/default',
  authorize('SUPER_ADMIN'),
  validate(setDefaultLanguageSchema),
  languagesController.setDefaultLanguage
);

/**
 * @route   GET /api/admin/languages
 * @desc    Liste de toutes les langues
 * @access  Private (SUPER_ADMIN)
 */
router.get('/', authorize('SUPER_ADMIN'), languagesController.getAllLanguages);

/**
 * @route   POST /api/admin/languages
 * @desc    Créer une langue
 * @access  Private (SUPER_ADMIN)
 */
router.post(
  '/',
  authorize('SUPER_ADMIN'),
  validate(createLanguageSchema),
  languagesController.createLanguage
);

/**
 * @route   GET /api/admin/languages/:id
 * @desc    Détail d'une langue
 * @access  Private (SUPER_ADMIN)
 */
router.get(
  '/:id',
  authorize('SUPER_ADMIN'),
  validate(getLanguageByIdSchema),
  languagesController.getLanguageById
);

/**
 * @route   PUT /api/admin/languages/:id
 * @desc    Modifier une langue
 * @access  Private (SUPER_ADMIN)
 */
router.put(
  '/:id',
  authorize('SUPER_ADMIN'),
  validate(updateLanguageSchema),
  languagesController.updateLanguage
);

/**
 * @route   PATCH /api/admin/languages/:id/toggle
 * @desc    Activer/désactiver une langue
 * @access  Private (SUPER_ADMIN)
 */
router.patch(
  '/:id/toggle',
  authorize('SUPER_ADMIN'),
  validate(toggleLanguageSchema),
  languagesController.toggleLanguage
);

/**
 * @route   DELETE /api/admin/languages/:id
 * @desc    Supprimer une langue
 * @access  Private (SUPER_ADMIN)
 */
router.delete(
  '/:id',
  authorize('SUPER_ADMIN'),
  validate(getLanguageByIdSchema),
  languagesController.deleteLanguage
);

export default router;