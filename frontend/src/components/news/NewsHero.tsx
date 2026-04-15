// src/components/news/NewsHero.tsx
'use client';
 
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
 
interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  author: {
    id: number;
    name: string;
  };
  views: number;
}
 
const NewsHero = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchHeroArticles = async () => {
      try {
        // 1ère tentative : articles featured de type ARTICLE
        const response = await api.get('/mag/articles', {
          params: {
            type: 'ARTICLE',   // ✅ uniquement les articles
            featured: true,
            pageSize: 3,
            page: 1,
            status: 'PUBLISHED',
          },
        });
        setArticles(response.data.data || []);
      } catch (error) {
        console.error('Erreur NewsHero:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
 
    fetchHeroArticles();
  }, []);
 
  const calculateReadingTime = (excerpt: string): string => {
    const words   = excerpt?.split(' ').length ?? 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min`;
  };
 
  // ── États ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="bg-[#1A3A8A] py-8 sm:py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-8 sm:h-12 bg-gray-600 rounded animate-pulse mb-4"></div>
            <div className="h-4 sm:h-6 bg-gray-600 rounded animate-pulse w-3/4 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 bg-gray-700 rounded-3xl h-[300px] sm:h-[400px] md:h-[450px] animate-pulse"></div>
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-700 rounded-3xl h-36 sm:h-48 animate-pulse"></div>
              <div className="bg-gray-700 rounded-3xl h-36 sm:h-48 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
 
  if (articles.length === 0) {
    return (
      <section className="bg-[#1A3A8A] py-8 sm:py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            Actualités du Tourisme
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Aucun article en vedette disponible pour le moment
          </p>
        </div>
      </section>
    );
  }
 
  // Si moins de 3 articles, dupliquer le premier pour remplir l'espace
  const displayArticles = [...articles];
  while (displayArticles.length < 3) {
    displayArticles.push(articles[0]);
  }
 
  const mainArticle  = displayArticles[0];
  const sideArticles = displayArticles.slice(1, 3);
 
  return (
    <section className="bg-[#1A3A8A] py-8 sm:py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
 
        <h1 className="text-center text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-8 sm:mb-12 max-w-4xl mx-auto leading-tight">
          Actualités du Tourisme : Afrique, Europe et Monde
        </h1>
 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
 
          {/* ── Article principal ─────────────────────────────────────────── */}
          <Link href={`/actualites/${mainArticle.slug}`} className="lg:col-span-2 group">
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-[1.01] h-full flex flex-col">
              <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full">
                <Image
                  src={mainArticle.coverImage || '/images/placeholder.jpg'}
                  alt={mainArticle.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex-1">
                <span className="bg-[#F19300] text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full uppercase mb-3 sm:mb-4 inline-block">
                  À LA UNE
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#001A4D] mb-3 sm:mb-4 group-hover:text-[#F19300] transition-colors line-clamp-3">
                  {mainArticle.title}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
                  {mainArticle.excerpt}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider gap-2 sm:gap-0">
                  <span>Par {mainArticle.author?.name || 'Rédaction'}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    {new Date(mainArticle.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>{calculateReadingTime(mainArticle.excerpt ?? '')} min</span>
                </div>
              </div>
            </div>
          </Link>
 
          {/* ── Articles latéraux ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {sideArticles.map((article) => (
              <Link
                key={article.id}
                href={`/actualites/${article.slug}`}
                className="group flex-1"
              >
                <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-[1.01] h-full flex flex-col">
                  <div className="relative h-40 sm:h-44 md:h-48 w-full">
                    <Image
                      src={article.coverImage || '/images/placeholder.jpg'}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <span className="bg-blue-700 text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-md uppercase mb-2 sm:mb-3 inline-block">
                      {article.category?.name || 'Actualité'}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#001A4D] mb-2 sm:mb-3 leading-snug group-hover:text-[#F19300] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider gap-2 sm:gap-0">
                      <span>Par {article.author?.name || 'Rédaction'}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
 
        </div>
      </div>
    </section>
  );
};
 
export default NewsHero;