import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/admin/register
 * @desc    Inscription (à désactiver en production)
 * @access  Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route   POST /api/admin/login
 * @desc    Connexion
 * @access  Public
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @route   GET /api/admin/me
 * @desc    Utilisateur connecté
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

export default router;