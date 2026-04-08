// src/controllers/languages.controller.ts
import type { Request, Response } from 'express';
import { languagesService } from '../services/languages.service';
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * Contrôleur des langues
 */
export class LanguagesController {
  /**
   * @route   GET /api/admin/languages
   * @desc    Liste de toutes les langues
   * @access  Private (SUPER_ADMIN)
   */
  getAllLanguages = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const languages = await languagesService.getAllLanguages();
    successResponse(res, languages, 'Langues récupérées avec succès');
  });

  /**
   * @route   GET /api/admin/languages/:id
   * @desc    Détail d'une langue
   * @access  Private (SUPER_ADMIN)
   */
  getLanguageById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const language = await languagesService.getLanguageById(parseInt(id));
    successResponse(res, language, 'Langue récupérée avec succès');
  });

  /**
   * @route   POST /api/admin/languages
   * @desc    Créer une langue
   * @access  Private (SUPER_ADMIN)
   */
  createLanguage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const language = await languagesService.createLanguage(req.body);
    successResponse(res, language, 'Langue créée avec succès', 201);
  });

  /**
   * @route   PUT /api/admin/languages/:id
   * @desc    Modifier une langue
   * @access  Private (SUPER_ADMIN)
   */
  updateLanguage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const language = await languagesService.updateLanguage(parseInt(id), req.body);
    successResponse(res, language, 'Langue modifiée avec succès');
  });

  /**
   * @route   PATCH /api/admin/languages/:id/toggle
   * @desc    Activer/désactiver une langue
   * @access  Private (SUPER_ADMIN)
   */
  toggleLanguage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { enabled } = req.body;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const language = await languagesService.toggleLanguage(parseInt(id), enabled);
    successResponse(res, language, 'Statut mis à jour avec succès');
  });

  /**
   * @route   DELETE /api/admin/languages/:id
   * @desc    Supprimer une langue
   * @access  Private (SUPER_ADMIN)
   */
  deleteLanguage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const result = await languagesService.deleteLanguage(parseInt(id));
    successResponse(res, result, 'Langue supprimée avec succès');
  });

  /**
   * @route   PATCH /api/admin/languages/default
   * @desc    Définir la langue par défaut
   * @access  Private (SUPER_ADMIN)
   */
  setDefaultLanguage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { defaultLanguage } = req.body;

    const result = await languagesService.setDefaultLanguage(defaultLanguage);
    successResponse(res, result, 'Langue par défaut définie avec succès');
  });

  /**
   * @route   GET /api/admin/languages/settings
   * @desc    Récupérer les paramètres de langue
   * @access  Private (SUPER_ADMIN)
   */
  getSettings = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const settings = await languagesService.getSettings();
    successResponse(res, settings, 'Paramètres récupérés avec succès');
  });

  /**
   * @route   PUT /api/admin/languages/settings
   * @desc    Mettre à jour les paramètres de langue
   * @access  Private (SUPER_ADMIN)
   */
  updateSettings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const settings = await languagesService.updateSettings(req.body);
    successResponse(res, settings, 'Paramètres mis à jour avec succès');
  });
}

export const languagesController = new LanguagesController();