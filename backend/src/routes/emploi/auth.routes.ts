// src/routes/emploi/auth.routes.ts
import { Router } from 'express';
import { register, login, me, changePassword } from '../../modules/emploi/auth/auth.controller';
import { emploiAuth } from '../../middlewares/emploi-auth.middleware';
import { validate } from '../../middlewares/validate';
import { registerSchema, loginSchema, changePasswordSchema } from '../../modules/emploi/auth/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', emploiAuth, me);
router.patch('/password', emploiAuth, validate(changePasswordSchema), changePassword);

export default router;
