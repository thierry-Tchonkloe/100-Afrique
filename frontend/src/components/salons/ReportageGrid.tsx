// src/components/salons/ReportageGrid.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { Loader2, ArrowRight, Play, FileText, Image as ImageIcon } from 'lucide-react';

interface Reportage {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
  category: {
    id: number;
    name: string;
  };
  content: Array<{
    type: string;
    url?: string;
    value?: string;
  }>;
}

interface FilterState {
  year: string;
  region: string;
  type: string;
}

const ReportageGrid = () => {
  const [reportages, setReportages] = useState<Reportage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<FilterState>({
    year: 'all',
    region: 'all',
    type: 'all'
  });

  useEffect(() => {
    const fetchReportages = async () => {
      try {
        setLoading(true);
        
        const params: Record<string, string | number> = {
          pageSize: 12,
          page: 1,
          status: 'PUBLISHED'
          // TODO Backend: Ajouter categorySlug: 'reportages-salons'
        };

        // Filtrage par année
        if (filters.year !== 'all') {
          params.year = filters.year;
        }
        
        // TODO Backend: Ajouter des tags pour région et type
        if (filters.region !== 'all') {
          params.region = filters.region;
        }

        if (filters.type !== 'all') {
          params.contentType = filters.type;
        }

        const response = await api.get('/mag/articles', { params });
        
        setReportages(response.data.data || []);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Erreur lors de la récupération des reportages:", error.message);
        }
        setReportages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReportages();
  }, [filters]);

  // Fonction pour déterminer le type de contenu
  const getContentType = (reportage: Reportage): 'video' | 'article' | 'interview' => {
    if (reportage.content && reportage.content.some(block => block.type === 'video')) {
      return 'video';
    }
    if (reportage.category.name.toLowerCase().includes('interview')) {
      return 'interview';
    }
    return 'article';
  };

  // Fonction pour l'icône de type de contenu
  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play size={14} className="fill-current" />;
      case 'article': return <FileText size={14} />;
      case 'interview': return <ImageIcon size={14} />;
      default: return <FileText size={14} />;
    }
  };

  // Couleur du badge selon la catégorie
  const getCategoryColor = (categoryName: string): string => {
    const name = categoryName.toLowerCase();
    if (name.includes('interview')) return 'bg-purple-600';
    if (name.includes('video')) return 'bg-red-600';
    if (name.includes('analyse')) return 'bg-blue-600';
    return 'bg-it-blue';
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-serif font-bold text-it-blue uppercase tracking-widest">
          Reportages et comptes-rendus
        </h2>
      </div>

      {/* BARRE DE FILTRES */}
      <div className="flex flex-wrap gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
        {/* Filtre Année */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Année</label>
          <select 
            value={filters.year}
            onChange={(e) => setFilters({...filters, year: e.target.value})}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-it-orange/20 focus:border-it-orange transition-all cursor-pointer min-w-[140px]"
          >
            <option value="all">Toutes les années</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>

        {/* Filtre Région */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Destination / Région</label>
          <select 
            value={filters.region}
            onChange={(e) => setFilters({...filters, region: e.target.value})}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-it-orange/20 focus:border-it-orange transition-all cursor-pointer min-w-[160px]"
          >
            <option value="all">Toutes les régions</option>
            <option value="afrique">Afrique</option>
            <option value="europe">Europe</option>
            <option value="ameriques">Amériques</option>
            <option value="asie-pacifique">Asie-Pacifique</option>
            <option value="moyen-orient">Moyen-Orient</option>
          </select>
        </div>

        {/* Filtre Type de contenu */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Format</label>
          <select 
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-it-orange/20 focus:border-it-orange transition-all cursor-pointer min-w-[160px]"
          >
            <option value="all">Tous les contenus</option>
            <option value="article">Articles & Dossiers</option>
            <option value="video">Vidéos & Web TV</option>
            <option value="interview">Interviews Exclusives</option>
          </select>
        </div>

        {/* Bouton Réinitialiser */}
        {(filters.year !== 'all' || filters.region !== 'all' || filters.type !== 'all') && (
          <button 
            onClick={() => setFilters({ year: 'all', region: 'all', type: 'all' })}
            className="mt-auto mb-1 text-[10px] font-bold uppercase text-it-orange hover:underline px-2 py-2"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* GRILLE DE CARTES */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="flex flex-col space-y-4 animate-pulse">
              <div className="bg-gray-200 h-52 w-full rounded-2xl" />
              <div className="h-4 bg-gray-200 w-1/4 rounded" />
              <div className="h-6 bg-gray-200 w-3/4 rounded" />
              <div className="h-20 bg-gray-200 w-full rounded" />
            </div>
          ))}
        </div>
      ) : reportages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reportages.map((item) => {
            const contentType = getContentType(item);
            const categoryColor = getCategoryColor(item.category.name);

            return (
              <article 
                key={item.id} 
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <img 
                    src={item.coverImage} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <span className={`absolute bottom-4 left-4 ${categoryColor} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-lg flex items-center gap-2`}>
                    {renderTypeIcon(contentType)}
                    {item.category.name}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] text-it-orange font-bold uppercase tracking-widest mb-2">
                    {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                  <h3 className="font-serif font-bold text-it-blue text-lg leading-snug mb-3 group-hover:text-it-orange transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed font-light mb-6">
                    {item.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <Link 
                      href={`/actualites/${item.slug}`}
                      className="text-it-blue font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all"
                    >
                      Lire le reportage 
                      <ArrowRight size={14} className="text-it-orange" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400">
            Aucun reportage ne correspond à vos critères de recherche.
          </p>
        </div>
      )}

      {/* Bouton Charger Plus */}
      {!loading && reportages.length >= 12 && (
        <div className="flex justify-center pt-10">
          <button 
            className="bg-it-blue text-white px-12 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-it-orange transition-colors shadow-lg active:scale-95"
          >
            Voir plus de reportages
          </button>
        </div>
      )}
    </section>
  );
};

export default ReportageGrid;