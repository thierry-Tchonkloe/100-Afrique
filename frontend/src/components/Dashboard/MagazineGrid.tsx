// src/components/Dashboard/MagazineGrid.tsx
'use client';
 
import { useState, useEffect } from 'react';
import { fetchMagazines } from '@/services/Dashboard/magazineService';
import { Search, Calendar, Globe } from 'lucide-react';
import MagazineCard from './MagazineCard';
import MagazineCarousel from '@/components/ui/MagazineCarousel';
 
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
 
interface RSSSource {
  name: string;
  count: number;
}
 
export default function MagazineGrid() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortOrder, setSortOrder] = useState('desc');
 
  useEffect(() => {
    fetchMagazinesData();
  }, [currentPage, search, sortBy, sortOrder]);
 
  const fetchMagazinesData = async () => {
    try {
      setLoading(true);
      const response = await fetchMagazines({
        page: currentPage,
        pageSize: 12,
        search,
        sortBy,
        sortOrder
      });
 
      if (response.success) {
        setMagazines(response.data.magazines);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">Erreur: {error}</p>
        <button
          onClick={fetchMagazinesData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }
 
  return (
    <div className="space-y-6">
      {/* Carrousel Mobile / Grille Desktop */}
      <MagazineCarousel
        magazines={magazines}
        title="📚 Nos Actualités sur le Tourisme en Afrique"
        subtitle="Explorez notre collection d'articles sur le tourisme en Afrique, mise à jour en temps réel."
      />
 
      {/* Grille Desktop (en plus du carrousel) */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {magazines.map((magazine) => (
            <MagazineCard key={magazine.id} magazine={magazine} />
          ))}
        </div>
 
        {/* Pagination Desktop */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Précédent
            </button>
            
            <span className="px-4 py-1 text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
 
 