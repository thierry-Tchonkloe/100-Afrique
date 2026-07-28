// src/controllers/emploi/settings.controller.ts
import { type Response } from 'express';
import { settingsService } from '../../services/emploi/settings.service';
import { asyncHandler } from '../../middlewares/errorHandler';
import { successResponse } from '../../utils/response';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

export const getSettings = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await settingsService.getSettings(req.emploiUser!.id);
  successResponse(res, data);
});

export const updateEmail = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await settingsService.updateEmail(req.emploiUser!.id, req.body);
  successResponse(res, null);
});

export const updatePrivacy = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await settingsService.updatePrivacy(req.emploiUser!.id, req.body);
  successResponse(res, null);
});

export const updateNotifications = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await settingsService.updateNotifications(req.emploiUser!.id, req.body);
  successResponse(res, null);
});

export const updateTwoFactor = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await settingsService.updateTwoFactor(req.emploiUser!.id, req.body);
  successResponse(res, null);
});

export const linkLinkedIn = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const authUrl = settingsService.getLinkedInAuthUrl(req.emploiUser!.id);
  successResponse(res, { authUrl });
});

export const pauseAccount = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await settingsService.pauseAccount(req.emploiUser!.id);
  successResponse(res, null, 'Compte mis en pause');
});

export const exportData = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await settingsService.exportData(req.emploiUser!.id);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="mes-donnees-itourisme.json"');
  res.json(data);
});

export const deleteAccount = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await settingsService.deleteAccount(req.emploiUser!.id, req.body);
  successResponse(res, null, 'Compte supprimé définitivement');
});
