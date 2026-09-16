// src/app/(front-office)/actualites/[slug]/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { useArticleDetail } from '@/components/articles/detail/useArticleDetail';
import ArticleHero from '@/components/articles/detail/ArticleHero';
import ArticleMeta from '@/components/articles/detail/ArticleMeta';
import ArticleTags from '@/components/articles/detail/ArticleTags';
import RelatedArticles from '@/components/articles/detail/RelatedArticles';
import ContentBlockRenderer from '@/components/shared/ContentBlockRenderer';
import LinkedDestinationCard from '@/components/shared/LinkedDestinationCard';

const ArticleDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const { article, related, loading, notFound, readingTime, parsedContent } = useArticleDetail(slug);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-it-gold" size={44} />
        <p className="text-it-blue font-medium text-sm uppercase tracking-widest animate-pulse">
          Chargement de l&apos;article...
        </p>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 px-4">
        <div className="text-center">
          <p className="text-8xl font-black text-it-blue/10 mb-2">404</p>
          <h1 className="text-2xl font-bold text-it-blue mb-3">Article introuvable</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Cet article n&apos;existe pas ou a été supprimé.
          </p>
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 bg-it-emerald-dark text-white px-6 py-3 rounded-lg font-bold hover:bg-it-terracotta transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <ArticleHero article={article} />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <ArticleMeta article={article} readingTime={readingTime} />

        {article.excerpt && (
          <p className="text-xl text-it-blue font-medium leading-relaxed border-l-4 border-it-gold pl-6 mb-10 italic">
            {article.excerpt}
          </p>
        )}

        <ContentBlockRenderer blocks={parsedContent} />

        {article.tags && <ArticleTags tags={article.tags} />}
        {article.destination && <LinkedDestinationCard destination={article.destination} />}
      </div>

      <RelatedArticles articles={related} />

      <div className="py-12 flex justify-center bg-white border-t border-gray-100">
        <Link
          href="/actualites"
          className="inline-flex items-center gap-2 bg-it-emerald-dark text-white px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-it-terracotta transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Toutes les actualités
        </Link>
      </div>
    </main>
  );
};

export default ArticleDetailPage;