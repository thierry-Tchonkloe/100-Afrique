// src/components/emploi/entreprises/entrepriseCardHelpers.tsx
import { Building2 } from 'lucide-react';
import { normalizeSector } from '@/lib/sectors';
import { SECTOR_ICONS, SECTOR_COLORS } from '@/data/entreprisesPageConfig';
import { COMPANY_ENRICHMENTS } from '@/data/companyEnrichments';

export function getSectorColor(sectorRaw: string) {
  const key = normalizeSector(sectorRaw);
  return key ? SECTOR_COLORS[key] : { bg: 'bg-gray-100', text: 'text-gray-700', light: 'bg-gray-50' };
}

export function getSectorIcon(sectorRaw: string): React.ReactNode {
  const key = normalizeSector(sectorRaw);
  return key ? SECTOR_ICONS[key] : <Building2 size={16} />;
}

export function getCoverImage(company: {
  name: string;
  vitrine?: { bannerUrl?: string | null; galleryImage?: string | null } | null;
}): string | undefined {
  return company.vitrine?.bannerUrl
    ?? company.vitrine?.galleryImage
    ?? COMPANY_ENRICHMENTS[company.name]?.coverUrl
    ?? undefined;
}

export function getLogoImage(company: {
  logo?: string | null;
  vitrine?: { logoUrl?: string | null } | null;
}): string | undefined {
  return company.logo ?? company.vitrine?.logoUrl ?? undefined;
}
