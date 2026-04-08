import multer from 'multer';
import type { Request } from 'express';
import { AppError } from './errorHandler';

/**
 * Configuration Multer pour l'upload de fichiers
 * Utilise la mémoire temporaire avant l'envoi vers Cloudinary
 */
const storage = multer.memoryStorage();

/**
 * Filtre pour n'accepter que les images
 */
const fileFilter = (
  _req: Request, // ← Préfixé avec _
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  // Types MIME autorisés
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    "application/pdf",
    "video/mp4",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Seules les images (JPEG, PNG, GIF, WebP, pdf, mp4) sont autorisées',
        400
      )
    );
  }
};

/**
 * Configuration de l'upload
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite à 5 MB
  },
});

/**
 * Middleware pour upload d'une seule image
 */
export const uploadSingle = upload.single('image');

/**
 * Middleware pour upload de plusieurs images
 */
export const uploadMultiple = upload.array('images', 10); // Maximum 10 images