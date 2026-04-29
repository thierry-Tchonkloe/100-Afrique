// src/components/recruteur/offres/OffreCard.tsx
'use client';

import Link from 'next/link';
import { MapPin, Pencil, Eye, Pause, Trash2, Copy, Calendar, Star } from 'lucide-react';
import type { Offre } from '@/types/offres.types';
import clsx from 'clsx';

// ── Status border color ───────────────────────────────────────────────────────
const STATUS_BORDER: Record<string, string> = {
  active:   'border-l-green-400',
  paused:   'border-l-gray-300',
  draft:    'border-l-gray-300',
  archived: 'border-l-gray-200',
};

// ── Contract type badge ───────────────────────────────────────────────────────
const CONTRACT_COLORS: Record<string, string> = {
  CDI:             'text-blue-600',
  CDD:             'text-purple-600',
  Saisonnier:      'text-green-600',
  Stage:           'text-teal-600',
  Alternance:      'text-indigo-600',
  'CDD Saisonnier': 'text-orange-600',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `Publié il y a ${Math.floor((Date.now() - d.getTime()) / 86400000)} jours`;
}

function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface OffreCardProps {
  offre: Offre;
  onEdit: (id: string) => void;
  onPause: (id: string) => void;
  onArchive: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export default function OffreCard({
  offre, onEdit, onPause, onArchive, onDuplicate,
}: OffreCardProps) {
  const contractColor = CONTRACT_COLORS[offre.contractType] ?? 'text-gray-600';
  const expires       = daysUntil(offre.expiresAt);

  return (
    <div className={clsx(
      'bg-white rounded-2xl border-l-4 border border-gray-100 shadow-sm',
      'hover:shadow-md transition-shadow',
      STATUS_BORDER[offre.status] ?? 'border-l-gray-200'
    )}>
      <div className="flex items-center gap-4 px-5 py-4">

        {/* Left: info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 text-sm">{offre.title}</h3>
            {offre.isPremium && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50
                               border border-amber-200 px-2 py-0.5 rounded-full">
                <Star size={9} fill="currentColor" /> Premium
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
            <span className={`font-semibold ${contractColor}`}>{offre.contractType}</span>
            <span className="flex items-center gap-1 text-gray-400">
              <MapPin size={11} /> {offre.location}
            </span>
            <span className="text-gray-400">
              {offre.status === 'draft' ? 'Brouillon créé' : formatDate(offre.publishedAt)}
            </span>
          </div>

          {offre.status === 'active' && (
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
              <Calendar size={10} />
              Expire dans {expires} jour{expires > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Center: stats — hidden for drafts */}
        {offre.status !== 'draft' && (
          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">{offre.views.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Vues</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <p className="text-lg font-bold text-[#E8622A]">{offre.candidatesCount}</p>
                {offre.newCandidatesCount > 0 && (
                  <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold
                                   rounded-full flex items-center justify-center">
                    {offre.newCandidatesCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">Candidats</p>
            </div>
          </div>
        )}

        {/* Right: actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onEdit(offre.id)} title="Modifier"
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
            <Pencil size={15} />
          </button>
          <Link href={`/emploi/jobs/${offre.id}`} title="Voir l'offre" target="_blank"
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
            <Eye size={15} />
          </Link>
          {offre.status === 'active' && (
            <button onClick={() => onPause(offre.id)} title="Mettre en pause"
              className="p-2 rounded-xl hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition">
              <Pause size={15} />
            </button>
          )}
          <button onClick={() => onDuplicate(offre.id)} title="Dupliquer"
            className="p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition">
            <Copy size={15} />
          </button>
          <button onClick={() => onArchive(offre.id)} title="Archiver"
            className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}