// src/hooks/useJobApply.ts
'use client';

import { useState } from 'react';
import { applyToJob } from '@/services/emploi.service';
import { toApiError } from '@/lib/api-error';

export type JobApplyStatus = 'idle' | 'applying' | 'applied' | 'error';

interface UseJobApplyReturn {
  status: JobApplyStatus;
  /** Message d'erreur lisible (ex: "Vous avez déjà postulé à cette offre"). */
  errorMessage: string | null;
  apply: () => Promise<void>;
}

export function useJobApply(jobId: string): UseJobApplyReturn {
  const [status, setStatus] = useState<JobApplyStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function apply() {
    setStatus('applying');
    setErrorMessage(null);
    try {
      await applyToJob(jobId);
      setStatus('applied');
    } catch (err) {
      // FIX : plus de `setApplied(true)` de secours ici. Le statut reflète
      // toujours la réalité — "Déjà postulé" (409) et "Erreur serveur"
      // affichent tous les deux un message, jamais une fausse coche verte.
      const apiError = toApiError(err);
      setStatus('error');
      setErrorMessage(apiError.message);
    }
  }

  return { status, errorMessage, apply };
}