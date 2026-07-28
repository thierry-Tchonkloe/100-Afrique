// src/routes/emploi/public.routes.ts
import { Router } from 'express';
import { getPublicJobs, getPublicJob } from '../../controllers/emploi/offres.controller';
import { getPublicVitrine } from '../../controllers/emploi/vitrine.controller';
import { getPublicCompanies, getPublicCompanyDetail } from '../../controllers/emploi/entreprises.controller';
import { validate } from '../../middlewares/validate';
import { publicJobsQuerySchema, offreIdParamSchema } from '../../validators/emploi/offre.validator';
import { etablissementIdParamSchema } from '../../validators/emploi/vitrine.validator';
import { z } from 'zod';

const router = Router();

// ── Job Board public ─────────────────────────────────────────────────────────
router.get('/jobs', validate(publicJobsQuerySchema), getPublicJobs);
router.get('/jobs/:id', validate(offreIdParamSchema), getPublicJob);

// ── Entreprises publiques ─────────────────────────────────────────────────────
router.get('/entreprises', getPublicCompanies);
router.get('/entreprises/:id', validate(z.object({ params: z.object({ id: z.coerce.number().int().positive() }) })), getPublicCompanyDetail);

// ── Vitrines publiques (legacy — conservé pour compatibilité) ────────────────
router.get('/vitrines/:etablissementId', validate(etablissementIdParamSchema), getPublicVitrine);

export default router;
