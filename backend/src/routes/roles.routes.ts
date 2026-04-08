// src/routes/roles.routes.ts
import { Router } from 'express';
import { rolesController } from '../controllers/roles.controller';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth';
import { getRoleSchema, updateRolePermissionsSchema } from '../validators/roles.validator';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════
// Toutes les routes nécessitent une authentification
// ═══════════════════════════════════════════════════════════════════════════

router.use(authenticate);

// ═══════════════════════════════════════════════════════════════════════════
// ROLES (SUPER_ADMIN uniquement)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/admin/roles
 * @desc    Liste de tous les rôles avec permissions
 * @access  Private (SUPER_ADMIN)
 */
router.get('/', authorize('SUPER_ADMIN'), rolesController.getAllRoles);

/**
 * @route   GET /api/admin/roles/:role
 * @desc    Détail d'un rôle avec permissions
 * @access  Private (SUPER_ADMIN)
 */
router.get(
  '/:role',
  authorize('SUPER_ADMIN'),
  validate(getRoleSchema),
  rolesController.getRoleByName
);

/**
 * @route   PUT /api/admin/roles/:role/permissions
 * @desc    Mettre à jour les permissions d'un rôle
 * @access  Private (SUPER_ADMIN)
 */
router.put(
  '/:role/permissions',
  authorize('SUPER_ADMIN'),
  validate(updateRolePermissionsSchema),
  rolesController.updateRolePermissions
);

export default router;