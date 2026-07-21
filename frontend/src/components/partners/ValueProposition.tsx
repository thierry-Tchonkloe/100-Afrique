// src/components/partners/ValueProposition.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Users, Globe, PlayCircle, Award } from 'lucide-react';
import { RoutePlanet } from '@/components/icons/CustomIcons';
import { motion, AnimatePresence } from 'framer-motion';

interface ValueItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

interface ValuePropositionProps {
  values?: ValueItem[];
}

const cardBackgrounds: Record<string, string> = {
  users: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
  globe: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80',
  play:  'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=80',
  award: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
};

const IconRenderer = ({ iconName }: { iconName: string }) => {
  const props = { size: 32, className: "text-white" };
  switch (iconName) {
    case 'users':  return <Users {...props} />;
    case 'globe':  return <RoutePlanet {...props} />;
    case 'play':   return <PlayCircle {...props} />;
    case 'award':  return <Award {...props} />;
    default:       return <Users {...props} />;
  }
};

// Icônes : alternance emerald-dark / gold
const iconBg: Record<string, string> = {
  users: 'bg-it-emerald-dark',
  globe: 'bg-it-gold',
  play:  'bg-it-emerald-dark',
  award: 'bg-it-gold',
};

const AUTOPLAY_INTERVAL = 3500;

const ValueProposition = ({ values }: ValuePropositionProps) => {
  const defaultValues: ValueItem[] = [
    { id: '1', title: "Public Cible Qualifié",    description: "Professionnels du tourisme, offices de tourisme et institutions spécialisées", iconName: 'users' },
    { id: '2', title: "Portée Internationale",    description: "Couverture complète Afrique et International avec focus afro-européen",         iconName: 'globe' },
    { id: '3', title: "Contenu Multi-Formats",    description: "Articles, vidéos, magazine papier et présence événementielle",                   iconName: 'play'  },
    { id: '4', title: "Notoriété Reconnue",        description: "Média de référence reconnu par les acteurs du secteur",                         iconName: 'award' },
  ];

  const data = values || defaultValues;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % data.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [data.length]);

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-it-blue text-center uppercase mb-16 border-b-2 border-slate-100 pb-8">
          Notre Proposition de Valeur Unique
        </h2>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl min-h-[320px] flex flex-col justify-end cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${cardBackgrounds[item.iconName] || cardBackgrounds.users})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/90 transition-all duration-500" />
              <div className="relative z-10 p-6 space-y-3">
                <div className={`inline-flex p-3 rounded-full ${iconBg[item.iconName] || 'bg-it-emerald-dark'} shadow-lg`}>
                  <IconRenderer iconName={item.iconName} />
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed font-light max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-500 ease-in-out">
                  {item.description}
                </p>
              </div>
              {/* Accent terracotta */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-it-terracotta group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden relative overflow-hidden rounded-2xl">
          <div className="relative h-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={data[current].id}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col justify-end"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${cardBackgrounds[data[current].iconName] || cardBackgrounds.users})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
                <div className="relative z-10 p-7 space-y-3">
                  <div className={`inline-flex p-3 rounded-full ${iconBg[data[current].iconName] || 'bg-it-emerald-dark'} shadow-lg`}>
                    <IconRenderer iconName={data[current].iconName} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{data[current].title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-light">{data[current].description}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-it-terracotta" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-2 mt-5">
            {data.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === current ? 'w-8 bg-it-terracotta' : 'w-2 bg-slate-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
