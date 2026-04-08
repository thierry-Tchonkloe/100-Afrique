// src/components/partners/VisibilityOpportunities.tsx
"use client";

import React from 'react';
import { Layout, PenTool, BookOpen, Mic2 } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  iconType: 'display' | 'content' | 'magazine' | 'salons';
}

interface VisibilityOpportunitiesProps {
  opportunities?: Opportunity[];
}

const IconBox = ({ type }: { type: string }) => {
  const baseStyles = "p-3 rounded-lg flex items-center justify-center text-white shadow-md";
  const iconSize = 24;

  switch (type) {
    case 'display':
      return <div className={`${baseStyles} bg-[#1D3A8A]`}><Layout size={iconSize} /></div>;
    case 'content':
      return <div className={`${baseStyles} bg-[#F19300]`}><PenTool size={iconSize} /></div>;
    case 'magazine':
      return <div className={`${baseStyles} bg-[#1D3A8A]`}><BookOpen size={iconSize} /></div>;
    case 'salons':
      return <div className={`${baseStyles} bg-[#F19300]`}><Mic2 size={iconSize} /></div>;
    default:
      return <div className={`${baseStyles} bg-[#1D3A8A]`}><Layout size={iconSize} /></div>;
  }
};

const VisibilityOpportunities = ({ opportunities }: VisibilityOpportunitiesProps) => {
  const defaultOps: Opportunity[] = [
    {
      id: '1',
      title: "Publicité Display",
      subtitle: "Bannières stratégiquement placées : Header, Sidebar, In-Article, Footer",
      description: "Optimisez votre visibilité sur l'ensemble de notre plateforme web.",
      iconType: 'display',
      features: ["Formats standards IAB", "Ciblage géographique", "Statistiques détaillées"]
    },
    {
      id: '2',
      title: "Contenus Sponsorisés",
      subtitle: "Articles, dossiers spéciaux, vidéos avec mention \"Sponsorisé\"",
      description: "Engagez notre audience avec du contenu à forte valeur ajoutée.",
      iconType: 'content',
      features: ["Rédaction professionnelle", "Optimisation SEO", "Promotion multi-canaux"]
    },
    {
      id: '3',
      title: "Partenariat Magazine",
      subtitle: "Espaces publicitaires dans l'édition papier et numérique",
      description: "Associez votre image à notre support de prestige trimestriel.",
      iconType: 'magazine',
      features: ["Double exposition print/digital", "Formats premium", "Distribution ciblée"]
    },
    {
      id: '4',
      title: "Couverture Salons",
      subtitle: "Reportages, interviews et mise en avant lors des événements",
      description: "Devenez l'acteur incontournable des grands rendez-vous du tourisme.",
      iconType: 'salons',
      features: ["Couverture en direct", "Interviews exclusives", "Contenu multi-format"]
    }
  ];

  const data = opportunities || defaultOps;

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D3E50] text-center uppercase tracking-[0.2em] mb-16">
          Vos Opportunités de Visibilité
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.map((op) => (
            <div 
              key={op.id} 
              className="flex flex-col md:flex-row gap-6 p-8 bg-white border border-slate-100 rounded-xl shadow-[0_5px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300"
            >
              <div className="shrink-0">
                <IconBox type={op.iconType} />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#2D3E50] mb-1">{op.title}</h3>
                  <p className="text-sm text-gray-500 font-medium italic">{op.subtitle}</p>
                </div>
                
                <ul className="space-y-2">
                  {op.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F19300]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisibilityOpportunities;


