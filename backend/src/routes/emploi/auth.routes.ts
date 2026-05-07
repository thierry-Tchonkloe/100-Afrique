// src/routes/emploi/auth.routes.ts
import { Router } from 'express';
import { register, login, me, changePassword } from '../../controllers/emploi/auth.controller';
import { emploiAuth } from '../../middlewares/emploi-auth.middleware';

const router = Router();

// POST /api/emploi/auth/register
router.post('/register', register);

// POST /api/emploi/auth/login
router.post('/login', login);

// GET /api/emploi/auth/me  (protégé)
router.get('/me', emploiAuth, me);

// PATCH /api/emploi/auth/password  (protégé)
router.patch('/password', emploiAuth, changePassword);

export default router;