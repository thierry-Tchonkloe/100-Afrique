// src/controllers/emploi/offres.controller.ts
import { type Response } from 'express';
import { offresService } from './offres.service';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { successResponse } from '../../../utils/response';
import type { EmploiRequest } from '../../../middlewares/emploi-auth.middleware';

// GET /api/emploi/recruteur/offres?etablissementId=
export const getOffres = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const requestedEtabId = req.query.etablissementId ? Number(req.query.etablissementId) : undefined;
  const data = await offresService.listForRecruiter(req.emploiUser!.id, requestedEtabId);
  successResponse(res, data);
});

// POST /api/emploi/recruteur/offres
export const createOffre = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await offresService.create(req.emploiUser!.id, req.body);
  successResponse(res, data, undefined, 201);
});

// PATCH /api/emploi/recruteur/offres/:id
export const updateOffre = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await offresService.update(req.emploiUser!.id, Number(req.params.id), req.body);
  successResponse(res, data);
});

// PATCH /api/emploi/recruteur/offres/:id/status
export const updateOffreStatus = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await offresService.updateStatus(req.emploiUser!.id, Number(req.params.id), req.body);
  successResponse(res, data);
});

// POST /api/emploi/recruteur/offres/:id/duplicate
export const duplicateOffre = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await offresService.duplicate(req.emploiUser!.id, Number(req.params.id));
  successResponse(res, data, undefined, 201);
});

// DELETE /api/emploi/recruteur/offres/:id (archive)
export const archiveOffre = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await offresService.archive(req.emploiUser!.id, Number(req.params.id));
  successResponse(res, null);
});

// ── Public ─────────────────────────────────────────────────────────────────
// GET /api/emploi/jobs
export const getPublicJobs = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await offresService.listPublic(req.query as any);
  successResponse(res, data);
});

// GET /api/emploi/jobs/:id
export const getPublicJob = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await offresService.getPublicDetail(Number(req.params.id));
  successResponse(res, data);
});
