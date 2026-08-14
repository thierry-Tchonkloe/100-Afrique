'use client';
// src/app/(emploi)/emploi/entreprises/[id]/page.tsx

import { use, useState } from 'react';
import Link from 'next/link';
import { Building2, WifiOff } from 'lucide-react';
import { useCompanyDetail } from '@/hooks/useCompanyDetail';
import CompanyHero from '@/components/emploi/entreprise-detail/CompanyHero';
import CompanyKpiBar from '@/components/emploi/entreprise-detail/CompanyKpiBar';
import CompanySidebar from '@/components/emploi/entreprise-detail/CompanySidebar';
import PresentationTab from '@/components/emploi/entreprise-detail/PresentationTab';
import VieTab from '@/components/emploi/entreprise-detail/VieTab';
import OffresTab from '@/components/emploi/entreprise-detail/OffresTab';

// FIX Next.js 15 : `params` est une Promise même dans un Client Component,
// on la déballe avec React.use() avant de lire `.id`.
export default function VitrineEntreprisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, state } = useCompanyDetail(id);
  const [tab, setTab] = useState<'presentation' | 'vie' | 'offres'>('presentation');

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (state === 'network_error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <WifiOff size={24} className="text-red-400" />
          </div>
          <p className="font-semibold text-gray-700">Impossible de contacter le serveur</p>
          <p className="text-sm text-gray-400 mt-1">
            Vérifiez que l'API est démarrée et accessible depuis ce navigateur
            (problème réseau ou de configuration CORS).
          </p>
          <Link href="/emploi/entreprises" className="mt-4 inline-block text-sm text-[#E8622A] font-semibold hover:underline">
            ← Voir toutes les entreprises
          </Link>
        </div>
      </div>
    );
  }

  if (state === 'not_found' || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} className="text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700">Entreprise introuvable</p>
          <Link href="/emploi/entreprises" className="mt-4 inline-block text-sm text-[#E8622A] font-semibold hover:underline">
            ← Voir toutes les entreprises
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <CompanyHero data={data} />
      <CompanyKpiBar kpis={data.kpis} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-7">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
              <div className="flex">
                {([
                  { key: 'presentation', label: 'Présentation' },
                  { key: 'vie', label: 'Vie au Travail' },
                  { key: 'offres', label: `Offres (${data.offresCount})` },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex-1 py-3.5 text-sm font-semibold border-b-2 transition-all ${
                      tab === key ? 'border-[#E8622A] text-[#E8622A] bg-orange-50/40' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {tab === 'presentation' && <PresentationTab data={data} />}
            {tab === 'vie' && <VieTab data={data} />}
            {tab === 'offres' && <OffresTab data={data} />}
          </div>

          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <CompanySidebar data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
