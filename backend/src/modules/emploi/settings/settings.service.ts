// src/services/emploi/settings.service.ts
import bcrypt from 'bcrypt';
import { emploiUserRepository } from '../repositories/emploiUser.repository';
import { settingsRepository } from './settings.repository';
import { candidatProfilRepository } from '../candidat-profil/candidatProfil.repository';
import { alerteJobRepository } from '../alertes/alerteJob.repository';
import { notificationRepository } from '../notifications/notification.repository';
import { applicationRepository } from '../candidatures/application.repository';
import { ConflictError, UnauthorizedError } from '../../../errors/http-errors';
import type {
  DeleteAccountInput, UpdateEmailInput, UpdateNotificationsInput,
  UpdatePrivacyInput, UpdateTwoFactorInput,
} from './settings.types';

export const settingsService = {
  async getSettings(userId: number) {
    const [account, settings, recentApps] = await Promise.all([
      emploiUserRepository.findByIdSafe(userId),
      settingsRepository.findByUserId(userId),
      applicationRepository.findRecentReadForUser(userId, 3),
    ]);

    return {
      account: { email: account?.email ?? '', twoFactorEnabled: settings?.twoFactorEnabled ?? false },
      privacy: {
        profileVisible: settings?.profileVisible ?? true,
        hideLastName: settings?.hideLastName ?? false,
        hidePhoto: settings?.hidePhoto ?? false,
        hideContactInfo: settings?.hideContactInfo ?? false,
      },
      recentAccess: recentApps.map((a) => ({
        id: `ra-${a.id}`,
        companyName: a.etablissement.name,
        accessedAt: a.updatedAt.toISOString(),
      })),
      notifications: {
        newsletter: settings?.newsletter ?? true,
        serviceAlerts: settings?.serviceAlerts ?? true,
      },
      socials: {
        linkedinConnected: settings?.linkedinConnected ?? false,
        linkedinEmail: settings?.linkedinEmail ?? undefined,
      },
    };
  },

  async updateEmail(userId: number, input: UpdateEmailInput): Promise<void> {
    const user = await emploiUserRepository.findByIdWithPassword(userId);
    if (!user || !(await bcrypt.compare(input.currentPassword, user.password))) {
      throw new UnauthorizedError('Mot de passe incorrect');
    }
    const exists = await emploiUserRepository.findByEmail(input.email);
    if (exists && exists.id !== userId) {
      throw new ConflictError('Cet email est déjà utilisé');
    }
    await emploiUserRepository.updateEmail(userId, input.email);
  },

  async updatePrivacy(userId: number, input: UpdatePrivacyInput): Promise<void> {
    await settingsRepository.upsert(userId, input, input);
    if (input.profileVisible !== undefined) {
      await candidatProfilRepository.setAllVisibility(userId, input.profileVisible);
    }
  },

  async updateNotifications(userId: number, input: UpdateNotificationsInput): Promise<void> {
    await settingsRepository.upsert(
      userId,
      { ...(input.newsletter !== undefined && { newsletter: input.newsletter }) },
      { newsletter: input.newsletter },
    );
  },

  async updateTwoFactor(userId: number, input: UpdateTwoFactorInput): Promise<void> {
    await settingsRepository.upsert(userId, { twoFactorEnabled: input.enabled }, { twoFactorEnabled: input.enabled });
  },

  getLinkedInAuthUrl(userId: number): string {
    return `https://www.linkedin.com/oauth/authorize?state=${userId}`;
  },

  async pauseAccount(userId: number): Promise<void> {
    await candidatProfilRepository.setAllVisibility(userId, false);
  },

  async exportData(userId: number) {
    const [user, profil, apps, alertes, notifs] = await Promise.all([
      emploiUserRepository.findForExport(userId),
      candidatProfilRepository.findByUserIdWithRelations(userId),
      applicationRepository.findAllRawForUser(userId),
      alerteJobRepository.findManyForUser(userId),
      notificationRepository.findManyForUser(userId, 1000),
    ]);
    return { exportedAt: new Date().toISOString(), user, profil, applications: apps, alertes, notifications: notifs };
  },

  async deleteAccount(userId: number, input: DeleteAccountInput): Promise<void> {
    const user = await emploiUserRepository.findByIdWithPassword(userId);
    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new UnauthorizedError('Mot de passe incorrect');
    }
    await emploiUserRepository.delete(userId); // cascade delete côté DB
  },
};