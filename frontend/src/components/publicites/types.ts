// src/components/publicites/types.ts
export type BannerType = 'IMAGE_JPG' | 'HTML_JS';
export type BannerStatus = 'ACTIF' | 'FUTUR' | 'EXPIRE';

export interface Banner {
  id: number;
  officialWebSite: string | null;
  description: string | null;
  advertiser: string;
  campaign: string;
  type: BannerType;
  imageUrl: string | null;
  publicId: string | null;
  htmlCode: string | null;
  startDate: string;
  endDate: string;
  status: BannerStatus;
  createdAt: string;
  updatedAt: string;
  advertisingId: number;
}

export interface AdZone {
  id: number;
  name: string;
  slug: string;
  width: number;
  height: number;
  path: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  banners: Banner[];
  fillRate: number;
}

export interface ThirdPartyCode {
  id: number;
  code: string;
  updatedAt: string;
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function toInputDate(iso: string) {
  return iso ? iso.slice(0, 10) : '';
}