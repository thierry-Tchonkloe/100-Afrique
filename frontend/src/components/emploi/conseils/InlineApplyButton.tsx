'use client';
// src/components/emploi/conseils/InlineApplyButton.tsx
// Version compacte (pill) du bouton "Postuler" utilisée dans le widget
// d'offres inséré au milieu des articles conseils.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { applyToJob } from '@/services/emploi.service';
import { useAuthUser } from '@/hooks/useAuthUser';

export default function InlineApplyButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { user, hydrated, isRecruiter } = useAuthUser();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [err409, setErr409] = useState(false);

  if (!hydrated) {
    return (
      <button disabled
        className="w-full flex items-center justify-center gap-1.5 bg-[#E8622A]/60
                   text-white font-semibold text-xs py-2.5 rounded-xl">
        <Loader2 size={12} className="animate-spin" />
      </button>
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push(`/auth?redirect=/emploi/jobs/${jobId}`)}
        className="w-full flex items-center justify-center gap-1.5 bg-[#E8622A]
                   hover:bg-[#d4561f] text-white font-semibold text-xs py-2.5
                   rounded-xl transition-colors"
      >
        <LogIn size={12} /> Postuler
      </button>
    );
  }

  if (isRecruiter) {
    return (
      <button disabled
        className="w-full flex items-center justify-center gap-1.5 bg-gray-100
                   text-gray-400 font-semibold text-xs py-2.5 rounded-xl cursor-not-allowed"
        title="Réservé aux candidats"
      >
        <Lock size={12} /> Postuler
      </button>
    );
  }

  if (applied) {
    return (
      <span className="w-full flex items-center justify-center gap-1.5 bg-green-50
                       text-green-600 border border-green-100 font-semibold text-xs
                       py-2.5 rounded-xl">
        <CheckCircle2 size={12} /> Envoyée
      </span>
    );
  }

  if (err409) {
    return (
      <span className="w-full flex items-center justify-center gap-1.5 bg-amber-50
                       text-amber-600 border border-amber-100 font-semibold text-xs
                       py-2.5 rounded-xl">
        <AlertCircle size={12} /> Déjà postulé
      </span>
    );
  }

  async function handleApply() {
    setApplying(true);
    try {
      await applyToJob(jobId);
      setApplied(true);
    } catch (err: any) {
      if (err?.response?.status === 409) setErr409(true);
      else setApplied(true);
    } finally {
      setApplying(false);
    }
  }

  return (
    <button
      onClick={handleApply}
      disabled={applying}
      className="w-full flex items-center justify-center gap-1.5 bg-[#E8622A]
                 hover:bg-[#d4561f] disabled:opacity-60 text-white font-semibold
                 text-xs py-2.5 rounded-xl transition-colors"
    >
      {applying ? <><Loader2 size={12} className="animate-spin" /> Envoi...</> : 'Postuler'}
    </button>
  );
}
