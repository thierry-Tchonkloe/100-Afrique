// src/components/home/MagazineSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface Magazine {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  createdAt: string;
  metaTitle?: string;
  category: {
    name: string;
  };
}

const MagazineSection = () => {
  const [latestMag, setLatestMag] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMagazine = async () => {
      try {
        // ✅ Endpoint futur : Catégorie "Magazine" spécifique
        // Pour l'instant, on récupère le dernier article featured
        const res = await api.get('/mag/articles', {
          params: {
            featured: true,
            pageSize: 1,
            page: 1,
            status: 'PUBLISHED'
            // TODO: Ajouter categoryId pour "Magazine" dans l'API
          }
        });
        
        if (res.data && res.data.data.length > 0) {
          setLatestMag(res.data.data[0]);
        }
      } catch (error) {
        console.error("Erreur MagazineSection:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMagazine();
  }, []);

  const defaultPoints = [
    "Dossier spécial : Top 20 des destinations africaines émergentes",
    "Interviews exclusives avec les acteurs majeurs du secteur",
    "Analyses des tendances et opportunités d'investissement"
  ];

  if (loading) {
    return (
      <div className="py-24 bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#F39C12]" size={40} />
        <p className="text-[#001A4D] font-medium">Chargement du magazine...</p>
      </div>
    );
  }

  const issueDate = latestMag 
    ? new Date(latestMag.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase()
    : "DÉCEMBRE 2024";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1300px] mx-auto px-6">
        <h2 className="text-center text-[#001A4D] text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest mb-16">
          Le Magazine Waxeho
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          <div className="w-full lg:w-1/2 flex justify-center items-center bg-[#8fb0c5] rounded-xl p-12 aspect-square lg:aspect-auto min-h-[500px] shadow-sm">
            <div className="relative w-full max-w-[450px] drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:scale-[1.02]">
              <img 
                src={latestMag?.coverImage || "/magazine-mockup.png"} 
                alt={latestMag?.title || "Couverture WAXEHO"}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <div className="bg-[#F39C12] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              NUMÉRO {issueDate}
            </div>

            <h3 className="text-4xl font-serif font-bold text-[#333] mb-6 leading-tight">
              {latestMag?.title || "Spécial Destinations Africaines 2025"}
            </h3>

            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-lg">
              {latestMag?.excerpt || "Découvrez notre dossier exclusif sur les destinations africaines qui feront 2025."}
            </p>

            <ul className="space-y-4 mb-10">
              {defaultPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <div className="mt-1 flex-shrink-0">
                    <Check size={18} className="text-[#F39C12]" />
                  </div>
                  <span className="text-gray-700 text-[15px]">{point}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link 
                href={latestMag ? `/articles/${latestMag.slug}` : "/magazine"}
                className="px-8 py-3.5 border-2 border-[#001A4D] text-[#001A4D] rounded-lg font-bold text-sm hover:bg-[#001A4D] hover:text-white transition-all tracking-wide"
              >
                Consulter cet extrait
              </Link>
              
              <Link 
                href="/abonnement"
                className="px-8 py-3.5 bg-[#F39C12] text-white rounded-lg font-bold text-sm hover:bg-[#D68910] transition-all tracking-wide shadow-md"
              >
                S&apos;abonner / Acheter
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MagazineSection;