// src/components/alertes/AlerteCard.tsx
'use client';

import { Pencil, Trash2 } from 'lucide-react';
import type { AlerteJob } from '@/types/alertes.types';
import { FREQUENCY_LABELS, FREQUENCY_ICONS } from '@/types/alertes.types';

interface AlerteCardProps {
  alerte: AlerteJob;
  onToggle: (id: string, active: boolean) => void;
  onEdit: (alerte: AlerteJob) => void;
  onDelete: (id: string) => void;
}

function formatLastSent(iso?: string): string {
  if (!iso) return 'Jamais envoyé';
  return `Dernier envoi le ${new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })}`;
}

export default function AlerteCard({ alerte, onToggle, onEdit, onDelete }: AlerteCardProps) {
  const freqLabel = FREQUENCY_LABELS[alerte.frequency];
  const freqIcon  = FREQUENCY_ICONS[alerte.frequency];

  // All displayable tags
  const tags = [
    ...alerte.keywords,
    alerte.location && alerte.location,
    ...alerte.contractTypes,
    alerte.frequency && `${freqIcon} ${freqLabel}`,
  ].filter(Boolean) as string[];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 hover:border-gray-200 transition">
      <div className="flex items-start justify-between gap-4">
        {/* Left: title + toggle */}
        <div className="flex items-center gap-3 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm truncate">{alerte.name}</h3>

          {/* Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onToggle(alerte.id, !alerte.isActive)}
              className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                alerte.isActive ? 'bg-[#E8622A]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  alerte.isActive ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className={`text-xs font-medium ${alerte.isActive ? 'text-[#E8622A]' : 'text-gray-400'}`}>
              {alerte.isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(alerte)}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
            title="Modifier"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(alerte.id)}
            className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
            title="Supprimer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap gap-2 mt-3">
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="text-xs font-medium text-[#3B5BDB] bg-blue-50 px-2.5 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Last sent */}
      <p className="text-xs text-gray-400 mt-3">{formatLastSent(alerte.lastSentAt)}</p>
    </div>
  );
}