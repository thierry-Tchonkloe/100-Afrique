// src/routes/emploi/candidat.routes.ts
import { Router } from 'express';
import { emploiAuth, requireCandidat } from '../../middlewares/emploi-auth.middleware';
import { uploadImage, uploadPdf, cloudinaryMiddleware } from '../../middlewares/emploi-upload.middleware';
import { validate } from '../../middlewares/validate';

import {
  getDashboard, getProfil, updateIdentity, updateSkills, updateVisibility,
  uploadAvatar, uploadCv, deleteCv,
  createExperience, updateExperience, deleteExperience,
  createFormation, updateFormation, deleteFormation,
  getApplications, applyToJob, withdrawApplication, getSuggestions,
  getNotifications, markNotifRead, markAllNotifsRead,
} from '../../controllers/emploi/candidat.controller';

import { getAlertes, createAlerte, updateAlerte, toggleAlerte, deleteAlerte } from '../../controllers/emploi/alertes.controller';

import {
  getSettings, updateEmail, updatePrivacy, updateNotifications,
  updateTwoFactor, linkLinkedIn, pauseAccount, exportData, deleteAccount,
} from '../../controllers/emploi/settings.controller';

import {
  updateIdentitySchema, updateSkillsSchema, updateVisibilitySchema,
  createExperienceSchema, updateExperienceSchema,
  createFormationSchema, updateFormationSchema,
  applyToJobSchema, idParamSchema,
} from '../../validators/emploi/candidat.validator';

import { createAlerteSchema, updateAlerteSchema, toggleAlerteSchema, alerteIdParamSchema } from '../../validators/emploi/alerte.validator';

import {
  updateEmailSchema, updatePrivacySchema, updateNotificationsSchema,
  updateTwoFactorSchema, deleteAccountSchema,
} from '../../validators/emploi/settings.validator';

const router = Router();

router.use(emploiAuth, requireCandidat);

// ── Dashboard ──────────────────────────────────────────────────────────────
router.get('/dashboard', getDashboard);

// ── Profil ─────────────────────────────────────────────────────────────────
router.get('/profil', getProfil);
router.patch('/profil/identity', validate(updateIdentitySchema), updateIdentity);
router.patch('/profil/skills', validate(updateSkillsSchema), updateSkills);
router.patch('/profil/visibility', validate(updateVisibilitySchema), updateVisibility);
router.post('/profil/avatar', uploadImage.single('avatar'), cloudinaryMiddleware('avatars'), uploadAvatar);
router.post('/profil/cv', uploadPdf.single('cv'), cloudinaryMiddleware('cvs', 'raw'), uploadCv);
router.delete('/profil/cv', deleteCv);

// ── Expériences ────────────────────────────────────────────────────────────
router.post('/profil/experiences', validate(createExperienceSchema), createExperience);
router.patch('/profil/experiences/:id', validate(updateExperienceSchema), updateExperience);
router.delete('/profil/experiences/:id', validate(idParamSchema), deleteExperience);

// ── Formations ─────────────────────────────────────────────────────────────
router.post('/profil/formations', validate(createFormationSchema), createFormation);
router.patch('/profil/formations/:id', validate(updateFormationSchema), updateFormation);
router.delete('/profil/formations/:id', validate(idParamSchema), deleteFormation);

// ── Candidatures ───────────────────────────────────────────────────────────
router.get('/applications', getApplications);
router.post('/applications', validate(applyToJobSchema), applyToJob);
router.delete('/applications/:id', validate(idParamSchema), withdrawApplication);

// ── Suggestions ────────────────────────────────────────────────────────────
router.get('/suggestions', getSuggestions);

// ── Alertes ────────────────────────────────────────────────────────────────
router.get('/alertes', getAlertes);
router.post('/alertes', validate(createAlerteSchema), createAlerte);
router.patch('/alertes/:id', validate(updateAlerteSchema), updateAlerte);
router.patch('/alertes/:id/toggle', validate(toggleAlerteSchema), toggleAlerte);
router.delete('/alertes/:id', validate(alerteIdParamSchema), deleteAlerte);

// ── Notifications ──────────────────────────────────────────────────────────
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', validate(idParamSchema), markNotifRead);
router.patch('/notifications/read-all', markAllNotifsRead);

// ── Paramètres ─────────────────────────────────────────────────────────────
router.get('/settings', getSettings);
router.patch('/settings/email', validate(updateEmailSchema), updateEmail);
router.patch('/settings/privacy', validate(updatePrivacySchema), updatePrivacy);
router.patch('/settings/notifications', validate(updateNotificationsSchema), updateNotifications);
router.patch('/settings/2fa', validate(updateTwoFactorSchema), updateTwoFactor);
router.post('/settings/linkedin/link', linkLinkedIn);
router.patch('/settings/pause', pauseAccount);
router.get('/settings/export', exportData);
router.delete('/settings/account', validate(deleteAccountSchema), deleteAccount);

export default router;
