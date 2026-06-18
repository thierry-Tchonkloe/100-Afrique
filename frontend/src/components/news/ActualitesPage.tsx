// src/components/news/ActualitesPage.tsx
'use client';

import { useState } from 'react';
import NewsHero from '@/components/news/NewsHero';
import LatestNews from '@/components/news/LatestNews';
import LatestNewsCarousel from '@/components/news/LatestNewsCarousel';
import NewsletterSection from '@/components/news/NewsletterSection';
import AdvancedSearch from '@/components/news/AdvancedSearch';
import EditorialCTA from '@/components/magazine/EditorialCTA';
import type { Magazine, SidebarArticle } from '@/lib/server-data';

interface SearchFilters {
  query: string;
  region: string;
  country: string;
  topic: string;
}

interface ActualitesPageProps {
  /** Magazines pré-fetchés côté serveur pour le hero. */
  heroMagazines: Magazine[];
  /** Articles sidebar pré-fetchés côté serveur. */
  sidebarAnalyses: SidebarArticle[];
  sidebarInterview: SidebarArticle | null;
}

export default function ActualitesPage({
  heroMagazines,
  sidebarAnalyses,
  sidebarInterview,
}: ActualitesPageProps) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    region: '',
    country: '',
    topic: '',
  });

  return (
    <main className="min-h-screen bg-white">

      {/* ── 1. Hero dark immersif (données SSR, pas de fetch client) ── */}
      <NewsHero magazines={heroMagazines} />

      {/* ── 2. Barre de recherche ── */}
      <section className="py-6 sm:py-8" style={{ background: '#F7F9F8' }}>
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
          <AdvancedSearch onSearch={setSearchFilters} />
        </div>
      </section>

      {/* ── 3. Flux actualités (client : pagination + filtres dynamiques) ── */}

      {/* Mobile / Tablet */}
      <div className="lg:hidden py-10 px-4">
        <div className="max-w-[1300px] mx-auto">
          <div className="mb-8">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-1"
              style={{ color: '#B85C38' }}
            >
              — Explorer par source
            </p>
            <h2
              className="text-2xl font-black"
              style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}
            >
              Toutes les{' '}
              <span style={{ color: '#1A5C43' }}>Actualités</span>
            </h2>
          </div>
          <LatestNewsCarousel searchFilters={searchFilters} />
        </div>
      </div>

      {/* Desktop : sidebar reçoit ses données SSR, plus aucun fetch client */}
      <div className="hidden lg:block bg-white">
        <LatestNews
          searchFilters={searchFilters}
          sidebarAnalyses={sidebarAnalyses}
          sidebarInterview={sidebarInterview}
        />
      </div>

      {/* ── 4. CTA éditorial ── */}
      <EditorialCTA />

      {/* ── 5. Newsletter ── */}
      <NewsletterSection />
    </main>
  );
}











// // src/components/news/ActualitesPage.tsx
// 'use client';

// import { useState } from 'react';
// import NewsHero from '@/components/news/NewsHero';
// import LatestNews from '@/components/news/LatestNews';
// import LatestNewsCarousel from '@/components/news/LatestNewsCarousel';
// import NewsletterSection from '@/components/news/NewsletterSection';
// import AdvancedSearch from '@/components/news/AdvancedSearch';
// import EditorialCTA from '@/components/magazine/EditorialCTA';

// interface SearchFilters {
//   query: string;
//   region: string;
//   country: string;
//   topic: string;
// }

// export default function ActualitesPage() {
//   const [searchFilters, setSearchFilters] = useState<SearchFilters>({
//     query: '', region: '', country: '', topic: '',
//   });

//   return (
//     <main className="min-h-screen bg-white">

//       {/* ── 1. Hero dark immersif ── */}
//       <NewsHero />

//       {/* ── 2. Barre de recherche ── */}
//       <section className="py-6 sm:py-8" style={{ background: '#F7F9F8' }}>
//         <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
//           <AdvancedSearch onSearch={setSearchFilters} />
//         </div>
//       </section>

//       {/* ── 3. Flux actualités ── */}
//       {/* Mobile/Tablet */}
//       <div className="lg:hidden py-10 px-4">
//         <div className="max-w-[1300px] mx-auto">
//           <div className="mb-8">
//             <p className="text-xs font-bold uppercase tracking-[0.25em] mb-1" style={{ color: '#B85C38' }}>— Explorer par source</p>
//             <h2 className="text-2xl font-black" style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}>
//               Toutes les <span style={{ color: '#1A5C43' }}>Actualités</span>
//             </h2>
//           </div>
//           <LatestNewsCarousel searchFilters={searchFilters} />
//         </div>
//       </div>

//       {/* Desktop */}
//       <div className="hidden lg:block bg-white">
//         <LatestNews searchFilters={searchFilters} />
//       </div>

//       {/* ── 4. CTA éditorial ── */}
//       <EditorialCTA />

//       {/* ── 5. Newsletter ── */}
//       <NewsletterSection />
//     </main>
//   );
// }
















// // src/components/news/ActualitesPage.tsx
// 'use client';
 
// import { useState } from 'react';
// import NewsHero from '@/components/news/NewsHero';
// import LatestNews from '@/components/news/LatestNews';
// import LatestNewsCarousel from '@/components/news/LatestNewsCarousel';
// import NewsletterSection from '@/components/news/NewsletterSection';
// import MagazineGrid from '@/components/Dashboard/MagazineGrid';
// import AdvancedSearch from '@/components/news/AdvancedSearch';
// import EditorialCTA from '@/components/magazine/EditorialCTA';
 
// export default function ActualitesPage() {
//   const [searchFilters, setSearchFilters] = useState({
//     query: '',
//     region: '',
//     country: '',
//     topic: ''
//   });
 
//   const handleSearch = (filters: any) => {
//     setSearchFilters(filters);
//   };
 
//   return (
//     <main className="min-h-screen bg-white">
//       {/* Section 1 : Le Héro Bleu (3 articles) */}
//       <NewsHero />
 
//       {/* Section 2 : Recherche avancée */}
//       <section className="py-6 sm:py-8 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <AdvancedSearch onSearch={handleSearch} />
//         </div>
//       </section>
 
//       {/* Section 3 : Magazines RSS - Nouvelle section */}
//       {/* <section className="py-8 sm:py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <MagazineGrid />
//         </div>
//       </section> */}
 
//       {/* Section 4 : Actualités - Carrousel Mobile / Grille Desktop */}
//       <section className="py-8 sm:py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header Section */}
//           <div className="text-center mb-8 sm:mb-12">
//             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
//               📰 Toutes les Actualités
//             </h2>
//             <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
//               Découvrez les dernières nouvelles et analyses du secteur touristique africain et international
//             </p>
//           </div>
 
//           {/* Carrousel Mobile/Tablet */}
//           <div className="lg:hidden">
//             <LatestNewsCarousel searchFilters={searchFilters} />
//           </div>
          
//           {/* Grille Desktop */}
//           <div className="hidden lg:block">
//             <LatestNews searchFilters={searchFilters} />
//           </div>
//         </div>
//       </section>

//       {/* Section 5 (Équipe & CTA) : Modales de partenariat et rédaction */}
//       <EditorialCTA />
 
//       {/* Section 6 : La Newsletter Pro */}
//       <NewsletterSection />
//     </main>
//   );
// }