// src/components/Dashboard/MagazineCard.tsx
'use client';
 
import Link from 'next/link';
import { ExternalLink, Calendar, Eye } from 'lucide-react';
 
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
 
interface MagazineCardProps {
  magazine: Magazine;
}
 
export default function MagazineCard({ magazine }: MagazineCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const magazineUrl = `/magazine/${magazine.slug}`;
 
  return (
    <Link
      href={magazineUrl}
      className="group block"
    >
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Image de couverture */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
            alt={magazine.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Overlay avec informations */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center gap-2 text-xs mb-2">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(magazine.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-3 h-3" />
                <span className="text-xs">Voir les détails</span>
              </div>
            </div>
          </div>
 
          {/* Badge source */}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {magazine.source}
            </span>
          </div>
 
          {/* Badge featured si applicable */}
          {magazine.featured && (
            <div className="absolute top-3 right-3">
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                ⭐ À la une
              </span>
            </div>
          )}
        </div>
 
        {/* Informations */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {magazine.title}
          </h3>
          
          {magazine.excerpt && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
              {magazine.excerpt}
            </p>
          )}
 
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(magazine.publishedAt)}</span>
            </div>
            
            <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700">
              <span className="text-xs font-medium">Lire</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
 
