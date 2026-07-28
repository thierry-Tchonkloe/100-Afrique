// src/controllers/emploi/auth.controller.ts
import { type Response } from 'express';
import { authService } from '../../services/emploi/auth.service';
import { asyncHandler } from '../../middlewares/errorHandler';
import { successResponse } from '../../utils/response';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

// POST /api/emploi/auth/register
export const register = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const session = await authService.register(req.body);
  successResponse(res, session, undefined, 201);
});

// POST /api/emploi/auth/login
export const login = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const session = await authService.login(req.body);
  successResponse(res, session);
});

// GET /api/emploi/auth/me
export const me = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const user = await authService.getMe(req.emploiUser!.id);
  successResponse(res, user);
});

// PATCH /api/emploi/auth/password
export const changePassword = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await authService.changePassword(req.emploiUser!.id, req.body);
  successResponse(res, null, 'Mot de passe mis à jour');
});
