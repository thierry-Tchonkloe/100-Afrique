// src/components/candidat/dashboard/JobSuggestionCard.tsx
import { MapPin, Clock } from 'lucide-react';
import SectorIcon from './SectorIcon';
import { timeAgo } from '@/utils/date';
import type { JobSuggestion } from '@/types/emploi.types';

interface JobSuggestionCardProps {
  job: JobSuggestion;
  status: 'idle' | 'applying' | 'applied' | 'error';
  errorMessage?: string;
  onApply: (jobId: string) => void;
}

export default function JobSuggestionCard({ job, status, errorMessage, onApply }: JobSuggestionCardProps) {
  return (
    <div className="p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <SectorIcon sector={job.sector} size={15} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-tight">{job.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{job.companyName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <MapPin size={11} /> {job.location}
        </span>
        <span className="font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
          {job.contractType}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} /> Publié {timeAgo(job.publishedAt)}
        </span>
      </div>

      <button
        onClick={() => onApply(job.id)}
        disabled={status === 'applying' || status === 'applied'}
        className="w-full bg-[#E8622A] hover:bg-[#D45520] disabled:bg-gray-200
                   disabled:text-gray-400 text-white text-sm font-semibold
                   py-2.5 rounded-xl transition-colors"
      >
        {status === 'applied' ? '✓ Postulé' : status === 'applying' ? 'Envoi…' : 'Postuler'}
      </button>

      {/* FIX : avant, un échec de candidature (déjà postulé, offre expirée...)
          était silencieusement traité comme un succès dans l'UI. On affiche
          désormais le vrai message renvoyé par le backend (ConflictError,
          NotFoundError...), sans jamais faire croire à une candidature envoyée
          qui ne l'a pas été. */}
      {status === 'error' && errorMessage && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}