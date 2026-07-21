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
