// src/app.ts
import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config, validateConfig } from './config/env';
import { disconnectDatabase } from './config/database';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';
import { rssScheduler } from './services/rss-scheduler.service';

/**
 * Initialisation de l'application Express
 */
const app: Application = express();

/**
 * Validation de la configuration au démarrage
 */
try {
  validateConfig();
} catch (error) {
  logger.error('Erreur de configuration:', error);
  process.exit(1);
}

// ========================================
// MIDDLEWARES GLOBAUX
// ========================================

/**
 * Sécurité - Helmet
 * Protection contre diverses vulnérabilités web
 */
app.use(helmet());

/**
 * CORS - Configuration
 * Autorise les requêtes cross-origin depuis les origines définies
 */
// app.use(
//   cors({
//     origin: config.cors.origin,
//     credentials: true,
//   })
// );


app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://100-afrique.vercel.app',
    ],
    credentials: true,
  })
);

/**
 * Rate Limiting
 * Protection contre les attaques par force brute et DDoS
 */
// const limiter = rateLimit({
//   windowMs: config.rateLimit.windowMs,
//   max: config.rateLimit.max,
//   message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// app.use('/api/', limiter);

app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,

    skip: (req) => {
      // 🔥 ne limite pas GET (lecture)
      return req.method === 'GET';
    },
  })
);

app.set('trust proxy', 1);

/**
 * Body Parser
 * Parse les requêtes JSON et URL-encoded
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================================
// ROUTE DE SANTÉ (HEALTH CHECK)
// ========================================

/**
 * @route   GET /
 * @desc    Health check - Vérifier que l'API fonctionne
 * @access  Public
 */
app.get('/', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    message: '🚀 iTourisme Nomade Backend API',
    version: '1.0.0',
    environment: config.env,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route   GET /api/health
 * @desc    Health check détaillé
 * @access  Public
 */
app.get('/api/health', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// ROUTES API
// ========================================

/**
 * Routes principales (depuis src/routes/index.ts)
 * Inclut toutes les routes définies dans le fichier central
 */
app.use('/api', routes);

// ========================================
// GESTION DES ERREURS
// ========================================

/**
 * Route non trouvée (404)
 */
app.use(notFoundHandler);

/**
 * Gestionnaire d'erreurs global
 */
app.use(errorHandler);

// ========================================
// DÉMARRAGE DU SERVEUR
// ========================================

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.success(`🚀 Serveur démarré sur le port ${PORT}`);
  logger.info(`📡 Environnement: ${config.env}`);
  logger.info(`🌍 URL: http://localhost:${PORT}`);
  logger.info(`📚 Documentation: http://localhost:${PORT}/api`);
  logger.info('');
  logger.info('📋 Routes disponibles:');
  logger.info('  • Magazine: /api/magazine/*');
  logger.info('  • Newsletter: /api/newsletter/*');
  logger.info('  • Partenaires: /api/pages/partners, /api/contacts/partners');
  logger.info('  • Destinations: /api/destinations/*');
  logger.info('  • Articles: /api/mag/articles/*');
  logger.info('  • Catégories: /api/mag/categories/*');

  if (config.rss.schedulerEnabled) {
    rssScheduler.startScheduler();
    logger.info('  • RSS Scheduler: activé');
  } else {
    logger.info('  • RSS Scheduler: désactivé');
  }
});

// ========================================
// GESTION DE L'ARRÊT GRACIEUX
// ========================================

/**
 * Arrêt propre du serveur
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`\n${signal} reçu, arrêt en cours...`);

  server.close(async () => {
    logger.info('✅ Serveur HTTP fermé');

    try {
      await disconnectDatabase();
      logger.success('👋 Arrêt complet du serveur');
      process.exit(0);
    } catch (error) {
      logger.error('Erreur lors de l\'arrêt:', error);
      process.exit(1);
    }
  });

  // Force l'arrêt après 10 secondes
  setTimeout(() => {
    logger.error('⏰ Arrêt forcé après timeout');
    process.exit(1);
  }, 10000);
};

// Écoute des signaux d'arrêt
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('❌ Promesse rejetée non gérée:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('❌ Exception non capturée:', error);
  process.exit(1);
});

export default app;
