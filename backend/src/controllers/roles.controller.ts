// src/controllers/roles.controller.ts
import type { Request, Response } from 'express';
import { rolesService } from '../services/roles.service';
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * Contrôleur des rôles
 */
export class RolesController {
  /**
   * @route   GET /api/admin/roles
   * @desc    Liste de tous les rôles avec permissions
   * @access  Private (SUPER_ADMIN)
   */
  getAllRoles = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const roles = await rolesService.getAllRoles();
    successResponse(res, roles, 'Rôles récupérés avec succès');
  });

  /**
   * @route   GET /api/admin/roles/:role
   * @desc    Détail d'un rôle avec permissions
   * @access  Private (SUPER_ADMIN)
   */
  getRoleByName = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { role } = req.params;

    if (!role || Array.isArray(role)) {
      throw new Error('Rôle invalide');
    }

    const roleData = await rolesService.getRoleByName(role as 'SUPER_ADMIN' | 'EDITOR');
    successResponse(res, roleData, 'Rôle récupéré avec succès');
  });

  /**
   * @route   PUT /api/admin/roles/:role/permissions
   * @desc    Mettre à jour les permissions d'un rôle
   * @access  Private (SUPER_ADMIN)
   */
  updateRolePermissions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { role } = req.params;
  const { permissions } = req.body;

  console.log('📥 Received data:', { role, permissions, type: typeof permissions }); // ✅ DEBUG

  if (!role || Array.isArray(role)) {
    throw new Error('Rôle invalide');
  }

  const result = await rolesService.updateRolePermissions(
    role as 'SUPER_ADMIN' | 'EDITOR',
    permissions
  );
  
  console.log('✅ Result:', result); // ✅ DEBUG
  
  successResponse(res, result, 'Permissions mises à jour avec succès');
});
}

export const rolesController = new RolesController();