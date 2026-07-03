// src/components/about/MissionVisionSection.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { ViseMark, HorizonMark } from '@/components/icons/CustomIcons';
import api from '@/lib/api';

interface StatsData {
  monthlyReaders: string;
  articlesPublished: string;
  countriesCovered: string;
  yearsExperience: string;
}

const DEFAULT_STATS: StatsData = {
  monthlyReaders:    '50K+',
  articlesPublished: '200+',
  countriesCovered:  '30+',
  yearsExperience:   '10+',
};

function useReveal(threshold = 0.1) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useCallback((node: HTMLElement | null) => setEl(node), []);
  useEffect(() => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);
  return { ref, visible };
}

const MissionVisionSection = () => {
  const [stats, setStats] = useState<StatsData>(DEFAULT_STATS);

  const { ref: headingRef, visible: headingVisible } = useReveal(0.1);
  const { ref: missionRef, visible: missionVisible } = useReveal(0.1);
  const { ref: visionRef,  visible: visionVisible  } = useReveal(0.1);
  const { ref: statsRef,   visible: statsVisible   } = useReveal(0.1);

  useEffect(() => {
    api.get('/about/stats')
      .then((r) => { if (r.data) setStats(r.data); })
      .catch(() => {});
  }, []);

  return (
    <section
      className="relative py-16 sm:py-20 px-5 sm:px-6 overflow-hidden"
      style={{
        backgroundImage: 'url(/images/mission-vision-bg.jpg)',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.93) 0%, rgba(248,250,249,0.90) 50%, rgba(255,253,244,0.92) 100%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 w-96 h-96 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(26,92,67,0.07) 0%, transparent 65%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(200,168,75,0.08) 0%, transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Titre */}
        <div
          ref={headingRef as React.RefCallback<HTMLDivElement>}
          className="text-center mb-12 sm:mb-16 transition-all duration-700"
          style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? 'translateY(0)' : 'translateY(24px)' }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#B85C38' }}>
            Ce qui nous anime
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight" style={{ color: '#1A2B4A' }}>
            Notre mission &amp; notre vision
          </h2>
        </div>

        {/* Mission / Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-16">

          {/* Mission — ViseMark remplace Target */}
          <div
            ref={missionRef as React.RefCallback<HTMLDivElement>}
            className="rounded-2xl p-7 sm:p-10 border-l-4 transition-all duration-700"
            style={{
              background: 'rgba(248,250,249,0.75)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(26,92,67,0.12)',
              borderLeft: '4px solid #1A5C43',
              opacity: missionVisible ? 1 : 0,
              transform: missionVisible ? 'translateX(0)' : 'translateX(-32px)',
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#1A5C43' }}>
                {/* ViseMark remplace Target */}
                <ViseMark size={18} className="text-white" strokeWidth={1.6} />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide" style={{ color: '#1A2B4A' }}>
                Notre Mission
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Créé pour valoriser les destinations africaines et informer les professionnels du tourisme,{' '}
              <strong style={{ color: '#1A5C43' }}>Waxeho</strong> et{' '}
              <strong style={{ color: '#1A5C43' }}>iTourisme TV</strong> forment un duo complémentaire unique dans le paysage médiatique touristique francophone.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Notre équipe de journalistes spécialisés décrypte les tendances, met en lumière les innovations et accompagne les acteurs du secteur avec des analyses approfondies et des reportages exclusifs.
            </p>
          </div>

          {/* Vision — HorizonMark remplace Eye */}
          <div
            ref={visionRef as React.RefCallback<HTMLDivElement>}
            className="rounded-2xl p-7 sm:p-10 transition-all duration-700"
            style={{
              background: 'rgba(253,249,240,0.75)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(200,168,75,0.18)',
              borderLeft: '4px solid #C8A84B',
              opacity: visionVisible ? 1 : 0,
              transform: visionVisible ? 'translateX(0)' : 'translateX(32px)',
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#C8A84B' }}>
                {/* HorizonMark remplace Eye */}
                <HorizonMark size={18} className="text-white" strokeWidth={1.6} />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide" style={{ color: '#1A2B4A' }}>
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
        <div
          ref={statsRef as React.RefCallback<HTMLDivElement>}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {[
            { value: stats.monthlyReaders,   label: 'Lecteurs Mensuels' },
            { value: stats.articlesPublished, label: 'Articles Publiés'  },
            { value: stats.countriesCovered,  label: 'Pays Couverts'     },
            { value: stats.yearsExperience,   label: "Ans d'expérience"  },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className="rounded-2xl p-5 sm:p-6 text-center transition-all duration-700 hover:scale-105"
              style={{
                background: 'rgba(26,92,67,0.88)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(200,168,75,0.2)',
                transitionDelay: `${i * 100}ms`,
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? 'translateY(0)' : 'translateY(28px)',
              }}
            >
              <span className="block text-3xl sm:text-4xl font-serif font-bold mb-1" style={{ color: '#C8A84B' }}>
                {value}
              </span>
              <span className="text-[10px] sm:text-sm font-medium tracking-wide text-white/70">
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












// // src/components/about/MissionVisionSection.tsx
// "use client";

// import React, { useEffect, useState, useCallback } from 'react';
// import { Target, Eye } from 'lucide-react';
// import api from '@/lib/api';

// interface StatsData {
//   monthlyReaders: string;
//   articlesPublished: string;
//   countriesCovered: string;
//   yearsExperience: string;
// }

// const DEFAULT_STATS: StatsData = {
//   monthlyReaders:    '50K+',
//   articlesPublished: '200+',
//   countriesCovered:  '30+',
//   yearsExperience:   '10+',
// };

// function useReveal(threshold = 0.1) {
//   const [el, setEl] = useState<HTMLElement | null>(null);
//   const [visible, setVisible] = useState(false);
//   const ref = useCallback((node: HTMLElement | null) => setEl(node), []);

//   useEffect(() => {
//     if (!el) return;
//     const rect = el.getBoundingClientRect();
//     if (rect.top < window.innerHeight && rect.bottom > 0) { setVisible(true); return; }
//     const obs = new IntersectionObserver(
//       ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
//       { threshold }
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [el, threshold]);

//   return { ref, visible };
// }

// const MissionVisionSection = () => {
//   const [stats, setStats] = useState<StatsData>(DEFAULT_STATS);

//   const { ref: headingRef, visible: headingVisible } = useReveal(0.1);
//   const { ref: missionRef, visible: missionVisible } = useReveal(0.1);
//   const { ref: visionRef,  visible: visionVisible  } = useReveal(0.1);
//   const { ref: statsRef,   visible: statsVisible   } = useReveal(0.1);

//   useEffect(() => {
//     api.get('/about/stats')
//       .then((r) => { if (r.data) setStats(r.data); })
//       .catch(() => {});
//   }, []);

//   return (
//     <section
//       className="relative py-16 sm:py-20 px-5 sm:px-6 overflow-hidden"
//       style={{
//         backgroundImage: 'url(/images/mission-vision-bg.jpg)',
//         backgroundAttachment: 'fixed',
//         backgroundPosition: 'center center',
//         backgroundSize: 'cover',
//         backgroundRepeat: 'no-repeat',
//       }}
//     >
//       {/* Overlay blanc cassé pour lisibilité sur fond photo */}
//       <div
//         className="absolute inset-0 z-0 pointer-events-none"
//         style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.93) 0%, rgba(248,250,249,0.90) 50%, rgba(255,253,244,0.92) 100%)' }}
//         aria-hidden="true"
//       />

//       {/* Blob lumière émeraude haut-gauche */}
//       <div
//         className="absolute top-0 left-0 w-96 h-96 z-0 pointer-events-none"
//         style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(26,92,67,0.07) 0%, transparent 65%)' }}
//         aria-hidden="true"
//       />

//       {/* Blob lumière or bas-droite */}
//       <div
//         className="absolute bottom-0 right-0 w-80 h-80 z-0 pointer-events-none"
//         style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(200,168,75,0.08) 0%, transparent 65%)' }}
//         aria-hidden="true"
//       />

//       <div className="relative z-10 max-w-6xl mx-auto">

//         {/* ── Titre section ── */}
//         <div
//           ref={headingRef as React.RefCallback<HTMLDivElement>}
//           className="text-center mb-12 sm:mb-16 transition-all duration-700"
//           style={{
//             opacity: headingVisible ? 1 : 0,
//             transform: headingVisible ? 'translateY(0)' : 'translateY(24px)',
//           }}
//         >
//           <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#B85C38' }}>
//             Ce qui nous anime
//           </p>
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight" style={{ color: '#1A2B4A' }}>
//             Notre mission &amp; notre vision
//           </h2>
//         </div>

//         {/* ── Mission / Vision — 2 colonnes ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-16">

//           {/* Mission */}
//           <div
//             ref={missionRef as React.RefCallback<HTMLDivElement>}
//             className="rounded-2xl p-7 sm:p-10 border-l-4 transition-all duration-700"
//             style={{
//               background: 'rgba(248,250,249,0.75)',
//               backdropFilter: 'blur(12px)',
//               WebkitBackdropFilter: 'blur(12px)',
//               border: '1px solid rgba(26,92,67,0.12)',
//               borderLeft: '4px solid #1A5C43',
//               opacity: missionVisible ? 1 : 0,
//               transform: missionVisible ? 'translateX(0)' : 'translateX(-32px)',
//             }}
//           >
//             <div className="flex items-center gap-3 mb-5">
//               <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#1A5C43' }}>
//                 <Target size={18} className="text-white" />
//               </div>
//               <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide" style={{ color: '#1A2B4A' }}>
//                 Notre Mission
//               </h3>
//             </div>
//             <p className="text-gray-600 text-sm leading-relaxed mb-4">
//               Créé pour valoriser les destinations africaines et informer les professionnels du tourisme,{' '}
//               <strong style={{ color: '#1A5C43' }}>Waxeho</strong> et{' '}
//               <strong style={{ color: '#1A5C43' }}>iTourisme TV</strong> forment un duo complémentaire unique dans le paysage médiatique touristique francophone.
//             </p>
//             <p className="text-gray-600 text-sm leading-relaxed">
//               Notre équipe de journalistes spécialisés décrypte les tendances, met en lumière les innovations et accompagne les acteurs du secteur avec des analyses approfondies et des reportages exclusifs.
//             </p>
//           </div>

//           {/* Vision */}
//           <div
//             ref={visionRef as React.RefCallback<HTMLDivElement>}
//             className="rounded-2xl p-7 sm:p-10 transition-all duration-700"
//             style={{
//               background: 'rgba(253,249,240,0.75)',
//               backdropFilter: 'blur(12px)',
//               WebkitBackdropFilter: 'blur(12px)',
//               border: '1px solid rgba(200,168,75,0.18)',
//               borderLeft: '4px solid #C8A84B',
//               opacity: visionVisible ? 1 : 0,
//               transform: visionVisible ? 'translateX(0)' : 'translateX(32px)',
//             }}
//           >
//             <div className="flex items-center gap-3 mb-5">
//               <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#C8A84B' }}>
//                 <Eye size={18} className="text-white" />
//               </div>
//               <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide" style={{ color: '#1A2B4A' }}>
//                 Notre Vision
//               </h3>
//             </div>
//             <p className="text-gray-600 text-sm leading-relaxed mb-4">
//               Nous aspirons à devenir le partenaire médiatique de référence du tourisme africain, en proposant des contenus innovants qui contribuent au développement durable du secteur.
//             </p>
//             <p className="text-gray-600 text-sm leading-relaxed">
//               <strong style={{ color: '#B85C38' }}>iTourisme TV</strong> donne vie aux destinations à travers des documentaires, interviews et contenus visuels captivants — créant des ponts entre cultures et inspirant les voyageurs du monde entier.
//             </p>
//           </div>
//         </div>

//         {/* ── Statistiques ── */}
//         <div
//           ref={statsRef as React.RefCallback<HTMLDivElement>}
//           className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
//         >
//           {[
//             { value: stats.monthlyReaders,   label: 'Lecteurs Mensuels' },
//             { value: stats.articlesPublished, label: 'Articles Publiés'  },
//             { value: stats.countriesCovered,  label: 'Pays Couverts'     },
//             { value: stats.yearsExperience,   label: "Ans d'expérience"  },
//           ].map(({ value, label }, i) => (
//             <div
//               key={label}
//               className="rounded-2xl p-5 sm:p-6 text-center transition-all duration-700 hover:scale-105"
//               style={{
//                 background: 'rgba(26,92,67,0.88)',
//                 backdropFilter: 'blur(12px)',
//                 WebkitBackdropFilter: 'blur(12px)',
//                 border: '1px solid rgba(200,168,75,0.2)',
//                 transitionDelay: `${i * 100}ms`,
//                 opacity: statsVisible ? 1 : 0,
//                 transform: statsVisible ? 'translateY(0)' : 'translateY(28px)',
//               }}
//             >
//               <span className="block text-3xl sm:text-4xl font-serif font-bold mb-1" style={{ color: '#C8A84B' }}>
//                 {value}
//               </span>
//               <span className="text-[10px] sm:text-sm font-medium tracking-wide text-white/70">
//                 {label}
//               </span>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default MissionVisionSection;













// // src/components/about/MissionVisionSection.tsx
// "use client";

// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { Target, Eye } from 'lucide-react';
// import api from '@/lib/api';

// interface StatsData {
//   monthlyReaders: string;
//   articlesPublished: string;
//   countriesCovered: string;
//   yearsExperience: string;
// }

// const DEFAULT_STATS: StatsData = {
//   monthlyReaders:    '50K+',
//   articlesPublished: '200+',
//   countriesCovered:  '30+',
//   yearsExperience:   '10+',
// };

// // ─── Hook reveal générique ────────────────────────────────────────────────────

// function useReveal(threshold = 0.1) {
//   const [el, setEl] = useState<HTMLElement | null>(null);
//   const [visible, setVisible] = useState(false);
//   const ref = useCallback((node: HTMLElement | null) => setEl(node), []);

//   useEffect(() => {
//     if (!el) return;
//     const rect = el.getBoundingClientRect();
//     if (rect.top < window.innerHeight && rect.bottom > 0) { setVisible(true); return; }
//     const obs = new IntersectionObserver(
//       ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
//       { threshold }
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [el, threshold]);

//   return { ref, visible };
// }

// // ─── Composant principal ──────────────────────────────────────────────────────

// const MissionVisionSection = () => {
//   const [stats, setStats] = useState<StatsData>(DEFAULT_STATS);

//   const { ref: headingRef, visible: headingVisible } = useReveal(0.1);
//   const { ref: missionRef, visible: missionVisible } = useReveal(0.1);
//   const { ref: visionRef,  visible: visionVisible  } = useReveal(0.1);
//   const { ref: statsRef,   visible: statsVisible   } = useReveal(0.1);

//   useEffect(() => {
//     api.get('/about/stats')
//       .then((r) => { if (r.data) setStats(r.data); })
//       .catch(() => {});
//   }, []);

//   return (
//     <section className="py-16 sm:py-20 px-5 sm:px-6 bg-white">
//       <div className="max-w-6xl mx-auto">

//         {/* ── Titre section ── */}
//         <div
//           ref={headingRef as React.RefCallback<HTMLDivElement>}
//           className="text-center mb-12 sm:mb-16 transition-all duration-700"
//           style={{
//             opacity: headingVisible ? 1 : 0,
//             transform: headingVisible ? 'translateY(0)' : 'translateY(24px)',
//           }}
//         >
//           <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#B85C38' }}>
//             Ce qui nous anime
//           </p>
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight" style={{ color: '#1A2B4A' }}>
//             Notre mission &amp; notre vision
//           </h2>
//         </div>

//         {/* ── Mission / Vision — 2 colonnes ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-16">

//           {/* Mission — slide depuis la gauche */}
//           <div
//             ref={missionRef as React.RefCallback<HTMLDivElement>}
//             className="rounded-2xl p-7 sm:p-10 border-l-4 shadow-sm transition-all duration-700"
//             style={{
//               background: '#F8FAF9',
//               borderColor: '#1A5C43',
//               opacity: missionVisible ? 1 : 0,
//               transform: missionVisible ? 'translateX(0)' : 'translateX(-32px)',
//             }}
//           >
//             <div className="flex items-center gap-3 mb-5">
//               <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#1A5C43' }}>
//                 <Target size={18} className="text-white" />
//               </div>
//               <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide" style={{ color: '#1A2B4A' }}>
//                 Notre Mission
//               </h3>
//             </div>
//             <p className="text-gray-600 text-sm leading-relaxed mb-4">
//               Créé pour valoriser les destinations africaines et informer les professionnels du tourisme,{' '}
//               <strong style={{ color: '#1A5C43' }}>WAXÉHO</strong> et{' '}
//               <strong style={{ color: '#1A5C43' }}>i Tourisme TV</strong> forment un duo complémentaire unique dans le paysage médiatique touristique francophone.
//             </p>
//             <p className="text-gray-600 text-sm leading-relaxed">
//               Notre équipe de journalistes spécialisés décrypte les tendances, met en lumière les innovations et accompagne les acteurs du secteur avec des analyses approfondies et des reportages exclusifs.
//             </p>
//           </div>

//           {/* Vision — slide depuis la droite */}
//           <div
//             ref={visionRef as React.RefCallback<HTMLDivElement>}
//             className="rounded-2xl p-7 sm:p-10 border-l-4 shadow-sm transition-all duration-700"
//             style={{
//               background: '#FDF9F0',
//               borderColor: '#C8A84B',
//               opacity: visionVisible ? 1 : 0,
//               transform: visionVisible ? 'translateX(0)' : 'translateX(32px)',
//             }}
//           >
//             <div className="flex items-center gap-3 mb-5">
//               <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#C8A84B' }}>
//                 <Eye size={18} className="text-white" />
//               </div>
//               <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide" style={{ color: '#1A2B4A' }}>
//                 Notre Vision
//               </h3>
//             </div>
//             <p className="text-gray-600 text-sm leading-relaxed mb-4">
//               Nous aspirons à devenir le partenaire médiatique de référence du tourisme africain, en proposant des contenus innovants qui contribuent au développement durable du secteur.
//             </p>
//             <p className="text-gray-600 text-sm leading-relaxed">
//               <strong style={{ color: '#B85C38' }}>iTourisme TV</strong> donne vie aux destinations à travers des documentaires, interviews et contenus visuels captivants — créant des ponts entre cultures et inspirant les voyageurs du monde entier.
//             </p>
//           </div>
//         </div>

//         {/* ── Statistiques — cascade staggerée ── */}
//         <div
//           ref={statsRef as React.RefCallback<HTMLDivElement>}
//           className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
//         >
//           {[
//             { value: stats.monthlyReaders,    label: 'Lecteurs Mensuels' },
//             { value: stats.articlesPublished,  label: 'Articles Publiés'  },
//             { value: stats.countriesCovered,   label: 'Pays Couverts'     },
//             { value: stats.yearsExperience,    label: "Ans d'expérience"  },
//           ].map(({ value, label }, i) => (
//             <div
//               key={label}
//               className="rounded-2xl p-5 sm:p-6 text-center shadow-sm transition-all duration-700 hover:scale-105"
//               style={{
//                 background: '#1A5C43',
//                 transitionDelay: `${i * 100}ms`,
//                 opacity: statsVisible ? 1 : 0,
//                 transform: statsVisible ? 'translateY(0)' : 'translateY(28px)',
//               }}
//             >
//               <span className="block text-3xl sm:text-4xl font-serif font-bold mb-1" style={{ color: '#C8A84B' }}>
//                 {value}
//               </span>
//               <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-white/70">
//                 {label}
//               </span>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default MissionVisionSection;