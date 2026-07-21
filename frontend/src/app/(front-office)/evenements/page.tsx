// src/app/(front-office)/salons/page.tsx
import { getPageSalons, getPageSalonInterview } from '@/lib/server-data';
import type { Salon, SalonInterview } from '@/lib/server-data';
import SalonsPageClient from '@/components/salons/SalonsPageClient';

export const metadata = {
  title: 'Salons & Événements du Tourisme | 100% Afrique',
  description:
    'Suivez les plus grands salons du tourisme mondial. Reportages exclusifs depuis IFTM, ITB, WTM et bien d\'autres événements professionnels.',
};

export default async function SalonsPage() {
  const [salonsResult, interviewResult] = await Promise.allSettled([
    getPageSalons(),
    getPageSalonInterview(),
  ]);

  const salons: Salon[] =
    salonsResult.status === 'fulfilled' ? salonsResult.value : [];

  const interview: SalonInterview | null =
    interviewResult.status === 'fulfilled' ? interviewResult.value : null;

  return <SalonsPageClient salons={salons} interview={interview} />;
}
