// src/components/destinations/DestinationGrid.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '@/lib/api';

interface Destination {
  id: number;
  name: string;
  slug: string;
  description?: string;
  coverImage: string;
  continent?: string;
  articleCount?: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    data: Destination[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      pageSize: number;
    };
  };
}

const DestinationGrid = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filter, setFilter] = useState('TOUTES');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const continents = ['TOUTES', 'AFRIQUE', 'EUROPE', 'AMÉRIQUES', 'ASIE/MOYEN-ORIENT', 'OCÉANIE'];

  const fetchDestinations = async (isNewFilter = false) => {
    if (loading) return;

    try {
      setLoading(true);
      const currentPage = isNewFilter ? 1 : page;
      
      // ✅ Endpoint principal : Liste des destinations
      const response = await api.get<ApiResponse>('/destinations', {
        params: {
          continent: filter !== 'TOUTES' ? filter : undefined,
          search: searchQuery || undefined,
          page: currentPage,
          pageSize: 8,
          status: 'PUBLISHED'
        }
      });

      // ✅ CORRECTION : Accès correct aux données
      const apiData = response.data.data; // Premier .data = axios, second .data = structure API
      const newDestinations = apiData.data || []; // Les destinations sont dans data.data
      const pagination = apiData.pagination;

      if (isNewFilter) {
        setDestinations(newDestinations);
        setPage(2);
      } else {
        setDestinations((prev) => [...prev, ...newDestinations]);
        setPage((prev) => prev + 1);
      }

      // Vérifier s'il y a plus de résultats
      if (pagination) {
        setHasMore(pagination.currentPage < pagination.totalPages);
      } else {
        setHasMore(newDestinations.length >= 8);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Erreur destinations:", error.response?.data || error.message);
      }
      if (isNewFilter) {
        setDestinations([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Déclencher la recherche quand le filtre ou la saisie change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDestinations(true);
    }, 300); // Debounce de 300ms pour la recherche

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchQuery]);

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      
      {/* BARRE DE FILTRES ET RECHERCHE */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {continents.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              disabled={loading}
              className={`px-5 py-2 rounded-full text-[11px] font-bold tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                filter === c 
                ? 'bg-[#F19300] text-white shadow-lg' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Rechercher un pays, une ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1D3A8A]/10 outline-none transition-all disabled:opacity-50"
          />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2D3E50] uppercase tracking-[0.15em] mb-10">
        Explorez nos destinations
      </h2>

      {/* GRILLE */}
      {loading && destinations.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl">
          <Loader2 className="animate-spin mx-auto mb-4 text-[#F19300]" size={40} />
          <p className="text-gray-400">Chargement des destinations...</p>
        </div>
      ) : destinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <Link
              href={`/destinations/${dest.slug}`}
              key={dest.id}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-xl bg-slate-200 hover:shadow-2xl transition-shadow"
            >
              <Image
                src={dest.coverImage || '/images/placeholder-dest.jpg'}
                alt={dest.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold tracking-wide mb-1 uppercase">{dest.name}</h3>
                <p className="text-xs font-light text-white/80 tracking-widest uppercase">
                  {dest.articleCount || 0} Articles & Vidéos
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl">
          <p className="text-gray-400 text-lg">
            Aucune destination ne correspond à vos critères de recherche.
          </p>
        </div>
      )}

      {/* BOUTON VOIR PLUS */}
      {hasMore && destinations.length > 0 && (
        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => fetchDestinations(false)}
            disabled={loading}
            className="bg-[#1D3A8A] hover:bg-[#F19300] disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-10 py-4 rounded-lg font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Chargement...
              </>
            ) : (
              'Voir plus de destinations'
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default DestinationGrid;