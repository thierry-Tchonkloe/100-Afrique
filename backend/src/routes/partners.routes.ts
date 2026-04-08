// src/routes/partners.routes.ts
import { Router } from 'express';
import { partnersController } from '../controllers/partners.controller';

const router = Router();

// GET /api/pages/partners - Données complètes de la page
router.get('/pages/partners', partnersController.getPageData);

// POST /api/contacts/partners - Formulaire de contact partenariat
router.post('/contacts/partners', partnersController.submitContact);

export default router;