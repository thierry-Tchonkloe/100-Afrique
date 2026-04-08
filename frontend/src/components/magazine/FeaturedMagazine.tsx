// src/components/magazine/FeaturedMagazine.tsx
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Loader2, Download, ShoppingCart, CreditCard } from 'lucide-react';
import { fetchMagazines } from '@/services/Dashboard/magazineService';

interface Magazine {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string;
  url: string;
  metaTitle?: string;
  readOnlineUrl?: string;
}

const FeaturedMagazine = () => {
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestMagazine = async () => {
      try {
        const response = await fetchMagazines({
          page: 1,
          pageSize: 1,
          sortBy: 'publishedAt',
          sortOrder: 'desc',
        });
        
        if (response.success && response.data.magazines.length > 0) {
          setMagazine(response.data.magazines[0]);
        }
      } catch (error) {
        console.error("Erreur magazine:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestMagazine();
  }, []);

  if (loading) return (
    <div className="h-[500px] flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-it-blue" size={40} />
    </div>
  );

  if (!magazine) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Aucun magazine disponible pour le moment</p>
      </div>
    );
  }

  // Générer le numéro et la date depuis les données
  const magazineNumber = magazine.metaTitle || "N°12";
  const magazineDate = new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  }).toUpperCase();
  const magazineUrl = `/magazine/${magazine.slug}`;

  // Points forts par défaut (à remplacer par des données structurées dans l'API)
  const highlights = [
    "Dossier spécial : Top 20 des destinations africaines émergentes",
    "Interviews exclusives avec les acteurs majeurs du secteur",
    "Analyses des tendances et opportunités d'investissement",
    "Guide pratique pour les professionnels du tourisme"
  ];

  return (
    <section className="py-20 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* BLOC GAUCHE : VISUEL */}
          <div className="relative group">
            <div className="absolute -top-4 -right-4 z-20 bg-it-orange text-white font-black px-6 py-2 rounded-lg shadow-lg transform rotate-3">
              NOUVEAU
            </div>
            
            <div className="absolute inset-0 bg-gray-200 rounded-[2rem] transform translate-x-4 translate-y-4 -z-10 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
            
            <div className="relative aspect-[3/4] w-full max-w-[450px] mx-auto overflow-hidden rounded-[2rem] shadow-2xl">
              <Image 
                src={magazine.coverImage || '/images/magazine-placeholder.jpg'} 
                alt={magazine.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* BLOC DROIT : CONTENU */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-it-orange font-bold tracking-widest uppercase text-sm">
                NUMÉRO {magazineNumber} — {magazineDate}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-it-blue leading-tight">
                {magazine.title}
              </h2>
              {magazine.excerpt && (
                <p className="text-gray-600 text-base leading-relaxed">
                  {magazine.excerpt}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-black text-it-blue uppercase tracking-tighter">
                AU SOMMAIRE :
              </h3>
              <ul className="space-y-3">
                {highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-600">
                    <Check size={18} className="text-it-orange mt-1 shrink-0" />
                    <span className="text-[15px] leading-relaxed italic">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Boutons d'action principaux */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href={magazineUrl}
                className="flex-1 bg-it-orange hover:bg-[#d98400] text-white font-black py-5 px-8 rounded-xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest shadow-xl shadow-it-orange/20 active:scale-95"
              >
                <Download size={18} />
                Consulter l&apos;aperçu
              </Link>
              <Link
                href="/magazine"
                className="flex-1 border-2 border-it-orange text-it-orange hover:bg-it-orange hover:text-white font-black py-5 px-8 rounded-xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest active:scale-95"
              >
                <ShoppingCart size={18} />
                Voir la collection
              </Link>
            </div>

            {/* Barre Offre Spéciale d'Abonnement */}
            <div className="bg-gradient-to-r from-it-orange to-[#E67E00] rounded-2xl p-4 flex items-center justify-between shadow-lg">
              <div className="pl-4">
                <p className="text-white font-black text-sm uppercase">Offre spéciale abonnement</p>
                <p className="text-orange-100 text-[11px] font-medium italic">
                  Économisez 25% sur l&apos;abonnement annuel
                </p>
              </div>
              <Link
                href="/magazine"
                className="bg-it-blue text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-tighter hover:bg-black transition-colors flex items-center gap-2"
              >
                <CreditCard size={14} />
                DÉCOUVRIR
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedMagazine;
