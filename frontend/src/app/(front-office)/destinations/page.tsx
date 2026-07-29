// src/app/(front-office)/destinations/page.tsx
import { Suspense } from 'react';
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

// ✅ NOUVEAU — squelette de secours pendant que le shell statique est
// servi et que DestinationGrid (client, useSearchParams) s'hydrate.
function DestinationGridFallback() {
  return (
    <section className="py-12 sm:py-16 px-5 sm:px-6" style={{ background: '#F7F9F8' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-200 animate-pulse" style={{ aspectRatio: '4/3' }} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function DestinationsPage() {
  const [highlightsResult] = await Promise.allSettled([
    getAfricaHighlights(),
  ]);

  const highlights: Highlight[] =
    highlightsResult.status === 'fulfilled' ? highlightsResult.value : [];

  return (
    <main className="min-h-screen bg-white">
      <DestinationsHero />
      {/* ✅ NOUVEAU — Suspense requis : DestinationGrid lit désormais
          l'URL (?region=...) via useSearchParams() pour rendre les liens
          du méga-menu Header réellement fonctionnels. */}
      <Suspense fallback={<DestinationGridFallback />}>
        <DestinationGrid />
      </Suspense>
      <AfricaHighlights highlights={highlights} />
      <DestinationCTA />
    </main>
  );
}












// // src/app/(front-office)/destinations/page.tsx
// import DestinationsHero from '@/components/destinations/DestinationsHero';
// import DestinationGrid from '@/components/destinations/DestinationGrid';
// import AfricaHighlights from '@/components/destinations/AfricaHighlights';
// import DestinationCTA from '@/components/destinations/DestinationCTA';
// import { getAfricaHighlights } from '@/lib/server-data';
// import type { Highlight } from '@/lib/server-data';

// export const metadata = {
//   title: 'Destinations | Afrique et International - 100% Afrique',
//   description:
//     "Explorez les destinations touristiques en Afrique et à l'international. Fiches pays détaillées, reportages exclusifs et actualités.",
//   keywords: ['destinations afrique', 'tourisme international', 'voyages', 'guides touristiques'],
// };

// export default async function DestinationsPage() {
//   const [highlightsResult] = await Promise.allSettled([
//     getAfricaHighlights(),
//   ]);

//   const highlights: Highlight[] =
//     highlightsResult.status === 'fulfilled' ? highlightsResult.value : [];

//   return (
//     <main className="min-h-screen bg-white">
//       <DestinationsHero />
//       <DestinationGrid />
//       <AfricaHighlights highlights={highlights} />
//       <DestinationCTA />
//     </main>
//   );
// }