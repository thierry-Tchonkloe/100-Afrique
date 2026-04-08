// src/roues/admin-articles.routes.ts
import { Router } from 'express';
import { articleController } from '../controllers/article.controller';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import {
  createArticleSchema,
  updateArticleSchema,
  getArticleByIdSchema,
  quickCreateArticleSchema,          // ← ajoute
} from '../validators/article.validator';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

/**
 * @route   GET /api/admin/articles
 * @desc    Liste de tous les articles (brouillons inclus)
 * @access  Private
 */
router.get('/', articleController.getAllArticles);

router.post('/quick', validate(quickCreateArticleSchema), articleController.quickCreateArticle);

/**
 * @route   POST /api/admin/articles
 * @desc    Créer un article
 * @access  Private
 */
router.post('/', validate(createArticleSchema), articleController.createArticle);

/**
 * @route   GET /api/admin/articles/:id
 * @desc    Détail d'un article par ID
 * @access  Private
 */
router.get('/:id', validate(getArticleByIdSchema), articleController.getArticleById);

/**
 * @route   PUT /api/admin/articles/:id
 * @desc    Modifier un article
 * @access  Private
 */
router.put('/:id', validate(updateArticleSchema), articleController.updateArticle);

/**
 * @route   DELETE /api/admin/articles/:id
 * @desc    Supprimer un article
 * @access  Private
 */
router.delete('/:id', validate(getArticleByIdSchema), articleController.deleteArticle);

export default router;