// src/components/home/EventsDestinationsSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Calendar, Globe } from 'lucide-react';
import api from '@/lib/api';
import { AdvertisingBanner } from "@/components/AdvertisingBanner";

interface Event {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
}

interface Destination {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface DestinationArticle {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
}

interface TopBarProps {
  /** Slug de la zone défini dans l'admin — défaut: "top-banner-accueil" */
  zoneSlug?: string;
  /** Afficher les points de pagination */
  showDots?: boolean;
  className?: string;
}

const EventsDestinationsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [destinations, setDestinations] = useState<DestinationArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Appels parallèles pour optimiser
        const [resEvents, resDest] = await Promise.all([
          // TODO: Créer une catégorie "Salons & Événements" dans l'API
          api.get('/mag/articles', {
            params: {
              pageSize: 4,
              page: 1,
              status: 'PUBLISHED'
              // categoryId: ID_CATEGORY_SALONS (à ajouter)
            }
          }),
          
          // ✅ Endpoint correct : Destinations featured
          api.get('/destinations/featured', {
            params: {
              limit: 3
            }
          })
        ]);
        
        setEvents(resEvents.data.data || []);
        setDestinations(resDest.data.data || []);
      } catch (error) {
        console.error("Erreur Section Mixte:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="animate-spin text-[#F39C12]" size={40} />
      </div>
    );
  }

  return (
    <section className="py-12 bg-[#F8FAFC]">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Espace publicitaire (à implémenter) */}
        <div className="w-full bg-it-gray-light flex items-center justify-between border-b border-gray-200">
          {/* <span className="text-gray-500 text-sm font-medium italic">
            Espace Publicitaire Leaderboard 728×90
          </span> */}
          <AdvertisingBanner zoneSlug="leaderboards-footer" showDots={true} className="" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* SALONS ET ÉVÉNEMENTS */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-50 h-full">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[#1A365D] text-2xl font-bold uppercase tracking-tight">
                Salons et Événements
              </h2>
              <Calendar className="text-[#F39C12]" size={24} />
            </div>
            
            <div className="space-y-8">
              {events.map((event) => (
                <Link 
                  href={`/articles/${event.slug}`}
                  key={event.id} 
                  className="pl-4 border-l-4 border-[#F39C12] group cursor-pointer block"
                >
                  <h3 className="font-bold text-[#333] text-lg group-hover:text-[#F39C12] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                    {event.excerpt}
                  </p>
                  <p className="text-[#1A365D] font-bold text-sm mt-1">
                    {new Date(event.createdAt).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </Link>
              ))}
            </div>

            <Link 
              href="/evenements" 
              className="mt-12 inline-flex items-center gap-2 text-sm font-bold text-[#1A365D] bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all group"
            >
              Voir l&apos;Agenda Complet 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* NOS DESTINATIONS PHARES */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-50 h-full">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[#1A365D] text-2xl font-bold uppercase tracking-tight">
                Nos Destinations Phares
              </h2>
              <Globe className="text-[#F39C12]" size={24} />
            </div>

            <div className="space-y-4">
              {destinations.map((dest) => (
                <Link 
                  href={`/articles/${dest.slug}`}
                  key={dest.id} 
                  className="relative h-28 rounded-xl overflow-hidden group cursor-pointer block"
                >
                  <img 
                    src={dest.coverImage} 
                    alt={dest.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute inset-0 flex flex-col justify-center px-6">
                    <h3 className="text-white font-bold text-lg">{dest.title}</h3>
                    <p className="text-white/80 text-xs">Découvrir la destination</p>
                  </div>
                </Link>
              ))}
            </div>

            <Link 
              href="/destinations" 
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#1A365D] bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all group"
            >
              Explorer toutes les destinations 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EventsDestinationsSection;