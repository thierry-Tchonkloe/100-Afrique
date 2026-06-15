// src/components/partners/ValueProposition.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Users, Globe, PlayCircle, Award } from 'lucide-react';
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
    case 'globe':  return <Globe {...props} />;
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
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-it-blue text-center uppercase tracking-[0.15em] mb-20 border-b-2 border-slate-100 pb-8">
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


















// // src/components/partners/ValueProposition.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import { Users, Globe, PlayCircle, Award } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// interface ValueItem {
//   id: string;
//   title: string;
//   description: string;
//   iconName: string;
// }

// interface ValuePropositionProps {
//   values?: ValueItem[];
// }

// // Background images from Unsplash (free, no auth needed)
// const cardBackgrounds: Record<string, string> = {
//   users: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80', // professionals meeting
//   globe: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80', // world map / globe
//   play: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=80',  // camera / media production
//   award: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80', // trophy / award
// };

// const IconRenderer = ({ iconName }: { iconName: string }) => {
//   const props = { size: 32, className: "text-white" };
//   switch (iconName) {
//     case 'users':  return <Users {...props} />;
//     case 'globe':  return <Globe {...props} />;
//     case 'play':   return <PlayCircle {...props} />;
//     case 'award':  return <Award {...props} />;
//     default:       return <Users {...props} />;
//   }
// };

// const iconBg: Record<string, string> = {
//   users: 'bg-[#1D3A8A]',
//   globe: 'bg-[#F19300]',
//   play:  'bg-[#1D3A8A]',
//   award: 'bg-[#F19300]',
// };

// const AUTOPLAY_INTERVAL = 3500;

// const ValueProposition = ({ values }: ValuePropositionProps) => {
//   const defaultValues: ValueItem[] = [
//     {
//       id: '1',
//       title: "Public Cible Qualifié",
//       description: "Professionnels du tourisme, offices de tourisme et institutions spécialisées",
//       iconName: 'users',
//     },
//     {
//       id: '2',
//       title: "Portée Internationale",
//       description: "Couverture complète Afrique et International avec focus afro-européen",
//       iconName: 'globe',
//     },
//     {
//       id: '3',
//       title: "Contenu Multi-Formats",
//       description: "Articles, vidéos, magazine papier et présence événementielle",
//       iconName: 'play',
//     },
//     {
//       id: '4',
//       title: "Notoriété Reconnue",
//       description: "Média de référence reconnu par les acteurs du secteur",
//       iconName: 'award',
//     },
//   ];

//   const data = values || defaultValues;
//   const [current, setCurrent] = useState(0);

//   // Auto-advance carousel
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % data.length);
//     }, AUTOPLAY_INTERVAL);
//     return () => clearInterval(timer);
//   }, [data.length]);

//   return (
//     <section className="py-24 bg-white px-6">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D3E50] text-center uppercase tracking-[0.15em] mb-20 border-b-2 border-slate-100 pb-8">
//           Notre Proposition de Valeur Unique
//         </h2>

//         {/* ── Desktop grid (md+): 4 cards side by side ── */}
//         <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
//           {data.map((item) => (
//             <div
//               key={item.id}
//               className="group relative overflow-hidden rounded-2xl min-h-[320px] flex flex-col justify-end cursor-pointer"
//             >
//               {/* Background image */}
//               <div
//                 className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
//                 style={{ backgroundImage: `url(${cardBackgrounds[item.iconName] || cardBackgrounds.users})` }}
//               />

//               {/* Dark gradient overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/90 transition-all duration-500" />

//               {/* Content */}
//               <div className="relative z-10 p-6 space-y-3">
//                 <div className={`inline-flex p-3 rounded-full ${iconBg[item.iconName] || 'bg-[#1D3A8A]'} shadow-lg`}>
//                   <IconRenderer iconName={item.iconName} />
//                 </div>

//                 <h3 className="text-xl font-bold text-white leading-tight">
//                   {item.title}
//                 </h3>

//                 {/* Description slides up on hover */}
//                 <p className="text-slate-300 text-sm leading-relaxed font-light max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-500 ease-in-out">
//                   {item.description}
//                 </p>
//               </div>

//               {/* Bottom accent line */}
//               <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#F19300] group-hover:w-full transition-all duration-500" />
//             </div>
//           ))}
//         </div>

//         {/* ── Mobile: Framer Motion carousel ── */}
//         <div className="md:hidden relative overflow-hidden rounded-2xl">
//           <div className="relative h-[360px]">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={data[current].id}
//                 initial={{ opacity: 0, x: 80 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -80 }}
//                 transition={{ duration: 0.45, ease: 'easeInOut' }}
//                 className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col justify-end"
//               >
//                 {/* Background image */}
//                 <div
//                   className="absolute inset-0 bg-cover bg-center"
//                   style={{
//                     backgroundImage: `url(${cardBackgrounds[data[current].iconName] || cardBackgrounds.users})`,
//                   }}
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

//                 <div className="relative z-10 p-7 space-y-3">
//                   <div className={`inline-flex p-3 rounded-full ${iconBg[data[current].iconName] || 'bg-[#1D3A8A]'} shadow-lg`}>
//                     <IconRenderer iconName={data[current].iconName} />
//                   </div>
//                   <h3 className="text-2xl font-bold text-white">{data[current].title}</h3>
//                   <p className="text-slate-300 text-sm leading-relaxed font-light">
//                     {data[current].description}
//                   </p>
//                 </div>
//                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F19300]" />
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {/* Dot indicators */}
//           <div className="flex justify-center gap-2 mt-5">
//             {data.map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setCurrent(idx)}
//                 className={`h-2 rounded-full transition-all duration-300 ${
//                   idx === current ? 'w-8 bg-[#F19300]' : 'w-2 bg-slate-300'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ValueProposition;















// // src/components/partners/ValueProposition.tsx
// "use client";

// import React from 'react';
// import { Users, Globe, PlayCircle, Award } from 'lucide-react';

// // Interface pour les éléments de la proposition de valeur
// interface ValueItem {
//   id: string;
//   title: string;
//   description: string;
//   iconName: string; // "users" | "globe" | "play" | "award"
// }

// interface ValuePropositionProps {
//   values?: ValueItem[];
// }

// // Helper pour mapper les noms d'icônes venant de l'API aux composants Lucide
// const IconRenderer = ({ iconName }: { iconName: string }) => {
//   const props = { size: 32, className: "text-white" };
//   switch (iconName) {
//     case 'users': return <div className="bg-[#1D3A8A] p-4 rounded-full shadow-lg"><Users {...props} /></div>;
//     case 'globe': return <div className="bg-[#F19300] p-4 rounded-full shadow-lg"><Globe {...props} /></div>;
//     case 'play': return <div className="bg-[#1D3A8A] p-4 rounded-full shadow-lg"><PlayCircle {...props} /></div>;
//     case 'award': return <div className="bg-[#F19300] p-4 rounded-full shadow-lg"><Award {...props} /></div>;
//     default: return <div className="bg-[#1D3A8A] p-4 rounded-full shadow-lg"><Users {...props} /></div>;
//   }
// };

// const ValueProposition = ({ values }: ValuePropositionProps) => {
//   // Données par défaut conformes à la capture si l'API ne renvoie rien
//   const defaultValues: ValueItem[] = [
//     {
//       id: '1',
//       title: "Public Cible Qualifié",
//       description: "Professionnels du tourisme, offices de tourisme et institutions spécialisées",
//       iconName: 'users'
//     },
//     {
//       id: '2',
//       title: "Portée Internationale",
//       description: "Couverture complète Afrique et International avec focus afro-européen",
//       iconName: 'globe'
//     },
//     {
//       id: '3',
//       title: "Contenu Multi-Formats",
//       description: "Articles, vidéos, magazine papier et présence événementielle",
//       iconName: 'play'
//     },
//     {
//       id: '4',
//       title: "Notoriété Reconnue",
//       description: "Média de référence reconnu par les acteurs du secteur",
//       iconName: 'award'
//     }
//   ];

//   const dataToDisplay = values || defaultValues;

//   return (
//     <section className="py-24 bg-white px-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Titre de la section - Style Waxeho */}
//         <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D3E50] text-center uppercase tracking-[0.15em] mb-20 border-b-2 border-slate-100 pb-8">
//           Notre Proposition de Valeur Unique
//         </h2>

//         {/* Grille des cartes de valeur */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {dataToDisplay.map((item) => (
//             <div 
//               key={item.id}
//               className="group flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-slate-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-2"
//             >
//               {/* Icône avec cercle coloré */}
//               <div className="mb-8 transform group-hover:scale-110 transition-transform duration-300">
//                 <IconRenderer iconName={item.iconName} />
//               </div>

//               {/* Titre */}
//               <h3 className="text-xl font-bold text-[#2D3E50] mb-4 group-hover:text-[#1D3A8A] transition-colors">
//                 {item.title}
//               </h3>

//               {/* Description */}
//               <p className="text-gray-500 text-sm leading-relaxed font-light">
//                 {item.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ValueProposition;


