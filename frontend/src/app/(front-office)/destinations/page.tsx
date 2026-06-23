// src/app/(front-office)/destinations/page.tsx
import DestinationsHero from '@/components/destinations/DestinationsHero';
import DestinationGrid from '@/components/destinations/DestinationGrid';
import AfricaHighlights from '@/components/destinations/AfricaHighlights';
import DestinationCTA from '@/components/destinations/DestinationCTA';
import { getAfricaHighlights } from '@/lib/server-data';
import type { Highlight } from '@/lib/server-data';

export const metadata = {
  title: 'Destinations | Afrique et International - 100% Afrique',
  description:
    "Explorez les destinations touristiques en Afrique et à l'international. Fiches pays détaillées, reportages exclusifs et actualités.",
  keywords: ['destinations afrique', 'tourisme international', 'voyages', 'guides touristiques'],
};

export default async function DestinationsPage() {
  const [highlightsResult] = await Promise.allSettled([
    getAfricaHighlights(),
  ]);

  const highlights: Highlight[] =
    highlightsResult.status === 'fulfilled' ? highlightsResult.value : [];

  return (
    <main className="min-h-screen bg-white">
      <DestinationsHero />
      <DestinationGrid />
      <AfricaHighlights highlights={highlights} />
      <DestinationCTA />
    </main>
  );
}