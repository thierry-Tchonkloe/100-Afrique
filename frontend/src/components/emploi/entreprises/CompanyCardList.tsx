'use client';
// src/components/emploi/entreprises/CompanyCardList.tsx
import Link from 'next/link';
import { Heart, MapPin, Users, Star, ArrowRight } from 'lucide-react';
import { COMPANY_ENRICHMENTS } from '@/data/companyEnrichments';
import { getSectorColor, getSectorIcon, getLogoImage } from './entrepriseCardHelpers';
import type { Company } from './types';

export default function CompanyCardList({
  company, isFav, onFav,
}: { company: Company; isFav: boolean; onFav: (id: string) => void }) {
  const sc = getSectorColor(company.sector);
  const icon = getSectorIcon(company.sector);
  const enriched = COMPANY_ENRICHMENTS[company.name];
  const logoImage = getLogoImage(company);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-gray-200
                    transition-all duration-200 overflow-hidden">
      <div className="flex gap-0">
        <div className={`w-1.5 flex-shrink-0 ${enriched?.logoColor ?? 'bg-[#E8622A]'}`} />

        <div className="flex items-center gap-4 p-4 flex-1 min-w-0">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100
                           shadow-sm overflow-hidden ${logoImage ? 'bg-white' : (enriched?.logoColor ?? 'bg-[#1E2A3A]')}`}>
            {logoImage ? (
              <img src={logoImage} alt={company.name} className="w-full h-full object-contain p-1" />
            ) : (
              <div className="text-white">{icon}</div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#1E2A3A] text-sm group-hover:text-[#E8622A] transition-colors">
                {company.name}
              </h3>
              {enriched?.isPremium && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  ⭐ Premium
                </span>
              )}
              {enriched?.isFeatured && (
                <span className="text-[10px] font-bold text-[#E8622A] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                  ⚡ Recrute
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {company.sector && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                  {company.sector}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin size={10} /> {company.city || 'Localisation non renseignée'}
              </span>
              {enriched?.employeeCount && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Users size={10} /> {enriched.employeeCount}
                </span>
              )}
              {enriched?.rating && (
                <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <Star size={10} className="text-amber-400 fill-amber-400" /> {enriched.rating}
                </span>
              )}
            </div>

            {(company.vitrine?.slogan || enriched?.description) && (
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-1">
                {company.vitrine?.slogan || enriched?.description}
              </p>
            )}

            {enriched?.tags && (
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {enriched.tags.map((t) => (
                  <span key={t} className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              {enriched?.growth && (
                <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-full">
                  {enriched.growth}
                </span>
              )}
              <span className="text-sm font-bold text-[#E8622A]">
                {company.offresCount} offre{company.offresCount > 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => onFav(company.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition">
                <Heart size={14} className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-300'} />
              </button>
              <Link href={`/emploi/entreprises/${company.id}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#E8622A]
                               border border-[#E8622A]/30 px-3 py-1.5 rounded-xl
                               hover:bg-[#E8622A] hover:text-white transition-all duration-200">
                Voir la vitrine <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
