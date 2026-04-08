// src/routes/users.routes.ts
import { Router } from 'express';
import { usersController } from '../controllers/users.controller';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth';
import {
  updateUserSchema,
  getUserByIdSchema,
  updateUserStatusSchema,
} from '../validators/users.validator';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════
// Toutes les routes nécessitent une authentification
// ═══════════════════════════════════════════════════════════════════════════

router.use(authenticate);

// ═══════════════════════════════════════════════════════════════════════════
// USERS (SUPER_ADMIN uniquement)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/admin/users
 * @desc    Liste de tous les utilisateurs
 * @access  Private (SUPER_ADMIN)
 */
router.get('/', authorize('SUPER_ADMIN', 'EDITOR'), usersController.getAllUsers);
router.get('/', usersController.getAllUsers);
/**
 * @route   GET /api/admin/users/:id
 * @desc    Détail d'un utilisateur
 * @access  Private (SUPER_ADMIN)
 */
router.get(
  '/:id',
  authorize('SUPER_ADMIN'),
  validate(getUserByIdSchema),
  usersController.getUserById
);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Modifier un utilisateur
 * @access  Private (SUPER_ADMIN)
 */
router.put(
  '/:id',
  authorize('SUPER_ADMIN'),
  validate(updateUserSchema),
  usersController.updateUser
);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Supprimer un utilisateur
 * @access  Private (SUPER_ADMIN)
 */
router.delete(
  '/:id',
  authorize('SUPER_ADMIN'),
  validate(getUserByIdSchema),
  usersController.deleteUser
);

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Changer le statut d'un utilisateur
 * @access  Private (SUPER_ADMIN)
 */
router.patch(
  '/:id/status',
  authorize('SUPER_ADMIN'),
  validate(updateUserStatusSchema),
  usersController.updateUserStatus
);

export default router;