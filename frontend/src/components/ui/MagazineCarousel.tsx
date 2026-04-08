// src/components/ui/MagazineCarousel.tsx
'use client';
 
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MagazineCard from '@/components/Dashboard/MagazineCard';
 
interface Magazine {
  id: number;
  title: string;
  slug: string;
  url: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  publishedAt: string;
  source: string;
  author?: string | null;
  categoryId: number;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  category?: any;
  readOnlineUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  shareUrl?: string;
}
 
interface MagazineCarouselProps {
  magazines: Magazine[];
  title?: string;
  subtitle?: string;
}
 
const MagazineCarousel = ({
  magazines,
  title = "📚 Magazines Tourisme d'Afrique",
  subtitle = "Explorez notre collection de magazines spécialisés"
}: MagazineCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
 
  const itemsPerView = {
    mobile: 1.2,
    tablet: 2.5,
    desktop: 4
  };
 
  const maxIndex = Math.max(0, magazines.length - Math.ceil(itemsPerView.mobile));
 
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
 
  useEffect(() => {
    const handleResize = () => {
      setCurrentIndex(0);
    };
 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
  if (magazines.length === 0) {
    return null;
  }
 
  return (
    <section className="py-8 bg-gray-50">
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
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {magazines.slice(0, 8).map((magazine) => (
              <MagazineCard key={magazine.id} magazine={magazine} />
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
                {magazines.map((magazine, index) => (
                  <div
                    key={magazine.id}
                    className="flex-shrink-0 w-[85vw] sm:w-[45vw]"
                  >
                    <MagazineCard magazine={magazine} />
                  </div>
                ))}
              </div>
            </div>
 
            {/* Navigation Buttons */}
            {magazines.length > 1 && (
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
                  {Array.from({ length: Math.min(magazines.length, 5) }).map((_, index) => {
                    const dotIndex = index + Math.min(currentIndex, Math.max(0, magazines.length - 5));
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
          <a
            href="/magazine"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Voir tous les magazines</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
 
export default MagazineCarousel;