// src/components/candidat/dashboard/SuggestionsSection.tsx
'use client';

import { useState } from 'react';
import JobSuggestionCard from './JobSuggestionCard';
import { applyToJob } from '@/services/emploi.service';
import { toApiError } from '@/lib/api-error';
import type { JobSuggestion } from '@/types/emploi.types';

type ApplyStatus = 'idle' | 'applying' | 'applied' | 'error';

interface SuggestionsSectionProps {
  suggestions: JobSuggestion[];
  sector?: string;
}

export default function SuggestionsSection({ suggestions, sector }: SuggestionsSectionProps) {
  const [statuses, setStatuses] = useState<Record<string, ApplyStatus>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleApply(jobId: string) {
    setStatuses((s) => ({ ...s, [jobId]: 'applying' }));
    setErrors((e) => ({ ...e, [jobId]: '' }));
    try {
      await applyToJob(jobId);
      setStatuses((s) => ({ ...s, [jobId]: 'applied' }));
    } catch (err) {
      // FIX : on ne masque plus l'échec derrière un "✓ Postulé" optimiste.
      // Le message vient directement du backend (ex: "Vous avez déjà
      // postulé à cette offre", ConflictError 409).
      const apiError = toApiError(err);
      setStatuses((s) => ({ ...s, [jobId]: 'error' }));
      setErrors((e) => ({ ...e, [jobId]: apiError.message }));
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <h2 className="font-semibold text-gray-800 text-sm">Suggestions pour vous</h2>
        {sector && <p className="text-xs text-gray-400 mt-0.5">Basées sur votre profil {sector}</p>}
      </div>

      {suggestions.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Aucune suggestion pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-50">
          {suggestions.map((job) => (
            <JobSuggestionCard
              key={job.id}
              job={job}
              status={statuses[job.id] ?? 'idle'}
              errorMessage={errors[job.id]}
              onApply={handleApply}
            />
          ))}
        </div>
      )}
    </div>
  );
}