'use client';
// src/components/emploi/home/RecruiterCtaButton.tsx
import { useRouter } from 'next/navigation';
import { ArrowRight, LayoutDashboard, Loader2 } from 'lucide-react';
import { useAuthUser } from '@/hooks/useAuthUser';

export default function RecruiterCtaButton() {
  const router = useRouter();
  const { hydrated, isCandidat, isRecruiter } = useAuthUser();

  if (!hydrated) {
    return (
      <button disabled className="inline-flex items-center gap-2 bg-white/60 text-[#E8622A]/60 font-bold px-8 py-3.5 rounded-xl text-sm cursor-wait">
        <Loader2 size={15} className="animate-spin" /> Chargement...
      </button>
    );
  }

  if (isRecruiter) {
    return (
      <button
        onClick={() => router.push('/recruteur/vitrine')}
        className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm shadow-lg shadow-black/10"
      >
        <LayoutDashboard size={15} /> Accéder à ma vitrine <ArrowRight size={15} />
      </button>
    );
  }

  if (isCandidat) {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => router.push('/auth')}
          className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm shadow-lg shadow-black/10"
        >
          Créer un compte recruteur <ArrowRight size={15} />
        </button>
        <p className="text-white/60 text-xs">Connecté en tant que candidat · Un compte recruteur est requis</p>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/auth?redirect=/recruteur/vitrine')}
      className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm shadow-lg shadow-black/10"
    >
      Créer votre vitrine entreprise <ArrowRight size={15} />
    </button>
  );
}
