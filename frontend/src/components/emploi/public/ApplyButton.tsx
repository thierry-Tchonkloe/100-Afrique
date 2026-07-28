// src/components/emploi/public/ApplyButton.tsx
//
// AVANT : trois composants presque identiques (InlineApplyButton dans
// jobs/page.tsx, InlineApplyButton dans conseils/page.tsx, ApplyButton
// dans jobs/[id]/page.tsx) réimplémentaient chacun la logique d'auth +
// de candidature, avec le même bug de faux succès sur erreur non-409
// (voir hooks/useJobApply.ts). Un seul composant ici, avec une prop
// `variant` pour couvrir les deux tailles visuelles utilisées
// (`pill` = compact inline dans une carte, `full` = bouton pleine largeur
// avec texte explicatif sur la page de détail).

'use client';

import { useRouter } from 'next/navigation';
import { Loader2, LogIn, Lock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useJobApply } from '@/hooks/useJobApply';

interface ApplyButtonProps {
  jobId: string;
  variant?: 'pill' | 'full';
  /** Affiché sous le bouton en variant="full" une fois candidat connecté. */
  helperText?: string;
}

export default function ApplyButton({ jobId, variant = 'pill', helperText }: ApplyButtonProps) {
  const router = useRouter();
  const { user, hydrated, isCandidat, isRecruiter } = useAuthUser();
  const { status, errorMessage, apply } = useJobApply(jobId);

  const isFull = variant === 'full';
  const baseCls = isFull
    ? 'w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm transition-all'
    : 'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors';

  // Avant hydratation (évite un mismatch SSR — on ne sait pas encore qui est connecté)
  if (!hydrated) {
    return (
      <button disabled className={`${baseCls} bg-[#E8622A]/60 text-white cursor-wait`}>
        <Loader2 size={isFull ? 15 : 12} className="animate-spin" /> {isFull ? 'Chargement...' : '...'}
      </button>
    );
  }

  // Non connecté → redirige vers /auth avec retour sur cette offre
  if (!isCandidat && !isRecruiter) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/auth?redirect=${encodeURIComponent(`/emploi/jobs/${jobId}`)}`);
        }}
        className={`${baseCls} bg-[#E8622A] hover:bg-[#d4561f] text-white`}
        title="Connexion requise"
      >
        <LogIn size={isFull ? 15 : 12} /> {isFull ? 'Connexion pour postuler' : 'Postuler'}
      </button>
    );
  }

  // Recruteur connecté → ce bouton ne le concerne pas
  if (isRecruiter) {
    return (
      <button disabled className={`${baseCls} bg-gray-100 text-gray-400 cursor-not-allowed`} title="Réservé aux candidats">
        <Lock size={isFull ? 15 : 12} /> {isFull ? 'Réservé aux candidats' : 'Postuler'}
      </button>
    );
  }

  // Candidature réussie
  if (status === 'applied') {
    return (
      <span className={`${baseCls} bg-green-50 text-green-600 border border-green-100`}>
        <CheckCircle2 size={isFull ? 15 : 12} /> {isFull ? 'Candidature envoyée !' : 'Envoyée'}
      </span>
    );
  }

  // Échec (409 "déjà postulé" ou toute autre erreur backend) — jamais de faux succès
  if (status === 'error') {
    return (
      <span
        className={`${baseCls} bg-amber-50 text-amber-600 border border-amber-100`}
        title={errorMessage ?? undefined}
      >
        <AlertCircle size={isFull ? 15 : 12} /> {isFull ? errorMessage : 'Échec'}
      </span>
    );
  }

  // Candidat connecté, prêt à postuler
  return (
    <div className={isFull ? 'w-full' : undefined}>
      <button
        onClick={(e) => { e.stopPropagation(); apply(); }}
        disabled={status === 'applying'}
        className={`${baseCls} bg-[#E8622A] hover:bg-[#d4561f] disabled:opacity-60 text-white ${isFull ? 'shadow-lg shadow-[#E8622A]/20' : ''}`}
      >
        {status === 'applying' ? (
          <><Loader2 size={isFull ? 15 : 12} className="animate-spin" /> {isFull ? 'Envoi en cours...' : 'Envoi...'}</>
        ) : (
          <><Send size={isFull ? 15 : 12} /> {isFull ? 'Postuler maintenant' : 'Postuler'}</>
        )}
      </button>
      {isFull && helperText && (
        <p className="text-center text-xs text-gray-400 mt-2">
          {user ? `Bonjour ${user.firstName} · ${helperText}` : helperText}
        </p>
      )}
    </div>
  );
}