// src/components/emploi/home/HomeCompanyCard.tsx
import Link from 'next/link';
import { normalizeSector } from '@/lib/sectors';
import { SECTOR_BG_IMAGE, sectorIcon, sectorColorClasses } from '@/components/emploi/public/sectorVisuals';
import type { PublicEtablissement } from '@/services/emploi-public.service';

export default function HomeCompanyCard({ company }: { company: PublicEtablissement }) {
  const sectorKey = normalizeSector(company.sector);
  const bg = company.vitrine?.logoUrl ? undefined : (sectorKey ? SECTOR_BG_IMAGE[sectorKey] : undefined);

  return (
    <Link href={`/emploi/entreprises/${company.id}`} className="group relative overflow-hidden rounded-2xl aspect-[4/3] block">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 bg-gray-200"
        style={bg || company.vitrine?.bannerUrl ? { backgroundImage: `url(${company.vitrine?.bannerUrl ?? bg})` } : undefined}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${sectorColorClasses(company.sector)} shadow-lg`}>
          {company.logo
            ? <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-lg" />
            : sectorIcon(company.sector)}
        </div>
        <h3 className="text-white font-bold text-base leading-tight">{company.name}</h3>
        <p className="text-gray-300 text-xs mt-0.5">
          {company.city && <>{company.city} · </>}
          {company.offresCount} offre{company.offresCount > 1 ? 's' : ''} disponible{company.offresCount > 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  );
}
