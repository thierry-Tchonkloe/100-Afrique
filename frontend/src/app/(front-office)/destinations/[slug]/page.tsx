// src/app/(front-office)/destinations/[slug]/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Tag } from 'lucide-react';

import { useDestinationDetail } from '@/components/destinations/detail/useDestinationDetail';
import DestinationHero from '@/components/destinations/detail/DestinationHero';
import PracticalInfoSection from '@/components/destinations/detail/PracticalInfoSection';
import DestinationArticlesSection from '@/components/destinations/detail/DestinationArticlesSection';
import ContentBlockRenderer from '@/components/shared/ContentBlockRenderer';

const DestinationDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const {
    destination, articles, loading, notFound,
    hasMoreArticles, loadingMore, parsedContent, hasPracticalInfo,
    loadMore,
  } = useDestinationDetail(slug);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-it-gold" size={44} />
        <p className="text-it-blue font-medium text-sm uppercase tracking-widest animate-pulse">
          Chargement de la destination...
        </p>
      </div>
    );
  }

  if (notFound || !destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 px-4">
        <div className="text-center">
          <p className="text-8xl font-black text-it-blue/10 mb-2">404</p>
          <h1 className="text-2xl font-bold text-it-blue mb-3">Destination introuvable</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Cette destination n&apos;existe pas ou a été supprimée.
          </p>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 bg-it-emerald-dark text-white px-6 py-3 rounded-lg font-bold hover:bg-it-terracotta transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <DestinationHero destination={destination} />

      {hasPracticalInfo && <PracticalInfoSection destination={destination} />}

      {parsedContent.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-14">
          {destination.description && (
            <p className="text-xl text-it-blue font-medium leading-relaxed border-l-4 border-it-gold pl-6 mb-10 italic">
              {destination.description}
            </p>
          )}
          <ContentBlockRenderer blocks={parsedContent} />
        </section>
      )}

      {parsedContent.length === 0 && destination.description && (
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-14">
          <p className="text-xl text-it-blue font-medium leading-relaxed border-l-4 border-it-gold pl-6 italic">
            {destination.description}
          </p>
        </section>
      )}

      {destination.tags && destination.tags.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 pb-10">
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-100">
            <Tag size={16} className="text-gray-400" />
            {destination.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-it-gold/10 hover:text-it-gold transition-colors cursor-default"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <DestinationArticlesSection
        destination={destination}
        articles={articles}
        hasMoreArticles={hasMoreArticles}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
      />

      <div className="py-12 flex justify-center bg-white border-t border-gray-100">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 bg-it-emerald-dark text-white px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-it-terracotta transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Toutes les destinations
        </Link>
      </div>
    </main>
  );
};

export default DestinationDetailPage;