'use client';
// src/components/emploi/entreprise-detail/CompanyHero.tsx
import { useState } from 'react';
import { Hotel, Building2, MapPin, Heart } from 'lucide-react';
import { sectorLabel } from '@/lib/sectors';
import type { PublicCompanyDetail } from '@/services/emploi-public.service';

export default function CompanyHero({ data }: { data: PublicCompanyDetail }) {
  const [followed, setFollowed] = useState(false);
  const banner = data.vitrine?.bannerUrl;
  const logo = data.logo ?? data.vitrine?.logoUrl;
  const sectorText = data.sector ? sectorLabel(data.sector) : '';

  return (
    <div className="relative h-56 md:h-64 overflow-hidden bg-[#1E2A3A]">
      {banner ? (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Hotel size={120} className="text-white" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 flex items-end gap-4">
        <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center
                        flex-shrink-0 border-2 border-white overflow-hidden">
          {logo
            ? <img src={logo} alt={data.name} className="w-full h-full object-contain p-1" />
            : <Building2 size={22} className="text-[#E8622A]" />}
        </div>

        <div className="flex-1 min-w-0 pb-1">
          <h1 className="text-xl font-extrabold text-white leading-tight">{data.name}</h1>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {sectorText && (
              <span className="text-xs text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                {sectorText}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-white/70">
              <MapPin size={11} /> {data.city || 'Localisation non renseignée'}
            </span>
            <button
              onClick={() => setFollowed((v) => !v)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition ${
                followed ? 'bg-[#E8622A] border-[#E8622A] text-white' : 'border-white/50 text-white hover:bg-white/10'
              }`}
            >
              <Heart size={10} className={followed ? 'fill-white' : ''} />
              {followed ? 'Suivi' : 'Suivre'}
            </button>
          </div>
          {data.vitrine?.slogan && (
            <p className="text-white/70 text-xs mt-1.5 italic">{data.vitrine.slogan}</p>
          )}
        </div>
      </div>
    </div>
  );
}
