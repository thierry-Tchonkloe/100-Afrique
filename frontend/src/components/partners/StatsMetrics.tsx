// src/components/partners/StatsMetrics.tsx
"use client";

import React from 'react';
import { Download } from 'lucide-react';

interface StatItem {
  id: string;
  value: string;
  label: string;
}

interface StatsMetricsProps {
  stats?: StatItem[] | null;
  mediaKitUrl?: string;
}

const StatsMetrics = ({ stats, mediaKitUrl }: StatsMetricsProps) => {
  // Fallback si l'API ne renvoie pas de stats
  const displayStats = stats && stats.length > 0 ? stats : [
    { id: '1', value: "250K+", label: "Visiteurs Uniques / Mois" },
    { id: '2', value: "15K+", label: "Abonnés Newsletter" },
    { id: '3', value: "2M+", label: "Vues Vidéos / An" },
    { id: '4', value: "75%", label: "Professionnels dans notre audience" }
  ];

  const handleDownload = () => {
    if (mediaKitUrl) {
      window.open(mediaKitUrl, '_blank');
    }
  };

  return (
    <section className="bg-it-blue py-20 px-6 text-center text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-[0.2em]">
          Nos Chiffres Clés
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {displayStats.map((stat) => (
            <div key={stat.id} className="space-y-4 group">
              <div className="text-5xl md:text-6xl font-black text-it-orange tracking-tighter transition-transform group-hover:scale-105">
                {stat.value}
              </div>
              <p className="text-sm text-blue-100/80 font-light max-w-[200px] mx-auto">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-8">
          <button 
            onClick={handleDownload}
            className="inline-flex items-center gap-3 bg-it-orange hover:bg-white hover:text-it-orange text-white font-bold px-10 py-5 rounded-lg text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95"
          >
            <Download size={20} />
            Télécharger le kit média (PDF)
          </button>
        </div>
      </div>
    </section>
  );
};

export default StatsMetrics;