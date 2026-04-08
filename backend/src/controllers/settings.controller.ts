// src/controllers/settings.controller.ts
import type { Request, Response } from 'express';
import { settingsService } from '../services/settings.service';
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * Contrôleur des paramètres
 */
export class SettingsController {
  /**
   * @route   GET /api/admin/settings/taxonomy
   * @desc    Récupérer les paramètres de taxonomie
   * @access  Private (SUPER_ADMIN)
   */
  // ✅ CORRECTION: Remplacer req par _req
  getTaxonomySettings = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const settings = await settingsService.getTaxonomySettings();
    successResponse(res, settings, 'Paramètres récupérés avec succès');
  });

  /**
   * @route   PUT /api/admin/settings/taxonomy
   * @desc    Sauvegarder les paramètres de taxonomie
   * @access  Private (SUPER_ADMIN)
   */
  updateTaxonomySettings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const settings = await settingsService.updateTaxonomySettings(req.body);
    successResponse(res, settings, 'Paramètres sauvegardés avec succès');
  });
}

export const settingsController = new SettingsController();