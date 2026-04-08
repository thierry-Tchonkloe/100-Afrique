// src/components/partners/ValueProposition.tsx
"use client";

import React from 'react';
import { Users, Globe, PlayCircle, Award } from 'lucide-react';

// Interface pour les éléments de la proposition de valeur
interface ValueItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // "users" | "globe" | "play" | "award"
}

interface ValuePropositionProps {
  values?: ValueItem[];
}

// Helper pour mapper les noms d'icônes venant de l'API aux composants Lucide
const IconRenderer = ({ iconName }: { iconName: string }) => {
  const props = { size: 32, className: "text-white" };
  switch (iconName) {
    case 'users': return <div className="bg-[#1D3A8A] p-4 rounded-full shadow-lg"><Users {...props} /></div>;
    case 'globe': return <div className="bg-[#F19300] p-4 rounded-full shadow-lg"><Globe {...props} /></div>;
    case 'play': return <div className="bg-[#1D3A8A] p-4 rounded-full shadow-lg"><PlayCircle {...props} /></div>;
    case 'award': return <div className="bg-[#F19300] p-4 rounded-full shadow-lg"><Award {...props} /></div>;
    default: return <div className="bg-[#1D3A8A] p-4 rounded-full shadow-lg"><Users {...props} /></div>;
  }
};

const ValueProposition = ({ values }: ValuePropositionProps) => {
  // Données par défaut conformes à la capture si l'API ne renvoie rien
  const defaultValues: ValueItem[] = [
    {
      id: '1',
      title: "Public Cible Qualifié",
      description: "Professionnels du tourisme, offices de tourisme et institutions spécialisées",
      iconName: 'users'
    },
    {
      id: '2',
      title: "Portée Internationale",
      description: "Couverture complète Afrique et International avec focus afro-européen",
      iconName: 'globe'
    },
    {
      id: '3',
      title: "Contenu Multi-Formats",
      description: "Articles, vidéos, magazine papier et présence événementielle",
      iconName: 'play'
    },
    {
      id: '4',
      title: "Notoriété Reconnue",
      description: "Média de référence reconnu par les acteurs du secteur",
      iconName: 'award'
    }
  ];

  const dataToDisplay = values || defaultValues;

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        {/* Titre de la section - Style Waxeho */}
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D3E50] text-center uppercase tracking-[0.15em] mb-20 border-b-2 border-slate-100 pb-8">
          Notre Proposition de Valeur Unique
        </h2>

        {/* Grille des cartes de valeur */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dataToDisplay.map((item) => (
            <div 
              key={item.id}
              className="group flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-slate-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Icône avec cercle coloré */}
              <div className="mb-8 transform group-hover:scale-110 transition-transform duration-300">
                <IconRenderer iconName={item.iconName} />
              </div>

              {/* Titre */}
              <h3 className="text-xl font-bold text-[#2D3E50] mb-4 group-hover:text-[#1D3A8A] transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;


