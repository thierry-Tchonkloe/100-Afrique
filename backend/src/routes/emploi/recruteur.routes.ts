// src/routes/emploi/recruteur.routes.ts
import { Router } from 'express';
import { emploiAuth, requireRecruiter } from '../../middlewares/emploi-auth.middleware';
import { uploadImage, cloudinaryMiddleware } from '../../middlewares/emploi-upload.middleware';
import { validate } from '../../middlewares/validate';

import { getProfile, switchEtablissement, getDashboard } from '../../controllers/emploi/recruteur.controller';

import {
  getOffres, createOffre, updateOffre, updateOffreStatus, duplicateOffre, archiveOffre,
} from '../../controllers/emploi/offres.controller';

import {
  getVitrine, updateVitrine, uploadLogo, uploadBanner, uploadPhoto, deletePhoto, addVideo, deleteVideo,
} from '../../controllers/emploi/vitrine.controller';

import {
  getCandidatures, updateStatus, markRead, toggleFavorite, saveNotes, sendMessage, toggleStar,
} from '../../controllers/emploi/candidatures-rec.controller';

import { proxyCandidatCv } from '../../controllers/emploi/cv-proxy.controller';

import {
  createOffreSchema, updateOffreSchema, updateOffreStatusSchema, offreIdParamSchema,
} from '../../validators/emploi/offre.validator';

import { updateVitrineSchema, addVideoSchema, videoIdParamSchema, photoIdParamSchema } from '../../validators/emploi/vitrine.validator';

import {
  updateCandidatureStatusSchema, toggleFavoriteSchema, toggleStarSchema,
  saveNotesSchema, sendMessageSchema, candidatureIdParamSchema,
} from '../../validators/emploi/candidature.validator';

import { z } from 'zod';

const router = Router();

router.use(emploiAuth, requireRecruiter);

// ── Profil recruteur ─────────────────────────────────────────────────────────
router.get('/profile', getProfile);
router.patch(
  '/profile/etablissement',
  validate(z.object({ body: z.object({ etablissementId: z.coerce.number().int().positive() }) })),
  switchEtablissement,
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get('/dashboard', getDashboard);

// ── Offres ────────────────────────────────────────────────────────────────────
router.get('/offres', getOffres);
router.post('/offres', validate(createOffreSchema), createOffre);
router.patch('/offres/:id', validate(updateOffreSchema), updateOffre);
router.patch('/offres/:id/status', validate(updateOffreStatusSchema), updateOffreStatus);
router.post('/offres/:id/duplicate', validate(offreIdParamSchema), duplicateOffre);
router.delete('/offres/:id', validate(offreIdParamSchema), archiveOffre);

// ── Vitrine ───────────────────────────────────────────────────────────────────
router.get('/vitrine', getVitrine);
router.patch('/vitrine', validate(updateVitrineSchema), updateVitrine);
router.post('/vitrine/logo', uploadImage.single('logo'), cloudinaryMiddleware('vitrines/logos'), uploadLogo);
router.post('/vitrine/banner', uploadImage.single('banner'), cloudinaryMiddleware('vitrines/banners'), uploadBanner);
router.post('/vitrine/photos', uploadImage.single('photo'), cloudinaryMiddleware('vitrines/photos'), uploadPhoto);
router.delete('/vitrine/photos/:id', validate(photoIdParamSchema), deletePhoto);
router.post('/vitrine/videos', validate(addVideoSchema), addVideo);
router.delete('/vitrine/videos/:id', validate(videoIdParamSchema), deleteVideo);

// ── Candidatures reçues ───────────────────────────────────────────────────────
router.get('/candidatures', getCandidatures);
router.patch('/candidatures/:id/status', validate(updateCandidatureStatusSchema), updateStatus);
router.patch('/candidatures/:id/read', validate(candidatureIdParamSchema), markRead);
router.patch('/candidatures/:id/favorite', validate(toggleFavoriteSchema), toggleFavorite);
router.patch('/candidatures/:id/star', validate(toggleStarSchema), toggleStar);
router.patch('/candidatures/:id/notes', validate(saveNotesSchema), saveNotes);
router.post('/candidatures/:id/message', validate(sendMessageSchema), sendMessage);
router.get('/candidatures/:id/cv', validate(candidatureIdParamSchema), proxyCandidatCv);

export default router;
