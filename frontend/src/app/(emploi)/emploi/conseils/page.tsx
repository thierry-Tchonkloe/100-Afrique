'use client';
// src/app/(emploi)/emploi/conseils/page.tsx

import { Suspense } from 'react';
import { BookOpen } from 'lucide-react';
import { useConseilsSearch } from '@/hooks/useConseilsSearch';
import ConseilsHero from '@/components/emploi/conseils/ConseilsHero';
import ArticleCard from '@/components/emploi/conseils/ArticleCard';
import ArticleSkeleton from '@/components/emploi/conseils/ArticleSkeleton';
import OffresWidget from '@/components/emploi/conseils/OffresWidget';
import EbookSection from '@/components/emploi/conseils/EbookSection';
import NewsletterBanner from '@/components/emploi/conseils/NewsletterBanner';

function ConseilsContent() {
  const {
    articles, loading, search, searchInput, setSearchInput, activeCategory, setActiveCategory, clearAll,
  } = useConseilsSearch();

  const featured = articles.filter((a) => a.featured).slice(0, 3);
  const regular = articles.filter((a) => !a.featured);
  const showAll = !!activeCategory || !!search;
  const continueReading = !showAll ? articles.filter((a) => !a.featured).slice(-2) : [];

  return (
    <div className="min-h-screen bg-white">
      <ConseilsHero
        searchInput={searchInput} setSearchInput={setSearchInput}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        loading={loading}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {(search || activeCategory) && !loading && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-[#1E2A3A]">{articles.length}</span> article{articles.length > 1 ? 's' : ''} trouvé{articles.length > 1 ? 's' : ''}
              {search && <span> pour &quot;<span className="text-[#E8622A]">{search}</span>&quot;</span>}
              {activeCategory && <span> dans <span className="text-[#E8622A]">{activeCategory}</span></span>}
            </p>
            <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-600 underline">
              Tout effacer
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)}
          </div>

        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-700">Aucun article trouvé</p>
            <p className="text-sm text-gray-400 mt-1">Essayez d&apos;autres mots-clés ou une autre catégorie</p>
            <button onClick={clearAll} className="mt-3 text-sm text-[#E8622A] font-semibold hover:underline">
              Voir tous les articles
            </button>
          </div>

        ) : showAll ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>

        ) : (
          <>
            {featured.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                {featured.map((a) => <ArticleCard key={a.id} article={a} />)}
              </div>
            )}

            <OffresWidget />

            {regular.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                {regular.map((a) => <ArticleCard key={a.id} article={a} />)}
              </div>
            )}

            <EbookSection />

            {continueReading.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-extrabold text-[#1E2A3A] mb-5">Continuez votre lecture</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {continueReading.map((a) => <ArticleCard key={a.id} article={a} size="compact" />)}
                </div>
              </div>
            )}

            <NewsletterBanner />
          </>
        )}
      </div>
    </div>
  );
}

export default function ConseilsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8622A]/30 border-t-[#E8622A] rounded-full animate-spin" />
      </div>
    }>
      <ConseilsContent />
    </Suspense>
  );
}
