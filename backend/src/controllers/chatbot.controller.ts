// // src/controllers/chatbot.controller.ts
// import type { Request, Response } from 'express';
// import { chatbotService } from '../services/chatbot.service';
// import { successResponse } from '../utils/response';
// import { asyncHandler } from '../middlewares/errorHandler';

// /**
//  * Contrôleur du chatbot
//  */
// export class ChatbotController {

// src/controllers/chatbot.controller.ts
import type { Request, Response } from 'express';
import { chatbotService, type ChatbotSettings } from '../services/chatbot.service'; // Importez le type ici
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

export class ChatbotController {
  // ═══════════════════════════════════════════════════════════════════════════
  // CHATBOT SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * @route   GET /api/admin/chatbot/settings
   * @desc    Récupérer les paramètres du chatbot (Admin)
   * @access  Private (SUPER_ADMIN)
   */
  getSettings = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const settings = await chatbotService.getSettings();
    successResponse(res, settings, 'Paramètres récupérés avec succès');
  });

  // /**
  //  * @route   GET /api/chatbot/settings
  //  * @desc    Récupérer les paramètres du chatbot (Public)
  //  * @access  Public
  //  */
  // getPublicSettings = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  //   const settings = await chatbotService.getSettings();
    
  //   // Ne retourner que les champs nécessaires au frontend public
  //   const publicSettings = {
  //     isActive: settings.isActive,
  //     defaultLanguage: settings.defaultLanguage,
  //     welcomeMessage: settings.welcomeMessage,
  //     failureMessage: settings.failureMessage,
  //   };

  //   successResponse(res, publicSettings, 'Paramètres récupérés avec succès');
  // });

  /**
   * @route   GET /api/chatbot/settings
   * @desc    Récupérer les paramètres du chatbot (Public)
   * @access  Public
   */
  getPublicSettings = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    // TypeScript sait maintenant que 'settings' est de type ChatbotSettings
    const settings: ChatbotSettings = await chatbotService.getSettings();
    
    const publicSettings = {
      isActive: settings.isActive,
      defaultLanguage: settings.defaultLanguage,
      welcomeMessage: settings.welcomeMessage,
      failureMessage: settings.failureMessage,
    };

    successResponse(res, publicSettings, 'Paramètres récupérés avec succès');
  });

  /**
   * @route   PUT /api/admin/chatbot/settings
   * @desc    Mettre à jour les paramètres du chatbot
   * @access  Private (SUPER_ADMIN)
   */
  updateSettings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const settings = await chatbotService.updateSettings(req.body);
    successResponse(res, settings, 'Paramètres sauvegardés avec succès');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // CHATBOT FAQ - ADMIN
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * @route   GET /api/admin/chatbot/faqs
   * @desc    Liste de toutes les FAQs (Admin)
   * @access  Private (SUPER_ADMIN)
   */
  getAllFAQs = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const faqs = await chatbotService.getAllFAQs();
    successResponse(res, faqs, 'FAQs récupérées avec succès');
  });

  /**
   * @route   GET /api/admin/chatbot/faqs/:id
   * @desc    Détail d'une FAQ
   * @access  Private (SUPER_ADMIN)
   */
  getFAQById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const faq = await chatbotService.getFAQById(parseInt(id));
    successResponse(res, faq, 'FAQ récupérée avec succès');
  });

  /**
   * @route   POST /api/admin/chatbot/faqs
   * @desc    Créer une FAQ
   * @access  Private (SUPER_ADMIN)
   */
  createFAQ = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const faq = await chatbotService.createFAQ(req.body);
    successResponse(res, faq, 'FAQ créée avec succès', 201);
  });

  /**
   * @route   PUT /api/admin/chatbot/faqs/:id
   * @desc    Modifier une FAQ
   * @access  Private (SUPER_ADMIN)
   */
  updateFAQ = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const faq = await chatbotService.updateFAQ(parseInt(id), req.body);
    successResponse(res, faq, 'FAQ modifiée avec succès');
  });

  /**
   * @route   DELETE /api/admin/chatbot/faqs/:id
   * @desc    Supprimer une FAQ
   * @access  Private (SUPER_ADMIN)
   */
  deleteFAQ = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const result = await chatbotService.deleteFAQ(parseInt(id));
    successResponse(res, result, 'FAQ supprimée avec succès');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // CHATBOT FAQ - PUBLIC
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * @route   GET /api/chatbot/faqs
   * @desc    Liste des FAQs actives (Public)
   * @access  Public
   */
  getActiveFAQs = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const faqs = await chatbotService.getActiveFAQs();
    successResponse(res, faqs, 'FAQs récupérées avec succès');
  });
}

export const chatbotController = new ChatbotController();