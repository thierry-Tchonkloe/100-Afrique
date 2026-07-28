// src/controllers/emploi/candidatures-rec.controller.ts
import { type Response } from 'express';
import { candidaturesService } from '../../services/emploi/candidatures.service';
import { asyncHandler } from '../../middlewares/errorHandler';
import { successResponse } from '../../utils/response';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

// GET /api/emploi/recruteur/candidatures?etablissementId=&offerId=
export const getCandidatures = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const etabId = req.query.etablissementId ? Number(req.query.etablissementId) : undefined;
  const offerId = req.query.offerId ? Number(req.query.offerId) : undefined;
  const data = await candidaturesService.list(req.emploiUser!.id, etabId, offerId);
  successResponse(res, data);
});

// PATCH /api/emploi/recruteur/candidatures/:id/status
export const updateStatus = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await candidaturesService.updateStatus(Number(req.params.id), req.body);
  successResponse(res, data);
});

// PATCH /api/emploi/recruteur/candidatures/:id/read
export const markRead = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await candidaturesService.markRead(Number(req.params.id));
  successResponse(res, null);
});

// PATCH /api/emploi/recruteur/candidatures/:id/favorite
export const toggleFavorite = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await candidaturesService.toggleFavorite(Number(req.params.id), req.body);
  successResponse(res, null);
});

// PATCH /api/emploi/recruteur/candidatures/:id/star
export const toggleStar = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await candidaturesService.toggleStar(Number(req.params.id), req.body);
  successResponse(res, null);
});

// PATCH /api/emploi/recruteur/candidatures/:id/notes
export const saveNotes = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await candidaturesService.saveNotes(Number(req.params.id), req.body);
  successResponse(res, null);
});

// POST /api/emploi/recruteur/candidatures/:id/message
export const sendMessage = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await candidaturesService.sendMessage(Number(req.params.id), req.body);
  successResponse(res, null, 'Message envoyé');
});
