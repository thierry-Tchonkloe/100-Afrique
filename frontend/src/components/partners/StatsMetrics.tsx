// src/components/partners/StatsMetrics.tsx
"use client";

import React, { useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useInView, useMotionValue, useSpring, animate, motion } from 'framer-motion';

interface StatItem {
  id: string;
  value: string;
  label: string;
}

interface StatsMetricsProps {
  stats?: StatItem[] | null;
  mediaKitUrl?: string;
}

function parseStatValue(raw: string): { number: number; prefix: string; suffix: string } {
  const match = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)([^0-9]*)$/);
  if (!match) return { number: 0, prefix: '', suffix: raw };
  return { prefix: match[1] || '', number: parseFloat(match[2]), suffix: match[3] || '' };
}

const AnimatedStat = ({ stat, index }: { stat: StatItem; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const { prefix, number, suffix } = parseStatValue(stat.value);
  const isFloat = !Number.isInteger(number);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18, mass: 1 });
  const [display, setDisplay] = React.useState('0');

  useEffect(() => {
    if (inView) {
      const controls = animate(motionVal, number, { duration: 2, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    } else {
      motionVal.set(0);
      setDisplay('0');
    }
  }, [inView, number, index, motionVal]);

  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      setDisplay(isFloat ? v.toFixed(1) : Math.round(v).toString());
    });
    return unsub;
  }, [spring, isFloat]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4 group"
    >
      {/* Nombre animé — gold pour contraster sur fond emerald-dark */}
      <div className="text-5xl md:text-6xl font-black text-it-gold tracking-tighter transition-transform duration-300 group-hover:scale-105 tabular-nums">
        {prefix}{display}{suffix}
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.4, ease: 'easeOut' }}
        className="h-[2px] w-12 bg-it-gold/50 mx-auto origin-left"
      />
      <p className="text-md text-white/70 max-w-[200px] mx-auto leading-relaxed">
        {stat.label}
      </p>
    </motion.div>
  );
};

const StatsMetrics = ({ stats, mediaKitUrl }: StatsMetricsProps) => {
  const displayStats = stats && stats.length > 0 ? stats : [
    { id: '1', value: "250K+", label: "Visiteurs Uniques / Mois" },
    { id: '2', value: "15K+",  label: "Abonnés Newsletter" },
    { id: '3', value: "2M+",   label: "Vues Vidéos / An" },
    { id: '4', value: "75%",   label: "Professionnels dans notre audience" },
  ];

  return (
    <section className="bg-it-emerald-dark py-20 px-6 text-center text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-3xl md:text-4xl font-bold uppercase"
        >
          Nos Chiffres Clés
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {displayStats.map((stat, index) => (
            <AnimatedStat key={stat.id} stat={stat} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="pt-8"
        >
          <button
            onClick={() => mediaKitUrl && window.open(mediaKitUrl, '_blank')}
            className="inline-flex items-center gap-3 bg-it-terracotta hover:bg-white hover:text-it-emerald-dark text-white font-bold px-10 py-5 rounded-lg text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95"
          >
            <Download size={20} />
            Télécharger le kit média (PDF)
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsMetrics;



















// src/components/partners/StatsMetrics.tsx
// "use client";

// import React, { useRef } from 'react';
// import { Download } from 'lucide-react';
// import { useInView, useMotionValue, useSpring, animate, motion } from 'framer-motion';
// import { useEffect } from 'react';

// interface StatItem {
//   id: string;
//   value: string;
//   label: string;
// }

// interface StatsMetricsProps {
//   stats?: StatItem[] | null;
//   mediaKitUrl?: string;
// }

// // Extracts numeric part and suffix (e.g. "250K+" → { number: 250, suffix: "K+" })
// function parseStatValue(raw: string): { number: number; prefix: string; suffix: string } {
//   const match = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)([^0-9]*)$/);
//   if (!match) return { number: 0, prefix: '', suffix: raw };
//   return {
//     prefix: match[1] || '',
//     number: parseFloat(match[2]),
//     suffix: match[3] || '',
//   };
// }

// // Animated counter for a single stat
// const AnimatedStat = ({ stat, index }: { stat: StatItem; index: number }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: false, margin: '-80px' });

//   const { prefix, number, suffix } = parseStatValue(stat.value);
//   const isFloat = !Number.isInteger(number);

//   const motionVal = useMotionValue(0);
//   const spring = useSpring(motionVal, { stiffness: 60, damping: 18, mass: 1 });
//   const [display, setDisplay] = React.useState('0');

//   useEffect(() => {
//     if (inView) {
//       // Animate up to target when entering view
//       const controls = animate(motionVal, number, {
//         duration: 2,
//         delay: index * 0.15,
//         ease: [0.16, 1, 0.3, 1],
//       });
//       return controls.stop;
//     } else {
//       // Reset to 0 when leaving view so it replays next time
//       motionVal.set(0);
//       setDisplay('0');
//     }
//   }, [inView, number, index, motionVal]);

//   useEffect(() => {
//     const unsub = spring.on('change', (v) => {
//       setDisplay(isFloat ? v.toFixed(1) : Math.round(v).toString());
//     });
//     return unsub;
//   }, [spring, isFloat]);

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, y: 30 }}
//       animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
//       transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
//       className="space-y-4 group"
//     >
//       {/* Number */}
//       <div className="text-5xl md:text-6xl font-black text-it-orange tracking-tighter transition-transform duration-300 group-hover:scale-105 tabular-nums">
//         {prefix}{display}{suffix}
//       </div>

//       {/* Animated underline */}
//       <motion.div
//         initial={{ scaleX: 0 }}
//         animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
//         transition={{ duration: 0.8, delay: index * 0.15 + 0.4, ease: 'easeOut' }}
//         className="h-[2px] w-12 bg-it-orange/50 mx-auto origin-left"
//       />

//       <p className="text-sm text-blue-100/80 font-light max-w-[200px] mx-auto leading-relaxed">
//         {stat.label}
//       </p>
//     </motion.div>
//   );
// };

// const StatsMetrics = ({ stats, mediaKitUrl }: StatsMetricsProps) => {
//   const displayStats = stats && stats.length > 0 ? stats : [
//     { id: '1', value: "250K+", label: "Visiteurs Uniques / Mois" },
//     { id: '2', value: "15K+",  label: "Abonnés Newsletter" },
//     { id: '3', value: "2M+",   label: "Vues Vidéos / An" },
//     { id: '4', value: "75%",   label: "Professionnels dans notre audience" },
//   ];

//   const handleDownload = () => {
//     if (mediaKitUrl) window.open(mediaKitUrl, '_blank');
//   };

//   return (
//     <section className="bg-it-blue py-20 px-6 text-center text-white">
//       <div className="max-w-7xl mx-auto space-y-16">
//         <motion.h2
//           initial={{ opacity: 0, y: -16 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: false }}
//           transition={{ duration: 0.6, ease: 'easeOut' }}
//           className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-[0.2em]"
//         >
//           Nos Chiffres Clés
//         </motion.h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
//           {displayStats.map((stat, index) => (
//             <AnimatedStat key={stat.id} stat={stat} index={index} />
//           ))}
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: false }}
//           transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
//           className="pt-8"
//         >
//           <button
//             onClick={handleDownload}
//             className="inline-flex items-center gap-3 bg-it-orange hover:bg-white hover:text-it-orange text-white font-bold px-10 py-5 rounded-lg text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95"
//           >
//             <Download size={20} />
//             Télécharger le kit média (PDF)
//           </button>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default StatsMetrics;




















// // src/components/partners/StatsMetrics.tsx
// "use client";

// import React from 'react';
// import { Download } from 'lucide-react';

// interface StatItem {
//   id: string;
//   value: string;
//   label: string;
// }

// interface StatsMetricsProps {
//   stats?: StatItem[] | null;
//   mediaKitUrl?: string;
// }

// const StatsMetrics = ({ stats, mediaKitUrl }: StatsMetricsProps) => {
//   // Fallback si l'API ne renvoie pas de stats
//   const displayStats = stats && stats.length > 0 ? stats : [
//     { id: '1', value: "250K+", label: "Visiteurs Uniques / Mois" },
//     { id: '2', value: "15K+", label: "Abonnés Newsletter" },
//     { id: '3', value: "2M+", label: "Vues Vidéos / An" },
//     { id: '4', value: "75%", label: "Professionnels dans notre audience" }
//   ];

//   const handleDownload = () => {
//     if (mediaKitUrl) {
//       window.open(mediaKitUrl, '_blank');
//     }
//   };

//   return (
//     <section className="bg-it-blue py-20 px-6 text-center text-white">
//       <div className="max-w-7xl mx-auto space-y-16">
//         <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-[0.2em]">
//           Nos Chiffres Clés
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
//           {displayStats.map((stat) => (
//             <div key={stat.id} className="space-y-4 group">
//               <div className="text-5xl md:text-6xl font-black text-it-orange tracking-tighter transition-transform group-hover:scale-105">
//                 {stat.value}
//               </div>
//               <p className="text-sm text-blue-100/80 font-light max-w-[200px] mx-auto">
//                 {stat.label}
//               </p>
//             </div>
//           ))}
//         </div>

//         <div className="pt-8">
//           <button 
//             onClick={handleDownload}
//             className="inline-flex items-center gap-3 bg-it-orange hover:bg-white hover:text-it-orange text-white font-bold px-10 py-5 rounded-lg text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95"
//           >
//             <Download size={20} />
//             Télécharger le kit média (PDF)
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default StatsMetrics;