// src/controllers/emploi/candidatures-rec.controller.ts
import { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();

async function getEtabId(userId: number, requested?: string): Promise<number | null> {
  if (requested) return Number(requested);
  const link = await prisma.recruteurEtablissement.findFirst({ where: { userId, isDefault: true } });
  if (link) return link.etablissementId;
  const first = await prisma.recruteurEtablissement.findFirst({ where: { userId } });
  return first?.etablissementId ?? null;
}

const STATUS_MAP: Record<string, any> = {
  new:         'SENT',
  sent:        'SENT',
  in_progress: 'IN_PROGRESS',
  viewed:      'VIEWED',
  selected:    'SELECTED',
  interview:   'INTERVIEW',
  accepted:    'ACCEPTED',
  refused:     'REFUSED',
  archived:    'ARCHIVED',
};

// ── FIX: SENT non lu → 'new', SENT lu → 'in_progress'
// Ce mapping est utilisé dans fmtApp uniquement pour les statuts non-SENT.
const STATUS_REV: Record<string, string> = {
  IN_PROGRESS: 'in_progress',
  SELECTED:    'in_progress',
  VIEWED:      'in_progress',
  ACCEPTED:    'in_progress',
  INTERVIEW:   'interview',
  REFUSED:     'refused',
  ARCHIVED:    'refused',
  PENDING:     'new',
};

function calcMatchScore(app: any): number {
  const expCount = app.user.candidatProfil?.experiences?.length ?? 0;
  // Seed with app.id for determinism (no Math.random)
  const seed = Number(app.id) % 20;
  return Math.min(50 + expCount * 10 + seed, 99);
}

// ── FIX: isRead détermine si une candidature SENT est 'new' ou 'in_progress'
function fmtApp(a: any) {
  const profil = a.user.candidatProfil;

  let frontStatus: string;
  if (a.status === 'SENT') {
    frontStatus = a.isRead ? 'in_progress' : 'new';
  } else {
    frontStatus = STATUS_REV[a.status] ?? 'in_progress';
  }

  return {
    id: String(a.id),
    candidatName: `${a.user.firstName} ${a.user.lastName}`,
    candidatAvatar: a.user.avatar ?? undefined,
    candidatTitle: profil?.headline ?? 'Candidat',
    matchScore: a.matchScore || calcMatchScore(a),
    offerId: String(a.offreId),
    offerTitle: a.offre.title,
    receivedAt: a.appliedAt.toISOString(),
    status: frontStatus,
    isRead: a.isRead,
    isFavorite: a.isFavorite,
    cvUrl: profil?.cvFileUrl ?? undefined,
    experiences: (profil?.experiences ?? []).map((e: any) => ({
      jobTitle: e.jobTitle,
      company: e.companyName,
      period: `${e.startDate}${e.endDate ? ` - ${e.endDate}` : ' - En poste'}`,
      description: (e.missions as string[])[0] ?? '',
    })),
    formations: (profil?.formations ?? []).map((f: any) => ({
      diploma: f.diploma,
      school: f.school,
      year: f.year,
    })),
    skills: (profil?.hardSkills as string[]) ?? [],
    location: profil?.city ?? '',
    mobility: profil?.mobility ?? '',
    availability: profil?.availability ?? 'immediate',
    salarySought: undefined,
    recruiterNotes: a.recruiterNotes ?? '',
  };
}

// GET /api/emploi/recruteur/candidatures
export async function getCandidatures(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const etabId = await getEtabId(uid, req.query.etablissementId as string);
    if (!etabId) {
      res.status(404).json({ success: false, message: 'Aucun établissement' });
      return;
    }

    const offreIdFilter = req.query.offerId ? { offreId: Number(req.query.offerId) } : {};

    const [apps, offres] = await Promise.all([
      prisma.application.findMany({
        where: { etablissementId: etabId, ...offreIdFilter },
        include: {
          user: {
            include: {
              candidatProfil: { include: { experiences: true, formations: true } },
            },
          },
          offre: { select: { title: true } },
        },
        orderBy: { appliedAt: 'desc' },
      }),
      prisma.offre.findMany({
        where: { etablissementId: etabId },
        select: { id: true, title: true },
      }),
    ]);

    // ── FIX: stats cohérentes avec le nouveau mapping
    const stats = {
      new: apps.filter((a) => a.status === 'SENT' && !a.isRead).length,
      in_progress: apps.filter(
        (a) =>
          (a.status === 'SENT' && a.isRead) ||
          ['IN_PROGRESS', 'SELECTED', 'VIEWED', 'ACCEPTED'].includes(a.status),
      ).length,
      interview: apps.filter((a) => a.status === 'INTERVIEW').length,
      favorite: apps.filter((a) => a.isFavorite).length,
      refused: apps.filter((a) => ['REFUSED', 'ARCHIVED'].includes(a.status)).length,
    };

    res.json({
      success: true,
      data: {
        stats,
        offers: offres.map((o) => ({ id: String(o.id), title: o.title })),
        candidatures: apps.map(fmtApp),
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// PATCH /api/emploi/recruteur/candidatures/:id/status
export async function updateStatus(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const { status } = req.body;
    const dbStatus = STATUS_MAP[status] ?? 'IN_PROGRESS';

    const app = await prisma.application.findUnique({ where: { id: Number(req.params.id) } });
    if (!app) {
      res.status(404).json({ success: false, message: 'Candidature introuvable' });
      return;
    }

    const timeline = (app.timeline as any[]) ?? [];
    timeline.push({ status, date: new Date().toISOString() });

    const updated = await prisma.application.update({
      where: { id: Number(req.params.id) },
      data: { status: dbStatus, timeline },
    });

    const notifType =
      status === 'refused' ? 'APPLICATION_REFUSED'
      : status === 'accepted' || status === 'interview' ? 'APPLICATION_ACCEPTED'
      : null;

    if (notifType) {
      const offre = await prisma.offre.findUnique({
        where: { id: app.offreId },
        select: { title: true, etablissement: { select: { name: true } } },
      });
      await prisma.emploiNotification.create({
        data: {
          userId: app.userId,
          type: notifType as any,
          title: status === 'refused' ? 'Candidature non retenue' : 'Votre candidature progresse',
          description:
            status === 'interview'
              ? `${offre?.etablissement.name} vous invite à un entretien pour ${offre?.title}`
              : status === 'refused'
              ? `Votre candidature pour ${offre?.title} n'a pas été retenue`
              : `Votre candidature pour ${offre?.title} est en cours d'examen`,
          relatedId: String(app.id),
        },
      });
    }

    // Retourner le statut front (pas le statut DB)
    let frontStatus: string;
    if (updated.status === 'SENT') {
      frontStatus = updated.isRead ? 'in_progress' : 'new';
    } else {
      frontStatus = STATUS_REV[updated.status] ?? 'in_progress';
    }

    res.json({ success: true, data: { status: frontStatus } });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// PATCH /api/emploi/recruteur/candidatures/:id/read
// ── FIX: on ne change plus le statut, seulement isRead
export async function markRead(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const app = await prisma.application.update({
      where: { id: Number(req.params.id) },
      data: { isRead: true }, // ← ne pas changer le status ici
    });

    // Notifier le candidat que son profil a été consulté (non-bloquant)
    await prisma.emploiNotification
      .create({
        data: {
          userId: app.userId,
          type: 'PROFILE_VIEWED',
          title: 'Profil consulté',
          description: 'Un recruteur a consulté votre candidature',
          relatedId: String(app.id),
        },
      })
      .catch(() => {});

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// PATCH /api/emploi/recruteur/candidatures/:id/favorite
export async function toggleFavorite(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const { isFavorite } = req.body;
    await prisma.application.update({
      where: { id: Number(req.params.id) },
      data: { isFavorite },
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// PATCH /api/emploi/recruteur/candidatures/:id/notes
export async function saveNotes(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const { notes } = req.body;
    await prisma.application.update({
      where: { id: Number(req.params.id) },
      data: { recruiterNotes: notes },
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// POST /api/emploi/recruteur/candidatures/:id/message
export async function sendMessage(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const { subject, body } = req.body;
    const app = await prisma.application.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: { select: { email: true, firstName: true } },
        offre: { select: { title: true } },
      },
    });
    if (!app) {
      res.status(404).json({ success: false, message: 'Candidature introuvable' });
      return;
    }

    await prisma.emploiNotification.create({
      data: {
        userId: app.userId,
        type: 'APPLICATION_ACCEPTED',
        title: subject,
        description: body.slice(0, 200),
        relatedId: String(app.id),
      },
    });

    res.json({ success: true, message: 'Message envoyé' });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// PATCH /api/emploi/recruteur/candidatures/:id/star
export async function toggleStar(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const { starred } = req.body;
    await prisma.application.update({
      where: { id: Number(req.params.id) },
      data: { isFavorite: starred },
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}
