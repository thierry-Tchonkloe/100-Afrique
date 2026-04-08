// src/controllers/tags.controller.ts
import type { Request, Response } from 'express';
import { tagsService } from '../services/tags.service';
import { successResponse } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * Contrôleur des tags
 */
export class TagsController {
  /**
   * @route   GET /api/admin/tags
   * @desc    Liste de tous les tags
   * @access  Private (SUPER_ADMIN, EDITOR)
   */
  // ✅ CORRECTION: Remplacer req par _req
  getAllTags = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const tags = await tagsService.getAllTags();
    successResponse(res, tags, 'Tags récupérés avec succès');
  });

  /**
   * @route   GET /api/admin/tags/:id
   * @desc    Détail d'un tag
   * @access  Private (SUPER_ADMIN, EDITOR)
   */
  getTagById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const tag = await tagsService.getTagById(parseInt(id));
    successResponse(res, tag, 'Tag récupéré avec succès');
  });

  /**
   * @route   POST /api/admin/tags
   * @desc    Créer un tag
   * @access  Private (SUPER_ADMIN, EDITOR)
   */
  createTag = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const tag = await tagsService.createTag(req.body);
    successResponse(res, tag, 'Tag créé avec succès', 201);
  });

  /**
   * @route   PUT /api/admin/tags/:id
   * @desc    Modifier un tag
   * @access  Private (SUPER_ADMIN, EDITOR)
   */
  updateTag = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const tag = await tagsService.updateTag(parseInt(id), req.body);
    successResponse(res, tag, 'Tag modifié avec succès');
  });

  /**
   * @route   DELETE /api/admin/tags/:id
   * @desc    Supprimer un tag
   * @access  Private (SUPER_ADMIN)
   */
  deleteTag = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const result = await tagsService.deleteTag(parseInt(id));
    successResponse(res, result, 'Tag supprimé avec succès');
  });
}

export const tagsController = new TagsController();