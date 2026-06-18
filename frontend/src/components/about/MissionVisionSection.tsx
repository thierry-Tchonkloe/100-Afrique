// src/components/about/MissionVisionSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Target, Eye } from 'lucide-react';
import api from '@/lib/api';

interface StatsData {
  monthlyReaders: string;
  articlesPublished: string;
  countriesCovered: string;
  yearsExperience: string;
}

const DEFAULT_STATS: StatsData = {
  monthlyReaders: '50K+',
  articlesPublished: '200+',
  countriesCovered: '30+',
  yearsExperience: '10+',
};

const MissionVisionSection = () => {
  const [stats, setStats] = useState<StatsData>(DEFAULT_STATS);

  useEffect(() => {
    api.get('/about/stats')
      .then((r) => { if (r.data) setStats(r.data); })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Titre section */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#B85C38' }}>
            Ce qui nous anime
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-tight" style={{ color: '#1A2B4A' }}>
            Notre mission &amp; notre vision
          </h2>
        </div>

        {/* Mission / Vision — 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

          {/* Mission */}
          <div className="rounded-2xl p-8 md:p-10 border-l-4 shadow-sm" style={{ background: '#F8FAF9', borderColor: '#1A5C43' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1A5C43' }}>
                <Target size={18} className="text-white" />
              </div>
              <h3 className="text-lg font-serif font-bold uppercase tracking-wide" style={{ color: '#1A2B4A' }}>
                Notre Mission
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Créé pour valoriser les destinations africaines et informer les professionnels du tourisme, <strong style={{ color: '#1A5C43' }}>WAXÉHO</strong> et <strong style={{ color: '#1A5C43' }}>i Tourisme TV</strong> forment un duo complémentaire unique dans le paysage médiatique touristique francophone.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Notre équipe de journalistes spécialisés décrypte les tendances, met en lumière les innovations et accompagne les acteurs du secteur avec des analyses approfondies et des reportages exclusifs.
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-2xl p-8 md:p-10 border-l-4 shadow-sm" style={{ background: '#FDF9F0', borderColor: '#C8A84B' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#C8A84B' }}>
                <Eye size={18} className="text-white" />
              </div>
              <h3 className="text-lg font-serif font-bold uppercase tracking-wide" style={{ color: '#1A2B4A' }}>
                Notre Vision
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Nous aspirons à devenir le partenaire médiatique de référence du tourisme africain, en proposant des contenus innovants qui contribuent au développement durable du secteur.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              <strong style={{ color: '#B85C38' }}>iTourisme TV</strong> donne vie aux destinations à travers des documentaires, interviews et contenus visuels captivants — créant des ponts entre cultures et inspirant les voyageurs du monde entier.
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: stats.monthlyReaders,   label: 'Lecteurs Mensuels'  },
            { value: stats.articlesPublished, label: 'Articles Publiés'   },
            { value: stats.countriesCovered,  label: 'Pays Couverts'      },
            { value: stats.yearsExperience,   label: "Ans d'expérience"   },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl p-6 text-center transition-transform hover:scale-105 shadow-sm"
              style={{ background: '#1A5C43' }}
            >
              <span className="block text-3xl md:text-4xl font-serif font-bold mb-1" style={{ color: '#C8A84B' }}>
                {value}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-white/70">
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