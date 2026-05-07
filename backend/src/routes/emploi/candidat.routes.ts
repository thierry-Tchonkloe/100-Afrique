// src/routes/emploi/candidat.routes.ts
import { Router } from 'express';
import { emploiAuth, requireCandidat } from '../../middlewares/emploi-auth.middleware';
import { uploadImage, uploadPdf, cloudinaryMiddleware } from '../../middlewares/emploi-upload.middleware';

import {
  getDashboard,
  getProfil,
  updateIdentity,
  updateSkills,
  updateVisibility,
  uploadAvatar,
  uploadCv,
  deleteCv,
  createExperience,
  updateExperience,
  deleteExperience,
  createFormation,
  updateFormation,
  deleteFormation,
  getApplications,
  applyToJob,
  withdrawApplication,
  getSuggestions,
  getNotifications,
  markNotifRead,
  markAllNotifsRead,
} from '../../controllers/emploi/candidat.controller';

import {
  getAlertes,
  createAlerte,
  updateAlerte,
  toggleAlerte,
  deleteAlerte,
} from '../../controllers/emploi/alertes.controller';

import {
  getSettings,
  updateEmail,
  updatePrivacy,
  updateNotifications,
  updateTwoFactor,
  linkLinkedIn,
  pauseAccount,
  exportData,
  deleteAccount,
} from '../../controllers/emploi/settings.controller';

const router = Router();

// Toutes les routes candidat nécessitent auth + rôle CANDIDAT
router.use(emploiAuth, requireCandidat);

// ── Dashboard ──────────────────────────────────────────────────────────────
// GET /api/emploi/candidat/dashboard
router.get('/dashboard', getDashboard);

// ── Profil ─────────────────────────────────────────────────────────────────
// GET    /api/emploi/candidat/profil
router.get('/profil', getProfil);

// PATCH  /api/emploi/candidat/profil/identity
router.patch('/profil/identity', updateIdentity);

// PATCH  /api/emploi/candidat/profil/skills
router.patch('/profil/skills', updateSkills);

// PATCH  /api/emploi/candidat/profil/visibility
router.patch('/profil/visibility', updateVisibility);

// POST   /api/emploi/candidat/profil/avatar  (multipart)
router.post(
  '/profil/avatar',
  uploadImage.single('avatar'),
  cloudinaryMiddleware('avatars'),
  uploadAvatar
);

// POST   /api/emploi/candidat/profil/cv  (multipart PDF)
router.post(
  '/profil/cv',
  uploadPdf.single('cv'),
  cloudinaryMiddleware('cvs', 'raw'),
  uploadCv
);

// DELETE /api/emploi/candidat/profil/cv
router.delete('/profil/cv', deleteCv);

// ── Expériences ────────────────────────────────────────────────────────────
// POST   /api/emploi/candidat/profil/experiences
router.post('/profil/experiences', createExperience);

// PATCH  /api/emploi/candidat/profil/experiences/:id
router.patch('/profil/experiences/:id', updateExperience);

// DELETE /api/emploi/candidat/profil/experiences/:id
router.delete('/profil/experiences/:id', deleteExperience);

// ── Formations ─────────────────────────────────────────────────────────────
// POST   /api/emploi/candidat/profil/formations
router.post('/profil/formations', createFormation);

// PATCH  /api/emploi/candidat/profil/formations/:id
router.patch('/profil/formations/:id', updateFormation);

// DELETE /api/emploi/candidat/profil/formations/:id
router.delete('/profil/formations/:id', deleteFormation);

// ── Candidatures ───────────────────────────────────────────────────────────
// GET    /api/emploi/candidat/applications
router.get('/applications', getApplications);

// POST   /api/emploi/candidat/applications  (postuler)
router.post('/applications', applyToJob);

// DELETE /api/emploi/candidat/applications/:id  (retirer)
router.delete('/applications/:id', withdrawApplication);

// ── Suggestions ────────────────────────────────────────────────────────────
// GET    /api/emploi/candidat/suggestions?sector=...
router.get('/suggestions', getSuggestions);

// ── Alertes ────────────────────────────────────────────────────────────────
// GET    /api/emploi/candidat/alertes
router.get('/alertes', getAlertes);

// POST   /api/emploi/candidat/alertes
router.post('/alertes', createAlerte);

// PATCH  /api/emploi/candidat/alertes/:id
router.patch('/alertes/:id', updateAlerte);

// PATCH  /api/emploi/candidat/alertes/:id/toggle
router.patch('/alertes/:id/toggle', toggleAlerte);

// DELETE /api/emploi/candidat/alertes/:id
router.delete('/alertes/:id', deleteAlerte);

// ── Notifications ──────────────────────────────────────────────────────────
// GET    /api/emploi/candidat/notifications
router.get('/notifications', getNotifications);

// PATCH  /api/emploi/candidat/notifications/:id/read
router.patch('/notifications/:id/read', markNotifRead);

// PATCH  /api/emploi/candidat/notifications/read-all
router.patch('/notifications/read-all', markAllNotifsRead);

// ── Paramètres ─────────────────────────────────────────────────────────────
// GET    /api/emploi/candidat/settings
router.get('/settings', getSettings);

// PATCH  /api/emploi/candidat/settings/email
router.patch('/settings/email', updateEmail);

// PATCH  /api/emploi/candidat/settings/privacy
router.patch('/settings/privacy', updatePrivacy);

// PATCH  /api/emploi/candidat/settings/notifications
router.patch('/settings/notifications', updateNotifications);

// PATCH  /api/emploi/candidat/settings/2fa
router.patch('/settings/2fa', updateTwoFactor);

// POST   /api/emploi/candidat/settings/linkedin/link
router.post('/settings/linkedin/link', linkLinkedIn);

// PATCH  /api/emploi/candidat/settings/pause
router.patch('/settings/pause', pauseAccount);

// GET    /api/emploi/candidat/settings/export
router.get('/settings/export', exportData);

// DELETE /api/emploi/candidat/settings/account
router.delete('/settings/account', deleteAccount);

export default router;