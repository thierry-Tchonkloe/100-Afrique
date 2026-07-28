// src/controllers/emploi/entreprises.controller.ts
import { type Request, type Response } from 'express';
import { entreprisesService } from '../../services/emploi/entreprises.service';
import { asyncHandler } from '../../middlewares/errorHandler';
import { successResponse } from '../../utils/response';

// GET /api/emploi/entreprises
export const getPublicCompanies = asyncHandler(async (_req: Request, res: Response) => {
  const data = await entreprisesService.listPublic();
  successResponse(res, data);
});

// GET /api/emploi/entreprises/:id
export const getPublicCompanyDetail = asyncHandler(async (req: Request, res: Response) => {
  const data = await entreprisesService.getPublicDetail(Number(req.params.id));
  successResponse(res, data);
});
