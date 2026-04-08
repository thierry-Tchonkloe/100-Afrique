// src/controllers/users.controller.ts
import type { Request, Response } from 'express';
import { usersService } from '../services/users.service';
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * Contrôleur des utilisateurs
 */
export class UsersController {
  /**
   * @route   GET /api/admin/users
   * @desc    Liste de tous les utilisateurs
   * @access  Private (SUPER_ADMIN)
   */
  getAllUsers = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const users = await usersService.getAllUsers();
    successResponse(res, users, 'Utilisateurs récupérés avec succès');
  });

  /**
   * @route   GET /api/admin/users/:id
   * @desc    Détail d'un utilisateur
   * @access  Private (SUPER_ADMIN)
   */
  getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const user = await usersService.getUserById(parseInt(id));
    successResponse(res, user, 'Utilisateur récupéré avec succès');
  });

  /**
   * @route   PUT /api/admin/users/:id
   * @desc    Modifier un utilisateur
   * @access  Private (SUPER_ADMIN)
   */
  updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const user = await usersService.updateUser(parseInt(id), req.body);
    successResponse(res, user, 'Utilisateur modifié avec succès');
  });

  /**
   * @route   DELETE /api/admin/users/:id
   * @desc    Supprimer un utilisateur
   * @access  Private (SUPER_ADMIN)
   */
  deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const result = await usersService.deleteUser(parseInt(id));
    successResponse(res, result, 'Utilisateur supprimé avec succès');
  });

  /**
   * @route   PATCH /api/admin/users/:id/status
   * @desc    Changer le statut d'un utilisateur
   * @access  Private (SUPER_ADMIN)
   */
  updateUserStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const user = await usersService.updateUserStatus(parseInt(id), status);
    successResponse(res, user, 'Statut mis à jour avec succès');
  });
}

export const usersController = new UsersController();