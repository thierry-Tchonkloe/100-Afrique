// src/controllers/emploi/cv-proxy.controller.ts
import { type Response } from 'express';
import https from 'https';
import http from 'http';
import { cvProxyService } from '../../services/emploi/cv-proxy.service';
import { asyncHandler } from '../../middlewares/errorHandler';
import { InternalError } from '../../errors/http-errors';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

export const proxyCandidatCv = asyncHandler(async (req: EmploiRequest, res: Response) => {
  const { cvUrl, cvName } = await cvProxyService.resolveCvAccess(req.emploiUser!.id, Number(req.params.id));

  const protocol = cvUrl.startsWith('https') ? https : http;

  await new Promise<void>((resolve, reject) => {
    protocol
      .get(cvUrl, (fileResponse) => {
        if (fileResponse.statusCode !== 200) {
          reject(new InternalError(`Impossible de récupérer le CV (HTTP ${fileResponse.statusCode})`));
          return;
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(cvName)}"`);
        if (fileResponse.headers['content-length']) {
          res.setHeader('Content-Length', fileResponse.headers['content-length']);
        }
        fileResponse.pipe(res);
        fileResponse.on('end', () => resolve());
      })
      .on('error', () => reject(new InternalError('Erreur lors du téléchargement du CV')));
  });
});
