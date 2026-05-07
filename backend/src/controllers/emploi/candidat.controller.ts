// src/controllers/emploi/candidat.controller.ts
import { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();

function calcStrength(p: any): number {
  let s = 0;
  if (p.headline) s += 15; if (p.city) s += 5; if (p.bio) s += 10; if (p.avatar) s += 10;
  if ((p.hardSkills as string[]).length) s += 10; if ((p.softSkills as string[]).length) s += 5;
  if ((p.languages  as any[]).length)    s += 10; if (p.cvFileUrl) s += 5;
  return Math.min(s, 100);
}

function mapStatus(s: string): string { return s.toLowerCase(); }

// ── Dashboard ─────────────────────────────────────────────────────────────────
export async function getDashboard(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const [profil, apps, alertsCount, notifs] = await Promise.all([
      prisma.candidatProfil.findUnique({ where: { userId: uid }, include: { experiences: true, formations: true } }),
      prisma.application.findMany({
        where: { userId: uid },
        include: { offre: { select: { title: true, sector: true, etablissement: { select: { name: true } } } } },
        orderBy: { appliedAt: 'desc' }, take: 5,
      }),
      prisma.alerteJob.count({ where: { userId: uid, isActive: true } }),
      prisma.emploiNotification.findMany({ where: { userId: uid }, orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    const suggestions = await prisma.offre.findMany({
      where: { status: 'ACTIVE' },
      include: { etablissement: { select: { name: true } } },
      orderBy: { publishedAt: 'desc' }, take: 3,
    });

    res.json({
      success: true,
      data: {
        profile: {
          id: String(uid),
          firstName: req.emploiUser!.firstName, lastName: req.emploiUser!.lastName,
          avatar: profil?.avatar,
          headline: profil?.headline ?? '', sector: 'Hôtellerie',
          profileStrength: profil ? calcStrength(profil) : 0,
          profileStrengthMessage: 'Ajoutez vos expériences pour attirer 3x plus de recruteurs',
        },
        stats: {
          applicationsCount: apps.length,
          profileViews: 47, savedJobsCount: 8, activeAlertsCount: alertsCount,
        },
        recentApplications: apps.map((a) => ({
          id: String(a.id), jobTitle: a.offre.title,
          companyName: a.offre.etablissement.name, sector: a.offre.sector,
          appliedAt: a.appliedAt.toISOString(), status: mapStatus(a.status),
        })),
        suggestions: suggestions.map((o) => ({
          id: String(o.id), title: o.title, companyName: o.etablissement.name,
          location: o.location, contractType: o.contractType,
          publishedAt: o.publishedAt?.toISOString() ?? o.createdAt.toISOString(),
          sector: o.sector,
        })),
        notifications: notifs.map((n) => ({
          id: String(n.id), type: n.type.toLowerCase(), title: n.title,
          description: n.description, createdAt: n.createdAt.toISOString(), read: n.isRead,
        })),
      },
    });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// ── Profil ────────────────────────────────────────────────────────────────────
export async function getProfil(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const [user, profil] = await Promise.all([
      prisma.emploiUser.findUnique({ where: { id: uid }, select: { firstName: true, lastName: true, email: true } }),
      prisma.candidatProfil.findUnique({ where: { userId: uid }, include: { experiences: { orderBy: { sortOrder: 'asc' } }, formations: true } }),
    ]);
    if (!profil || !user) { res.status(404).json({ success: false, message: 'Profil introuvable' }); return; }

    res.json({
      success: true,
      data: {
        id: String(uid), firstName: user.firstName, lastName: user.lastName,
        avatar: profil.avatar, headline: profil.headline ?? '',
        city: profil.city ?? '', mobility: profil.mobility ?? '', bio: profil.bio ?? '',
        experiences: profil.experiences.map((e) => ({
          id: String(e.id), jobTitle: e.jobTitle, companyName: e.companyName,
          location: e.location ?? '', startDate: e.startDate,
          endDate: e.endDate ?? undefined, contractType: e.contractType,
          missions: e.missions as string[],
        })),
        formations: profil.formations.map((f) => ({
          id: String(f.id), diploma: f.diploma, school: f.school, year: f.year,
        })),
        hardSkills: profil.hardSkills as string[],
        softSkills: profil.softSkills as string[],
        languages: profil.languages as object[],
        cvFile: profil.cvFileName ? {
          name: profil.cvFileName,
          updatedAt: profil.cvUpdatedAt?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) ?? '',
        } : undefined,
        isVisible: profil.isVisible, availability: profil.availability,
        profileStrength: calcStrength(profil),
      },
    });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function updateIdentity(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { firstName, lastName, headline, city, mobility, bio } = req.body;
    await Promise.all([
      prisma.emploiUser.update({ where: { id: uid }, data: { firstName, lastName } }),
      prisma.candidatProfil.update({ where: { userId: uid }, data: { headline, city, mobility, bio } }),
    ]);
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function updateSkills(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { hardSkills, softSkills, languages } = req.body;
    await prisma.candidatProfil.update({
      where: { userId: uid },
      data: {
        ...(hardSkills !== undefined && { hardSkills }),
        ...(softSkills !== undefined && { softSkills }),
        ...(languages  !== undefined && { languages }),
      },
    });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function updateVisibility(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { isVisible, availability } = req.body;
    await prisma.candidatProfil.update({
      where: { userId: uid },
      data: {
        ...(isVisible    !== undefined && { isVisible }),
        ...(availability !== undefined && { availability }),
      },
    });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function uploadAvatar(req: EmploiRequest & { file?: any }, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    if (!req.file) { res.status(400).json({ success: false, message: 'Fichier manquant' }); return; }
    const avatarUrl: string = req.file.path ?? req.file.url;
    await Promise.all([
      prisma.emploiUser.update({ where: { id: uid }, data: { avatar: avatarUrl } }),
      prisma.candidatProfil.update({ where: { userId: uid }, data: { avatar: avatarUrl } }),
    ]);
    res.json({ success: true, data: { avatarUrl } });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function uploadCv(req: EmploiRequest & { file?: any }, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    if (!req.file) { res.status(400).json({ success: false, message: 'Fichier manquant' }); return; }
    const fileUrl: string  = req.file.path ?? req.file.url;
    const fileName: string = req.file.originalname ?? 'cv.pdf';
    await prisma.candidatProfil.update({
      where: { userId: uid },
      data: { cvFileUrl: fileUrl, cvFileName: fileName, cvUpdatedAt: new Date() },
    });
    res.json({
      success: true,
      data: { fileName, updatedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) },
    });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function deleteCv(req: EmploiRequest, res: Response): Promise<void> {
  try {
    await prisma.candidatProfil.update({
      where: { userId: req.emploiUser!.id },
      data: { cvFileUrl: null, cvFileName: null, cvUpdatedAt: null },
    });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// ── Experience CRUD ───────────────────────────────────────────────────────────
export async function createExperience(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const profil = await prisma.candidatProfil.findUnique({ where: { userId: req.emploiUser!.id } });
    if (!profil) { res.status(404).json({ success: false, message: 'Profil introuvable' }); return; }
    const { jobTitle, companyName, location, startDate, endDate, contractType, missions } = req.body;
    const exp = await prisma.experience.create({
      data: { profilId: profil.id, jobTitle, companyName, location, startDate, endDate: endDate ?? null, contractType: contractType ?? 'CDI', missions: missions ?? [] },
    });
    res.status(201).json({ success: true, data: { ...exp, id: String(exp.id), missions: exp.missions as string[] } });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function updateExperience(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const { jobTitle, companyName, location, startDate, endDate, contractType, missions } = req.body;
    const exp = await prisma.experience.update({
      where: { id: Number(req.params.id) },
      data: { jobTitle, companyName, location, startDate, endDate: endDate ?? null, contractType, missions: missions ?? [] },
    });
    res.json({ success: true, data: { ...exp, id: String(exp.id), missions: exp.missions as string[] } });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function deleteExperience(req: EmploiRequest, res: Response): Promise<void> {
  try {
    await prisma.experience.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// ── Formation CRUD ────────────────────────────────────────────────────────────
export async function createFormation(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const profil = await prisma.candidatProfil.findUnique({ where: { userId: req.emploiUser!.id } });
    if (!profil) { res.status(404).json({ success: false, message: 'Profil introuvable' }); return; }
    const { diploma, school, year } = req.body;
    const f = await prisma.formation.create({ data: { profilId: profil.id, diploma, school, year } });
    res.status(201).json({ success: true, data: { ...f, id: String(f.id) } });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function updateFormation(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const f = await prisma.formation.update({ where: { id: Number(req.params.id) }, data: req.body });
    res.json({ success: true, data: { ...f, id: String(f.id) } });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function deleteFormation(req: EmploiRequest, res: Response): Promise<void> {
  try {
    await prisma.formation.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// ── Applications ──────────────────────────────────────────────────────────────
export async function getApplications(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const apps = await prisma.application.findMany({
      where: { userId: uid },
      include: { offre: { include: { etablissement: { select: { name: true } } } } },
      orderBy: { appliedAt: 'desc' },
    });
    res.json({
      success: true,
      data: {
        stats: {
          total: apps.length,
          inProgress: apps.filter((a) => ['SENT','VIEWED','IN_PROGRESS','SELECTED','INTERVIEW'].includes(a.status)).length,
          interviews: apps.filter((a) => a.status === 'INTERVIEW').length,
        },
        applications: apps.map((a) => ({
          id: String(a.id), jobTitle: a.offre.title,
          companyName: a.offre.etablissement.name,
          sector: a.offre.sector, location: a.offre.location,
          contractType: a.offre.contractType,
          postedAt: a.offre.publishedAt?.toISOString() ?? a.offre.createdAt.toISOString(),
          appliedAt: a.appliedAt.toISOString(),
          status: mapStatus(a.status), timeline: a.timeline,
        })),
      },
    });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function applyToJob(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { jobId } = req.body;
    const offre = await prisma.offre.findUnique({ where: { id: Number(jobId) } });
    if (!offre) { res.status(404).json({ success: false, message: 'Offre introuvable' }); return; }
    const existing = await prisma.application.findUnique({ where: { userId_offreId: { userId: uid, offreId: offre.id } } });
    if (existing) { res.status(409).json({ success: false, message: 'Déjà postulé' }); return; }

    const app = await prisma.application.create({
      data: {
        userId: uid, offreId: offre.id, etablissementId: offre.etablissementId,
        status: 'SENT',
        timeline: [{ status: 'sent', date: new Date().toISOString(), note: 'Candidature envoyée' }],
      },
    });
    // Notify recruiter
    const recruteurs = await prisma.recruteurEtablissement.findMany({ where: { etablissementId: offre.etablissementId }, select: { userId: true } });
    if (recruteurs.length) {
      await prisma.emploiNotification.createMany({
        data: recruteurs.map((r) => ({
          userId: r.userId, type: 'NEW_APPLICATION' as any,
          title: 'Nouvelle candidature',
          description: `${req.emploiUser!.firstName} ${req.emploiUser!.lastName} a postulé pour ${offre.title}`,
          relatedId: String(app.id),
        })),
      });
    }
    res.status(201).json({ success: true, data: { message: 'Candidature envoyée', id: String(app.id) } });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function withdrawApplication(req: EmploiRequest, res: Response): Promise<void> {
  try {
    await prisma.application.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function getSuggestions(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const profil = await prisma.candidatProfil.findUnique({ where: { userId: uid } });
    const sector = (req.query.sector as string) ?? profil?.mobility ?? '';
    const offres = await prisma.offre.findMany({
      where: { status: 'ACTIVE', ...(sector && { sector: { contains: sector.split(' ')[0], mode: 'insensitive' } }) },
      include: { etablissement: { select: { name: true } } },
      orderBy: { publishedAt: 'desc' }, take: 3,
    });
    res.json({
      success: true,
      data: offres.map((o) => ({
        id: String(o.id), title: o.title, companyName: o.etablissement.name,
        location: o.location, contractType: o.contractType,
        publishedAt: o.publishedAt?.toISOString() ?? o.createdAt.toISOString(), sector: o.sector,
      })),
    });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// ── Notifications ─────────────────────────────────────────────────────────────
export async function getNotifications(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const notifs = await prisma.emploiNotification.findMany({
      where: { userId: req.emploiUser!.id }, orderBy: { createdAt: 'desc' }, take: 20,
    });
    res.json({
      success: true,
      data: notifs.map((n) => ({
        id: String(n.id), type: n.type.toLowerCase(), title: n.title,
        description: n.description, createdAt: n.createdAt.toISOString(), read: n.isRead,
      })),
    });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function markNotifRead(req: EmploiRequest, res: Response): Promise<void> {
  try {
    await prisma.emploiNotification.update({ where: { id: Number(req.params.id) }, data: { isRead: true } });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

export async function markAllNotifsRead(req: EmploiRequest, res: Response): Promise<void> {
  try {
    await prisma.emploiNotification.updateMany({ where: { userId: req.emploiUser!.id }, data: { isRead: true } });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}