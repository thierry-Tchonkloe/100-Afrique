import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { validate } from '../middlewares/validate';
import { getCategoryBySlugSchema } from '../validators/category.validator';

const router = Router();

/**
 * @route   GET /api/categories
 * @desc    Liste de toutes les catégories
 * @access  Public
 */
router.get('/', categoryController.getAllCategories);

/**
 * @route   GET /api/categories/:slug
 * @desc    Détail d'une catégorie par slug
 * @access  Public
 */
router.get('/:slug', validate(getCategoryBySlugSchema), categoryController.getCategoryBySlug);

export default router;