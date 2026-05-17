// src/controllers/emploi/cv-proxy.controller.ts
// Route proxy : GET /api/emploi/recruteur/candidatures/:id/cv
//
// Pourquoi ce proxy ?
// Quand Cloudinary retourne un fichier "raw" (PDF), certains navigateurs
// reçoivent un fichier corrompu si le téléchargement est initié directement
// depuis le front (CORS + headers manquants). Ce proxy :
//  1. Récupère le fichier Cloudinary côté serveur (pas de CORS)
//  2. Le retransmet avec Content-Disposition: attachment → force le téléchargement
//  3. Vérifie que l'utilisateur est bien recruteur et a accès à cette candidature

import { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import https from 'https';
import http  from 'http';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();

// GET /api/emploi/recruteur/candidatures/:id/cv
export async function proxyCandidatCv(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid         = req.emploiUser!.id;
    const candidatureId = Number(req.params.id);

    // 1. Récupérer la candidature avec le profil candidat
    const application = await prisma.application.findUnique({
      where:   { id: candidatureId },
      include: {
        user: {
          include: {
            candidatProfil: { select: { cvFileUrl: true, cvFileName: true } },
          },
        },
        offre: { select: { etablissementId: true, title: true } },
      },
    });

    if (!application) {
      res.status(404).json({ success: false, message: 'Candidature introuvable' });
      return;
    }

    // 2. Vérifier que ce recruteur a accès à cet établissement
    const access = await prisma.recruteurEtablissement.findUnique({
      where: {
        userId_etablissementId: {
          userId:          uid,
          etablissementId: application.offre.etablissementId,
        },
      },
    });

    if (!access) {
      res.status(403).json({ success: false, message: 'Accès refusé' });
      return;
    }

    // 3. Vérifier que le candidat a un CV
    const cvUrl  = application.user.candidatProfil?.cvFileUrl;
    const cvName = application.user.candidatProfil?.cvFileName
      ?? `CV_${application.user.firstName}_${application.user.lastName}.pdf`;

    if (!cvUrl) {
      res.status(404).json({ success: false, message: 'Aucun CV disponible pour ce candidat' });
      return;
    }

    // 4. Proxy vers Cloudinary (ou autre hébergeur)
    const protocol = cvUrl.startsWith('https') ? https : http;

    protocol.get(cvUrl, (fileResponse) => {
      if (fileResponse.statusCode !== 200) {
        res.status(502).json({
          success: false,
          message: `Impossible de récupérer le CV (HTTP ${fileResponse.statusCode})`,
        });
        return;
      }

      // 5. Transmettre avec les bons headers pour forcer le téléchargement
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(cvName)}"`,
      );
      // Transmettre la taille si disponible
      if (fileResponse.headers['content-length']) {
        res.setHeader('Content-Length', fileResponse.headers['content-length']);
      }

      fileResponse.pipe(res);
    }).on('error', (err) => {
      console.error('[proxyCandidatCv] Erreur fetch Cloudinary:', err);
      res.status(502).json({ success: false, message: 'Erreur lors du téléchargement du CV' });
    });
  } catch (e) {
    console.error('[proxyCandidatCv]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}