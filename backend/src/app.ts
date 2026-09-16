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
import { startBannerStatusCron } from './jobs/refreshBannerStatuses.cron';

const app: Application = express();

try {
  validateConfig();
} catch (error) {
  logger.error('Erreur de configuration:', error);
  process.exit(1);
}

// ── Sécurité ──────────────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
const rawOrigins = process.env.CORS_ORIGIN ?? '';
const envOrigins = rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);

const BASE_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://100-afrique.vercel.app',
  'https://www.100-afrique.vercel.app',
];

const allowedOrigins = [...new Set([...BASE_ORIGINS, ...envOrigins])];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.warn(`[CORS] Origine bloquée: "${origin}"`);
      console.warn(`[CORS] Origines autorisées: ${allowedOrigins.join(' | ')}`);
      return callback(new Error(`CORS: origine ${origin} non autorisée`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, skip: (req) => req.method === 'GET' }));

app.set('trust proxy', 1);

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Health checks ─────────────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    message: '🚀 iTourisme Nomade Backend API',
    version: '1.0.0',
    environment: config.env,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (_req: Request, res: Response): void => {
  res.json({ success: true, status: 'healthy', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// ── Routes principales ────────────────────────────────────────────────────────
app.use('/api', routes);

// ── Erreurs ───────────────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Démarrage ─────────────────────────────────────────────────────────────────
const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.success(`🚀 Serveur démarré sur le port ${PORT}`);
  logger.info(`📡 Environnement: ${config.env}`);
  logger.info(`🌍 URL: http://localhost:${PORT}`);
  logger.info(`🔒 CORS autorisé pour: ${allowedOrigins.join(', ')}`);

  if (config.rss.schedulerEnabled) {
    rssScheduler.startScheduler();
    logger.info('  • RSS Scheduler: activé');
  }

  // ✅ Rafraîchissement automatique des statuts de bannières (admin uniquement,
  // n'affecte pas l'affichage public qui filtre déjà sur les dates en direct)
  startBannerStatusCron();
  logger.info('  • Banner Status Cron: activé');
});

// ── Arrêt gracieux ────────────────────────────────────────────────────────────
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`\n${signal} reçu, arrêt en cours...`);
  server.close(async () => {
    logger.info('✅ Serveur HTTP fermé');
    try {
      await disconnectDatabase();
      logger.success('👋 Arrêt complet du serveur');
      process.exit(0);
    } catch (error) {
      logger.error("Erreur lors de l'arrêt:", error);
      process.exit(1);
    }
  });
  setTimeout(() => { logger.error('⏰ Arrêt forcé'); process.exit(1); }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('❌ Promesse rejetée non gérée:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('❌ Exception non capturée:', error);
  process.exit(1);
});

export default app;
