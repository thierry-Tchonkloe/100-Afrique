// src/components/emploi/StatusBadge.tsx
import type { ApplicationStatus } from '../../types/candidatures.types';
import clsx from 'clsx';
import { Send, Eye, Clock, CalendarCheck, X, Star } from 'lucide-react';

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; classes: string; icon: typeof Send }
> = {
  pending:     { label: 'En attente',  classes: 'bg-gray-100 text-gray-500',           icon: Clock },
  sent:        { label: 'Envoyée',     classes: 'bg-blue-50 text-blue-600',             icon: Send },
  viewed:      { label: 'Consultée',   classes: 'bg-amber-50 text-amber-600',           icon: Eye },
  in_progress: { label: 'En cours',   classes: 'bg-orange-50 text-orange-500',         icon: Clock },
  selected:    { label: 'Sélectionnée', classes: 'bg-yellow-50 text-yellow-600',       icon: Star },
  interview:   { label: 'Entretien',  classes: 'bg-green-50 text-green-600',           icon: CalendarCheck },
  accepted:    { label: 'Acceptée',   classes: 'bg-green-50 text-green-600',           icon: CalendarCheck },
  refused:     { label: 'Refusée',    classes: 'bg-red-50 text-red-500',              icon: X },
  archived:    { label: 'Archivée',   classes: 'bg-gray-100 text-gray-500',           icon: Clock },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  showIcon?: boolean;
}

export default function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = config.icon;
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full',
      config.classes
    )}>
      {showIcon && <Icon size={11} />}
      {config.label}
    </span>
  );
}