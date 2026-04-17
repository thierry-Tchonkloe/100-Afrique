// src/components/news/ActualitesPage.tsx
'use client';
 
import { useState } from 'react';
import NewsHero from '@/components/news/NewsHero';
import LatestNews from '@/components/news/LatestNews';
import LatestNewsCarousel from '@/components/news/LatestNewsCarousel';
import NewsletterSection from '@/components/news/NewsletterSection';
import MagazineGrid from '@/components/Dashboard/MagazineGrid';
import AdvancedSearch from '@/components/news/AdvancedSearch';
import EditorialCTA from '@/components/magazine/EditorialCTA';
 
export default function ActualitesPage() {
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    region: '',
    country: '',
    topic: ''
  });
 
  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
  };
 
  return (
    <main className="min-h-screen bg-white">
      {/* Section 1 : Le Héro Bleu (3 articles) */}
      <NewsHero />
 
      {/* Section 2 : Recherche avancée */}
      <section className="py-6 sm:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdvancedSearch onSearch={handleSearch} />
        </div>
      </section>
 
      {/* Section 3 : Magazines RSS - Nouvelle section */}
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MagazineGrid />
        </div>
      </section>
 
      {/* Section 4 : Actualités - Carrousel Mobile / Grille Desktop */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              📰 Toutes les Actualités
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Découvrez les dernières nouvelles et analyses du secteur touristique africain et international
            </p>
          </div>
 
          {/* Carrousel Mobile/Tablet */}
          <div className="lg:hidden">
            <LatestNewsCarousel searchFilters={searchFilters} />
          </div>
          
          {/* Grille Desktop */}
          <div className="hidden lg:block">
            <LatestNews searchFilters={searchFilters} />
          </div>
        </div>
      </section>

      {/* Section 5 (Équipe & CTA) : Modales de partenariat et rédaction */}
      <EditorialCTA />
 
      {/* Section 6 : La Newsletter Pro */}
      <NewsletterSection />
    </main>
  );
}