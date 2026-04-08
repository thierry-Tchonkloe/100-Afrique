// src/components/magazine/MagazineLibrary.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { fetchMagazines } from '@/services/Dashboard/magazineService';

interface Magazine {
  id: number;
  title: string;
  slug: string;
  url: string;
  coverImage: string | null;
  excerpt: string | null;
  publishedAt: string;
  metaTitle?: string;
  readOnlineUrl?: string;
}

const categories = [
  { id: 'all', label: 'Tous' },
  { id: '2024', label: '2024' },
  { id: '2023', label: '2023' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'culture', label: 'Culture' },
];

const MagazineLibrary = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadMagazines = async () => {
    setLoading(true);
    try {
      const response = await fetchMagazines({
        page: 1,
        pageSize: 60,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      });

      setMagazines(response.success ? response.data.magazines : []);
    } catch (error) {
      console.error("Erreur bibliothèque:", error);
      setMagazines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMagazines();
  }, []);

  const filteredMagazines = (() => {
    if (activeFilter === 'all') {
      return magazines;
    }

    if (activeFilter === '2024' || activeFilter === '2023') {
      return magazines.filter(
        (magazine) =>
          new Date(magazine.publishedAt).getFullYear().toString() === activeFilter,
      );
    }

    return magazines.filter((magazine) => {
      const haystack = `${magazine.title} ${magazine.excerpt || ''}`.toLowerCase();
      return haystack.includes(activeFilter.toLowerCase());
    });
  })();

  // Fonction pour extraire le numéro depuis le titre ou metaTitle
  const extractNumber = (magazine: Magazine): string => {
    if (magazine.metaTitle) {
      const match = magazine.metaTitle.match(/N°(\d+)/i);
      if (match) return match[1];
    }
    return (new Date(magazine.publishedAt).getMonth() + 1).toString();
  };

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* En-tête */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-it-blue uppercase tracking-tight">
            Retrouvez nos anciens numéros
          </h2>
          <p className="text-gray-500 text-lg">
            Une bibliothèque riche de contenus exclusifs
          </p>
        </div>

        {/* Système de Filtres */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <div className="bg-gray-100 p-1.5 rounded-xl flex flex-wrap justify-center gap-1 shadow-inner">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  activeFilter === cat.id
                    ? 'bg-it-orange text-white shadow-lg scale-105'
                    : 'text-gray-500 hover:text-it-blue hover:bg-white/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille de la Bibliothèque */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-it-orange" size={48} />
          </div>
        ) : filteredMagazines.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {filteredMagazines.map((mag) => {
              const magazineUrl = `/magazine/${mag.slug}`;

              return (
              <Link
                href={magazineUrl}
                key={mag.id}
                className="group cursor-pointer"
              >
                {/* Couverture avec effet de profondeur */}
                <div className="relative aspect-[3/4] mb-4 rounded-xl overflow-hidden shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 bg-white border border-gray-100">
                  <img
                    src={mag.coverImage ?? '/images/magazine-placeholder.jpg'}
                    alt={mag.title}
                    className="object-cover"
                  />
                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-it-blue/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-it-blue p-3 rounded-full shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <Search size={20} />
                    </span>
                  </div>
                </div>

                {/* Infos du numéro */}
                <div className="space-y-1">
                  <h4 className="font-black text-it-blue text-sm uppercase tracking-tight">
                    Numéro {extractNumber(mag)}
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 italic">
                    {mag.excerpt || mag.title}
                  </p>
                  <p className="text-gray-400 text-[10px] font-medium">
                    {new Date(mag.publishedAt).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </Link>
            )})}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 italic">
              Aucun numéro disponible pour cette catégorie.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MagazineLibrary;
