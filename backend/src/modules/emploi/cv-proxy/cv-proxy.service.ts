// src/services/emploi/cv-proxy.service.ts
import { applicationRepository } from '../candidatures/application.repository';
import { assertOffreAccess } from '../services/etablissement-access.service';
import { NotFoundError } from '../../../errors/http-errors';

export const cvProxyService = {
  async resolveCvAccess(userId: number, applicationId: number) {
    const application = await applicationRepository.findByIdWithCvContext(applicationId);
    if (!application) throw new NotFoundError('Candidature introuvable');

    await assertOffreAccess(userId, application.offre.etablissementId);

    const cvUrl = application.user.candidatProfil?.cvFileUrl;
    if (!cvUrl) throw new NotFoundError('Aucun CV disponible pour ce candidat');

    const cvName =
      application.user.candidatProfil?.cvFileName ??
      `CV_${application.user.firstName}_${application.user.lastName}.pdf`;

    return { cvUrl, cvName };
  },
};