// src/app/(front-office)/destinations/page.tsx
import DestinationsHero from '@/components/destinations/DestinationsHero';
import DestinationGrid from '@/components/destinations/DestinationGrid';
import AfricaHighlights from '@/components/destinations/AfricaHighlights';
import DestinationCTA from '@/components/destinations/DestinationCTA';

export const metadata = {
  title: 'Destinations | Afrique et International - WAXEHO',
  description: 'Explorez les destinations touristiques en Afrique et à l\'international. Fiches pays détaillées, reportages exclusifs et actualités.',
  keywords: ['destinations afrique', 'tourisme international', 'voyages', 'guides touristiques'],
};

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-white">
      <DestinationsHero />
      <DestinationGrid />
      <AfricaHighlights />
      <DestinationCTA />
    </main>
  );
}