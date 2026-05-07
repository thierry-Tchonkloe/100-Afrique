// src/controllers/emploi/alertes.controller.ts
import { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();

const FREQ: Record<string, any> = { realtime: 'REALTIME', daily: 'DAILY', weekly: 'WEEKLY' };
const FREQ_REV: Record<string, string> = { REALTIME: 'realtime', DAILY: 'daily', WEEKLY: 'weekly' };

function fmt(a: any) {
  return {
    id: String(a.id), name: a.name,
    keywords: a.keywords as string[],
    location: a.location ?? '',
    radius: a.radius ?? undefined,
    contractTypes: a.contractTypes as string[],
    sector: a.sector ?? '',
    frequency: FREQ_REV[a.frequency] ?? 'daily',
    isActive: a.isActive,
    lastSentAt: a.lastSentAt?.toISOString(),
    createdAt: a.createdAt.toISOString(),
  };
}

// GET /api/emploi/candidat/alertes
export async function getAlertes(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const rows = await prisma.alerteJob.findMany({
      where: { userId: req.emploiUser!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: rows.map(fmt) });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// POST /api/emploi/candidat/alertes
export async function createAlerte(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { name, keywords, location, radius, contractTypes, sector, frequency, isActive } = req.body;
    const row = await prisma.alerteJob.create({
      data: {
        userId: uid, name,
        keywords:      Array.isArray(keywords)      ? keywords      : [],
        contractTypes: Array.isArray(contractTypes) ? contractTypes : [],
        location, radius, sector,
        frequency: FREQ[frequency] ?? 'DAILY',
        isActive: isActive ?? true,
      },
    });
    res.status(201).json({ success: true, data: fmt(row) });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// PATCH /api/emploi/candidat/alertes/:id
export async function updateAlerte(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const { frequency, ...rest } = req.body;
    const row = await prisma.alerteJob.update({
      where: { id: Number(req.params.id) },
      data: { ...rest, ...(frequency && { frequency: FREQ[frequency] ?? 'DAILY' }) },
    });
    res.json({ success: true, data: fmt(row) });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// PATCH /api/emploi/candidat/alertes/:id/toggle
export async function toggleAlerte(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const row = await prisma.alerteJob.update({
      where: { id: Number(req.params.id) },
      data: { isActive: req.body.isActive },
    });
    res.json({ success: true, data: fmt(row) });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// DELETE /api/emploi/candidat/alertes/:id
export async function deleteAlerte(req: EmploiRequest, res: Response): Promise<void> {
  try {
    await prisma.alerteJob.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}