import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

/**
 * Configuration centralisée de l'application
 * Toutes les variables d'environnement sont validées au démarrage
 */
export const config = {
  // Environnement
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',

  // Serveur
  port: parseInt(process.env.PORT || '5000', 10),

  // Base de données
  databaseUrl: process.env.DATABASE_URL!,

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
    folder: process.env.CLOUDINARY_FOLDER || 'itourisme-nomade',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['https://100-afrique.vercel.app', 'http://localhost:3000'],
  },

  // Bcrypt
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  },

  // Rate Limiting
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15', 10) * 60 * 1000,
  },

  // Cache
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
  },

  // RSS
  rss: {
    schedulerEnabled: process.env.RSS_SCHEDULER_ENABLED !== 'false',
  },

  // Pagination
  pagination: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || '10', 10),
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || '50', 10),
  },
};

/**
 * Valide que toutes les variables d'environnement requises sont présentes
 */
export function validateConfig(): void {
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Variables d'environnement manquantes: ${missing.join(', ')}\n` +
      `Veuillez créer un fichier .env basé sur .env.example`
    );
  }

  console.log('✅ Configuration validée avec succès');
}
