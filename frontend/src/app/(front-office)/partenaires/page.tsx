// src/app/(front-office)/partenaires-annonceurs/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import PartnersHero from '@/components/partners/PartnersHero';
import ValueProposition from '@/components/partners/ValueProposition';
import StatsMetrics from '@/components/partners/StatsMetrics';
import VisibilityOpportunities from '@/components/partners/VisibilityOpportunities';
import PartnerLogos from '@/components/partners/PartnerLogos';
import PartnersContact from '@/components/partners/PartnersContact';
import { Loader2 } from 'lucide-react';

// --- Définition des Interfaces ---
interface HeroData {
  title: string;
  description: string;
  imageUrl: string;
}

interface ValueItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

interface StatItem {
  id: string;
  value: string;
  label: string;
}

interface Opportunity {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  iconType: 'display' | 'content' | 'magazine' | 'salons';
}

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
}

interface PartnersPageData {
  hero: HeroData;
  values: ValueItem[];
  stats: StatItem[];
  mediaKitUrl: string;
  opportunities: Opportunity[];
  partners: Partner[];
}

const PartenairesPage = () => {
  const [data, setData] = useState<PartnersPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPartnersData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // ✅ Endpoint principal : Toutes les données de la page partenaires
        const response = await api.get('/pages/partners');
        
        setData(response.data.data || response.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.error("Erreur API Partenaires:", err.message);
          
          // En cas d'erreur 404, on affiche quand même la page avec les données par défaut
          if (err.response?.status === 404) {
            console.info("Endpoint /pages/partners non disponible, utilisation des données par défaut");
          } else {
            setError("Impossible de charger les données. Veuillez réessayer plus tard.");
          }
        }
        
        // Les composants géreront leurs propres fallbacks
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPartnersData();
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-it-orange mx-auto" />
          <p className="text-gray-500 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-it-orange text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-it-blue transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <PartnersHero 
        onOpenOffers={scrollToContact} 
        data={data?.hero} 
      />

      <ValueProposition 
        values={data?.values} 
      />

      <StatsMetrics 
        stats={data?.stats} 
        mediaKitUrl={data?.mediaKitUrl} 
      />

      <VisibilityOpportunities 
        opportunities={data?.opportunities} 
      />

      <PartnerLogos 
        partners={data?.partners} 
      />

      <div id="contact-form">
        <PartnersContact />
      </div>
    </main>
  );
};

export default PartenairesPage;