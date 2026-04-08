// src/controllers/article.controller.ts
import type { Request, Response } from 'express';
import { articleService } from '../services/article.service';
import { successResponse, paginatedResponse, calculatePagination } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import { config } from '../config/env';

export type ArticleType = "ARTICLE" | "PAGE" | "VIDEO" | "SALON" | "DESTINATION";

export class ArticleController {
  /**
   * @route   GET /api/mag/articles
   * @desc    Liste des articles (Front-Office) avec filtres avancés
   * @access  Public
   */
  getPublicArticles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
      page     = '1',
      pageSize = config.pagination.defaultPageSize.toString(),
      search,
      categoryId,
      categorySlug,
      featured,
      hasVideo,
      year,
      type,                          // ✅ NOUVEAU — filtre par type (VIDEO, ARTICLE…)
      sortBy = 'createdAt:desc',
    } = req.query;

    const pageNum    = Math.max(1, parseInt(page as string));
    const pageSizeNum = Math.min(
      config.pagination.maxPageSize,
      Math.max(1, parseInt(pageSize as string))
    );

    // Construction des filtres
    const filters: {
      search?:       string;
      categoryId?:   number;
      categorySlug?: string;
      featured?:     boolean;
      hasVideo?:     boolean;
      year?:         number;
      type?:         ArticleType;
      status:        'PUBLISHED';
    } = {
      status: 'PUBLISHED' as const,
    };

    if (search) {
      filters.search = search as string;
    }

    if (categoryId) {
      filters.categoryId = parseInt(categoryId as string);
    }

    if (categorySlug) {
      filters.categorySlug = categorySlug as string;
    }

    if (featured === 'true') {
      filters.featured = true;
    } else if (featured === 'false') {
      filters.featured = false;
    }

    if (hasVideo === 'true') {
      filters.hasVideo = true;
    }

    if (year) {
      filters.year = parseInt(year as string);
    }

    // ✅ NOUVEAU — filtre type (VIDEO, ARTICLE, SALON, DESTINATION, PAGE)
    const allowedTypes: ArticleType[] = ['ARTICLE', 'PAGE', 'VIDEO', 'SALON', 'DESTINATION'];
    if (type && allowedTypes.includes((type as string).toUpperCase() as ArticleType)) {
      filters.type = (type as string).toUpperCase() as ArticleType;
    }

    // Options de tri
    const [sortField, sortOrder] = (sortBy as string).split(':');
    const sortOptions = {
      field: sortField,
      order: (sortOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc',
    };

    const { articles, totalItems } = await articleService.getArticles(
      filters,
      { page: pageNum, pageSize: pageSizeNum },
      sortOptions
    );

    const pagination = calculatePagination(pageNum, pageSizeNum, totalItems);

    paginatedResponse(res, articles, pagination);
  });

  /**
   * @route   GET /api/mag/articles/:slug
   * @desc    Détail d'un article par slug (Front-Office)
   * @access  Public
   */
  getPublicArticleBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    if (!slug || Array.isArray(slug)) {
      throw new Error('Slug invalide');
    }

    const article = await articleService.getArticleBySlug(slug);
    await articleService.incrementViews(article.id);

    successResponse(res, article);
  });

  /**
   * @route   GET /api/admin/articles
   * @desc    Liste de tous les articles (Back-Office)
   * @access  Private (Admin)
   */
  getAllArticles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
      page     = '1',
      pageSize = config.pagination.defaultPageSize.toString(),
      search,
      categoryId,
      status,
      authorId,
      type,
      startDateFrom,  // ← nouveau
      startDateTo,    // ← nouveau
    } = req.query;

    const pageNum = Number.isNaN(parseInt(page as string))
      ? 1
      : Math.max(1, parseInt(page as string));

    const pageSizeNum = Number.isNaN(parseInt(pageSize as string))
      ? config.pagination.defaultPageSize
      : Math.min(config.pagination.maxPageSize, Math.max(1, parseInt(pageSize as string)));

    const filters: {
      type?:       ArticleType;
      search?:     string;
      categoryId?: number;
      status?: 'DRAFT' | 'PUBLISHED' | 'REVIEW' | 'ARCHIVED';
      authorId?: number;
      startDateFrom?: Date;  // ← nouveau
      startDateTo?: Date;    // ← nouveau
    } = {};

    const allowedTypes: ArticleType[] = ['ARTICLE', 'PAGE', 'VIDEO', 'SALON', 'DESTINATION'];
    if (type && allowedTypes.includes((type as string).toUpperCase() as ArticleType)) {
      filters.type = (type as string).toUpperCase() as ArticleType;
    }

    // if (type && ["ARTICLE", "PAGE", "VIDEO", "SALON", "DESTINATION"].includes(type as string)) {
    //   filters.type = type as any;
    // }

    if (search) {
      filters.search = search as string;
    }

    if (categoryId) {
      filters.categoryId = parseInt(categoryId as string);
    }

    // if (status && (status === 'DRAFT' || status === 'PUBLISHED' || status === 'REVIEW' || status === 'ARCHIVED')) {
    //   filters.status = status;
    // }

    if (status && ['DRAFT', 'PUBLISHED', 'REVIEW', 'ARCHIVED'].includes(status as string)) {
      filters.status = status as 'DRAFT' | 'PUBLISHED' | 'REVIEW' | 'ARCHIVED';
    }

    if (authorId) {
      filters.authorId = parseInt(authorId as string);
    }

    // ── Filtres SALON ──────────────────────────────────────────
    if (startDateFrom) filters.startDateFrom = new Date(startDateFrom as string);
    if (startDateTo) filters.startDateTo = new Date(startDateTo as string);

    const { articles, totalItems } = await articleService.getArticles(filters, {
      page: pageNum,
      pageSize: pageSizeNum,
    });

    const pagination = calculatePagination(pageNum, pageSizeNum, totalItems);

    paginatedResponse(res, articles, pagination);
  });

  /**
   * @route   GET /api/admin/articles/:id
   * @access  Private (Admin)
   */
  getArticleById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id || Array.isArray(id)) throw new Error('ID invalide');
    const article = await articleService.getArticleById(parseInt(id));
    successResponse(res, article);
  });

  /**
   * @route   POST /api/admin/articles
   * @access  Private (Admin)
   */
  createArticle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authorId = req.user!.userId;
    const article  = await articleService.createArticle(req.body, authorId);
    successResponse(res, article, 'Article créé avec succès', 201);
  });

  /**
   * @route   POST /api/admin/articles/quick
   * @access  Private (Admin)
   */
  quickCreateArticle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authorId = req.user!.userId;
    const article  = await articleService.quickCreateArticle(req.body, authorId);
    successResponse(res, article, 'Article créé avec succès', 201);
  });

  /**
   * @route   PUT /api/admin/articles/:id
   * @access  Private (Admin)
   */
  updateArticle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id || Array.isArray(id)) throw new Error('ID invalide');
    const article = await articleService.updateArticle(parseInt(id), req.body);
    successResponse(res, article, 'Article modifié avec succès');
  });

  /**
   * @route   DELETE /api/admin/articles/:id
   * @access  Private (Admin)
   */
  deleteArticle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id || Array.isArray(id)) throw new Error('ID invalide');
    const result = await articleService.deleteArticle(parseInt(id));
    successResponse(res, result);
  });

  /**
   * @route   GET /api/destinations/featured
   * @access  Public
   */
  getFeaturedArticles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { limit = '5' } = req.query;
    const articles = await articleService.getFeaturedArticles(parseInt(limit as string));
    successResponse(res, articles);
  });
}

export const articleController = new ArticleController();