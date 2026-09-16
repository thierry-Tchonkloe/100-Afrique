// src/components/emploi/entreprise-detail/detailHelpers.ts
import type { PublicOffre } from '@/services/emploi-public.service';

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '';
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return 'À l\'instant';
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Il y a 1 jour' : `Il y a ${d} jours`;
}

export function fmtSalary(o: PublicOffre): string {
  if (!o.salaryMin) return '';
  const min = Math.round(o.salaryMin / 1000);
  const max = Math.round((o.salaryMax ?? o.salaryMin) / 1000);
  return min === max ? `${min}k€` : `${min}-${max}k€`;
}
