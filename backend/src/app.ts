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
// On lit CORS_ORIGIN depuis l'env (liste séparée par des virgules).
// En prod sur Render/Railway : CORS_ORIGIN=https://ton-domaine.vercel.app
// En local : CORS_ORIGIN=http://localhost:3000,http://localhost:3001
const rawOrigins = process.env.CORS_ORIGIN ?? '';
const envOrigins = rawOrigins
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Origines de base toujours autorisées (prod hardcodée + localhost dev)
const BASE_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://100-afrique.vercel.app',
  'https://www.100-afrique.vercel.app',
];

// Fusion : env + base (dédupliqué)
const allowedOrigins = [...new Set([...BASE_ORIGINS, ...envOrigins])];

app.use(
  cors({
    origin: (origin, callback) => {
      // Requêtes sans origin (Postman, SSR, mobile) → autorisées
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Log pour diagnostiquer en prod
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
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    skip: (req) => req.method === 'GET',
  })
);

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
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── Endpoint de diagnostic emploi (TEMPORAIRE — à supprimer après debug) ──────
// Permet de vérifier en prod que le lien RecruteurEtablissement existe bien.
// Accès : GET /api/emploi-debug/check?email=recruteur@example.com
// IMPORTANT : supprimer ou protéger cet endpoint après résolution du problème.
app.get('/api/emploi-debug/check', async (req: Request, res: Response): Promise<void> => {
  // Sécurité minimale : token de debug requis
  const debugToken = req.query.token as string;
  if (debugToken !== process.env.DEBUG_TOKEN && process.env.NODE_ENV === 'production') {
    res.status(401).json({ error: 'Non autorisé. Passez ?token=VOTRE_DEBUG_TOKEN' });
    return;
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const email = req.query.email as string;

    if (email) {
      // Diagnostic pour un recruteur spécifique
      const user = await prisma.emploiUser.findUnique({
        where: { email },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (!user) {
        res.json({ found: false, message: `Aucun utilisateur avec email: ${email}` });
        await prisma.$disconnect();
        return;
      }

      const liens = await prisma.recruteurEtablissement.findMany({
        where: { userId: user.id },
        include: { etablissement: { select: { id: true, name: true, sector: true } } },
      });

      const vitrines = await Promise.all(
        liens.map((l) =>
          prisma.vitrine.findUnique({ where: { etablissementId: l.etablissementId } })
        )
      );

      res.json({
        user,
        liens: liens.map((l, i) => ({
          liaisonId:      l.id,
          isDefault:      l.isDefault,
          etablissement:  l.etablissement,
          vitrineExiste:  !!vitrines[i],
          vitrineId:      vitrines[i]?.id ?? null,
        })),
        diagnostic: {
          liensCount:     liens.length,
          hasDefault:     liens.some((l) => l.isDefault),
          probleme:       liens.length === 0
            ? '❌ AUCUN LIEN RecruteurEtablissement — exécuter le SQL de correction'
            : !liens.some((l) => l.isDefault)
            ? '⚠️  Liens existent mais isDefault=false — exécuter UPDATE'
            : '✅ Configuration correcte',
        },
        // SQL de correction si nécessaire
        sqlFix: liens.length === 0 ? `
-- Exécuter dans ta DB prod :
INSERT INTO etablissements (name, sector, city, "createdAt", "updatedAt")
VALUES ('Établissement de ${user.email}', 'Hôtellerie', '', NOW(), NOW())
RETURNING id;
-- Puis (remplace USER_ID et ETAB_ID) :
INSERT INTO recruteur_etablissements ("userId", "etablissementId", "isDefault")
VALUES (${user.id}, ETAB_ID, true);
INSERT INTO vitrines ("etablissementId", kpis, values, perks, photos, videos, socials, "completionScore", views, "createdAt", "updatedAt")
VALUES (ETAB_ID, '[]', '[]', '[]', '[]', '[]', '{}', 0, 0, NOW(), NOW())
ON CONFLICT ("etablissementId") DO NOTHING;
        ` : liens.some((l) => !l.isDefault) ? `
-- Exécuter dans ta DB prod :
UPDATE recruteur_etablissements SET "isDefault" = true WHERE "userId" = ${user.id};
        ` : 'Aucune correction nécessaire',
      });
    } else {
      // Vue globale : tous les recruteurs
      const recruteurs = await prisma.emploiUser.findMany({
        where: { role: 'RECRUITER' },
        select: { id: true, email: true, isActive: true },
      });

      const result = await Promise.all(
        recruteurs.map(async (u) => {
          const liens = await prisma.recruteurEtablissement.findMany({
            where: { userId: u.id },
          });
          return {
            ...u,
            liensCount: liens.length,
            hasDefault: liens.some((l) => l.isDefault),
            statut:     liens.length === 0 ? '❌ AUCUN LIEN' : !liens.some((l) => l.isDefault) ? '⚠️ PAS DE DEFAULT' : '✅ OK',
          };
        })
      );

      res.json({
        recruteurs: result,
        resume: {
          total:    result.length,
          ok:       result.filter((r) => r.statut === '✅ OK').length,
          sansLien: result.filter((r) => r.statut === '❌ AUCUN LIEN').length,
          sansDef:  result.filter((r) => r.statut === '⚠️ PAS DE DEFAULT').length,
        },
      });
    }

    await prisma.$disconnect();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
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
      logger.error('Erreur lors de l\'arrêt:', error);
      process.exit(1);
    }
  });
  setTimeout(() => { logger.error('⏰ Arrêt forcé'); process.exit(1); }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('❌ Promesse rejetée non gérée:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('❌ Exception non capturée:', error);
  process.exit(1);
});

export default app;
















// // src/app.ts
// import express, { type Application, type Request, type Response } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import { config, validateConfig } from './config/env';
// import { disconnectDatabase } from './config/database';
// import routes from './routes';
// import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
// import { logger } from './utils/logger';
// import { rssScheduler } from './services/rss-scheduler.service';

// /**
//  * Initialisation de l'application Express
//  */
// const app: Application = express();

// /**
//  * Validation de la configuration au démarrage
//  */
// try {
//   validateConfig();
// } catch (error) {
//   logger.error('Erreur de configuration:', error);
//   process.exit(1);
// }

// // ========================================
// // MIDDLEWARES GLOBAUX
// // ========================================

// /**
//  * Sécurité - Helmet
//  * Protection contre diverses vulnérabilités web
//  */
// app.use(helmet());

// /**
//  * CORS - Configuration
//  * Autorise les requêtes cross-origin depuis les origines définies
//  */
// // app.use(
// //   cors({
// //     origin: config.cors.origin,
// //     credentials: true,
// //   })
// // );


// app.use(
//   cors({
//     origin: [
//       'http://localhost:3000',
//       'https://100-afrique.vercel.app',
//     ],
//     credentials: true,
//   })
// );

// /**
//  * Rate Limiting
//  * Protection contre les attaques par force brute et DDoS
//  */
// // const limiter = rateLimit({
// //   windowMs: config.rateLimit.windowMs,
// //   max: config.rateLimit.max,
// //   message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard',
// //   standardHeaders: true,
// //   legacyHeaders: false,
// // });

// // app.use('/api/', limiter);

// app.use(
//   '/api/',
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 1000,

//     skip: (req) => {
//       // 🔥 ne limite pas GET (lecture)
//       return req.method === 'GET';
//     },
//   })
// );

// app.set('trust proxy', 1);

// /**
//  * Body Parser
//  * Parse les requêtes JSON et URL-encoded
//  */
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // ========================================
// // ROUTE DE SANTÉ (HEALTH CHECK)
// // ========================================

// /**
//  * @route   GET /
//  * @desc    Health check - Vérifier que l'API fonctionne
//  * @access  Public
//  */
// app.get('/', (_req: Request, res: Response): void => {
//   res.json({
//     success: true,
//     message: '🚀 iTourisme Nomade Backend API',
//     version: '1.0.0',
//     environment: config.env,
//     timestamp: new Date().toISOString(),
//   });
// });

// /**
//  * @route   GET /api/health
//  * @desc    Health check détaillé
//  * @access  Public
//  */
// app.get('/api/health', (_req: Request, res: Response): void => {
//   res.json({
//     success: true,
//     status: 'healthy',
//     uptime: process.uptime(),
//     timestamp: new Date().toISOString(),
//   });
// });

// // ========================================
// // ROUTES API
// // ========================================

// /**
//  * Routes principales (depuis src/routes/index.ts)
//  * Inclut toutes les routes définies dans le fichier central
//  */
// app.use('/api', routes);

// // ========================================
// // GESTION DES ERREURS
// // ========================================

// /**
//  * Route non trouvée (404)
//  */
// app.use(notFoundHandler);

// /**
//  * Gestionnaire d'erreurs global
//  */
// app.use(errorHandler);

// // ========================================
// // DÉMARRAGE DU SERVEUR
// // ========================================

// const PORT = config.port;

// const server = app.listen(PORT, () => {
//   logger.success(`🚀 Serveur démarré sur le port ${PORT}`);
//   logger.info(`📡 Environnement: ${config.env}`);
//   logger.info(`🌍 URL: http://localhost:${PORT}`);
//   logger.info(`📚 Documentation: http://localhost:${PORT}/api`);
//   logger.info('');
//   logger.info('📋 Routes disponibles:');
//   logger.info('  • Magazine: /api/magazine/*');
//   logger.info('  • Newsletter: /api/newsletter/*');
//   logger.info('  • Partenaires: /api/pages/partners, /api/contacts/partners');
//   logger.info('  • Destinations: /api/destinations/*');
//   logger.info('  • Articles: /api/mag/articles/*');
//   logger.info('  • Catégories: /api/mag/categories/*');

//   if (config.rss.schedulerEnabled) {
//     rssScheduler.startScheduler();
//     logger.info('  • RSS Scheduler: activé');
//   } else {
//     logger.info('  • RSS Scheduler: désactivé');
//   }
// });

// // ========================================
// // GESTION DE L'ARRÊT GRACIEUX
// // ========================================

// /**
//  * Arrêt propre du serveur
//  */
// const gracefulShutdown = async (signal: string): Promise<void> => {
//   logger.info(`\n${signal} reçu, arrêt en cours...`);

//   server.close(async () => {
//     logger.info('✅ Serveur HTTP fermé');

//     try {
//       await disconnectDatabase();
//       logger.success('👋 Arrêt complet du serveur');
//       process.exit(0);
//     } catch (error) {
//       logger.error('Erreur lors de l\'arrêt:', error);
//       process.exit(1);
//     }
//   });

//   // Force l'arrêt après 10 secondes
//   setTimeout(() => {
//     logger.error('⏰ Arrêt forcé après timeout');
//     process.exit(1);
//   }, 10000);
// };

// // Écoute des signaux d'arrêt
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// // Gestion des erreurs non capturées
// process.on('unhandledRejection', (reason: unknown) => {
//   logger.error('❌ Promesse rejetée non gérée:', reason);
//   process.exit(1);
// });

// process.on('uncaughtException', (error: Error) => {
//   logger.error('❌ Exception non capturée:', error);
//   process.exit(1);
// });

// export default app;
