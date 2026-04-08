// src/routes/permissions.routes.ts
import { Router } from 'express';
import { permissionsController } from '../controllers/permissions.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════
// Toutes les routes nécessitent une authentification
// ═══════════════════════════════════════════════════════════════════════════

router.use(authenticate);

// ═══════════════════════════════════════════════════════════════════════════
// PERMISSIONS (SUPER_ADMIN uniquement)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/admin/permissions
 * @desc    Liste de toutes les permissions
 * @access  Private (SUPER_ADMIN)
 */
router.get('/', authorize('SUPER_ADMIN'), permissionsController.getAllPermissions);

export default router;