import cloudinary, { uploadOptions } from '../config/cloudinary';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';

/**
 * Service de gestion des médias
 */
export class MediaService {
  /**
   * Upload une image vers Cloudinary
   */
  async uploadImage(file: Express.Multer.File): Promise<{
    url: string;
    publicId: string;
    filename: string;
    size: number;
    mimeType: string;
  }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        async (error, result) => {
          if (error) {
            reject(new AppError('Erreur lors de l\'upload de l\'image', 500));
            return;
          }

          if (!result) {
            reject(new AppError('Aucune réponse de Cloudinary', 500));
            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            filename: file.originalname,
            size: result.bytes,
            mimeType: file.mimetype,
          });
        }
      );

      // Envoyer le buffer vers Cloudinary
      uploadStream.end(file.buffer);
    });
  }

  /**
   * Sauvegarde les métadonnées du média dans la BDD
   */
  async saveMedia(data: {
    url: string;
    publicId: string;
    filename: string;
    altText?: string;
    size?: number;
    mimeType?: string;
  }) {
    const media = await prisma.media.create({
      data,
    });

    return media;
  }

  /**
   * Upload et sauvegarde en une seule opération
   */
  async uploadAndSave(file: Express.Multer.File, altText?: string) {
    // Upload vers Cloudinary
    const uploadResult = await this.uploadImage(file);

    // Sauvegarder dans la BDD
    const media = await this.saveMedia({
      ...uploadResult,
      altText,
    });

    return media;
  }

  /**
   * Récupère tous les médias avec pagination
   */
  async getMedia(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;

    const [media, totalItems] = await Promise.all([
      prisma.media.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.media.count(),
    ]);

    return {
      media,
      totalItems,
    };
  }

  /**
   * Récupère un média par son ID
   */
  async getMediaById(id: number) {
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new AppError('Média non trouvé', 404);
    }

    return media;
  }

  /**
   * Supprime un média (de Cloudinary et de la BDD)
   */
  async deleteMedia(id: number) {
    // Récupérer le média
    const media = await this.getMediaById(id);

    try {
      // Supprimer de Cloudinary
      await cloudinary.uploader.destroy(media.publicId);
    } catch (error) {
      // Log l'erreur mais continue quand même
      console.error('Erreur lors de la suppression de Cloudinary:', error);
    }

    // Supprimer de la BDD
    await prisma.media.delete({
      where: { id },
    });

    return { message: 'Média supprimé avec succès' };
  }

  /**
   * Met à jour les métadonnées d'un média
   */
  async updateMedia(id: number, data: { altText?: string; filename?: string }) {
    // Vérifier que le média existe
    await this.getMediaById(id);

    // Mettre à jour
    const media = await prisma.media.update({
      where: { id },
      data,
    });

    return media;
  }
}

export const mediaService = new MediaService();