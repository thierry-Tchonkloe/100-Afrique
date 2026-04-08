// src/routes/public-chatbot.routes.ts
import { Router } from 'express';
import { chatbotController } from '../controllers/chatbot.controller';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════
// ROUTES PUBLIC (Pas d'authentification requise)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/chatbot/settings
 * @desc    Récupérer les paramètres publics du chatbot
 * @access  Public
 */
router.get('/settings', chatbotController.getPublicSettings);

/**
 * @route   GET /api/chatbot/faqs
 * @desc    Récupérer les FAQs actives
 * @access  Public
 */
router.get('/faqs', chatbotController.getActiveFAQs);

export default router;