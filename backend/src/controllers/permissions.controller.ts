// src/controllers/permissions.controller.ts
import type { Request, Response } from 'express';
import { permissionsService } from '../services/permissions.service';
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * Contrôleur des permissions
 */
export class PermissionsController {
  /**
   * @route   GET /api/admin/permissions
   * @desc    Liste de toutes les permissions
   * @access  Private (SUPER_ADMIN)
   */
  getAllPermissions = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const permissions = await permissionsService.getAllPermissions();
    successResponse(res, permissions, 'Permissions récupérées avec succès');
  });
}

export const permissionsController = new PermissionsController();