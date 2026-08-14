'use client';
// src/components/emploi/metiers/SectorAlertCtaButton.tsx
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuthUser } from '@/hooks/useAuthUser';

export default function SectorAlertCtaButton({ sectorColorHex }: { sectorColorHex: string }) {
  const router = useRouter();
  const { hydrated, isCandidat, isRecruiter } = useAuthUser();

  if (!hydrated) {
    return (
      <button disabled className="flex items-center justify-center gap-1.5 w-full bg-white/60 text-sm font-bold
                                   py-2.5 rounded-xl cursor-wait" style={{ color: sectorColorHex }}>
        <Loader2 size={14} className="animate-spin" /> Chargement...
      </button>
    );
  }

  if (isCandidat) {
    return (
      <button
        onClick={() => router.push('/candidat/alertes')}
        className="flex items-center justify-center gap-1.5 w-full bg-white text-sm font-bold
                   py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        style={{ color: sectorColorHex }}
      >
        Gérer mes alertes <ArrowRight size={13} />
      </button>
    );
  }

  if (isRecruiter) {
    return (
      <div
        className="flex items-center justify-center gap-1.5 w-full bg-white/60 text-sm font-bold
                   py-2.5 rounded-xl cursor-not-allowed opacity-70"
        style={{ color: sectorColorHex }}
        title="Réservé aux candidats"
      >
        Réservé aux candidats
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/auth?redirect=/candidat/alertes')}
      className="flex items-center justify-center gap-1.5 w-full bg-white text-sm font-bold
                 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
      style={{ color: sectorColorHex }}
    >
      Créer une alerte <ArrowRight size={13} />
    </button>
  );
}
