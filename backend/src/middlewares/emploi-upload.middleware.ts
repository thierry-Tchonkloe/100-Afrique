// src/middlewares/emploi-upload.middleware.ts
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { type Request } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Memory storage (buffer → Cloudinary) ─────────────────────────────────────
const storage = multer.memoryStorage();

function fileFilter(allowed: string[]) {
  return (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Type non autorisé: ${file.mimetype}`));
  };
}

// Image upload (avatars, logos, banners, photos)
export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
  fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
});

// CV upload (PDF only, 2 Mo)
export const uploadPdf = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter(['application/pdf']),
});

// ── Upload to Cloudinary helper ───────────────────────────────────────────────
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId?: string,
  resourceType: 'image' | 'raw' | 'auto' = 'image'
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${process.env.CLOUDINARY_FOLDER ?? 'itourisme-nomade-cloud'}/emploi/${folder}`,
        ...(publicId && { public_id: publicId }),
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error('Upload failed'));
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

// ── Express middleware that uploads buffer to Cloudinary ──────────────────────
export function cloudinaryMiddleware(folder: string, resourceType: 'image' | 'raw' = 'image') {
  return async (req: any, _res: any, next: any) => {
    if (!req.file) { next(); return; }
    try {
      const { url, publicId } = await uploadToCloudinary(
        req.file.buffer, folder, undefined, resourceType
      );
      req.file.path = url;          // compatible with existing controller code
      req.file.url  = url;
      req.file.public_id = publicId;
      next();
    } catch (err) { next(err); }
  };
}