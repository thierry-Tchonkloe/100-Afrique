import { v2 as cloudinary } from 'cloudinary';
import { config } from './env';

/**
 * Configuration de Cloudinary pour le stockage des images
 */
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true, // Toujours utiliser HTTPS
});

export default cloudinary;

/**
 * Options d'upload par défaut pour Cloudinary
 */
export const uploadOptions = {
  folder: config.cloudinary.folder,
  resource_type: 'auto' as const,
  allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'mp4'],
  transformation: [
    {
      quality: 'auto:good',
      fetch_format: 'auto',
    },
  ],
};