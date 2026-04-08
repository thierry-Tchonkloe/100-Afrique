// src/controllers/category.controller.ts
import type { Request, Response } from 'express';
import { categoryService } from '../services/category.service';
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * Contrôleur des catégories
 */
export class CategoryController {
  /**
   * @route   GET /api/categories
   * @desc    Liste de toutes les catégories (Front-Office)
   * @access  Public
   */
  getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const { type } = req.query;

    let categories;
    if (type && (type === 'MAGAZINE' || type === 'DESTINATION')) {
      categories = await categoryService.getCategoriesByType(type);
    } else {
      categories = await categoryService.getAllCategories();
    }

    successResponse(res, categories);
  });

  /**
   * @route   GET /api/categories/:slug
   * @desc    Détail d'une catégorie par slug
   * @access  Public
   */
  getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;

    // ✅ Vérification
    if (!slug || Array.isArray(slug)) {
      throw new Error('Slug invalide');
    }

    const category = await categoryService.getCategoryBySlug(slug);

    successResponse(res, category);
  });

  /**
   * @route   GET /api/admin/categories/:id
   * @desc    Détail d'une catégorie par ID (Back-Office)
   * @access  Private
   */
  getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // ✅ Vérification
    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const category = await categoryService.getCategoryById(parseInt(id));

    successResponse(res, category);
  });

  /**
   * @route   POST /api/admin/categories
   * @desc    Créer une catégorie
   * @access  Private (SUPER_ADMIN uniquement)
   */
  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(req.body);

    successResponse(res, category, 'Catégorie créée avec succès', 201);
  });

  /**
   * @route   PUT /api/admin/categories/:id
   * @desc    Modifier une catégorie
   * @access  Private (SUPER_ADMIN uniquement)
   */
  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // ✅ Vérification
    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const category = await categoryService.updateCategory(parseInt(id), req.body);

    successResponse(res, category, 'Catégorie modifiée avec succès');
  });

  /**
   * @route   DELETE /api/admin/categories/:id
   * @desc    Supprimer une catégorie
   * @access  Private (SUPER_ADMIN uniquement)
   */
  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // ✅ Vérification
    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const result = await categoryService.deleteCategory(parseInt(id));

    successResponse(res, result);
  });
}

export const categoryController = new CategoryController();