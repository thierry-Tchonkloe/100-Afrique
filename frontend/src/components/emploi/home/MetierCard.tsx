'use client';
// src/components/emploi/home/MetierCard.tsx
import { useRouter } from 'next/navigation';
import type { METIERS } from '@/data/metiersHomeConfig';

export default function MetierCard({ metier }: { metier: (typeof METIERS)[number] }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/emploi/metiers/${metier.sector}`)}
      className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100
                 hover:border-[#E8622A]/40 hover:shadow-md transition-all duration-200 group cursor-pointer"
      aria-label={`Voir les offres ${metier.label}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${metier.color} group-hover:scale-110 transition-transform duration-200`}>
        {metier.icon}
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-700 leading-tight">{metier.label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 leading-tight hidden sm:block">{metier.description}</p>
      </div>
    </button>
  );
}
