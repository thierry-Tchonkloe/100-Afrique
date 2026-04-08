import { Router } from 'express';
import { articleController } from '../controllers/article.controller';
import { validate } from '../middlewares/validate';
import { getArticleBySlugSchema } from '../validators/article.validator';

const router = Router();

/**
 * @route   GET /api/mag/articles
 * @desc    Liste des articles publiés
 * @access  Public
 */
router.get('/', articleController.getPublicArticles);

/**
 * @route   GET /api/mag/articles/:slug
 * @desc    Détail d'un article par slug
 * @access  Public
 */
router.get('/:slug', validate(getArticleBySlugSchema), articleController.getPublicArticleBySlug);

export default router;