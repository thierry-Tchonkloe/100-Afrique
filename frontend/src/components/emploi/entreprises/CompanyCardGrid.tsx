'use client';
// src/components/emploi/entreprises/CompanyCardGrid.tsx
import Link from 'next/link';
import { Star, Zap, Heart, MapPin, Building2, ArrowRight } from 'lucide-react';
import { COMPANY_ENRICHMENTS } from '@/data/companyEnrichments';
import { getSectorColor, getSectorIcon, getCoverImage, getLogoImage } from './entrepriseCardHelpers';
import type { Company } from './types';

export default function CompanyCardGrid({
  company, isFav, onFav,
}: { company: Company; isFav: boolean; onFav: (id: string) => void }) {
  const sc = getSectorColor(company.sector);
  const icon = getSectorIcon(company.sector);
  const enriched = COMPANY_ENRICHMENTS[company.name];

  const coverImage = getCoverImage(company);
  const logoImage = getLogoImage(company);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden
                    hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col">
      <div className="relative h-36 overflow-hidden flex-shrink-0">
        {coverImage ? (
          <img src={coverImage} alt={company.name}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className={`w-full h-full ${sc.light} flex items-center justify-center`}>
            <div className={`text-6xl opacity-10 ${sc.text}`}><Building2 size={64} /></div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          {enriched?.isPremium && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600
                             bg-amber-50/95 border border-amber-200 px-2 py-0.5 rounded-full backdrop-blur-sm">
              <Star size={9} fill="currentColor" /> Premium
            </span>
          )}
          {enriched?.isFeatured && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#E8622A]
                             bg-white/95 border border-orange-100 px-2 py-0.5 rounded-full backdrop-blur-sm">
              <Zap size={9} fill="currentColor" /> Recrute activement
            </span>
          )}
        </div>

        <button onClick={() => onFav(company.id)}
                className="absolute top-3 right-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full
                           flex items-center justify-center hover:bg-white transition shadow-sm">
          <Heart size={13} className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
        </button>

        <div className={`absolute bottom-0 left-4 translate-y-1/2 w-12 h-12 rounded-xl shadow-lg
                         flex items-center justify-center border-2 border-white overflow-hidden z-10
                         ${logoImage ? 'bg-white' : (enriched?.logoColor ?? 'bg-[#1E2A3A]')}`}>
          {logoImage ? (
            <img src={logoImage} alt={company.name} className="w-full h-full object-contain p-1" />
          ) : (
            <div className="text-white">{icon}</div>
          )}
        </div>
      </div>

      <div className="pt-8 pb-5 px-4 flex-1 flex flex-col">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-[#1E2A3A] text-sm leading-tight group-hover:text-[#E8622A] transition-colors">
                {company.name}
              </h3>
              {company.sector && (
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${sc.bg} ${sc.text}`}>
                  {company.sector}
                </span>
              )}
            </div>
            {enriched?.rating && (
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-gray-700">{enriched.rating}</span>
              </div>
            )}
          </div>

          {(company.vitrine?.slogan || enriched?.description) && (
            <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
              {company.vitrine?.slogan || enriched?.description}
            </p>
          )}
        </div>

        {enriched?.tags && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {enriched.tags.map((t) => (
              <span key={t} className="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={11} /> {company.city || 'Localisation non renseignée'}
          </div>
          <div className="flex items-center gap-2">
            {enriched?.growth && (
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                {enriched.growth}
              </span>
            )}
            <span className="text-xs font-bold text-[#E8622A]">
              {company.offresCount} offre{company.offresCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <Link href={`/emploi/entreprises/${company.id}`}
            className="mx-4 mb-4 flex items-center justify-center gap-2 text-xs font-semibold
                       text-[#E8622A] border border-[#E8622A]/30 py-2.5 rounded-xl
                       hover:bg-[#E8622A] hover:text-white transition-all duration-200 group-hover:border-[#E8622A]">
        Voir la vitrine <ArrowRight size={13} />
      </Link>
    </div>
  );
}
