'use client';
// src/components/recruteur/dashboard/VitrineHealthCard.tsx
import Link from 'next/link';
import CompletionRing from '@/components/recruteur/dashboard/CompletionRing';

interface VitrineHealth {
  completionScore: number;
  views: number;
  engagementRate: number;
}

export default function VitrineHealthCard({ vitrineHealth }: { vitrineHealth: VitrineHealth }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
      <h2 className="font-semibold text-gray-800 text-sm mb-4">Santé de la Vitrine Entreprise</h2>
      <CompletionRing pct={vitrineHealth.completionScore} />
      <p className="text-xs text-gray-400 text-center mt-2 mb-5">Score de complétion</p>
      <div className="space-y-2.5 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Vues de la vitrine</span>
          <span className="text-xs font-semibold text-gray-800">{vitrineHealth.views.toLocaleString('fr-FR')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Taux d'engagement</span>
          <span className="text-xs font-semibold text-green-500">+{vitrineHealth.engagementRate}%</span>
        </div>
      </div>
      <Link href="/recruteur/vitrine" className="mt-5 w-full bg-[#E8622A] hover:bg-[#D45520] text-white text-sm font-semibold py-2.5 rounded-xl transition text-center block">
        Améliorer ma vitrine
      </Link>
    </div>
  );
}
