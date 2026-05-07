// src/routes/emploi/public.routes.ts
import { Router } from 'express';
import { getPublicJobs, getPublicJob } from '../../controllers/emploi/offres.controller';
import { getPublicVitrine } from '../../controllers/emploi/vitrine.controller';

const router = Router();

// ── Job Board public ────────────────────────────────────────────────────────
// GET /api/emploi/jobs?sector=&location=&contractType=&search=&page=&limit=
router.get('/jobs', getPublicJobs);

// GET /api/emploi/jobs/:id
router.get('/jobs/:id', getPublicJob);

// ── Vitrines publiques ──────────────────────────────────────────────────────
// GET /api/emploi/vitrines/:etablissementId
router.get('/vitrines/:etablissementId', getPublicVitrine);

export default router;