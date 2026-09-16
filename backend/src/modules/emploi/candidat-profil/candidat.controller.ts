// src/controllers/emploi/candidat.controller.ts
import { type Response } from 'express';
import { candidatProfilService } from './candidat-profil.service';
import { candidatDashboardService } from './candidat-dashboard.service';
import { candidatApplicationService } from '../candidatures/candidat-application.service';
import { notificationsService } from '../notifications/notifications.service';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { successResponse } from '../../../utils/response';
import { BadRequestError } from '../../../errors/http-errors';
import type { EmploiRequest } from '../../../middlewares/emploi-auth.middleware';

// ── Dashboard ──────────────────────────────────────────────────────────────
// GET /api/emploi/candidat/dashboard
export const getDashboard = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await candidatDashboardService.getDashboard(req.emploiUser!.id, req.emploiUser!);
  successResponse(res, data);
});

// ── Profil ─────────────────────────────────────────────────────────────────
// GET /api/emploi/candidat/profil
export const getProfil = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await candidatProfilService.getProfil(req.emploiUser!.id);
  successResponse(res, data);
});

// PATCH /api/emploi/candidat/profil/identity
export const updateIdentity = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await candidatProfilService.updateIdentity(req.emploiUser!.id, req.body);
  successResponse(res, null);
});

// PATCH /api/emploi/candidat/profil/skills
export const updateSkills = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await candidatProfilService.updateSkills(req.emploiUser!.id, req.body);
  successResponse(res, null);
});

// PATCH /api/emploi/candidat/profil/visibility
export const updateVisibility = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await candidatProfilService.updateVisibility(req.emploiUser!.id, req.body);
  successResponse(res, null);
});

// POST /api/emploi/candidat/profil/avatar
export const uploadAvatar = asyncHandler(async (req: EmploiRequest & { file?: any }, res: Response) => {
  if (!req.file) throw new BadRequestError('Fichier manquant');
  const data = await candidatProfilService.uploadAvatar(req.emploiUser!.id, req.file.path ?? req.file.url);
  successResponse(res, data);
});

// POST /api/emploi/candidat/profil/cv
export const uploadCv = asyncHandler(async (req: EmploiRequest & { file?: any }, res: Response) => {
  if (!req.file) throw new BadRequestError('Fichier manquant');
  const data = await candidatProfilService.uploadCv(
    req.emploiUser!.id,
    req.file.path ?? req.file.url,
    req.file.originalname ?? 'cv.pdf',
  );
  successResponse(res, data);
});

// DELETE /api/emploi/candidat/profil/cv
export const deleteCv = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await candidatProfilService.deleteCv(req.emploiUser!.id);
  successResponse(res, null);
});

// ── Expériences ────────────────────────────────────────────────────────────
export const createExperience = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await candidatProfilService.createExperience(req.emploiUser!.id, req.body);
  successResponse(res, data, undefined, 201);
});

export const updateExperience = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await candidatProfilService.updateExperience(Number(req.params.id), req.body);
  successResponse(res, data);
});

export const deleteExperience = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await candidatProfilService.deleteExperience(Number(req.params.id));
  successResponse(res, null);
});

// ── Formations ─────────────────────────────────────────────────────────────
export const createFormation = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await candidatProfilService.createFormation(req.emploiUser!.id, req.body);
  successResponse(res, data, undefined, 201);
});

export const updateFormation = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await candidatProfilService.updateFormation(Number(req.params.id), req.body);
  successResponse(res, data);
});

export const deleteFormation = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await candidatProfilService.deleteFormation(Number(req.params.id));
  successResponse(res, null);
});

// ── Candidatures ───────────────────────────────────────────────────────────
export const getApplications = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await candidatApplicationService.getApplications(req.emploiUser!.id);
  successResponse(res, data);
});

export const applyToJob = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await candidatApplicationService.applyToJob(req.emploiUser!, req.body.jobId);
  successResponse(res, data, undefined, 201);
});

export const withdrawApplication = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await candidatApplicationService.withdraw(Number(req.params.id));
  successResponse(res, null);
});

// ── Suggestions ────────────────────────────────────────────────────────────
export const getSuggestions = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await candidatDashboardService.getSuggestions(req.emploiUser!.id, req.query.sector as string | undefined);
  successResponse(res, data);
});

// ── Notifications ──────────────────────────────────────────────────────────
export const getNotifications = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const data = await notificationsService.list(req.emploiUser!.id);
  successResponse(res, data);
});

export const markNotifRead = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await notificationsService.markRead(Number(req.params.id));
  successResponse(res, null);
});

export const markAllNotifsRead = asyncHandler(async (req: EmploiRequest, res: Response) => {
  await notificationsService.markAllRead(req.emploiUser!.id);
  successResponse(res, null);
});
