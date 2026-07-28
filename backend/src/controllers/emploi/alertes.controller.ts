// src/controllers/emploi/alertes.controller.ts
import { type Response } from 'express';
import { alertesService } from '../../services/emploi/alertes.service';
import { asyncHandler } from '../../middlewares/errorHandler';
import { successResponse } from '../../utils/response';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

// GET /api/emploi/candidat/alertes
export const getAlertes = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await alertesService.list(req.emploiUser!.id);
  successResponse(res, data);
});

// POST /api/emploi/candidat/alertes
export const createAlerte = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await alertesService.create(req.emploiUser!.id, req.body);
  successResponse(res, data, undefined, 201);
});

// PATCH /api/emploi/candidat/alertes/:id
export const updateAlerte = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await alertesService.update(Number(req.params.id), req.body);
  successResponse(res, data);
});

// PATCH /api/emploi/candidat/alertes/:id/toggle
export const toggleAlerte = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await alertesService.toggle(Number(req.params.id), req.body.isActive);
  successResponse(res, data);
});

// DELETE /api/emploi/candidat/alertes/:id
export const deleteAlerte = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await alertesService.remove(Number(req.params.id));
  successResponse(res, null);
});
