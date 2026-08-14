'use client';
// src/components/emploi/entreprise-detail/VieTab.tsx
import { useState } from 'react';
import Lightbox from './Lightbox';
import { PERK_META } from '@/data/perkMeta';
import type { PublicCompanyDetail } from '@/services/emploi-public.service';

export default function VieTab({ data }: { data: PublicCompanyDetail }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const photos = data.photos ?? [];
  const perks = data.perks ?? [];
  const hasContent = photos.length > 0 || perks.length > 0;

  if (!hasContent) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400">
        Cette entreprise n'a pas encore ajouté de photos ni d'avantages.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {photos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-4">Nos Espaces de Travail</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {photos.map((p, i) => (
              <div key={p.id} onClick={() => setLightbox(i)}
                   className="aspect-square rounded-xl overflow-hidden cursor-pointer group">
                <img src={p.url} alt={p.alt ?? ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {perks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-5">Nos Avantages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {perks.map((label) => {
              const meta = PERK_META[label] ?? { emoji: '✨', description: '' };
              return (
                <div key={label} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#E8622A]/20 transition">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{meta.emoji}</span>
                    <h3 className="font-bold text-gray-800 text-sm">{label}</h3>
                  </div>
                  {meta.description && <p className="text-xs text-gray-500 leading-relaxed">{meta.description}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {lightbox !== null && (
        <Lightbox photos={photos} initial={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
