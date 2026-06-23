// src/components/videos/VideoCTASection.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Video } from 'lucide-react';
import ModaleDevis from '@/components/shared/ModaleDevis';

// ─── Hook reveal ──────────────────────────────────────────────────────────────

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

// ─── Composant ────────────────────────────────────────────────────────────────

const VideoCTASection = () => {
  const [isModaleOpen, setIsModaleOpen] = useState(false);
  const { ref, visible } = useReveal(0.1);

  return (
    <section className="py-12 sm:py-16 px-5 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref as React.RefCallback<HTMLDivElement>}
          className="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-700"
          style={{
            background: '#0D2B1A',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
          }}
        >
          {/* Motif grille */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Lueur terracotta */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full pointer-events-none transition-opacity duration-1000"
            style={{
              background: 'radial-gradient(ellipse at 100% 30%, #B85C38 0%, transparent 65%)',
              opacity: visible ? 0.15 : 0,
              transitionDelay: '300ms',
            }}
          />
          {/* Barre accent */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] origin-left"
            style={{
              background: '#B85C38',
              transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s',
              transform: visible ? 'scaleX(1)' : 'scaleX(0)',
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row min-h-[360px] md:min-h-[400px]">

            {/* Texte */}
            <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-14 flex flex-col justify-center gap-5">

              {/* Icône */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700"
                style={{
                  background: '#1A5C43',
                  boxShadow: '0 8px 24px rgba(26,92,67,0.4)',
                  transitionDelay: '100ms',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'scale(1)' : 'scale(0.8)',
                }}
              >
                <Video size={20} style={{ color: '#C8A84B' }} />
              </div>

              {/* Eyebrow */}
              <div
                className="flex items-center gap-3 transition-all duration-700"
                style={{ transitionDelay: '150ms', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)' }}
              >
                <div className="h-px w-8" style={{ background: '#C8A84B' }} />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: '#C8A84B' }}>
                  Production vidéo
                </span>
              </div>

              {/* Titre */}
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase leading-tight transition-all duration-700"
                style={{
                  letterSpacing: '-0.02em',
                  transitionDelay: '220ms',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(18px)',
                }}
              >
                Créez votre reportage <span style={{ color: '#C8A84B' }}>avec nous</span>
              </h2>

              {/* Description */}
              <p
                className="text-white/65 text-sm sm:text-base leading-relaxed transition-all duration-700"
                style={{
                  transitionDelay: '300ms',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(16px)',
                }}
              >
                Donnez de la visibilité à votre destination, votre hôtel ou votre événement grâce à un reportage vidéo professionnel réalisé par i Tourisme TV. Nos équipes vous accompagnent de la conception à la diffusion.
              </p>

              {/* CTA */}
              <div
                className="transition-all duration-700"
                style={{ transitionDelay: '380ms', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)' }}
              >
                <button
                  onClick={() => setIsModaleOpen(true)}
                  className="group inline-flex items-center gap-2 font-bold text-sm px-7 py-4 rounded-full text-white transition-all shadow-lg hover:shadow-xl active:scale-95"
                  style={{ background: '#B85C38' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
                >
                  Demander un Devis Reportage
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="w-full md:w-1/2 relative min-h-[220px] md:min-h-0">
              <img
                src="/images/tournage-video.png"
                alt="Équipe de tournage en action"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000"
                style={{ transform: visible ? 'scale(1)' : 'scale(1.06)' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to right, rgba(13,43,26,0.6) 0%, transparent 60%)' }}
              />
            </div>
          </div>
        </div>
      </div>

      <ModaleDevis isOpen={isModaleOpen} onClose={() => setIsModaleOpen(false)} />
    </section>
  );
};

export default VideoCTASection;













// // src/components/videos/VideoCTASection.tsx
// "use client";

// import React, { useState } from 'react';
// import { ArrowRight } from 'lucide-react';
// // Importation de la modale spécifique aux devis vidéo
// import ModaleDevis from '@/components/shared/ModaleDevis';

// const VideoCTASection = () => {
//   // État pour contrôler l'ouverture de la modale de devis
//   const [isModaleOpen, setIsModaleOpen] = useState(false);

//   return (
//     <section className="py-16 px-6 bg-white">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex flex-col md:flex-row bg-[#163066] rounded-xl overflow-hidden shadow-2xl min-h-[400px]">
          
//           {/* --- PARTIE TEXTE --- */}
//           <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-start space-y-6">
//             <h2 className="text-3xl md:text-4xl font-serif font-bold text-white uppercase leading-tight">
//               Créez votre reportage avec nous
//             </h2>
            
//             <p className="text-blue-100/80 leading-relaxed text-sm md:text-base">
//               Donnez de la visibilité à votre destination, votre hôtel ou votre événement grâce à un reportage vidéo professionnel réalisé par i Tourisme TV. Nos équipes vous accompagnent de la conception à la diffusion.
//             </p>

//             {/* Bouton qui déclenche l'ouverture du formulaire de devis */}
//             <button 
//               onClick={() => setIsModaleOpen(true)}
//               className="flex items-center gap-3 bg-[#F19300] hover:bg-[#d98400] text-[#163066] font-bold px-8 py-4 rounded-lg transition-all active:scale-95 shadow-lg group"
//             >
//               Demander un Devis Reportage
//               <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
//             </button>
//           </div>

//           {/* --- PARTIE IMAGE --- */}
//           <div className="w-full md:w-1/2 relative h-64 md:h-auto">
//             <img 
//               src="/images/tournage-video.png" 
//               alt="Équipe de tournage en action" 
//               className="absolute inset-0 w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-black/10" />
//           </div>
//         </div>
//       </div>

//       {/* --- INJECTION DE LA MODALE DEVIS --- */}
//       <ModaleDevis 
//         isOpen={isModaleOpen} 
//         onClose={() => setIsModaleOpen(false)} 
//       />
//     </section>
//   );
// };

// export default VideoCTASection;