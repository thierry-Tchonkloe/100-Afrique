import { Router } from 'express';
import { mediaController } from '../controllers/media.controller';
import { authenticate } from '../middlewares/auth';
import { uploadSingle } from '../middlewares/upload';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

/**
 * @route   POST /api/admin/media/upload
 * @desc    Upload d'une image
 * @access  Private
 */
router.post('/upload', uploadSingle, mediaController.uploadImage);

/**
 * @route   GET /api/admin/media
 * @desc    Liste de tous les médias
 * @access  Private
 */
router.get('/', mediaController.getAllMedia);

/**
 * @route   GET /api/admin/media/:id
 * @desc    Détail d'un média
 * @access  Private
 */
router.get('/:id', mediaController.getMediaById);

/**
 * @route   PUT /api/admin/media/:id
 * @desc    Modifier un média
 * @access  Private
 */
router.put('/:id', mediaController.updateMedia);

/**
 * @route   DELETE /api/admin/media/:id
 * @desc    Supprimer un média
 * @access  Private
 */
router.delete('/:id', mediaController.deleteMedia);

export default router;