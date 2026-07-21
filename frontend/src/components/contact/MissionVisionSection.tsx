// src/components/contact/MissionVisionSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';

interface StatsData {
  monthlyReaders: string;
  articlesPublished: string;
  countriesCovered: string;
}

const MissionVisionSection = () => {
  const [stats, setStats] = useState<StatsData>({
    monthlyReaders: "50K+",
    articlesPublished: "200+",
    countriesCovered: "30+",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/about/stats');
        if (response.data) setStats(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        <h2 className="text-3xl md:text-4xl font-serif font-bold text-it-blue text-center uppercase mb-12">
          Notre Mission et Notre Vision
        </h2>

        {/* Bloc texte — bordure gauche gold */}
        <div className="bg-slate-50 rounded-r-xl border-l-4 border-it-gold p-8 md:p-12 mb-16 shadow-sm">
          <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
            <p>
              Créé pour valoriser les destinations africaines et informer les professionnels du tourisme, WAXÉHO et i Tourisme TV forment un duo complémentaire unique dans le paysage médiatique touristique francophone.
            </p>
            <p>
              <span className="font-bold text-it-blue">WAXEHO</span>, magazine digital et expertise éditoriale, offre des analyses approfondies, des reportages exclusifs et une couverture complète de l&apos;actualité touristique africaine et internationale. Notre équipe de journalistes spécialisés décrypte les tendances, met en lumière les innovations et accompagne les acteurs du secteur.
            </p>
            <p>
              <span className="font-bold text-it-blue">iTourisme TV</span>, plateforme vidéo et reportages immersifs, donne vie aux destinations à travers des documentaires, interviews et contenus visuels captivants. Nous créons des ponts entre les cultures et inspirons les voyageurs du monde entier.
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: stats.monthlyReaders,    label: "Lecteurs Mensuels"  },
            { value: stats.articlesPublished,  label: "Articles Publiés"   },
            { value: stats.countriesCovered,   label: "Pays Couverts"      },
          ].map(({ value, label }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-8 text-center transition-transform hover:scale-105">
              <span className="block text-4xl font-bold text-it-gold mb-2">
                {value}
              </span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MissionVisionSection;
