// tests/emploi/candidatures.service.test.ts
//
// Flux critique #3 : gestion des candidatures côté recruteur. On verrouille
// ici trois choses qui, en revue de code, sont faciles à casser sans s'en
// rendre compte car elles ne provoquent pas d'erreur visible :
//   1. Le calcul des statistiques (stats.new / in_progress / interview /
//      favorite / refused) — un mauvais bucket ne plante rien, il affiche
//      juste un mauvais chiffre au recruteur.
//   2. Le déclenchement (ou non) de notification au candidat quand son
//      statut change — un oubli ici = le candidat n'est jamais prévenu.
//   3. `toggleStar` qui utilise `input.starred` mais appelle en interne
//      LE MÊME repository que `toggleFavorite` (`applicationRepository
//      .toggleFavorite`) — un détail facile à casser lors d'un refactor.
//
// Comme pour auth.service.test.ts : tout est mocké, on teste la logique
// métier du service en isolation, sans base de données réelle.

jest.mock('../../src/modules/emploi/candidatures/application.repository');
jest.mock('../../src/modules/emploi/notifications/notification.repository');
jest.mock('../../src/modules/emploi/offres/offre.repository');
jest.mock('../../src/modules/emploi/services/etablissement-access.service');

import { candidaturesService } from '../../src/modules/emploi/candidatures/candidatures.service';
import { applicationRepository } from '../../src/modules/emploi/candidatures/application.repository';
import { notificationRepository } from '../../src/modules/emploi/notifications/notification.repository';
import { offreRepository } from '../../src/modules/emploi/offres/offre.repository';
import { resolveActiveEtablissementId } from '../../src/modules/emploi/services/etablissement-access.service';
import { NotFoundError } from '../../src/errors/http-errors';

const mockedAppRepo = applicationRepository as jest.Mocked<typeof applicationRepository>;
const mockedNotifRepo = notificationRepository as jest.Mocked<typeof notificationRepository>;
const mockedOffreRepo = offreRepository as jest.Mocked<typeof offreRepository>;
const mockedResolveEtabId = resolveActiveEtablissementId as jest.Mock;

// Fabrique une "application" minimale mais complète pour toCandidatureOutput,
// afin de ne pas répéter tous les champs dans chaque test.
function makeApp(overrides: Record<string, any> = {}) {
  return {
    id: 1,
    status: 'SENT',
    isRead: false,
    isFavorite: false,
    offreId: 10,
    offre: { title: 'Développeur' },
    appliedAt: new Date('2024-01-01T00:00:00.000Z'),
    recruiterNotes: null,
    matchScore: null,
    user: {
      firstName: 'Awa',
      lastName: 'Koné',
      avatar: null,
      candidatProfil: null,
    },
    ...overrides,
  };
}

describe('candidaturesService.list', () => {
  beforeEach(() => jest.resetAllMocks());

  it("délègue la résolution de l'établissement actif à resolveActiveEtablissementId (empêche l'accès à un établissement arbitraire)", async () => {
    mockedResolveEtabId.mockResolvedValue(5);
    mockedAppRepo.findManyForEtablissement.mockResolvedValue([]);
    mockedOffreRepo.findTitlesForEtablissement.mockResolvedValue([]);

    await candidaturesService.list(1, 999, undefined);

    expect(mockedResolveEtabId).toHaveBeenCalledWith(1, 999);
    expect(mockedAppRepo.findManyForEtablissement).toHaveBeenCalledWith(5, undefined);
    expect(mockedOffreRepo.findTitlesForEtablissement).toHaveBeenCalledWith(5);
  });

  it('calcule correctement chaque compteur de stats (new / in_progress / interview / favorite / refused)', async () => {
    mockedResolveEtabId.mockResolvedValue(5);
    mockedOffreRepo.findTitlesForEtablissement.mockResolvedValue([{ id: 10, title: 'Développeur' }]);
    mockedAppRepo.findManyForEtablissement.mockResolvedValue([
      makeApp({ id: 1, status: 'SENT', isRead: false, isFavorite: false }), // -> new
      makeApp({ id: 2, status: 'SENT', isRead: true, isFavorite: true }), // -> in_progress + favorite
      makeApp({ id: 3, status: 'INTERVIEW', isRead: true }), // -> interview
      makeApp({ id: 4, status: 'REFUSED', isRead: true }), // -> refused
    ] as any);

    const result = await candidaturesService.list(1);

    expect(result.stats).toEqual({
      new: 1,
      in_progress: 1,
      interview: 1,
      favorite: 1,
      refused: 1,
    });
  });

  it("mappe le statut base de données vers le statut front (SENT + isRead=false -> 'new', SENT + isRead=true -> 'in_progress')", async () => {
    mockedResolveEtabId.mockResolvedValue(5);
    mockedOffreRepo.findTitlesForEtablissement.mockResolvedValue([]);
    mockedAppRepo.findManyForEtablissement.mockResolvedValue([
      makeApp({ id: 1, status: 'SENT', isRead: false }),
      makeApp({ id: 2, status: 'SENT', isRead: true }),
    ] as any);

    const result = await candidaturesService.list(1);

    expect(result.candidatures[0].status).toBe('new');
    expect(result.candidatures[1].status).toBe('in_progress');
  });
});

describe('candidaturesService.updateStatus', () => {
  beforeEach(() => jest.resetAllMocks());

  it("lève NotFoundError si la candidature n'existe pas", async () => {
    mockedAppRepo.findById.mockResolvedValue(null as any);

    await expect(candidaturesService.updateStatus(1, { status: 'interview' })).rejects.toBeInstanceOf(NotFoundError);
    expect(mockedAppRepo.updateStatusWithTimeline).not.toHaveBeenCalled();
  });

  it('ajoute une entrée à la timeline existante sans écraser les entrées précédentes', async () => {
    mockedAppRepo.findById.mockResolvedValue({
      id: 10,
      timeline: [{ status: 'new', date: '2024-01-01T00:00:00.000Z' }],
    } as any);
    mockedAppRepo.updateStatusWithTimeline.mockResolvedValue({
      id: 10, status: 'INTERVIEW', isRead: true, offreId: 99, userId: 7,
    } as any);
    mockedOffreRepo.findWithEtablissementNameById.mockResolvedValue({
      title: 'Dev', etablissement: { name: 'Acme' },
    } as any);

    await candidaturesService.updateStatus(10, { status: 'interview' });

    const [id, dbStatus, timelineArg] = mockedAppRepo.updateStatusWithTimeline.mock.calls[0];
    expect(id).toBe(10);
    expect(dbStatus).toBe('INTERVIEW');
    expect(timelineArg).toHaveLength(2);
    expect((timelineArg as any[])[0]).toEqual({ status: 'new', date: '2024-01-01T00:00:00.000Z' });
    expect((timelineArg as any[])[1]).toMatchObject({ status: 'interview' });
  });

  it("notifie le candidat quand le statut passe à 'interview' (avec le bon contenu de notification)", async () => {
    mockedAppRepo.findById.mockResolvedValue({ id: 10, timeline: [] } as any);
    mockedAppRepo.updateStatusWithTimeline.mockResolvedValue({
      id: 10, status: 'INTERVIEW', isRead: true, offreId: 99, userId: 7,
    } as any);
    mockedOffreRepo.findWithEtablissementNameById.mockResolvedValue({
      title: 'Dev', etablissement: { name: 'Acme' },
    } as any);

    await candidaturesService.updateStatus(10, { status: 'interview' });

    expect(mockedOffreRepo.findWithEtablissementNameById).toHaveBeenCalledWith(99);
    expect(mockedNotifRepo.create).toHaveBeenCalledWith({
      userId: 7,
      type: 'APPLICATION_ACCEPTED',
      title: 'Votre candidature progresse',
      description: 'Acme vous invite à un entretien pour Dev',
      relatedId: '10',
    });
  });

  it("n'envoie AUCUNE notification quand le statut passe à 'new' ou 'in_progress' (pas de notifType)", async () => {
    mockedAppRepo.findById.mockResolvedValue({ id: 20, timeline: [] } as any);
    mockedAppRepo.updateStatusWithTimeline.mockResolvedValue({
      id: 20, status: 'SENT', isRead: false, offreId: 1, userId: 2,
    } as any);

    const result = await candidaturesService.updateStatus(20, { status: 'new' });

    expect(mockedOffreRepo.findWithEtablissementNameById).not.toHaveBeenCalled();
    expect(mockedNotifRepo.create).not.toHaveBeenCalled();
    expect(result.status).toBe('new');
  });
});

describe('candidaturesService.markRead', () => {
  beforeEach(() => jest.resetAllMocks());

  it('crée une notification "profil consulté" pour le candidat', async () => {
    mockedAppRepo.markRead.mockResolvedValue({ id: 5, userId: 3 } as any);
    mockedNotifRepo.create.mockResolvedValue({} as any);

    await candidaturesService.markRead(5);

    expect(mockedNotifRepo.create).toHaveBeenCalledWith({
      userId: 3,
      type: 'PROFILE_VIEWED',
      title: 'Profil consulté',
      description: 'Un recruteur a consulté votre candidature',
      relatedId: '5',
    });
  });

  it("ne fait PAS échouer markRead si la création de notification échoue (non-bloquant)", async () => {
    mockedAppRepo.markRead.mockResolvedValue({ id: 5, userId: 3 } as any);
    mockedNotifRepo.create.mockRejectedValue(new Error('service notif indisponible'));

    await expect(candidaturesService.markRead(5)).resolves.toBeUndefined();
  });
});

describe('candidaturesService.toggleFavorite / toggleStar', () => {
  beforeEach(() => jest.resetAllMocks());

  it('toggleFavorite transmet input.isFavorite au repository', async () => {
    await candidaturesService.toggleFavorite(7, { isFavorite: true });
    expect(mockedAppRepo.toggleFavorite).toHaveBeenCalledWith(7, true);
  });

  it("toggleStar transmet input.starred (et pas input.isFavorite) au MÊME repository que toggleFavorite", async () => {
    await candidaturesService.toggleStar(7, { starred: true });
    expect(mockedAppRepo.toggleFavorite).toHaveBeenCalledWith(7, true);
  });
});

describe('candidaturesService.saveNotes', () => {
  beforeEach(() => jest.resetAllMocks());

  it('transmet les notes telles quelles au repository', async () => {
    await candidaturesService.saveNotes(3, { notes: 'Bon profil, à recontacter' });
    expect(mockedAppRepo.saveNotes).toHaveBeenCalledWith(3, 'Bon profil, à recontacter');
  });
});

describe('candidaturesService.sendMessage', () => {
  beforeEach(() => jest.resetAllMocks());

  it("lève NotFoundError si la candidature n'existe pas", async () => {
    mockedAppRepo.findByIdWithMessageContext.mockResolvedValue(null as any);

    await expect(
      candidaturesService.sendMessage(1, { subject: 'Bonjour', body: 'Message' }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(mockedNotifRepo.create).not.toHaveBeenCalled();
  });

  it('tronque le corps du message à 200 caractères dans la description de la notification', async () => {
    mockedAppRepo.findByIdWithMessageContext.mockResolvedValue({ id: 8, userId: 4 } as any);
    const longBody = 'x'.repeat(250);

    await candidaturesService.sendMessage(8, { subject: 'Bonjour', body: longBody });

    expect(mockedNotifRepo.create).toHaveBeenCalledWith({
      userId: 4,
      type: 'APPLICATION_ACCEPTED',
      title: 'Bonjour',
      description: 'x'.repeat(200),
      relatedId: '8',
    });
  });
});