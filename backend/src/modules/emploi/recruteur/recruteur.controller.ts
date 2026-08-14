// src/controllers/emploi/recruteur.controller.ts
import { type Response } from 'express';
import { recruteurService } from './recruteur.service';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { successResponse } from '../../../utils/response';
import type { EmploiRequest } from '../../../middlewares/emploi-auth.middleware';

// GET /api/emploi/recruteur/profile
export const getProfile = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await recruteurService.getProfile(req.emploiUser!);
  successResponse(res, data);
});

// PATCH /api/emploi/recruteur/profile/etablissement
export const switchEtablissement = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await recruteurService.switchEtablissement(req.emploiUser!.id, Number(req.body.etablissementId));
  successResponse(res, null);
});

// GET /api/emploi/recruteur/dashboard?etablissementId=&period=
export const getDashboard = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const requestedEtabId = req.query.etablissementId ? Number(req.query.etablissementId) : undefined;
  const period = (req.query.period as string) ?? '7d';

  const data = await recruteurService.getDashboard(req.emploiUser!, requestedEtabId, period);
  successResponse(res, data);
});
