// src/components/salons/AgendaSection.tsx
"use client";

import React from 'react';
import { Calendar, MapPin, Globe, Plane, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type?: 'calendar' | 'globe' | 'plane'; 
  slug: string;
}

interface AgendaSectionProps {
  events: Event[];
}

const AgendaSection = ({ events }: AgendaSectionProps) => {
  if (!events || events.length === 0) {
    return (
      <div className="py-10 text-center border border-dashed border-gray-200 rounded-lg">
        <p className="text-gray-400 text-sm font-light">
          Aucun événement programmé pour le moment.
        </p>
      </div>
    );
  }

  // Fonction pour afficher l'icône correcte selon le type ou le titre
  const renderIcon = (event: Event) => {
    const iconProps = { className: "text-white", size: 24 };
    
    const titleLower = event.title.toLowerCase();
    if (titleLower.includes('wtm') || titleLower.includes('world travel market')) {
      return <Globe {...iconProps} />;
    }
    if (titleLower.includes('iftm') || titleLower.includes('itb')) {
      return <Plane {...iconProps} />;
    }
    return <Calendar {...iconProps} />;
  };

  return (
    <section className="space-y-10">
      <h2 className="text-[#001A4D] text-2xl font-serif font-bold uppercase tracking-widest">
        Agenda des prochains événements
      </h2>
      
      <div className="space-y-4">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="flex flex-col md:flex-row gap-6 border border-gray-100 rounded-xl p-8 bg-white shadow-sm hover:shadow-lg transition-shadow"
          >
            {/* Icône Carrée Bleu Nuit */}
            <div className="w-16 h-16 shrink-0 rounded-lg flex items-center justify-center bg-[#1E3A8A]">
              {renderIcon(event)}
            </div>

            {/* Contenu Informatif */}
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold text-[#333] hover:text-[#F39C12] transition-colors">
                {event.title}
              </h3>

              {/* Métadonnées : Date et Lieu */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-500">
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-600" /> 
                  {event.date}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-600" /> 
                  {event.location}
                </span>
              </div>

              <p className="text-gray-500 text-[15px] leading-relaxed font-light max-w-4xl line-clamp-2">
                {event.description}
              </p>

              {/* Lien d'action orange */}
              <Link 
                href={`/evenements/${event.slug}`}
                className="inline-flex items-center gap-1 text-[#F39C12] font-bold text-sm hover:underline transition-all group"
              >
                Consulter la Fiche Salon 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AgendaSection;