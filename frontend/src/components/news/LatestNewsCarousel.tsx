// src/components/news/LatestNewsCarousel.tsx
'use client';
 
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import NewsCarousel from '@/components/ui/NewsCarousel';
 
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
 
interface LatestNewsCarouselProps {
  searchFilters?: {
    query: string;
    region: string;
    country: string;
    topic: string;
  };
}
 
const LatestNewsCarousel = ({ searchFilters }: LatestNewsCarouselProps) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Construire les paramètres de recherche
        const searchParams = {
          type: 'ARTICLE',
          pageSize: 12,
          page: 1,
          status: 'PUBLISHED',
          ...(searchFilters?.query && { search: searchFilters.query }),
          ...(searchFilters?.region && { region: searchFilters.region }),
          ...(searchFilters?.country && { country: searchFilters.country }),
          ...(searchFilters?.topic && { topic: searchFilters.topic }),
        };
 
        const response = await api.get('/mag/articles', { params: searchParams });
        setArticles(response.data.data ?? []);
      } catch (error: any) {
        console.error('Erreur chargement articles:', error);
        setError(error.message || 'Erreur lors du chargement des articles');
      } finally {
        setLoading(false);
      }
    };
 
    fetchArticles();
  }, [searchFilters]);
 
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin text-[#001A4D]" size={40} />
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-600 mb-4">Erreur: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }
 
  if (articles.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="text-gray-400 mb-4">
          <Loader2 className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
        <p className="text-gray-500">
          {searchFilters?.query || searchFilters?.region || searchFilters?.country || searchFilters?.topic
            ? "Essayez de modifier vos filtres de recherche."
            : "Aucun article n'est disponible pour le moment."}
        </p>
      </div>
    );
  }
 
  return (
    <NewsCarousel
      articles={articles}
      title="📰 Dernières Actualités Touristiques"
      subtitle="Découvrez les dernières nouvelles et tendances du secteur touristique africain"
    />
  );
};
 
export default LatestNewsCarousel;