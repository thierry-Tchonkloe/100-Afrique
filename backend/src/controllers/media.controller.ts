import type { Request, Response } from 'express';
import { mediaService } from '../services/media.service';
import { successResponse, paginatedResponse, calculatePagination } from '../utils/response';
import { asyncHandler, AppError } from '../middlewares/errorHandler';

/**
 * Contrôleur des médias
 */
export class MediaController {
  /**
   * @route   POST /api/admin/media/upload
   * @desc    Upload d'une image vers Cloudinary
   * @access  Private
   */
  uploadImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError('Aucun fichier fourni', 400);
    }

    const { altText } = req.body;

    const media = await mediaService.uploadAndSave(req.file, altText);

    successResponse(res, media, 'Image uploadée avec succès', 201);
  });

  /**
   * @route   GET /api/admin/media
   * @desc    Liste de tous les médias
   * @access  Private
   */
  getAllMedia = asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', pageSize = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const pageSizeNum = Math.max(1, parseInt(pageSize as string));

    const { media, totalItems } = await mediaService.getMedia(pageNum, pageSizeNum);

    const pagination = calculatePagination(pageNum, pageSizeNum, totalItems);

    paginatedResponse(res, media, pagination);
  });

  /**
   * @route   GET /api/admin/media/:id
   * @desc    Détail d'un média par ID
   * @access  Private
   */
  getMediaById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // ✅ Vérification
    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const media = await mediaService.getMediaById(parseInt(id));

    successResponse(res, media);
  });

  /**
   * @route   PUT /api/admin/media/:id
   * @desc    Modifier les métadonnées d'un média
   * @access  Private
   */
  updateMedia = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // ✅ Vérification
    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const { altText, filename } = req.body;

    const media = await mediaService.updateMedia(parseInt(id), { altText, filename });

    successResponse(res, media, 'Média modifié avec succès');
  });

  /**
   * @route   DELETE /api/admin/media/:id
   * @desc    Supprimer un média
   * @access  Private
   */
  deleteMedia = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // ✅ Vérification
    if (!id || Array.isArray(id)) {
      throw new Error('ID invalide');
    }

    const result = await mediaService.deleteMedia(parseInt(id));

    successResponse(res, result);
  });
}

export const mediaController = new MediaController();