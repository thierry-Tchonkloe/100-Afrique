import type { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * Contrôleur d'authentification
 */
export class AuthController {
  /**
   * @route   POST /api/admin/register
   * @desc    Inscription d'un nouvel utilisateur
   * @access  Public (à désactiver en production)
   */
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    successResponse(res, result, 'Inscription réussie', 201);
  });

  /**
   * @route   POST /api/admin/login
   * @desc    Connexion d'un utilisateur
   * @access  Public
   */
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    successResponse(res, result, 'Connexion réussie');
  });

  /**
   * @route   GET /api/admin/me
   * @desc    Récupère les informations de l'utilisateur connecté
   * @access  Private
   */
  getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const user = await authService.getCurrentUser(userId);
    successResponse(res, user);
  });
}

export const authController = new AuthController();