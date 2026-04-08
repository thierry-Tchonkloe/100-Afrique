// src/routes/newsletter.routes.ts
import { Router } from 'express';
import { newsletterController } from '../controllers/newsletter.controller';

const router = Router();

// POST /api/newsletter/subscribe
router.post('/subscribe', newsletterController.subscribe);

// POST /api/newsletter/unsubscribe
router.post('/unsubscribe', newsletterController.unsubscribe);

// GET /api/newsletter/verify/:token (pour confirmation email)
router.get('/verify/:token', newsletterController.verify);

export default router;