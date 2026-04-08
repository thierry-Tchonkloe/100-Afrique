// src/routes/admin-categories.routes.ts
import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { validate } from '../middlewares/validate';
import { authenticate, authorize } from '../middlewares/auth';
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
} from '../validators/category.validator';

const router = Router();

/**
 * Toutes les routes nécessitent une authentification
 */
router.use(authenticate);

/**
 * @route   GET /api/admin/categories
 * @desc    Liste de toutes les catégories
 * @access  Private
 */
router.get('/', categoryController.getAllCategories);

/**
 * @route   GET /api/admin/categories/:id
 * @desc    Détail d'une catégorie par ID
 * @access  Private
 */
router.get('/:id', validate(getCategoryByIdSchema), categoryController.getCategoryById);

/**
 * @route   POST /api/admin/categories
 * @desc    Créer une catégorie
 * @access  Private (SUPER_ADMIN uniquement)
 */
router.post(
  '/',
  authorize('SUPER_ADMIN'),
  validate(createCategorySchema),
  categoryController.createCategory
);

/**
 * @route   PUT /api/admin/categories/:id
 * @desc    Modifier une catégorie
 * @access  Private (SUPER_ADMIN uniquement)
 */
router.put(
  '/:id',
  authorize('SUPER_ADMIN'),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    Supprimer une catégorie
 * @access  Private (SUPER_ADMIN uniquement)
 */
router.delete(
  '/:id',
  authorize('SUPER_ADMIN'),
  validate(getCategoryByIdSchema),
  categoryController.deleteCategory
);

export default router;