// src/components/emploi/NotificationItem.tsx
import type { CandidatNotification, NotificationType } from '@/types/candidatures.types';
import { Bell, Eye, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

const TYPE_CONFIG: Record<NotificationType, { icon: typeof Bell; bg: string; color: string }> = {
  new_offer:            { icon: Bell,        bg: 'bg-[#FFF3EC]', color: 'text-[#E8622A]' },
  profile_viewed:       { icon: Eye,         bg: 'bg-blue-50',   color: 'text-blue-500' },
  application_accepted: { icon: CheckCircle, bg: 'bg-green-50',  color: 'text-green-500' },
  application_refused:  { icon: XCircle,     bg: 'bg-red-50',    color: 'text-red-500' },
};

interface NotificationItemProps {
  notification: CandidatNotification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.new_offer;
  const Icon = config.icon;

  return (
    <div className={clsx(
      'flex items-start gap-3 px-3 py-3 rounded-xl border',
      !notification.read ? 'border-gray-200 bg-white' : 'border-transparent bg-gray-50'
    )}>
      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon size={14} className={config.color} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-800 leading-tight">{notification.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{notification.description}</p>
      </div>
    </div>
  );
}