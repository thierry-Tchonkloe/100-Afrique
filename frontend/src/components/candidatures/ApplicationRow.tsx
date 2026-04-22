// src/components/candidatures/ApplicationRow.tsx
'use client';

import { ExternalLink } from 'lucide-react';
import type { Application } from '../../types/candidatures.types';
import StatusBadge from '../emploi/StatusBadge';
import SectorIcon from '../emploi/SectorIcon';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface ApplicationRowProps {
  application: Application;
  onClick: () => void;
}

export default function ApplicationRow({ application: app, onClick }: ApplicationRowProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors cursor-pointer
                 border-b border-gray-50 last:border-0 group"
    >
      <SectorIcon sector={app.sector} />

      {/* Job info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{app.jobTitle}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          Chez {app.companyName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Postulé le {formatDate(app.appliedAt)}
        </p>
      </div>

      {/* Status + action */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <StatusBadge status={app.status} />
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="text-xs font-semibold text-[#E8622A] hover:underline flex items-center gap-1
                     opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Voir le détail <ExternalLink size={11} />
        </button>
      </div>
    </div>
  );
}