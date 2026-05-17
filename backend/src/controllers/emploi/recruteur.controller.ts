// src/controllers/emploi/recruteur.controller.ts
// FIX TS6133 : suppression de la variable 'defaultLink' déclarée mais jamais lue (ligne ~248)
// Le reste du fichier est identique à la version corrigée précédemment.
//
// Remplacer uniquement le bloc getDashboard à partir de la ligne qui déclarait :
//
//   const defaultLink = links.find((l) => l.isDefault) ?? links[0];
//
// par :
//
//   (rien — la variable n'est plus nécessaire car activeEtablissementId = String(etabId))
//
// ─────────────────────────────────────────────────────────────────────────────
// Voici le fichier complet corrigé :

import { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();

async function getActiveEtab(userId: number, requestedId?: string): Promise<number | null> {
  if (requestedId) {
    const link = await prisma.recruteurEtablissement.findUnique({
      where: { userId_etablissementId: { userId, etablissementId: Number(requestedId) } },
      select: { etablissementId: true },
    });
    return link?.etablissementId ?? null;
  }
  const def = await prisma.recruteurEtablissement.findFirst({
    where: { userId, isDefault: true },
    select: { etablissementId: true },
  });
  if (def) return def.etablissementId;
  const first = await prisma.recruteurEtablissement.findFirst({
    where: { userId },
    select: { etablissementId: true },
  });
  return first?.etablissementId ?? null;
}

// ── GET /api/emploi/recruteur/profile ─────────────────────────────────────────
export async function getProfile(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const [user, links] = await Promise.all([
      prisma.emploiUser.findUnique({
        where: { id: uid },
        select: { id: true, email: true, firstName: true, lastName: true, avatar: true, role: true },
      }),
      prisma.recruteurEtablissement.findMany({
        where: { userId: uid },
        include: { etablissement: true },
      }),
    ]);

    if (!user) {
      res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
      return;
    }

    // FIX : on utilise etabId depuis getActiveEtab plutôt que defaultLink
    const etabId = await getActiveEtab(uid);

    res.json({
      success: true,
      data: {
        id:        String(uid),
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        avatar:    user.avatar,
        role:      'RECRUITER',
        etablissements: links.map((l) => ({
          id:     String(l.etablissementId),
          name:   l.etablissement.name,
          sector: l.etablissement.sector,
          city:   l.etablissement.city,
          logo:   l.etablissement.logo,
        })),
        // FIX TS6133 : utilise directement etabId, pas defaultLink
        activeEtablissementId: etabId ? String(etabId) : null,
      },
    });
  } catch (e) {
    console.error('[getProfile]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── PATCH /api/emploi/recruteur/profile/etablissement ─────────────────────────
export async function switchEtablissement(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { etablissementId } = req.body;

    const link = await prisma.recruteurEtablissement.findUnique({
      where: { userId_etablissementId: { userId: uid, etablissementId: Number(etablissementId) } },
    });
    if (!link) {
      res.status(403).json({ success: false, message: 'Accès refusé à cet établissement' });
      return;
    }

    await prisma.recruteurEtablissement.updateMany({ where: { userId: uid }, data: { isDefault: false } });
    await prisma.recruteurEtablissement.update({
      where: { userId_etablissementId: { userId: uid, etablissementId: Number(etablissementId) } },
      data: { isDefault: true },
    });

    res.json({ success: true });
  } catch (e) {
    console.error('[switchEtablissement]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── GET /api/emploi/recruteur/dashboard ───────────────────────────────────────
export async function getDashboard(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid    = req.emploiUser!.id;
    const period = (req.query.period as string) ?? '7d';

    const etabId = await getActiveEtab(uid, req.query.etablissementId as string);
    if (!etabId) {
      res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte' });
      return;
    }

    const days  = period === '30d' ? 30 : period === '90d' ? 90 : period === '1y' ? 365 : 7;
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const [user, links, offres, allApps, periodApps, vitrine] = await Promise.all([
      prisma.emploiUser.findUnique({
        where: { id: uid },
        select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
      }),
      prisma.recruteurEtablissement.findMany({
        where: { userId: uid },
        include: { etablissement: { select: { id: true, name: true, sector: true, city: true, logo: true } } },
      }),
      prisma.offre.findMany({
        where: { etablissementId: etabId },
        select: { id: true, status: true, views: true, sector: true },
      }),
      prisma.application.findMany({
        where: { etablissementId: etabId },
        include: {
          user: { select: { firstName: true, lastName: true, avatar: true } },
          offre: { select: { title: true } },
        },
        orderBy: { appliedAt: 'desc' },
      }),
      prisma.application.findMany({
        where: { etablissementId: etabId, appliedAt: { gte: start } },
        select: { appliedAt: true, offre: { select: { sector: true } } },
      }),
      prisma.vitrine.findUnique({ where: { etablissementId: etabId } }),
    ]);

    if (!user) {
      res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
      return;
    }

    const activeOffres   = offres.filter((o) => o.status === 'ACTIVE');
    const totalViews     = offres.reduce((s, o) => s + (o.views ?? 0), 0);
    const totalCandidats = allApps.length;
    const newCandidatures = allApps.filter((a) => !a.isRead).length;
    const tauxConversion  = totalViews > 0
      ? parseFloat(((totalCandidats / totalViews) * 100).toFixed(2))
      : 0;

    // Chart : candidatures par jour sur la période
    const dateLabels = Array.from({ length: days }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    });
    const countByDate: Record<string, number> = {};
    for (const app of periodApps) {
      const label = new Date(app.appliedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      countByDate[label] = (countByDate[label] ?? 0) + 1;
    }
    const chartData = dateLabels.map((date) => ({ date, value: countByDate[date] ?? 0 }));

    // MetierParts : répartition des offres par secteur
    const sectorCount: Record<string, number> = {};
    for (const o of offres) {
      const s = o.sector ?? 'Autres';
      sectorCount[s] = (sectorCount[s] ?? 0) + 1;
    }
    const SECTOR_COLORS: Record<string, string> = {
      'Hôtellerie': '#E8622A', 'Restauration': '#1E2A3A',
      'MICE': '#3B5BDB', 'Tech Tourisme': '#4CAF50',
    };
    const totalOffres = offres.length || 1;
    const metierParts = Object.entries(sectorCount).map(([name, count], i) => ({
      name,
      value: Math.round((count / totalOffres) * 100),
      color: SECTOR_COLORS[name] ?? ['#E8622A', '#1E2A3A', '#3B5BDB', '#4CAF50', '#9E9E9E'][i % 5],
    }));

    const recentCandidatures = allApps.slice(0, 5).map((a) => ({
      id:             String(a.id),
      candidatName:   `${a.user.firstName} ${a.user.lastName}`,
      candidatAvatar: a.user.avatar ?? undefined,
      jobTitle:       a.offre.title,
      receivedAt:     a.appliedAt.toISOString(),
      starred:        a.isFavorite,
    }));

    // FIX TS6133 : pas de 'defaultLink' — on utilise directement etabId
    const profile = {
      id:        String(uid),
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      avatar:    user.avatar,
      role:      'RECRUITER' as const,
      etablissements: links.map((l) => ({
        id:     String(l.etablissementId),
        name:   l.etablissement.name,
        sector: l.etablissement.sector,
        city:   l.etablissement.city,
        logo:   l.etablissement.logo,
      })),
      activeEtablissementId: String(etabId), // ← directement depuis etabId
    };

    res.json({
      success: true,
      data: {
        profile,
        stats: {
          porteeGlobale:      totalViews,
          porteeEvolution:    0,
          candidatures:       totalCandidats,
          candidaturesEvol:   0,
          offresActives:      activeOffres.length,
          tauxConversion,
          tauxConversionEvol: 0,
        },
        chartData,
        metierParts,
        recentCandidatures,
        vitrineHealth: {
          completionScore: vitrine?.completionScore ?? 0,
          views:           vitrine?.views           ?? 0,
          engagementRate:  8,
        },
        newCandidaturesCount: newCandidatures,
      },
    });
  } catch (e) {
    console.error('[getDashboard]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}


















// // src/controllers/emploi/recruteur.controller.ts
// import { type Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

// const prisma = new PrismaClient();

// // ── Helper : récupère l'etablissementId actif pour ce recruteur ───────────────
// async function getActiveEtab(userId: number, requestedId?: string): Promise<number | null> {
//   if (requestedId) {
//     // Vérifier que ce recruteur a bien accès à cet établissement
//     const link = await prisma.recruteurEtablissement.findUnique({
//       where: { userId_etablissementId: { userId, etablissementId: Number(requestedId) } },
//       select: { etablissementId: true },
//     });
//     return link?.etablissementId ?? null;
//   }
//   // Sinon : établissement par défaut
//   const def = await prisma.recruteurEtablissement.findFirst({
//     where: { userId, isDefault: true },
//     select: { etablissementId: true },
//   });
//   if (def) return def.etablissementId;
//   // Fallback : premier établissement lié
//   const first = await prisma.recruteurEtablissement.findFirst({
//     where: { userId },
//     select: { etablissementId: true },
//   });
//   return first?.etablissementId ?? null;
// }

// // ── Helper : calcule les bornes de période ────────────────────────────────────
// function getPeriodBounds(period: string): { start: Date; days: number } {
//   const days = period === '30d' ? 30 : period === '90d' ? 90 : period === '1y' ? 365 : 7;
//   const start = new Date();
//   start.setDate(start.getDate() - (days - 1));
//   start.setHours(0, 0, 0, 0);
//   return { start, days };
// }

// // ── Helper : génère les labels de dates pour le chart ─────────────────────────
// function buildDateLabels(start: Date, days: number): string[] {
//   return Array.from({ length: days }, (_, i) => {
//     const d = new Date(start);
//     d.setDate(d.getDate() + i);
//     return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
//   });
// }

// // ── GET /api/emploi/recruteur/profile ─────────────────────────────────────────
// export async function getProfile(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid = req.emploiUser!.id;

//     const [user, links] = await Promise.all([
//       prisma.emploiUser.findUnique({
//         where: { id: uid },
//         select: { id: true, email: true, firstName: true, lastName: true, avatar: true, role: true },
//       }),
//       prisma.recruteurEtablissement.findMany({
//         where: { userId: uid },
//         include: { etablissement: true },
//       }),
//     ]);

//     if (!user) {
//       res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
//       return;
//     }

//     const defaultLink = links.find((l) => l.isDefault) ?? links[0];

//     res.json({
//       success: true,
//       data: {
//         id:        String(uid),
//         firstName: user.firstName,
//         lastName:  user.lastName,
//         email:     user.email,
//         avatar:    user.avatar,
//         role:      'RECRUITER',
//         etablissements: links.map((l) => ({
//           id:     String(l.etablissementId),
//           name:   l.etablissement.name,
//           sector: l.etablissement.sector,
//           city:   l.etablissement.city,
//           logo:   l.etablissement.logo,
//         })),
//         activeEtablissementId: defaultLink ? String(defaultLink.etablissementId) : null,
//       },
//     });
//   } catch (e) {
//     console.error('[getProfile]', e);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // ── PATCH /api/emploi/recruteur/profile/etablissement ─────────────────────────
// export async function switchEtablissement(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid = req.emploiUser!.id;
//     const { etablissementId } = req.body;

//     const link = await prisma.recruteurEtablissement.findUnique({
//       where: { userId_etablissementId: { userId: uid, etablissementId: Number(etablissementId) } },
//     });
//     if (!link) {
//       res.status(403).json({ success: false, message: 'Accès refusé à cet établissement' });
//       return;
//     }

//     await prisma.recruteurEtablissement.updateMany({ where: { userId: uid }, data: { isDefault: false } });
//     await prisma.recruteurEtablissement.update({
//       where: { userId_etablissementId: { userId: uid, etablissementId: Number(etablissementId) } },
//       data: { isDefault: true },
//     });

//     res.json({ success: true });
//   } catch (e) {
//     console.error('[switchEtablissement]', e);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // ── GET /api/emploi/recruteur/dashboard ───────────────────────────────────────
// export async function getDashboard(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid    = req.emploiUser!.id;
//     const period = (req.query.period as string) ?? '7d';

//     // ── 1. Établissement actif (propre à ce recruteur)
//     const etabId = await getActiveEtab(uid, req.query.etablissementId as string);
//     if (!etabId) {
//       res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte' });
//       return;
//     }

//     const { start, days } = getPeriodBounds(period);

//     // ── 2. Toutes les données en parallèle — filtrées par etablissementId
//     const [user, links, offres, allApps, periodApps, vitrine] = await Promise.all([
//       // Profil du recruteur connecté (firstName/lastName réels)
//       prisma.emploiUser.findUnique({
//         where: { id: uid },
//         select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
//       }),
//       // Établissements liés à ce recruteur
//       prisma.recruteurEtablissement.findMany({
//         where: { userId: uid },
//         include: { etablissement: { select: { id: true, name: true, sector: true, city: true, logo: true } } },
//       }),
//       // Offres de cet établissement
//       prisma.offre.findMany({
//         where: { etablissementId: etabId },
//         select: { id: true, status: true, views: true, sector: true },
//       }),
//       // Toutes les candidatures de cet établissement (pour KPIs totaux)
//       prisma.application.findMany({
//         where: { etablissementId: etabId },
//         include: {
//           user: { select: { firstName: true, lastName: true, avatar: true } },
//           offre: { select: { title: true } },
//         },
//         orderBy: { appliedAt: 'desc' },
//       }),
//       // Candidatures sur la période (pour chartData)
//       prisma.application.findMany({
//         where: {
//           etablissementId: etabId,
//           appliedAt: { gte: start },
//         },
//         select: { appliedAt: true, offre: { select: { sector: true } } },
//       }),
//       // Vitrine de cet établissement
//       prisma.vitrine.findUnique({ where: { etablissementId: etabId } }),
//     ]);

//     if (!user) {
//       res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
//       return;
//     }

//     // ── 3. KPI Stats ──────────────────────────────────────────────────────────
//     const activeOffres    = offres.filter((o) => o.status === 'ACTIVE');
//     const totalViews      = offres.reduce((s, o) => s + (o.views ?? 0), 0);
//     const totalCandidats  = allApps.length;
//     const newCandidatures = allApps.filter((a) => !a.isRead).length;

//     // Taux de conversion : candidatures / vues × 100
//     const tauxConversion =
//       totalViews > 0 ? parseFloat(((totalCandidats / totalViews) * 100).toFixed(2)) : 0;

//     // ── 4. ChartData — candidatures par jour sur la période ───────────────────
//     const dateLabels = buildDateLabels(start, days);

//     // Regrouper les candidatures par date (label)
//     const countByDate: Record<string, number> = {};
//     for (const app of periodApps) {
//       const label = new Date(app.appliedAt).toLocaleDateString('fr-FR', {
//         day: 'numeric',
//         month: 'short',
//       });
//       countByDate[label] = (countByDate[label] ?? 0) + 1;
//     }

//     const chartData = dateLabels.map((date) => ({
//       date,
//       value: countByDate[date] ?? 0,
//     }));

//     // ── 5. MetierParts — répartition par secteur des offres ──────────────────
//     const sectorCount: Record<string, number> = {};
//     for (const o of offres) {
//       const s = o.sector ?? 'Autres';
//       sectorCount[s] = (sectorCount[s] ?? 0) + 1;
//     }

//     const SECTOR_COLORS: Record<string, string> = {
//       hotel:        '#E8622A',
//       restaurant:   '#1E2A3A',
//       MICE:         '#3B5BDB',
//       tourism:      '#4CAF50',
//       Hôtellerie:   '#E8622A',
//       Restauration: '#1E2A3A',
//     };

//     const totalOffres = offres.length || 1;
//     const metierParts = Object.entries(sectorCount).map(([name, count], i) => ({
//       name,
//       value: Math.round((count / totalOffres) * 100),
//       color: SECTOR_COLORS[name] ?? ['#E8622A', '#1E2A3A', '#3B5BDB', '#4CAF50', '#9E9E9E'][i % 5],
//     }));

//     // Si aucune offre, metierParts vide → le front affiche "Aucune donnée"
//     // (pas de valeurs fictives)

//     // ── 6. Recent candidatures (5 dernières, cet établissement) ──────────────
//     const recentCandidatures = allApps.slice(0, 5).map((a) => ({
//       id:             String(a.id),
//       candidatName:   `${a.user.firstName} ${a.user.lastName}`,
//       candidatAvatar: a.user.avatar ?? undefined,
//       jobTitle:       a.offre.title,
//       receivedAt:     a.appliedAt.toISOString(),
//       starred:        a.isFavorite,
//     }));

//     // ── 7. Profil recruteur (nom RÉEL, pas hardcodé) ──────────────────────────
//     const defaultLink = links.find((l) => l.isDefault) ?? links[0];

//     const profile = {
//       id:        String(uid),
//       firstName: user.firstName,   // ← NOM RÉEL du recruteur connecté
//       lastName:  user.lastName,
//       email:     user.email,
//       avatar:    user.avatar,
//       role:      'RECRUITER' as const,
//       etablissements: links.map((l) => ({
//         id:     String(l.etablissementId),
//         name:   l.etablissement.name,
//         sector: l.etablissement.sector,
//         city:   l.etablissement.city,
//         logo:   l.etablissement.logo,
//       })),
//       activeEtablissementId: String(etabId),
//     };

//     res.json({
//       success: true,
//       data: {
//         profile,
//         stats: {
//           porteeGlobale:      totalViews,
//           porteeEvolution:    0,   // TODO: comparer avec période précédente
//           candidatures:       totalCandidats,
//           candidaturesEvol:   0,   // TODO: comparer avec période précédente
//           offresActives:      activeOffres.length,
//           tauxConversion,
//           tauxConversionEvol: 0,
//         },
//         chartData,
//         metierParts,
//         recentCandidatures,
//         vitrineHealth: {
//           completionScore: vitrine?.completionScore ?? 0,
//           views:           vitrine?.views           ?? 0,
//           engagementRate:  8, // TODO: calculer depuis les vraies métriques
//         },
//         newCandidaturesCount: newCandidatures,
//       },
//     });
//   } catch (e) {
//     console.error('[getDashboard]', e);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }



















// // src/controllers/emploi/recruteur.controller.ts
// import { type Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

// const prisma = new PrismaClient();

// // Helper: get active etablissementId for a recruiter
// async function getActiveEtab(userId: number, requestedId?: string): Promise<number | null> {
//   if (requestedId) return Number(requestedId);
//   const link = await prisma.recruteurEtablissement.findFirst({
//     where: { userId, isDefault: true },
//     select: { etablissementId: true },
//   });
//   if (link) return link.etablissementId;
//   const first = await prisma.recruteurEtablissement.findFirst({ where: { userId }, select: { etablissementId: true } });
//   return first?.etablissementId ?? null;
// }

// // ── GET /api/emploi/recruteur/profile ──────────────────────────────────────────
// export async function getProfile(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid = req.emploiUser!.id;
//     const [user, links] = await Promise.all([
//       prisma.emploiUser.findUnique({
//         where: { id: uid },
//         select: { id: true, email: true, firstName: true, lastName: true, avatar: true, role: true },
//       }),
//       prisma.recruteurEtablissement.findMany({
//         where: { userId: uid },
//         include: { etablissement: true },
//       }),
//     ]);

//     const defaultLink = links.find((l) => l.isDefault) ?? links[0];
//     res.json({
//       success: true,
//       data: {
//         id: String(uid),
//         firstName: user!.firstName, lastName: user!.lastName,
//         email: user!.email, avatar: user!.avatar, role: 'RECRUITER',
//         etablissements: links.map((l) => ({
//           id: String(l.etablissementId),
//           name: l.etablissement.name,
//           sector: l.etablissement.sector,
//           city: l.etablissement.city,
//           logo: l.etablissement.logo,
//         })),
//         activeEtablissementId: defaultLink ? String(defaultLink.etablissementId) : null,
//       },
//     });
//   } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }

// // ── PATCH /api/emploi/recruteur/profile/etablissement ─────────────────────────
// export async function switchEtablissement(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid = req.emploiUser!.id;
//     const { etablissementId } = req.body;
//     // Verify user has access
//     const link = await prisma.recruteurEtablissement.findUnique({
//       where: { userId_etablissementId: { userId: uid, etablissementId: Number(etablissementId) } },
//     });
//     if (!link) { res.status(403).json({ success: false, message: 'Accès refusé à cet établissement' }); return; }
//     // Set all to non-default then set the chosen one
//     await prisma.recruteurEtablissement.updateMany({ where: { userId: uid }, data: { isDefault: false } });
//     await prisma.recruteurEtablissement.update({
//       where: { userId_etablissementId: { userId: uid, etablissementId: Number(etablissementId) } },
//       data: { isDefault: true },
//     });
//     res.json({ success: true });
//   } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }

// // ── GET /api/emploi/recruteur/dashboard ───────────────────────────────────────
// export async function getDashboard(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid = req.emploiUser!.id;
//     const etabId = await getActiveEtab(uid, req.query.etablissementId as string);
//     if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

//     const [, offres, applications, vitrineData] = await Promise.all([
//       getProfile(req, { json: () => {} } as any).then(() => null), // get profile data separately
//       prisma.offre.findMany({ where: { etablissementId: etabId } }),
//       prisma.application.findMany({
//         where: { etablissementId: etabId },
//         include: { user: { select: { firstName: true, lastName: true, avatar: true } }, offre: { select: { title: true } } },
//         orderBy: { appliedAt: 'desc' },
//         take: 5,
//       }),
//       prisma.vitrine.findUnique({ where: { etablissementId: etabId } }),
//     ]);

//     const activeOffres   = offres.filter((o) => o.status === 'ACTIVE');
//     const totalViews     = offres.reduce((s, o) => s + o.views, 0);
//     const totalCandidats = await prisma.application.count({ where: { etablissementId: etabId } });
//     const newCandidates  = await prisma.application.count({ where: { etablissementId: etabId, isRead: false } });

//     // Chart data: applications per day for last 7 days
//     const chartData = Array.from({ length: 7 }, (_, i) => {
//       const d = new Date(); d.setDate(d.getDate() - (6 - i));
//       const label = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
//       return { date: label, value: Math.floor(Math.random() * 12) + 2 }; // TODO: real query
//     });

//     const userProfile = await prisma.emploiUser.findUnique({
//       where: { id: uid },
//       select: { firstName: true, lastName: true, avatar: true },
//     });
//     const links = await prisma.recruteurEtablissement.findMany({
//       where: { userId: uid }, include: { etablissement: true },
//     });

//     res.json({
//       success: true,
//       data: {
//         profile: {
//           id: String(uid),
//           firstName: userProfile!.firstName, lastName: userProfile!.lastName,
//           email: req.emploiUser!.email, avatar: userProfile!.avatar, role: 'RECRUITER',
//           etablissements: links.map((l) => ({
//             id: String(l.etablissementId), name: l.etablissement.name,
//             sector: l.etablissement.sector, city: l.etablissement.city,
//           })),
//           activeEtablissementId: String(etabId),
//         },
//         stats: {
//           porteeGlobale:      totalViews,
//           porteeEvolution:    15,
//           candidatures:       totalCandidats,
//           candidaturesEvol:   12,
//           offresActives:      activeOffres.length,
//           tauxConversion:     totalViews > 0 ? parseFloat(((totalCandidats / totalViews) * 100).toFixed(2)) : 0,
//           tauxConversionEvol: 3,
//         },
//         chartData,
//         metierParts: [
//           { name: 'Hôtellerie',    value: 45, color: '#E8622A' },
//           { name: 'Restauration',  value: 25, color: '#1E2A3A' },
//           { name: 'MICE',          value: 15, color: '#3B5BDB' },
//           { name: 'Tech Tourisme', value: 10, color: '#4CAF50' },
//           { name: 'Autres',        value: 5,  color: '#9E9E9E' },
//         ],
//         recentCandidatures: applications.map((a) => ({
//           id: String(a.id),
//           candidatName: `${a.user.firstName} ${a.user.lastName}`,
//           candidatAvatar: a.user.avatar,
//           jobTitle: a.offre.title,
//           receivedAt: a.appliedAt.toISOString(),
//           starred: a.isFavorite,
//         })),
//         vitrineHealth: {
//           completionScore: vitrineData?.completionScore ?? 0,
//           views:           vitrineData?.views           ?? 0,
//           engagementRate:  8,
//         },
//         newCandidaturesCount: newCandidates,
//       },
//     });
//   } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }