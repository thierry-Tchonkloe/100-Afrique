// src/components/partners/VisibilityOpportunities.tsx
"use client";

import React from 'react';
import { PlanMark, PlumeMark, VolumeMark, TribuneMark } from '@/components/icons/CustomIcons';

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

const cardImages: Record<string, string> = {
  display:  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=900&q=80',
  content:  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&q=80',
  magazine: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=900&q=80',
  salons:   'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80',
};

const IconBox = ({ type }: { type: string }) => {
  const base = "p-3 rounded-xl flex items-center justify-center text-white shadow-lg";
  const size = 28;
  switch (type) {
    // PlanMark remplace Layout
    case 'display':  return <div className={`${base} bg-it-emerald-dark`}><PlanMark size={size} /></div>;
    // PlumeMark remplace PenTool
    case 'content':  return <div className={`${base} bg-it-gold`}><PlumeMark size={size} /></div>;
    // VolumeMark remplace BookOpen
    case 'magazine': return <div className={`${base} bg-it-emerald-dark`}><VolumeMark size={size} /></div>;
    // TribuneMark remplace Mic2
    case 'salons':   return <div className={`${base} bg-it-gold`}><TribuneMark size={size} /></div>;
    default:         return <div className={`${base} bg-it-emerald-dark`}><PlanMark size={size} /></div>;
  }
};

const VisibilityOpportunities = ({ opportunities }: VisibilityOpportunitiesProps) => {
  const defaultOps: Opportunity[] = [
    {
      id: '1', title: "Publicité Display",
      subtitle: "Bannières stratégiquement placées : Header, Sidebar, In-Article, Footer",
      description: "Optimisez votre visibilité sur l'ensemble de notre plateforme web.",
      iconType: 'display',
      features: ["Formats standards IAB", "Ciblage géographique", "Statistiques détaillées"],
    },
    {
      id: '2', title: "Contenus Sponsorisés",
      subtitle: "Articles, dossiers spéciaux, vidéos avec mention « Sponsorisé »",
      description: "Engagez notre audience avec du contenu à forte valeur ajoutée.",
      iconType: 'content',
      features: ["Rédaction professionnelle", "Optimisation SEO", "Promotion multi-canaux"],
    },
    {
      id: '3', title: "Partenariat Magazine",
      subtitle: "Espaces publicitaires dans l'édition papier et numérique",
      description: "Associez votre image à notre support de prestige trimestriel.",
      iconType: 'magazine',
      features: ["Double exposition print/digital", "Formats premium", "Distribution ciblée"],
    },
    {
      id: '4', title: "Couverture Salons",
      subtitle: "Reportages, interviews et mise en avant lors des événements",
      description: "Devenez l'acteur incontournable des grands rendez-vous du tourisme.",
      iconType: 'salons',
      features: ["Couverture en direct", "Interviews exclusives", "Contenu multi-format"],
    },
  ];

  const data = opportunities || defaultOps;

  return (
    <section className="py-24 bg-slate-50 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-it-blue text-center uppercase mb-16">
          Vos Opportunités de Visibilité
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.map((op) => (
            <div
              key={op.id}
              className="group relative overflow-hidden rounded-2xl min-h-[260px] flex flex-col justify-end cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${cardImages[op.iconType] || cardImages.display})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/10 group-hover:from-black/90 transition-all duration-500" />

              <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 right-0 w-full h-full bg-it-gold/20 blur-2xl rounded-full" />
              </div>

              <div className="relative z-10 p-7 flex gap-5">
                <div className="shrink-0 mt-1">
                  <IconBox type={op.iconType} />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-white leading-snug mb-1">{op.title}</h3>
                    <p className="text-slate-300 text-sm font-medium italic">{op.subtitle}</p>
                  </div>
                  <ul className="space-y-1.5 overflow-hidden max-h-0 group-hover:max-h-32 transition-all duration-500 ease-in-out">
                    {op.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-200 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-it-gold shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-it-terracotta group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisibilityOpportunities;
