// src/components/articles/detail/RelatedArticles.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { RelatedArticle } from './useArticleDetail';

const RelatedCard = ({ article }: { article: RelatedArticle }) => (
  <Link href={`/actualites/${article.slug}`} className="group flex flex-col">
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4">
      <img
        src={article.coverImage || '/images/placeholder.jpg'}
        alt={article.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <span className="absolute top-3 left-3 bg-it-terracotta text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wide">
        {article.category.name}
      </span>
    </div>
    <h3 className="text-base font-bold text-it-blue leading-snug mb-2 group-hover:text-it-gold transition-colors line-clamp-2">
      {article.title}
    </h3>
    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-auto">
      <span>Par {article.author.name}</span>
      <span>•</span>
      <span>
        {new Date(article.createdAt).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'short', year: 'numeric',
        })}
      </span>
    </div>
  </Link>
);

const RelatedArticles = ({ articles }: { articles: RelatedArticle[] }) => {
  if (!articles.length) return null;
  return (
    <section className="bg-it-gray-light py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-it-blue uppercase tracking-wide">
              Articles similaires
            </h2>
            <div className="w-12 h-1 bg-it-gold mt-2 rounded-full" />
          </div>
          <Link
            href="/actualites"
            className="text-sm font-bold text-it-blue hover:text-it-gold transition-colors flex items-center gap-1"
          >
            Voir tout
            <ArrowLeft size={14} className="rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {articles.map((a) => <RelatedCard key={a.id} article={a} />)}
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;