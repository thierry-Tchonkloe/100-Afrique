// src/controllers/emploi/vitrine.controller.ts
import { type Response } from 'express';
import { vitrineService } from './vitrine.service';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { successResponse } from '../../../utils/response';
import { BadRequestError } from '../../../errors/http-errors';
import { paramAsString } from '../../../utils/http-params';
import type { EmploiRequest } from '../../../middlewares/emploi-auth.middleware';

// GET /api/emploi/recruteur/vitrine?etablissementId=
export const getVitrine = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const requestedEtabId = req.query.etablissementId ? Number(req.query.etablissementId) : undefined;
  const data = await vitrineService.get(req.emploiUser!.id, requestedEtabId);
  successResponse(res, data);
});

// PATCH /api/emploi/recruteur/vitrine
export const updateVitrine = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await vitrineService.update(req.emploiUser!.id, req.body);
  successResponse(res, data);
});

// POST /api/emploi/recruteur/vitrine/logo
export const uploadLogo = asyncHandler(async (req: EmploiRequest & { file?: any }, res: Response) => {
  if (!req.file) throw new BadRequestError('Fichier manquant');
  const data = await vitrineService.uploadLogo(req.emploiUser!.id, req.file.path ?? req.file.url ?? req.file.secure_url);
  successResponse(res, data);
});

// POST /api/emploi/recruteur/vitrine/banner
export const uploadBanner = asyncHandler(async (req: EmploiRequest & { file?: any }, res: Response) => {
  if (!req.file) throw new BadRequestError('Fichier manquant');
  const data = await vitrineService.uploadBanner(req.emploiUser!.id, req.file.path ?? req.file.url ?? req.file.secure_url);
  successResponse(res, data);
});

// POST /api/emploi/recruteur/vitrine/photos
export const uploadPhoto = asyncHandler(async (req: EmploiRequest & { file?: any }, res: Response) => {
  if (!req.file) throw new BadRequestError('Fichier manquant');
  const url = req.file.path ?? req.file.url ?? req.file.secure_url;
  const photoId = req.file.filename ?? req.file.public_id ?? `photo-${Date.now()}`;
  const data = await vitrineService.uploadPhoto(req.emploiUser!.id, url, photoId, req.file.originalname ?? '');
  successResponse(res, data);
});

// DELETE /api/emploi/recruteur/vitrine/photos/:id
export const deletePhoto = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await vitrineService.deletePhoto(req.emploiUser!.id, paramAsString(req.params.id));
  successResponse(res, null);
});

// POST /api/emploi/recruteur/vitrine/videos
export const addVideo = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await vitrineService.addVideo(req.emploiUser!.id, req.body);
  successResponse(res, data);
});

// DELETE /api/emploi/recruteur/vitrine/videos/:id
export const deleteVideo = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await vitrineService.deleteVideo(req.emploiUser!.id, paramAsString(req.params.id));
  successResponse(res, null);
});

// ── Public ─────────────────────────────────────────────────────────────────
// GET /api/emploi/vitrines/:etablissementId
export const getPublicVitrine = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await vitrineService.getPublic(Number(req.params.etablissementId));
  successResponse(res, data);
});
