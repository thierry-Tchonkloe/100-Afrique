import type { Request, Response } from 'express';
import { statsService } from '../services/stats.service';
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * Contrôleur des statistiques
 */
export class StatsController {
  /**
   * @route   GET /api/admin/stats
   * @desc    Récupère les statistiques globales
   * @access  Private
   */
  getGlobalStats = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const stats = await statsService.getGlobalStats();
    successResponse(res, stats);
  });

  /**
   * @route   GET /api/admin/stats/most-viewed
   * @desc    Articles les plus vus
   * @access  Private
   */
  getMostViewedArticles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { limit = '10' } = req.query;
    const articles = await statsService.getMostViewedArticles(parseInt(limit as string));
    successResponse(res, articles);
  });

  /**
   * @route   GET /api/admin/stats/recent
   * @desc    Articles récents
   * @access  Private
   */
  getRecentArticles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { limit = '10' } = req.query;
    const articles = await statsService.getRecentArticles(parseInt(limit as string));
    successResponse(res, articles);
  });

  /**
   * @route   GET /api/admin/stats/categories
   * @desc    Statistiques par catégorie
   * @access  Private
   */
  getCategoryStats = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const stats = await statsService.getCategoryStats();
    successResponse(res, stats);
  });

  /**
   * @route   GET /api/admin/stats/authors
   * @desc    Statistiques par auteur
   * @access  Private
   */
  getAuthorStats = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const stats = await statsService.getAuthorStats();
    successResponse(res, stats);
  });
}

export const statsController = new StatsController();