// src/routes/magazine.routes.ts
import { Router } from 'express';
import { magazineController } from '../controllers/magazine.controller';

const router = Router();

// GET /api/magazine/subscription-plans
router.get('/subscription-plans', magazineController.getSubscriptionPlans);

// POST /api/magazine/create-checkout-session
router.post('/create-checkout-session', magazineController.createCheckoutSession);

export default router;