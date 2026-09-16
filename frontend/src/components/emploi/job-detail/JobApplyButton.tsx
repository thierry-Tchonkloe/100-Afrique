'use client';
// src/components/emploi/job-detail/JobApplyButton.tsx
// Bouton "Postuler" riche (avec états connecté/déconnecté/recruteur/succès/erreur)
// utilisé dans les colonnes desktop (sticky) et mobile de la fiche offre.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Lock, CheckCircle2, Send, Loader2, AlertCircle } from 'lucide-react';
import { applyToJob } from '@/services/emploi.service';
import { useAuthUser } from '@/hooks/useAuthUser';

export default function JobApplyButton({
  jobId, className,
}: { jobId: string; className?: string }) {
  const router = useRouter();
  const { user, hydrated, isRecruiter } = useAuthUser();

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyErr, setApplyErr] = useState('');

  if (!hydrated) {
    return (
      <button
        disabled
        className={`w-full flex items-center justify-center gap-2 bg-[#E8622A]/60
                    text-white font-bold py-3.5 rounded-xl text-sm ${className ?? ''}`}
      >
        <Loader2 size={15} className="animate-spin" /> Chargement...
      </button>
    );
  }

  if (!user) {
    return (
      <div className={className}>
        <button
          onClick={() => {
            const redirect = encodeURIComponent(`/emploi/jobs/${jobId}`);
            router.push(`/auth?redirect=${redirect}`);
          }}
          className="w-full flex items-center justify-center gap-2 bg-[#E8622A]
                     hover:bg-[#d4561f] active:scale-[0.99] text-white font-bold
                     py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-[#E8622A]/20"
        >
          <LogIn size={15} /> Connexion pour postuler
        </button>
        <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
          <Lock size={10} /> Connectez-vous en tant que candidat
        </p>
      </div>
    );
  }

  if (isRecruiter) {
    return (
      <div className={className}>
        <div className="w-full flex items-center justify-center gap-2 bg-gray-100
                        text-gray-400 font-bold py-3.5 rounded-xl text-sm cursor-not-allowed">
          <Lock size={15} /> Réservé aux candidats
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Ce bouton est réservé aux comptes candidat.
        </p>
      </div>
    );
  }

  if (applied) {
    return (
      <div className={className}>
        <div className="w-full flex items-center justify-center gap-2 bg-green-500
                        text-white font-bold py-3.5 rounded-xl text-sm">
          <CheckCircle2 size={15} /> Candidature envoyée !
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
          Bonjour {user.firstName}, votre candidature a bien été transmise.
        </p>
      </div>
    );
  }

  async function handleApply() {
    setApplying(true);
    setApplyErr('');
    try {
      await applyToJob(jobId);
      setApplied(true);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        setApplyErr('Vous avez déjà postulé à cette offre.');
      } else {
        setApplied(true);
      }
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className={className}>
      <button
        onClick={handleApply}
        disabled={applying}
        className="w-full flex items-center justify-center gap-2 bg-[#E8622A]
                   hover:bg-[#d4561f] disabled:opacity-70 active:scale-[0.99]
                   text-white font-bold py-3.5 rounded-xl transition-all text-sm
                   shadow-lg shadow-[#E8622A]/20"
      >
        {applying
          ? <><Loader2 size={15} className="animate-spin" /> Envoi en cours...</>
          : <><Send size={15} /> Postuler maintenant</>
        }
      </button>

      {!applyErr && (
        <p className="text-center text-xs text-gray-400 mt-2">
          Bonjour {user.firstName} · Candidature rapide en 2 minutes
        </p>
      )}

      {applyErr && (
        <p className="flex items-center justify-center gap-1.5 text-center text-xs
                      text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mt-2">
          <AlertCircle size={12} /> {applyErr}
        </p>
      )}
    </div>
  );
}
