// src/services/emploi/notifications.service.ts
import { notificationRepository } from './notification.repository';

function toOutput(n: any) {
  return {
    id: String(n.id),
    type: n.type.toLowerCase(),
    title: n.title,
    description: n.description,
    createdAt: n.createdAt.toISOString(),
    read: n.isRead,
  };
}

export const notificationsService = {
  async list(userId: number, take = 20) {
    const notifs = await notificationRepository.findManyForUser(userId, take);
    return notifs.map(toOutput);
  },

  async markRead(notificationId: number): Promise<void> {
    await notificationRepository.markRead(notificationId);
  },

  async markAllRead(userId: number): Promise<void> {
    await notificationRepository.markAllReadForUser(userId);
  },
};