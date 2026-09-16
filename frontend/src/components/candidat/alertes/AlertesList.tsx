// src/components/candidat/alertes/AlertesList.tsx
import AlerteCard from '@/components/candidat/alertes/AlerteCard';
import type { AlerteJob } from '@/types/alertes.types';

export default function AlertesList({
  alertes, onToggle, onEdit, onDelete,
}: {
  alertes: AlerteJob[];
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (a: AlerteJob) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {alertes.map((alerte) => (
        <AlerteCard
          key={alerte.id}
          alerte={alerte}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      <p className="text-xs text-gray-400 text-right pt-1">
        {alertes.length} alerte{alertes.length > 1 ? 's' : ''} configurée{alertes.length > 1 ? 's' : ''}
      </p>
    </div>
  );
}
