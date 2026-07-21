// src/routes/emploi/public.routes.ts
import { Router } from 'express';
import { getPublicJobs, getPublicJob } from '../../controllers/emploi/offres.controller';
import { getPublicVitrine } from '../../controllers/emploi/vitrine.controller';
import { getPublicCompanies, getPublicCompanyDetail } from '../../controllers/emploi/entreprises.controller';

const router = Router();

// ── Job Board public ────────────────────────────────────────────────────────
// GET /api/emploi/jobs?sector=&location=&contractType=&search=&page=&limit=
router.get('/jobs', getPublicJobs);

// GET /api/emploi/jobs/:id
router.get('/jobs/:id', getPublicJob);

// ── Entreprises publiques ────────────────────────────────────────────────────
// Indépendant des offres — basé sur Etablissement + Vitrine (logo, bannière, galerie).
// GET /api/emploi/entreprises      → liste (section COMPANIES homepage, page entreprises)
// GET /api/emploi/entreprises/:id  → détail complet + offres actives + galerie photo
router.get('/entreprises', getPublicCompanies);
router.get('/entreprises/:id', getPublicCompanyDetail);

// ── Vitrines publiques (legacy — conservé pour compatibilité) ───────────────
// GET /api/emploi/vitrines/:etablissementId
router.get('/vitrines/:etablissementId', getPublicVitrine);

export default router;
