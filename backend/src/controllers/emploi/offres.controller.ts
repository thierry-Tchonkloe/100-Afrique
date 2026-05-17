// src/controllers/emploi/offres.controller.ts
import { type Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();

// ── Helper : établissement actif du recruteur connecté ────────────────────────
async function getEtabId(userId: number, requested?: string): Promise<number | null> {
  if (requested) {
    const link = await prisma.recruteurEtablissement.findUnique({
      where: { userId_etablissementId: { userId, etablissementId: Number(requested) } },
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

// ── Contrôle d'accès : ce recruteur peut-il toucher cette offre ? ─────────────
async function canAccessOffre(
  userId: number,
  offreId: number,
): Promise<{ ok: boolean; etablissementId: number | null }> {
  const offre = await prisma.offre.findUnique({
    where:  { id: offreId },
    select: { etablissementId: true },
  });
  if (!offre) return { ok: false, etablissementId: null };

  const link = await prisma.recruteurEtablissement.findUnique({
    where: {
      userId_etablissementId: { userId, etablissementId: offre.etablissementId },
    },
  });
  return { ok: !!link, etablissementId: offre.etablissementId };
}

// ── Mapping statut front → enum Prisma ────────────────────────────────────────
// FIX: on utilise l'enum Prisma ($Enums.OffreStatus) pour éviter le TS2322
const STATUS_TO_PRISMA: Record<string, Prisma.OffreUpdateInput['status']> = {
  active:   'ACTIVE'   as Prisma.OffreUpdateInput['status'],
  paused:   'PAUSED'   as Prisma.OffreUpdateInput['status'],
  draft:    'DRAFT'    as Prisma.OffreUpdateInput['status'],
  archived: 'ARCHIVED' as Prisma.OffreUpdateInput['status'],
  ACTIVE:   'ACTIVE'   as Prisma.OffreUpdateInput['status'],
  PAUSED:   'PAUSED'   as Prisma.OffreUpdateInput['status'],
  DRAFT:    'DRAFT'    as Prisma.OffreUpdateInput['status'],
  ARCHIVED: 'ARCHIVED' as Prisma.OffreUpdateInput['status'],
};

// Si le type Prisma.OffreUpdateInput['status'] ne convient pas à votre version
// de Prisma, utilisez ce fallback :
function toDbStatus(s: string): any {
  return STATUS_TO_PRISMA[s] ?? 'PAUSED';
}

function fmtOffre(o: any): object {
  return {
    id:           String(o.id),
    title:        o.title,
    sector:       o.sector,
    contractType: o.contractType,
    location:     o.location,
    salaryMin:    o.salaryMin  ?? null,
    salaryMax:    o.salaryMax  ?? null,
    remote:       o.remote     ?? 'none',
    missions:     o.missions   ?? null,
    profileDesc:  o.profileDesc ?? null,
    advantages:   o.advantages  ?? null,
    requiredSkills:    (o.requiredSkills    ?? []) as string[],
    requiredLangs:     (o.requiredLangs     ?? []) as string[],
    requiredSoftwares: (o.requiredSoftwares ?? []) as string[],
    status:            (o.status as string).toLowerCase(),
    isPremium:         o.isPremium  ?? false,
    views:             o.views      ?? 0,
    candidatesCount:   o._count?.applications       ?? 0,
    newCandidatesCount: o._count?.unreadApplications ?? 0,
    publishedAt: o.publishedAt?.toISOString() ?? null,
    expiresAt:   o.expiresAt?.toISOString()   ?? null,
  };
}

// ── GET /api/emploi/recruteur/offres ──────────────────────────────────────────
export async function getOffres(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid    = req.emploiUser!.id;
    const etabId = await getEtabId(uid, req.query.etablissementId as string);

    if (!etabId) {
      res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte.' });
      return;
    }

    const [offres, unreadByOffre] = await Promise.all([
      prisma.offre.findMany({
        where:   { etablissementId: etabId },
        include: { _count: { select: { applications: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.application.groupBy({
        by:    ['offreId'],
        where: { etablissementId: etabId, isRead: false },
        _count: { id: true },
      }),
    ]);

    const unreadMap = Object.fromEntries(
      unreadByOffre.map((r) => [r.offreId, r._count.id]),
    );

    const enriched = offres.map((o) => ({
      ...o,
      _count: {
        applications:       o._count.applications,
        unreadApplications: unreadMap[o.id] ?? 0,
      },
    }));

    res.json({
      success: true,
      data: {
        stats: {
          online:   offres.filter((o) => ['ACTIVE', 'PAUSED'].includes(o.status)).length,
          drafts:   offres.filter((o) => o.status === 'DRAFT').length,
          archives: offres.filter((o) => o.status === 'ARCHIVED').length,
        },
        offres: enriched.map(fmtOffre),
      },
    });
  } catch (e) {
    console.error('[getOffres]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── POST /api/emploi/recruteur/offres ─────────────────────────────────────────
export async function createOffre(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid    = req.emploiUser!.id;
    const etabId = await getEtabId(uid);

    if (!etabId) {
      res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte.' });
      return;
    }

    const { step1, step2, step3, ...flat } = req.body;

    const offreData = step1
      ? {
          title:        step1.title,
          sector:       step1.sector,
          contractType: step1.contractType,
          location:     step1.location,
          salaryMin:    step1.salaryMin   ?? null,
          salaryMax:    step1.salaryMax   ?? null,
          remote:       step1.remote      ?? 'none',
          missions:     step2?.missions   ?? null,
          profileDesc:  step2?.profile    ?? null,
          advantages:   step2?.advantages ?? null,
          requiredSkills:    step3?.requiredSkills ?? [],
          requiredLangs:     step3?.languages      ?? [],
          requiredSoftwares: step3?.softwares      ?? [],
        }
      : flat;

    const offre = await prisma.offre.create({
      data: {
        ...offreData,
        etablissementId: etabId,
        status:          'ACTIVE',   // string littéral — Prisma l'accepte à la création
        publishedAt:     new Date(),
        expiresAt:       new Date(Date.now() + 30 * 86400000),
        views:           0,
        isPremium:       false,
      },
      include: { _count: { select: { applications: true } } },
    });

    res.status(201).json({ success: true, data: fmtOffre(offre) });
  } catch (e) {
    console.error('[createOffre]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── PATCH /api/emploi/recruteur/offres/:id ────────────────────────────────────
export async function updateOffre(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid     = req.emploiUser!.id;
    const offreId = Number(req.params.id);
    const { ok }  = await canAccessOffre(uid, offreId);

    if (!ok) {
      res.status(403).json({ success: false, message: 'Accès refusé ou offre introuvable' });
      return;
    }

    const { step1, step2, step3, ...flat } = req.body;
    const updateData = step1
      ? {
          title:        step1.title,
          sector:       step1.sector,
          contractType: step1.contractType,
          location:     step1.location,
          salaryMin:    step1.salaryMin   ?? null,
          salaryMax:    step1.salaryMax   ?? null,
          remote:       step1.remote,
          missions:     step2?.missions   ?? null,
          profileDesc:  step2?.profile    ?? null,
          advantages:   step2?.advantages ?? null,
          requiredSkills:    step3?.requiredSkills ?? [],
          requiredLangs:     step3?.languages      ?? [],
          requiredSoftwares: step3?.softwares      ?? [],
        }
      : flat;

    const offre = await prisma.offre.update({
      where:   { id: offreId },
      data:    updateData,
      include: { _count: { select: { applications: true } } },
    });

    res.json({ success: true, data: fmtOffre(offre) });
  } catch (e) {
    console.error('[updateOffre]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── PATCH /api/emploi/recruteur/offres/:id/status ─────────────────────────────
export async function updateOffreStatus(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid     = req.emploiUser!.id;
    const offreId = Number(req.params.id);
    const { status } = req.body as { status: string };

    const { ok } = await canAccessOffre(uid, offreId);
    if (!ok) {
      res.status(403).json({ success: false, message: 'Accès refusé ou offre introuvable' });
      return;
    }

    const offre = await prisma.offre.update({
      where: { id: offreId },
      data:  {
        // FIX TS2322 : cast explicite via la fonction helper
        status: toDbStatus(status) as any,
        ...(status === 'active' ? { publishedAt: new Date() } : {}),
      },
      include: { _count: { select: { applications: true } } },
    });

    res.json({ success: true, data: fmtOffre(offre) });
  } catch (e) {
    console.error('[updateOffreStatus]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── POST /api/emploi/recruteur/offres/:id/duplicate ───────────────────────────
export async function duplicateOffre(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid     = req.emploiUser!.id;
    const offreId = Number(req.params.id);

    const { ok, etablissementId } = await canAccessOffre(uid, offreId);
    if (!ok || !etablissementId) {
      res.status(403).json({ success: false, message: 'Accès refusé ou offre introuvable' });
      return;
    }

    const original = await prisma.offre.findUnique({ where: { id: offreId } });
    if (!original) {
      res.status(404).json({ success: false, message: 'Offre introuvable' });
      return;
    }

    const copy = await prisma.offre.create({
      data: {
        etablissementId:   original.etablissementId,
        title:             `${original.title} (copie)`,
        sector:            original.sector,
        contractType:      original.contractType,
        location:          original.location,
        salaryMin:         original.salaryMin,
        salaryMax:         original.salaryMax,
        remote:            original.remote,
        missions:          original.missions,
        profileDesc:       original.profileDesc,
        advantages:        original.advantages,
        requiredSkills:    (original.requiredSkills    ?? []) as string[],
        requiredLangs:     (original.requiredLangs     ?? []) as string[],
        requiredSoftwares: (original.requiredSoftwares ?? []) as string[],
        isPremium:         original.isPremium,
        status:            'DRAFT',
        views:             0,
        expiresAt:         new Date(Date.now() + 30 * 86400000),
      },
      include: { _count: { select: { applications: true } } },
    });

    res.status(201).json({ success: true, data: fmtOffre(copy) });
  } catch (e) {
    console.error('[duplicateOffre]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── DELETE /api/emploi/recruteur/offres/:id → archive ────────────────────────
export async function archiveOffre(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid     = req.emploiUser!.id;
    const offreId = Number(req.params.id);

    const { ok } = await canAccessOffre(uid, offreId);
    if (!ok) {
      res.status(403).json({ success: false, message: 'Accès refusé ou offre introuvable' });
      return;
    }

    await prisma.offre.update({
      where: { id: offreId },
      data:  { status: 'ARCHIVED' as any },
    });

    res.json({ success: true });
  } catch (e) {
    console.error('[archiveOffre]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── GET /api/emploi/jobs ──────────────────────────────────────────────────────
export async function getPublicJobs(req: any, res: Response): Promise<void> {
  try {
    const {
      sector, location, contractType, search,
      page = '1', limit = '10',
    } = req.query as Record<string, string>;

    const where: any = { status: 'ACTIVE' };
    if (sector)       where.sector       = { contains: sector,       mode: 'insensitive' };
    if (location)     where.location     = { contains: location,     mode: 'insensitive' };
    if (contractType) where.contractType = contractType;
    if (search)       where.title        = { contains: search,       mode: 'insensitive' };

    const skip = (Number(page) - 1) * Number(limit);

    const [total, offres] = await Promise.all([
      prisma.offre.count({ where }),
      prisma.offre.findMany({
        where,
        include: { etablissement: { select: { name: true, city: true, logo: true } } },
        orderBy: [{ isPremium: 'desc' }, { publishedAt: 'desc' }],
        skip,
        take: Number(limit),
      }),
    ]);

    // Incrémenter les vues de façon non-bloquante
    const ids = offres.map((o) => o.id);
    if (ids.length > 0) {
      prisma.offre
        .updateMany({ where: { id: { in: ids } }, data: { views: { increment: 1 } } })
        .catch(() => {});
    }

    res.json({
      success: true,
      data: {
        total, page: Number(page), limit: Number(limit),
        offres: offres.map((o) => ({
          id:           String(o.id),
          title:        o.title,
          companyName:  o.etablissement.name,
          sector:       o.sector,
          contractType: o.contractType,
          location:     o.location,
          salaryMin:    o.salaryMin,
          salaryMax:    o.salaryMax,
          remote:       o.remote,
          isPremium:    o.isPremium,
          publishedAt:  o.publishedAt?.toISOString(),
        })),
      },
    });
  } catch (e) {
    console.error('[getPublicJobs]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── GET /api/emploi/jobs/:id ──────────────────────────────────────────────────
export async function getPublicJob(req: any, res: Response): Promise<void> {
  try {
    const offre = await prisma.offre.findUnique({
      where:   { id: Number(req.params.id) },
      include: { etablissement: { include: { vitrine: true } } },
    });

    if (!offre || offre.status !== 'ACTIVE') {
      res.status(404).json({ success: false, message: 'Offre introuvable' });
      return;
    }

    res.json({
      success: true,
      data: {
        id:           String(offre.id),
        title:        offre.title,
        sector:       offre.sector,
        contractType: offre.contractType,
        location:     offre.location,
        salaryMin:    offre.salaryMin,
        salaryMax:    offre.salaryMax,
        remote:       offre.remote,
        missions:     offre.missions,
        profileDesc:  offre.profileDesc,
        advantages:   offre.advantages,
        requiredSkills: (offre.requiredSkills ?? []) as string[],
        requiredLangs:  (offre.requiredLangs  ?? []) as string[],
        publishedAt: offre.publishedAt?.toISOString(),
        expiresAt:   offre.expiresAt?.toISOString(),
        company: {
          id:     String(offre.etablissementId),
          name:   offre.etablissement.name,
          sector: offre.etablissement.sector,
          city:   offre.etablissement.city,
          logo:   offre.etablissement.logo,
          slogan: offre.etablissement.vitrine?.slogan,
        },
      },
    });
  } catch (e) {
    console.error('[getPublicJob]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}



















// // src/controllers/emploi/offres.controller.ts
// import { type Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

// const prisma = new PrismaClient();

// // ── FIX : vérifie que l'etablissementId demandé appartient bien au recruteur connecté
// async function getEtabId(userId: number, requested?: string): Promise<number | null> {
//   if (requested) {
//     // Contrôle d'accès : ce recruteur doit être lié à cet établissement
//     const link = await prisma.recruteurEtablissement.findUnique({
//       where: {
//         userId_etablissementId: { userId, etablissementId: Number(requested) },
//       },
//       select: { etablissementId: true },
//     });
//     return link?.etablissementId ?? null; // null si pas d'accès
//   }
//   // Sinon : établissement par défaut de ce recruteur
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

// function fmtOffre(o: any): object {
//   return {
//     id:           String(o.id),
//     title:        o.title,
//     sector:       o.sector,
//     contractType: o.contractType,
//     location:     o.location,
//     salaryMin:    o.salaryMin,
//     salaryMax:    o.salaryMax,
//     remote:       o.remote,
//     missions:     o.missions,
//     profileDesc:  o.profileDesc,
//     advantages:   o.advantages,
//     requiredSkills:    (o.requiredSkills    ?? []) as string[],
//     requiredLangs:     (o.requiredLangs     ?? []) as string[],
//     requiredSoftwares: (o.requiredSoftwares ?? []) as string[],
//     status:            o.status.toLowerCase(),
//     isPremium:         o.isPremium,
//     views:             o.views ?? 0,
//     candidatesCount:   o._count?.applications ?? 0,
//     // ── FIX : compter les candidatures non lues pour le badge
//     newCandidatesCount: o._count?.unreadApplications ?? 0,
//     publishedAt: o.publishedAt?.toISOString() ?? null,
//     expiresAt:   o.expiresAt?.toISOString()   ?? null,
//   };
// }

// // GET /api/emploi/recruteur/offres
// export async function getOffres(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid    = req.emploiUser!.id;
//     const etabId = await getEtabId(uid, req.query.etablissementId as string);

//     if (!etabId) {
//       res.status(404).json({
//         success: false,
//         message: 'Aucun établissement lié à ce compte recruteur.',
//       });
//       return;
//     }

//     const offres = await prisma.offre.findMany({
//       where:   { etablissementId: etabId },
//       include: { _count: { select: { applications: true } } },
//       orderBy: { createdAt: 'desc' },
//     });

//     // Compter les candidatures non lues par offre
//     const unreadByOffre = await prisma.application.groupBy({
//       by:     ['offreId'],
//       where:  { etablissementId: etabId, isRead: false },
//       _count: { id: true },
//     });

//     const unreadMap = Object.fromEntries(
//       unreadByOffre.map((r) => [r.offreId, r._count.id]),
//     );

//     // Injecter newCandidatesCount dans chaque offre
//     const offresWithUnread = offres.map((o) => ({
//       ...o,
//       _count: {
//         applications:       o._count.applications,
//         unreadApplications: unreadMap[o.id] ?? 0,
//       },
//     }));

//     const online   = offres.filter((o) => ['ACTIVE', 'PAUSED'].includes(o.status)).length;
//     const drafts   = offres.filter((o) => o.status === 'DRAFT').length;
//     const archives = offres.filter((o) => o.status === 'ARCHIVED').length;

//     res.json({
//       success: true,
//       data: {
//         stats: { online, drafts, archives },
//         offres: offresWithUnread.map(fmtOffre),
//       },
//     });
//   } catch (e) {
//     console.error('[getOffres]', e);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // POST /api/emploi/recruteur/offres
// export async function createOffre(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid    = req.emploiUser!.id;
//     // ── FIX : utilise toujours l'établissement du recruteur connecté
//     // (pas de req.query ici — le recruteur crée pour son propre établissement)
//     const etabId = await getEtabId(uid);

//     if (!etabId) {
//       res.status(404).json({
//         success: false,
//         message: 'Aucun établissement lié à ce compte recruteur.',
//       });
//       return;
//     }

//     const { step1, step2, step3, ...flat } = req.body;

//     // Supporte le format stepper (step1/step2/step3) et le format plat
//     const offreData = step1
//       ? {
//           title:        step1.title,
//           sector:       step1.sector,
//           contractType: step1.contractType,
//           location:     step1.location,
//           salaryMin:    step1.salaryMin   ?? null,
//           salaryMax:    step1.salaryMax   ?? null,
//           remote:       step1.remote      ?? 'none',
//           missions:     step2?.missions   ?? null,
//           profileDesc:  step2?.profile    ?? null,
//           advantages:   step2?.advantages ?? null,
//           requiredSkills:    step3?.requiredSkills ?? [],
//           requiredLangs:     step3?.languages      ?? [],
//           requiredSoftwares: step3?.softwares      ?? [],
//         }
//       : flat;

//     const offre = await prisma.offre.create({
//       data: {
//         etablissementId: etabId, // ← lié au bon établissement
//         ...offreData,
//         status:      'ACTIVE',
//         publishedAt: new Date(),
//         expiresAt:   new Date(Date.now() + 30 * 86400000),
//         views:       0,
//         isPremium:   false,
//       },
//       include: { _count: { select: { applications: true } } },
//     });

//     res.status(201).json({ success: true, data: fmtOffre(offre) });
//   } catch (e) {
//     console.error('[createOffre]', e);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // PATCH /api/emploi/recruteur/offres/:id
// export async function updateOffre(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid    = req.emploiUser!.id;
//     const offreId = Number(req.params.id);

//     // Vérifier que cette offre appartient bien au recruteur connecté
//     const existing = await prisma.offre.findUnique({
//       where:  { id: offreId },
//       select: { etablissementId: true },
//     });

//     if (!existing) {
//       res.status(404).json({ success: false, message: 'Offre introuvable' });
//       return;
//     }

//     const hasAccess = await prisma.recruteurEtablissement.findUnique({
//       where: {
//         userId_etablissementId: { userId: uid, etablissementId: existing.etablissementId },
//       },
//     });

//     if (!hasAccess) {
//       res.status(403).json({ success: false, message: 'Accès refusé' });
//       return;
//     }

//     const { step1, step2, step3, ...flat } = req.body;
//     const updateData = step1
//       ? {
//           title:        step1.title,
//           sector:       step1.sector,
//           contractType: step1.contractType,
//           location:     step1.location,
//           salaryMin:    step1.salaryMin   ?? null,
//           salaryMax:    step1.salaryMax   ?? null,
//           remote:       step1.remote,
//           missions:     step2?.missions   ?? null,
//           profileDesc:  step2?.profile    ?? null,
//           advantages:   step2?.advantages ?? null,
//           requiredSkills:    step3?.requiredSkills ?? [],
//           requiredLangs:     step3?.languages      ?? [],
//           requiredSoftwares: step3?.softwares      ?? [],
//         }
//       : flat;

//     const offre = await prisma.offre.update({
//       where:   { id: offreId },
//       data:    updateData,
//       include: { _count: { select: { applications: true } } },
//     });

//     res.json({ success: true, data: fmtOffre(offre) });
//   } catch (e) {
//     console.error('[updateOffre]', e);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // PATCH /api/emploi/recruteur/offres/:id/status
// export async function updateOffreStatus(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid    = req.emploiUser!.id;
//     const offreId = Number(req.params.id);
//     const { status } = req.body;

//     // Contrôle d'accès
//     const existing = await prisma.offre.findUnique({
//       where:  { id: offreId },
//       select: { etablissementId: true },
//     });
//     if (!existing) {
//       res.status(404).json({ success: false, message: 'Offre introuvable' });
//       return;
//     }
//     const hasAccess = await prisma.recruteurEtablissement.findUnique({
//       where: {
//         userId_etablissementId: { userId: uid, etablissementId: existing.etablissementId },
//       },
//     });
//     if (!hasAccess) {
//       res.status(403).json({ success: false, message: 'Accès refusé' });
//       return;
//     }

//     const STATUS_MAP: Record<string, string> = {
//       active:   'ACTIVE',
//       paused:   'PAUSED',
//       draft:    'DRAFT',
//       archived: 'ARCHIVED',
//       ACTIVE:   'ACTIVE',
//       PAUSED:   'PAUSED',
//       DRAFT:    'DRAFT',
//       ARCHIVED: 'ARCHIVED',
//     };

//     const offre = await prisma.offre.update({
//       where: { id: offreId },
//       data:  {
//         status: STATUS_MAP[status] ?? 'PAUSED',
//         ...(status === 'active' ? { publishedAt: new Date() } : {}),
//       },
//       include: { _count: { select: { applications: true } } },
//     });

//     res.json({ success: true, data: fmtOffre(offre) });
//   } catch (e) {
//     console.error('[updateOffreStatus]', e);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // POST /api/emploi/recruteur/offres/:id/duplicate
// export async function duplicateOffre(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid    = req.emploiUser!.id;
//     const offreId = Number(req.params.id);

//     const original = await prisma.offre.findUnique({ where: { id: offreId } });
//     if (!original) {
//       res.status(404).json({ success: false, message: 'Offre introuvable' });
//       return;
//     }

//     // Contrôle d'accès
//     const hasAccess = await prisma.recruteurEtablissement.findUnique({
//       where: {
//         userId_etablissementId: { userId: uid, etablissementId: original.etablissementId },
//       },
//     });
//     if (!hasAccess) {
//       res.status(403).json({ success: false, message: 'Accès refusé' });
//       return;
//     }

//     const copy = await prisma.offre.create({
//       data: {
//         etablissementId:   original.etablissementId,
//         title:             `${original.title} (copie)`,
//         sector:            original.sector,
//         contractType:      original.contractType,
//         location:          original.location,
//         salaryMin:         original.salaryMin,
//         salaryMax:         original.salaryMax,
//         remote:            original.remote,
//         missions:          original.missions,
//         profileDesc:       original.profileDesc,
//         advantages:        original.advantages,
//         requiredSkills:    original.requiredSkills    ?? [],
//         requiredLangs:     original.requiredLangs     ?? [],
//         requiredSoftwares: original.requiredSoftwares ?? [],
//         isPremium:         original.isPremium,
//         status:            'DRAFT',
//         views:             0,
//         expiresAt:         new Date(Date.now() + 30 * 86400000),
//       },
//       include: { _count: { select: { applications: true } } },
//     });

//     res.status(201).json({ success: true, data: fmtOffre(copy) });
//   } catch (e) {
//     console.error('[duplicateOffre]', e);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // DELETE /api/emploi/recruteur/offres/:id → archive (suppression douce)
// export async function archiveOffre(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid    = req.emploiUser!.id;
//     const offreId = Number(req.params.id);

//     const existing = await prisma.offre.findUnique({
//       where:  { id: offreId },
//       select: { etablissementId: true },
//     });
//     if (!existing) {
//       res.status(404).json({ success: false, message: 'Offre introuvable' });
//       return;
//     }

//     const hasAccess = await prisma.recruteurEtablissement.findUnique({
//       where: {
//         userId_etablissementId: { userId: uid, etablissementId: existing.etablissementId },
//       },
//     });
//     if (!hasAccess) {
//       res.status(403).json({ success: false, message: 'Accès refusé' });
//       return;
//     }

//     await prisma.offre.update({
//       where: { id: offreId },
//       data:  { status: 'ARCHIVED' },
//     });

//     res.json({ success: true });
//   } catch (e) {
//     console.error('[archiveOffre]', e);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // ── Routes publiques ──────────────────────────────────────────────────────────

// // GET /api/emploi/jobs
// export async function getPublicJobs(req: any, res: Response): Promise<void> {
//   try {
//     const {
//       sector, location, contractType, search,
//       page = '1', limit = '10',
//     } = req.query as Record<string, string>;

//     const where: any = { status: 'ACTIVE' };
//     if (sector)       where.sector       = { contains: sector,       mode: 'insensitive' };
//     if (location)     where.location     = { contains: location,     mode: 'insensitive' };
//     if (contractType) where.contractType = contractType;
//     if (search)       where.title        = { contains: search,       mode: 'insensitive' };

//     const skip = (Number(page) - 1) * Number(limit);

//     const [total, offres] = await Promise.all([
//       prisma.offre.count({ where }),
//       prisma.offre.findMany({
//         where,
//         include: { etablissement: { select: { name: true, city: true, logo: true } } },
//         orderBy: [{ isPremium: 'desc' }, { publishedAt: 'desc' }],
//         skip,
//         take: Number(limit),
//       }),
//     ]);

//     // Incrémenter les vues (non-bloquant)
//     const ids = offres.map((o) => o.id);
//     if (ids.length > 0) {
//       prisma.offre
//         .updateMany({ where: { id: { in: ids } }, data: { views: { increment: 1 } } })
//         .catch(() => {});
//     }

//     res.json({
//       success: true,
//       data: {
//         total,
//         page:  Number(page),
//         limit: Number(limit),
//         offres: offres.map((o) => ({
//           id:          String(o.id),
//           title:       o.title,
//           companyName: o.etablissement.name,
//           sector:      o.sector,
//           contractType: o.contractType,
//           location:    o.location,
//           salaryMin:   o.salaryMin,
//           salaryMax:   o.salaryMax,
//           remote:      o.remote,
//           isPremium:   o.isPremium,
//           publishedAt: o.publishedAt?.toISOString(),
//         })),
//       },
//     });
//   } catch (e) {
//     console.error('[getPublicJobs]', e);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // GET /api/emploi/jobs/:id
// export async function getPublicJob(req: any, res: Response): Promise<void> {
//   try {
//     const offre = await prisma.offre.findUnique({
//       where:   { id: Number(req.params.id) },
//       include: { etablissement: { include: { vitrine: true } } },
//     });

//     if (!offre || offre.status !== 'ACTIVE') {
//       res.status(404).json({ success: false, message: 'Offre introuvable' });
//       return;
//     }

//     res.json({
//       success: true,
//       data: {
//         id:           String(offre.id),
//         title:        offre.title,
//         sector:       offre.sector,
//         contractType: offre.contractType,
//         location:     offre.location,
//         salaryMin:    offre.salaryMin,
//         salaryMax:    offre.salaryMax,
//         remote:       offre.remote,
//         missions:     offre.missions,
//         profileDesc:  offre.profileDesc,
//         advantages:   offre.advantages,
//         requiredSkills: (offre.requiredSkills ?? []) as string[],
//         requiredLangs:  (offre.requiredLangs  ?? []) as string[],
//         publishedAt: offre.publishedAt?.toISOString(),
//         expiresAt:   offre.expiresAt?.toISOString(),
//         company: {
//           id:     String(offre.etablissementId),
//           name:   offre.etablissement.name,
//           sector: offre.etablissement.sector,
//           city:   offre.etablissement.city,
//           logo:   offre.etablissement.logo,
//           slogan: offre.etablissement.vitrine?.slogan,
//         },
//       },
//     });
//   } catch (e) {
//     console.error('[getPublicJob]', e);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

















// // src/controllers/emploi/offres.controller.ts
// import { type Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

// const prisma = new PrismaClient();

// async function getEtabId(userId: number, requested?: string): Promise<number | null> {
//   if (requested) return Number(requested);
//   const link = await prisma.recruteurEtablissement.findFirst({ where: { userId, isDefault: true } });
//   if (link) return link.etablissementId;
//   const first = await prisma.recruteurEtablissement.findFirst({ where: { userId } });
//   return first?.etablissementId ?? null;
// }

// function fmtOffre(o: any) {
//   return {
//     id: String(o.id),
//     title: o.title, sector: o.sector,
//     contractType: o.contractType, location: o.location,
//     salaryMin: o.salaryMin, salaryMax: o.salaryMax, remote: o.remote,
//     missions: o.missions, profileDesc: o.profileDesc, advantages: o.advantages,
//     requiredSkills:    o.requiredSkills    as string[],
//     requiredLangs:     o.requiredLangs     as string[],
//     requiredSoftwares: o.requiredSoftwares as string[],
//     status: o.status.toLowerCase(),
//     isPremium: o.isPremium,
//     views: o.views,
//     candidatesCount: o._count?.applications ?? 0,
//     newCandidatesCount: 0, // computed separately if needed
//     publishedAt: o.publishedAt?.toISOString(),
//     expiresAt: o.expiresAt?.toISOString(),
//   };
// }

// // GET /api/emploi/recruteur/offres
// export async function getOffres(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid   = req.emploiUser!.id;
//     const etabId = await getEtabId(uid, req.query.etablissementId as string);
//     if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

//     const offres = await prisma.offre.findMany({
//       where: { etablissementId: etabId },
//       include: { _count: { select: { applications: true } } },
//       orderBy: { createdAt: 'desc' },
//     });

//     const online   = offres.filter((o) => ['ACTIVE', 'PAUSED'].includes(o.status)).length;
//     const drafts   = offres.filter((o) => o.status === 'DRAFT').length;
//     const archives = offres.filter((o) => o.status === 'ARCHIVED').length;

//     res.json({
//       success: true,
//       data: {
//         stats: { online, drafts, archives },
//         offres: offres.map(fmtOffre),
//       },
//     });
//   } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }

// // POST /api/emploi/recruteur/offres
// export async function createOffre(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const uid = req.emploiUser!.id;
//     const etabId = await getEtabId(uid);
//     if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

//     const { step1, step2, step3 } = req.body;
//     // Support both flat and stepper format
//     const data = step1 ? {
//       title: step1.title, sector: step1.sector, contractType: step1.contractType,
//       location: step1.location, salaryMin: step1.salaryMin, salaryMax: step1.salaryMax,
//       remote: step1.remote ?? 'none',
//       missions: step2?.missions, profileDesc: step2?.profile, advantages: step2?.advantages,
//       requiredSkills: step3?.requiredSkills ?? [], requiredLangs: step3?.languages ?? [],
//       requiredSoftwares: step3?.softwares ?? [],
//     } : req.body;

//     const offre = await prisma.offre.create({
//       data: {
//         etablissementId: etabId, ...data,
//         status: 'ACTIVE',
//         publishedAt: new Date(),
//         expiresAt: new Date(Date.now() + 30 * 86400000),
//       },
//       include: { _count: { select: { applications: true } } },
//     });
//     res.status(201).json({ success: true, data: fmtOffre(offre) });
//   } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }

// // PATCH /api/emploi/recruteur/offres/:id
// export async function updateOffre(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const { step1, step2, step3, ...flat } = req.body;
//     const data = step1 ? {
//       title: step1.title, sector: step1.sector, contractType: step1.contractType,
//       location: step1.location, salaryMin: step1.salaryMin, salaryMax: step1.salaryMax,
//       remote: step1.remote, missions: step2?.missions, profileDesc: step2?.profile,
//       advantages: step2?.advantages,
//       requiredSkills: step3?.requiredSkills ?? [], requiredLangs: step3?.languages ?? [],
//       requiredSoftwares: step3?.softwares ?? [],
//     } : flat;

//     const offre = await prisma.offre.update({
//       where: { id: Number(req.params.id) },
//       data,
//       include: { _count: { select: { applications: true } } },
//     });
//     res.json({ success: true, data: fmtOffre(offre) });
//   } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }

// // PATCH /api/emploi/recruteur/offres/:id/status
// export async function updateOffreStatus(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const { status } = req.body;
//     const STATUS_MAP: Record<string, any> = {
//       active: 'ACTIVE', paused: 'PAUSED', draft: 'DRAFT', archived: 'ARCHIVED',
//       ACTIVE: 'ACTIVE', PAUSED: 'PAUSED', DRAFT: 'DRAFT', ARCHIVED: 'ARCHIVED',
//     };
//     const offre = await prisma.offre.update({
//       where: { id: Number(req.params.id) },
//       data: {
//         status: STATUS_MAP[status] ?? 'PAUSED',
//         ...(status === 'active' && { publishedAt: new Date() }),
//       },
//       include: { _count: { select: { applications: true } } },
//     });
//     res.json({ success: true, data: fmtOffre(offre) });
//   } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }

// // POST /api/emploi/recruteur/offres/:id/duplicate
// export async function duplicateOffre(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const original = await prisma.offre.findUnique({ where: { id: Number(req.params.id) } });
//     if (!original) { res.status(404).json({ success: false, message: 'Offre introuvable' }); return; }

//     const copy = await prisma.offre.create({
//       data: {
//         etablissementId:   original.etablissementId,
//         title:             `${original.title} (copie)`,
//         sector:            original.sector,
//         contractType:      original.contractType,
//         location:          original.location,
//         salaryMin:         original.salaryMin,
//         salaryMax:         original.salaryMax,
//         remote:            original.remote,
//         missions:          original.missions,
//         profileDesc:       original.profileDesc,
//         advantages:        original.advantages,
//         requiredSkills:    original.requiredSkills    ?? [],
//         requiredLangs:     original.requiredLangs     ?? [],
//         requiredSoftwares: original.requiredSoftwares ?? [],
//         isPremium:         original.isPremium,
//         status:            'DRAFT',
//         views:             0,
//       },
//       include: { _count: { select: { applications: true } } },
//     });
//     res.status(201).json({ success: true, data: fmtOffre(copy) });
//   } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }

// // DELETE /api/emploi/recruteur/offres/:id  → archive
// export async function archiveOffre(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     await prisma.offre.update({ where: { id: Number(req.params.id) }, data: { status: 'ARCHIVED' } });
//     res.json({ success: true });
//   } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }

// // Public: GET /api/emploi/jobs  (job board)
// export async function getPublicJobs(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const { sector, location, contractType, search, page = '1', limit = '10' } = req.query as Record<string, string>;
//     const where: any = { status: 'ACTIVE' };
//     if (sector)       where.sector       = { contains: sector,       mode: 'insensitive' };
//     if (location)     where.location     = { contains: location,     mode: 'insensitive' };
//     if (contractType) where.contractType = contractType;
//     if (search)       where.title        = { contains: search,       mode: 'insensitive' };

//     const skip = (Number(page) - 1) * Number(limit);
//     const [total, offres] = await Promise.all([
//       prisma.offre.count({ where }),
//       prisma.offre.findMany({
//         where,
//         include: { etablissement: { select: { name: true, city: true, logo: true } } },
//         orderBy: [{ isPremium: 'desc' }, { publishedAt: 'desc' }],
//         skip, take: Number(limit),
//       }),
//     ]);

//     // Increment views
//     const ids = offres.map((o) => o.id);
//     await prisma.offre.updateMany({ where: { id: { in: ids } }, data: { views: { increment: 1 } } });

//     res.json({
//       success: true,
//       data: {
//         total, page: Number(page), limit: Number(limit),
//         offres: offres.map((o) => ({
//           id: String(o.id), title: o.title,
//           companyName: o.etablissement.name,
//           sector: o.sector, contractType: o.contractType,
//           location: o.location, salaryMin: o.salaryMin, salaryMax: o.salaryMax,
//           remote: o.remote, isPremium: o.isPremium,
//           publishedAt: o.publishedAt?.toISOString(),
//         })),
//       },
//     });
//   } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }

// // Public: GET /api/emploi/jobs/:id
// export async function getPublicJob(req: any, res: Response): Promise<void> {
//   try {
//     const offre = await prisma.offre.findUnique({
//       where: { id: Number(req.params.id) },
//       include: { etablissement: { include: { vitrine: true } } },
//     });
//     if (!offre || offre.status !== 'ACTIVE') { res.status(404).json({ success: false, message: 'Offre introuvable' }); return; }
//     res.json({
//       success: true,
//       data: {
//         id: String(offre.id), title: offre.title, sector: offre.sector,
//         contractType: offre.contractType, location: offre.location,
//         salaryMin: offre.salaryMin, salaryMax: offre.salaryMax, remote: offre.remote,
//         missions: offre.missions, profileDesc: offre.profileDesc, advantages: offre.advantages,
//         requiredSkills: offre.requiredSkills as string[],
//         requiredLangs: offre.requiredLangs as string[],
//         publishedAt: offre.publishedAt?.toISOString(),
//         expiresAt: offre.expiresAt?.toISOString(),
//         company: {
//           id: String(offre.etablissementId), name: offre.etablissement.name,
//           sector: offre.etablissement.sector, city: offre.etablissement.city,
//           logo: offre.etablissement.logo,
//           slogan: offre.etablissement.vitrine?.slogan,
//         },
//       },
//     });
//   } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }