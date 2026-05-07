// src/routes/emploi/index.ts
import { Router } from 'express';
import authRoutes     from './auth.routes';
import candidatRoutes from './candidat.routes';
import recruteurRoutes from './recruteur.routes';
import publicRoutes   from './public.routes';

const router = Router();

// POST /api/emploi/auth/register
// POST /api/emploi/auth/login
// GET  /api/emploi/auth/me
// PATCH /api/emploi/auth/password
router.use('/auth', authRoutes);

// GET/PATCH /api/emploi/candidat/dashboard
// GET/PATCH /api/emploi/candidat/profil/**
// GET/POST/DELETE /api/emploi/candidat/applications/**
// GET/POST/PATCH/DELETE /api/emploi/candidat/alertes/**
// GET/PATCH /api/emploi/candidat/notifications/**
// GET/PATCH/DELETE /api/emploi/candidat/settings/**
router.use('/candidat', candidatRoutes);

// GET/PATCH /api/emploi/recruteur/profile/**
// GET /api/emploi/recruteur/dashboard
// GET/POST/PATCH/DELETE /api/emploi/recruteur/offres/**
// GET/PATCH /api/emploi/recruteur/vitrine/**
// GET/PATCH /api/emploi/recruteur/candidatures/**
router.use('/recruteur', recruteurRoutes);

// GET /api/emploi/jobs
// GET /api/emploi/jobs/:id
// GET /api/emploi/vitrines/:etablissementId
router.use('/', publicRoutes);

export default router;