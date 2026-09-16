// src/components/destinations/detail/DestinationArticlesSection.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { Camera, Compass, ChevronRight, Loader2, User, Eye, Calendar, Play, Newspaper } from 'lucide-react';
import type { ArticleCard, Destination } from './useDestinationDetail';
import { getContentHref } from './useDestinationDetail';

const ArticleCardItem = ({ article }: { article: ArticleCard }) => {
  const isVideo = article.type === 'VIDEO';
  const href = getContentHref(article);

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={article.coverImage || '/images/placeholder.jpg'}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <div className="w-12 h-12 bg-it-terracotta rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play size={20} fill="white" className="text-white ml-0.5" />
            </div>
          </div>
        )}

        <span className="absolute top-3 left-3 bg-it-terracotta text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
          {isVideo ? (
            <><Play size={9} fill="white" />Vidéo</>
          ) : (
            <><Newspaper size={9} />Article</>
          )}
        </span>

        <span className="absolute bottom-3 left-3 bg-it-blue/80 backdrop-blur-sm text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          {article.category.name}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-it-blue leading-snug mb-2 group-hover:text-it-gold transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{article.excerpt}</p>
        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <User size={11} className="text-it-gold" />
            <span className="font-medium text-gray-500">{article.author.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {article.views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye size={11} />
                <span>{article.views.toLocaleString('fr-FR')}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={11} />
              <span>
                {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'short',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface DestinationArticlesSectionProps {
  destination: Destination;
  articles: ArticleCard[];
  hasMoreArticles: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

const DestinationArticlesSection = ({
  destination, articles, hasMoreArticles, loadingMore, onLoadMore,
}: DestinationArticlesSectionProps) => (
  <section className="bg-it-gray-light py-16 px-4 md:px-8">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Camera size={18} className="text-it-gold" />
            <span className="text-it-gold text-xs font-bold uppercase tracking-[0.2em]">Nos reportages</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-it-blue uppercase tracking-wide">
            Articles & Vidéos sur{' '}
            <span className="text-it-terracotta">{destination.name}</span>
          </h2>
          <div className="w-14 h-1 bg-it-gold mt-3 rounded-full" />
        </div>
        {destination.articleCount !== undefined && destination.articleCount > 6 && (
          <span className="hidden md:block text-sm text-gray-400 font-medium">
            {destination.articleCount} contenus disponibles
          </span>
        )}
      </div>

      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCardItem key={article.id} article={article} />
            ))}
          </div>

          {hasMoreArticles && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="bg-it-emerald-dark hover:bg-it-terracotta disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-10 py-4 rounded-lg font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                {loadingMore ? (
                  <><Loader2 className="animate-spin" size={16} />Chargement...</>
                ) : (
                  <>Voir plus de contenus<ChevronRight size={16} /></>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Compass size={40} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 text-lg font-medium">
            Aucun contenu disponible pour cette destination pour le moment.
          </p>
          <p className="text-gray-300 text-sm mt-2">Revenez bientôt !</p>
        </div>
      )}
    </div>
  </section>
);

export default DestinationArticlesSection;