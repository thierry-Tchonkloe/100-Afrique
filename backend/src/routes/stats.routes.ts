import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

/**
 * @route   GET /api/admin/stats
 * @desc    Statistiques globales
 * @access  Private
 */
router.get('/', statsController.getGlobalStats);

/**
 * @route   GET /api/admin/stats/most-viewed
 * @desc    Articles les plus vus
 * @access  Private
 */
router.get('/most-viewed', statsController.getMostViewedArticles);

/**
 * @route   GET /api/admin/stats/recent
 * @desc    Articles récents
 * @access  Private
 */
router.get('/recent', statsController.getRecentArticles);

/**
 * @route   GET /api/admin/stats/categories
 * @desc    Statistiques par catégorie
 * @access  Private
 */
router.get('/categories', statsController.getCategoryStats);

/**
 * @route   GET /api/admin/stats/authors
 * @desc    Statistiques par auteur
 * @access  Private
 */
router.get('/authors', statsController.getAuthorStats);

export default router;