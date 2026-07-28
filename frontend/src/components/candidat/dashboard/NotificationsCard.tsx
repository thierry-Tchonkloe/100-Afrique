// src/components/candidat/dashboard/NotificationsCard.tsx
import NotificationItem from './NotificationItem';
import type { CandidatNotification } from '@/types/emploi.types';

interface NotificationsCardProps {
  notifications: CandidatNotification[];
}

export default function NotificationsCard({ notifications }: NotificationsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-50">
        <h2 className="font-semibold text-gray-800 text-sm">Notifications</h2>
      </div>
      <div className="p-3 space-y-2">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Aucune notification.</p>
        ) : (
          notifications.map((notif) => <NotificationItem key={notif.id} notification={notif} />)
        )}
      </div>
    </div>
  );
}