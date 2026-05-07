// src/routes/emploi/recruteur.routes.ts
import { Router } from 'express';
import { emploiAuth, requireRecruiter } from '../../middlewares/emploi-auth.middleware';
import { uploadImage, cloudinaryMiddleware } from '../../middlewares/emploi-upload.middleware';

import {
  getProfile,
  switchEtablissement,
  getDashboard,
} from '../../controllers/emploi/recruteur.controller';

import {
  getOffres,
  createOffre,
  updateOffre,
  updateOffreStatus,
  duplicateOffre,
  archiveOffre,
} from '../../controllers/emploi/offres.controller';

import {
  getVitrine,
  updateVitrine,
  uploadLogo,
  uploadBanner,
  uploadPhoto,
  deletePhoto,
  addVideo,
  deleteVideo,
} from '../../controllers/emploi/vitrine.controller';

import {
  getCandidatures,
  updateStatus,
  markRead,
  toggleFavorite,
  saveNotes,
  sendMessage,
  toggleStar,
} from '../../controllers/emploi/candidatures-rec.controller';

const router = Router();

// Toutes les routes recruteur nécessitent auth + rôle RECRUITER
router.use(emploiAuth, requireRecruiter);

// ── Profil recruteur ────────────────────────────────────────────────────────
// GET   /api/emploi/recruteur/profile
router.get('/profile', getProfile);

// PATCH /api/emploi/recruteur/profile/etablissement
router.patch('/profile/etablissement', switchEtablissement);

// ── Dashboard ───────────────────────────────────────────────────────────────
// GET   /api/emploi/recruteur/dashboard?etablissementId=&period=
router.get('/dashboard', getDashboard);

// ── Offres ──────────────────────────────────────────────────────────────────
// GET    /api/emploi/recruteur/offres?etablissementId=
router.get('/offres', getOffres);

// POST   /api/emploi/recruteur/offres
router.post('/offres', createOffre);

// PATCH  /api/emploi/recruteur/offres/:id
router.patch('/offres/:id', updateOffre);

// PATCH  /api/emploi/recruteur/offres/:id/status
router.patch('/offres/:id/status', updateOffreStatus);

// POST   /api/emploi/recruteur/offres/:id/duplicate
router.post('/offres/:id/duplicate', duplicateOffre);

// DELETE /api/emploi/recruteur/offres/:id  → archive
router.delete('/offres/:id', archiveOffre);

// ── Vitrine ─────────────────────────────────────────────────────────────────
// GET   /api/emploi/recruteur/vitrine?etablissementId=
router.get('/vitrine', getVitrine);

// PATCH /api/emploi/recruteur/vitrine
router.patch('/vitrine', updateVitrine);

// POST  /api/emploi/recruteur/vitrine/logo  (multipart)
router.post(
  '/vitrine/logo',
  uploadImage.single('logo'),
  cloudinaryMiddleware('vitrines/logos'),
  uploadLogo
);

// POST  /api/emploi/recruteur/vitrine/banner  (multipart)
router.post(
  '/vitrine/banner',
  uploadImage.single('banner'),
  cloudinaryMiddleware('vitrines/banners'),
  uploadBanner
);

// POST  /api/emploi/recruteur/vitrine/photos  (multipart)
router.post(
  '/vitrine/photos',
  uploadImage.single('photo'),
  cloudinaryMiddleware('vitrines/photos'),
  uploadPhoto
);

// DELETE /api/emploi/recruteur/vitrine/photos/:id
router.delete('/vitrine/photos/:id', deletePhoto);

// POST   /api/emploi/recruteur/vitrine/videos
router.post('/vitrine/videos', addVideo);

// DELETE /api/emploi/recruteur/vitrine/videos/:id
router.delete('/vitrine/videos/:id', deleteVideo);

// ── Candidatures reçues ─────────────────────────────────────────────────────
// GET   /api/emploi/recruteur/candidatures?etablissementId=&offerId=
router.get('/candidatures', getCandidatures);

// PATCH /api/emploi/recruteur/candidatures/:id/status
router.patch('/candidatures/:id/status', updateStatus);

// PATCH /api/emploi/recruteur/candidatures/:id/read
router.patch('/candidatures/:id/read', markRead);

// PATCH /api/emploi/recruteur/candidatures/:id/favorite
router.patch('/candidatures/:id/favorite', toggleFavorite);

// PATCH /api/emploi/recruteur/candidatures/:id/star  (dashboard quick action)
router.patch('/candidatures/:id/star', toggleStar);

// PATCH /api/emploi/recruteur/candidatures/:id/notes
router.patch('/candidatures/:id/notes', saveNotes);

// POST  /api/emploi/recruteur/candidatures/:id/message
router.post('/candidatures/:id/message', sendMessage);

export default router;