// src/routes/chatbot.routes.ts
import { Router } from 'express';
import { chatbotController } from '../controllers/chatbot.controller';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth';
import {
  updateChatbotSettingsSchema,
  createFAQSchema,
  updateFAQSchema,
  getFAQByIdSchema,
} from '../validators/chatbot.validator';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════
// Toutes les routes nécessitent une authentification
// ═══════════════════════════════════════════════════════════════════════════

router.use(authenticate);

// ═══════════════════════════════════════════════════════════════════════════
// CHATBOT SETTINGS (SUPER_ADMIN uniquement)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/admin/chatbot/settings
 * @desc    Récupérer les paramètres du chatbot
 * @access  Private (SUPER_ADMIN)
 */
router.get('/settings', authorize('SUPER_ADMIN'), chatbotController.getSettings);

/**
 * @route   PUT /api/admin/chatbot/settings
 * @desc    Mettre à jour les paramètres du chatbot
 * @access  Private (SUPER_ADMIN)
 */
router.put(
  '/settings',
  authorize('SUPER_ADMIN'),
  validate(updateChatbotSettingsSchema),
  chatbotController.updateSettings
);

// ═══════════════════════════════════════════════════════════════════════════
// CHATBOT FAQ (SUPER_ADMIN uniquement)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/admin/chatbot/faqs
 * @desc    Liste de toutes les FAQs
 * @access  Private (SUPER_ADMIN)
 */
router.get('/faqs', authorize('SUPER_ADMIN'), chatbotController.getAllFAQs);

/**
 * @route   GET /api/admin/chatbot/faqs/:id
 * @desc    Détail d'une FAQ
 * @access  Private (SUPER_ADMIN)
 */
router.get(
  '/faqs/:id',
  authorize('SUPER_ADMIN'),
  validate(getFAQByIdSchema),
  chatbotController.getFAQById
);

/**
 * @route   POST /api/admin/chatbot/faqs
 * @desc    Créer une FAQ
 * @access  Private (SUPER_ADMIN)
 */
router.post(
  '/faqs',
  authorize('SUPER_ADMIN'),
  validate(createFAQSchema),
  chatbotController.createFAQ
);

/**
 * @route   PUT /api/admin/chatbot/faqs/:id
 * @desc    Modifier une FAQ
 * @access  Private (SUPER_ADMIN)
 */
router.put(
  '/faqs/:id',
  authorize('SUPER_ADMIN'),
  validate(updateFAQSchema),
  chatbotController.updateFAQ
);

/**
 * @route   DELETE /api/admin/chatbot/faqs/:id
 * @desc    Supprimer une FAQ
 * @access  Private (SUPER_ADMIN)
 */
router.delete(
  '/faqs/:id',
  authorize('SUPER_ADMIN'),
  validate(getFAQByIdSchema),
  chatbotController.deleteFAQ
);

export default router;