// src/components/ui/NewsCarousel.tsx
'use client';
 
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Eye } from 'lucide-react';
import Link from 'next/link';
 
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
 
interface NewsCarouselProps {
  articles: NewsArticle[];
  title?: string;
  subtitle?: string;
}
 
const NewsCarousel = ({
  articles,
  title = "📰 Actualités Touristiques",
  subtitle = "Les dernières nouvelles du secteur touristique"
}: NewsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
 
  const itemsPerView = {
    mobile: 1.1,
    tablet: 2.2,
    desktop: 3
  };
 
  const maxIndex = Math.max(0, articles.length - Math.ceil(itemsPerView.mobile));
 
  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };
 
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
 
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    setStartX('touches' in e ? e.touches[0].clientX : e.clientX);
  };
 
  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };
 
  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const threshold = 50;
    if (translateX > threshold) {
      handlePrev();
    } else if (translateX < -threshold) {
      handleNext();
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };
 
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
 
  const calculateReadingTime = (excerpt: string): string => {
    const words = excerpt?.split(' ').length ?? 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min`;
  };
 
  useEffect(() => {
    const handleResize = () => {
      setCurrentIndex(0);
    };
 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
  if (articles.length === 0) {
    return null;
  }
 
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
 
        {/* Carousel Container */}
        <div className="relative">
          {/* Desktop Grid View */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {articles.slice(0, 6).map((article) => (
              <Link
                key={article.id}
                href={`/actualites/${article.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={article.coverImage || '/images/news-placeholder.jpg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-white text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                      </div>
                    </div>
 
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {article.category.name}
                      </span>
                    </div>
                  </div>
 
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {article.excerpt}
                    </p>
 
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{article.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
 
          {/* Mobile/Tablet Carousel */}
          <div className="lg:hidden">
            <div
              className="overflow-hidden"
              ref={carouselRef}
            >
              <div
                className="flex gap-4 transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
                style={{
                  transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`
                }}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex-shrink-0 w-[90vw] sm:w-[45vw]"
                  >
                    <Link href={`/actualites/${article.slug}`} className="group block">
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
                        {/* Image */}
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <img
                            src={article.coverImage || '/images/news-placeholder.jpg'}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                              {article.category.name}
                            </span>
                          </div>
                        </div>
 
                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {article.excerpt}
                          </p>
 
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(article.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{article.views}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Navigation Buttons */}
            {articles.length > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-full bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                  aria-label="Précédent"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
 
                {/* Dots Indicator */}
                <div className="flex space-x-2">
                  {Array.from({ length: Math.min(articles.length, 5) }).map((_, index) => {
                    const dotIndex = index + Math.min(currentIndex, Math.max(0, articles.length - 5));
                    return (
                      <button
                        key={dotIndex}
                        onClick={() => setCurrentIndex(dotIndex)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          dotIndex === currentIndex
                            ? 'bg-blue-600'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Aller à la page ${dotIndex + 1}`}
                      />
                    );
                  })}
                </div>
 
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  className="p-2 rounded-full bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                  aria-label="Suivant"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            )}
          </div>
        </div>
 
        {/* View All Button */}
        <div className="text-center mt-8">
          <Link
            href="/actualites"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Voir toutes les actualités</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
 
export default NewsCarousel;