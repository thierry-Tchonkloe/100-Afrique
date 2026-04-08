// src/routes/tags.routes.ts
import { Router } from 'express';
import { tagsController } from '../controllers/tags.controller';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth';
import {
  createTagSchema,
  updateTagSchema,
  getTagByIdSchema,
} from '../validators/tag.validator';

const router = Router();

/**
 * Toutes les routes nécessitent une authentification
 */
router.use(authenticate);

/**
 * @route   GET /api/admin/tags
 * @desc    Liste de tous les tags
 * @access  Private (SUPER_ADMIN, EDITOR)
 */
router.get('/', tagsController.getAllTags);

/**
 * @route   GET /api/admin/tags/:id
 * @desc    Détail d'un tag
 * @access  Private (SUPER_ADMIN, EDITOR)
 */
router.get('/:id', validate(getTagByIdSchema), tagsController.getTagById);

/**
 * @route   POST /api/admin/tags
 * @desc    Créer un tag
 * @access  Private (SUPER_ADMIN, EDITOR)
 */
router.post(
  '/',
  authorize('SUPER_ADMIN'),
  validate(createTagSchema),
  tagsController.createTag
);

/**
 * @route   PUT /api/admin/tags/:id
 * @desc    Modifier un tag
 * @access  Private (SUPER_ADMIN, EDITOR)
 */
router.put(
  '/:id',
  authorize('SUPER_ADMIN'),
  validate(updateTagSchema),
  tagsController.updateTag
);

/**
 * @route   DELETE /api/admin/tags/:id
 * @desc    Supprimer un tag
 * @access  Private (SUPER_ADMIN uniquement)
 */
router.delete(
  '/:id',
  authorize('SUPER_ADMIN'),
  validate(getTagByIdSchema),
  tagsController.deleteTag
);

export default router;