// src/controllers/emploi/settings.controller.ts
import { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();

// GET /api/emploi/candidat/settings
export async function getSettings(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const [user, settings, recentApps] = await Promise.all([
      prisma.emploiUser.findUnique({ where: { id: uid }, select: { email: true } }),
      prisma.emploiSettings.findUnique({ where: { userId: uid } }),
      prisma.application.findMany({
        where: { userId: uid, isRead: true },
        include: { etablissement: { select: { name: true } } },
        orderBy: { updatedAt: 'desc' }, take: 3,
      }),
    ]);
    res.json({
      success: true,
      data: {
        account: { email: user?.email ?? '', twoFactorEnabled: settings?.twoFactorEnabled ?? false },
        privacy: {
          profileVisible: settings?.profileVisible ?? true,
          hideLastName:   settings?.hideLastName   ?? false,
          hidePhoto:      settings?.hidePhoto      ?? false,
          hideContactInfo: settings?.hideContactInfo ?? false,
        },
        recentAccess: recentApps.map((a) => ({
          id: `ra-${a.id}`,
          companyName: a.etablissement.name,
          accessedAt: a.updatedAt.toISOString(),
        })),
        notifications: {
          newsletter:    settings?.newsletter    ?? true,
          serviceAlerts: settings?.serviceAlerts ?? true,
        },
        socials: {
          linkedinConnected: settings?.linkedinConnected ?? false,
          linkedinEmail:     settings?.linkedinEmail ?? undefined,
        },
      },
    });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// PATCH /api/emploi/candidat/settings/email
export async function updateEmail(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { email, currentPassword } = req.body;
    const user = await prisma.emploiUser.findUnique({ where: { id: uid } });
    if (!user || !await bcrypt.compare(currentPassword, user.password)) {
      res.status(401).json({ success: false, message: 'Mot de passe incorrect' }); return;
    }
    const exists = await prisma.emploiUser.findUnique({ where: { email } });
    if (exists && exists.id !== uid) { res.status(409).json({ success: false, message: 'Email déjà utilisé' }); return; }
    await prisma.emploiUser.update({ where: { id: uid }, data: { email } });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// PATCH /api/emploi/candidat/settings/privacy
export async function updatePrivacy(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { profileVisible, hideLastName, hidePhoto, hideContactInfo } = req.body;
    await prisma.emploiSettings.upsert({
      where: { userId: uid },
      update: {
        ...(profileVisible   !== undefined && { profileVisible   }),
        ...(hideLastName     !== undefined && { hideLastName     }),
        ...(hidePhoto        !== undefined && { hidePhoto        }),
        ...(hideContactInfo  !== undefined && { hideContactInfo  }),
      },
      create: { userId: uid, profileVisible, hideLastName, hidePhoto, hideContactInfo },
    });
    // Also sync with candidat profil visibility
    if (profileVisible !== undefined) {
      await prisma.candidatProfil.updateMany({ where: { userId: uid }, data: { isVisible: profileVisible } });
    }
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// PATCH /api/emploi/candidat/settings/notifications
export async function updateNotifications(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { newsletter } = req.body; // serviceAlerts is non-togglable
    await prisma.emploiSettings.upsert({
      where: { userId: uid },
      update: { ...(newsletter !== undefined && { newsletter }) },
      create: { userId: uid, newsletter },
    });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// PATCH /api/emploi/candidat/settings/2fa
export async function updateTwoFactor(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { enabled } = req.body;
    await prisma.emploiSettings.upsert({
      where: { userId: uid },
      update: { twoFactorEnabled: enabled },
      create: { userId: uid, twoFactorEnabled: enabled },
    });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// POST /api/emploi/candidat/settings/linkedin/link
export async function linkLinkedIn(req: EmploiRequest, res: Response): Promise<void> {
  // In production: OAuth2 redirect. Here we return a fake auth URL.
  res.json({
    success: true,
    data: { authUrl: `https://www.linkedin.com/oauth/authorize?state=${req.emploiUser!.id}` },
  });
}

// PATCH /api/emploi/candidat/settings/pause
export async function pauseAccount(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    await prisma.candidatProfil.updateMany({ where: { userId: uid }, data: { isVisible: false } });
    res.json({ success: true, message: 'Compte mis en pause' });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// GET /api/emploi/candidat/settings/export
export async function exportData(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const [user, profil, apps, alertes, notifs] = await Promise.all([
      prisma.emploiUser.findUnique({ where: { id: uid }, select: { email: true, firstName: true, lastName: true, createdAt: true } }),
      prisma.candidatProfil.findUnique({ where: { userId: uid }, include: { experiences: true, formations: true } }),
      prisma.application.findMany({ where: { userId: uid } }),
      prisma.alerteJob.findMany({ where: { userId: uid } }),
      prisma.emploiNotification.findMany({ where: { userId: uid } }),
    ]);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="mes-donnees-itourisme.json"');
    res.json({ exportedAt: new Date().toISOString(), user, profil, applications: apps, alertes, notifications: notifs });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// DELETE /api/emploi/candidat/settings/account
export async function deleteAccount(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { password } = req.body;
    const user = await prisma.emploiUser.findUnique({ where: { id: uid } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      res.status(401).json({ success: false, message: 'Mot de passe incorrect' }); return;
    }
    await prisma.emploiUser.delete({ where: { id: uid } }); // cascade deletes everything
    res.json({ success: true, message: 'Compte supprimé définitivement' });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}