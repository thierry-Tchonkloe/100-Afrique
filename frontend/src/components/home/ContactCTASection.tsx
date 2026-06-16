// src/components/home/ContactCTASection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Facebook, Twitter, Linkedin, Instagram, Youtube, ArrowRight, TrendingUp, Users, Globe, Award } from 'lucide-react';
import ModaleAnnonceur from '@/components/shared/ModaleAnnonceur';

// ─── Compteur animé ───────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = '', duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString('fr-FR')}{suffix}</span>;
}

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatItem {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
}

const STATS: StatItem[] = [
  { icon: <Users size={20} />, value: 45000, suffix: '+', label: 'Professionnels du tourisme' },
  { icon: <Globe size={20} />, value: 32, suffix: ' pays', label: 'Présence en Afrique' },
  { icon: <TrendingUp size={20} />, value: 98, suffix: '%', label: 'Satisfaction partenaires' },
  { icon: <Award size={20} />, value: 12, suffix: ' ans', label: 'D\'expertise média' },
];

// ─── Réseaux sociaux ──────────────────────────────────────────────────────────

const SOCIALS = [
  { icon: <Facebook size={18} />, color: '#1877F2', link: '#', name: 'Facebook' },
  { icon: <Twitter size={18} />, color: '#1DA1F2', link: '#', name: 'Twitter' },
  { icon: <Linkedin size={18} />, color: '#0A66C2', link: '#', name: 'LinkedIn' },
  { icon: <Instagram size={18} />, color: '#E4405F', link: '#', name: 'Instagram' },
  { icon: <Youtube size={18} />, color: '#FF0000', link: '#', name: 'YouTube' },
];

// ─── Section principale ───────────────────────────────────────────────────────

const ContactCTASection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ref: sectionRef, visible } = useRevealSection();

  return (
    <section className="relative overflow-hidden" style={{ background: '#0D2B1A' }}>

      {/* Pattern décoratif */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Lumière émeraude ambiante */}
      <div className="absolute top-0 left-0 w-1/2 h-full opacity-20" style={{ background: 'radial-gradient(ellipse at 0% 50%, #1A5C43 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-15" style={{ background: 'radial-gradient(ellipse at 100% 100%, #B85C38 0%, transparent 70%)' }} />

      <div ref={sectionRef} className="relative z-10 max-w-[1300px] mx-auto px-6 py-20 md:py-28">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-16 overflow-hidden rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center transition-all duration-700"
              style={{
                background: 'rgba(255,255,255,0.03)',
                transitionDelay: `${i * 100}ms`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(20px)',
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: '#1A5C43' }}>
                {stat.icon}
              </div>
              <p className="text-2xl md:text-3xl font-black text-white leading-none">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-white/40 font-medium leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── CTA principal ── */}
        <div
          className="flex flex-col items-center text-center transition-all duration-700 delay-300"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)' }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12" style={{ background: '#C8A84B' }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: '#C8A84B' }}>Rejoignez-nous</span>
            <div className="h-px w-12" style={{ background: '#C8A84B' }} />
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
            Devenez Partenaire<br />
            <span style={{ color: '#C8A84B' }}>de la Voix Africaine</span>
          </h2>

          <p className="max-w-xl text-white/55 text-lg leading-relaxed mb-10">
            Rejoignez notre réseau de partenaires et bénéficiez d&apos;une visibilité unique auprès des professionnels du tourisme africain et international.
          </p>

          {/* Boutons CTA */}
          <div className="flex flex-wrap justify-center gap-4 mb-14">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-full text-white transition-all hover:shadow-2xl active:scale-95"
              style={{ background: '#B85C38', boxShadow: '0 8px 32px rgba(184,92,56,0.3)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
              onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
            >
              Demander le Kit Média
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="https://wa.me/229XXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-full text-white transition-all hover:shadow-xl active:scale-95"
              style={{ background: '#1DB954', border: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#179443')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1DB954')}
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>

          {/* Réseaux sociaux */}
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-5 text-white/30">
            Suivez-nous
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map((s, i) => (
              <a
                key={i}
                href={s.link}
                title={s.name}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90"
                style={{ background: s.color }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <ModaleAnnonceur isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

// Hook local
function useRevealSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default ContactCTASection;









// // src/components/home/ContactCTASection.tsx
// "use client";

// import React, { useState } from 'react';
// import { MessageCircle, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
// import ModaleAnnonceur from '@/components/shared/ModaleAnnonceur';

// const ContactCTASection = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const socialLinks = [
//     { icon: <Facebook size={20} />, color: '#1877F2', link: '#', name: 'Facebook' },
//     { icon: <Twitter size={20} />, color: '#1DA1F2', link: '#', name: 'Twitter' },
//     { icon: <Linkedin size={20} />, color: '#0A66C2', link: '#', name: 'LinkedIn' },
//     { icon: <Instagram size={20} />, color: '#E4405F', link: '#', name: 'Instagram' },
//     { icon: <Youtube size={20} />, color: '#FF0000', link: '#', name: 'YouTube' },
//   ];

//   return (
//     /* Fond émeraude foncé — remplace #0A2357 */
//     <section className="py-20" style={{ background: '#1A5C43' }}>
//       <div className="max-w-[1400px] mx-auto px-6">
//         <div className="flex flex-col items-center text-center space-y-8">

//           {/* Titre */}
//           <div className="space-y-4">
//             <h2 className="text-3xl md:text-5xl font-serif font-bold text-white uppercase tracking-wider">
//               DEVENIR PARTENAIRE / NOUS CONTACTER
//             </h2>
//             <p className="max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
//               Rejoignez notre réseau de partenaires et bénéficiez d&apos;une visibilité
//               unique auprès des professionnels du tourisme africain et international.
//             </p>
//           </div>

//           {/* Boutons d'action */}
//           <div className="flex flex-wrap justify-center gap-4 pt-4">
//             {/* Kit Média — terre cuite */}
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="text-white px-8 py-4 rounded-md font-bold text-sm transition-all active:scale-95"
//               style={{ background: '#B85C38' }}
//               onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
//               onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
//             >
//               Demander le Kit Média
//             </button>

//             {/* WhatsApp — vert WhatsApp conservé (couleur de marque externe) */}
//             <a
//               href="https://wa.me/229XXXXXXXX"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 text-white px-8 py-4 rounded-md font-bold text-sm transition-all active:scale-95"
//               style={{ background: '#1DB954' }}
//               onMouseEnter={e => (e.currentTarget.style.background = '#179443')}
//               onMouseLeave={e => (e.currentTarget.style.background = '#1DB954')}
//             >
//               <MessageCircle size={18} />
//               Contact WhatsApp
//             </a>
//           </div>

//           {/* Réseaux sociaux */}
//           <div className="pt-6">
//             <p
//               className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
//               style={{ color: 'rgba(255,255,255,0.45)' }}
//             >
//               Suivez-nous sur les réseaux
//             </p>
//             <div className="flex flex-wrap justify-center gap-4">
//               {socialLinks.map((social, idx) => (
//                 <a
//                   key={idx}
//                   href={social.link}
//                   title={social.name}
//                   className="text-white p-4 rounded-full transition-all shadow-md active:scale-90"
//                   style={{ background: social.color }}
//                   onMouseEnter={e => {
//                     e.currentTarget.style.transform = 'scale(1.1) rotate(6deg)';
//                   }}
//                   onMouseLeave={e => {
//                     e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
//                   }}
//                 >
//                   {social.icon}
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <ModaleAnnonceur
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </section>
//   );
// };

// export default ContactCTASection;




















// // src/components/home/ContactCTASection.tsx
// "use client";

// import React, { useState } from 'react';
// import { 
//   MessageCircle, 
//   FileText, 
//   Facebook, 
//   Twitter, 
//   Linkedin, 
//   Instagram, 
//   Youtube 
// } from 'lucide-react';
// import ModaleAnnonceur from '@/components/shared/ModaleAnnonceur';

// const ContactCTASection = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Configuration des réseaux sociaux (Liens à mettre à jour)
//   const socialLinks = [
//     { icon: <Facebook size={20} />, color: 'bg-[#1877F2]', link: '#', name: 'Facebook' },
//     { icon: <Twitter size={20} />, color: 'bg-[#1DA1F2]', link: '#', name: 'Twitter' },
//     { icon: <Linkedin size={20} />, color: 'bg-[#0A66C2]', link: '#', name: 'LinkedIn' },
//     { icon: <Instagram size={20} />, color: 'bg-[#E4405F]', link: '#', name: 'Instagram' },
//     { icon: <Youtube size={20} />, color: 'bg-[#FF0000]', link: '#', name: 'YouTube' },
//   ];

//   return (
//     <section className="py-20 bg-[#0A2357]"> {/* Fond bleu nuit identique à la capture */}
//       <div className="max-w-[1400px] mx-auto px-6">
//         <div className="flex flex-col items-center text-center space-y-8">
          
//           {/* 1. Titre et Introduction style Serif */}
//           <div className="space-y-4">
//             <h2 className="text-3xl md:text-5xl font-serif font-bold text-white uppercase tracking-wider">
//               DEVENIR PARTENAIRE / NOUS CONTACTER
//             </h2>
//             <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
//               Rejoignez notre réseau de partenaires et bénéficiez d&apos;une visibilité
//               unique auprès des professionnels du tourisme africain et international.
//             </p>
//           </div>

//           {/* 2. Boutons d'Action Rectangulaires */}
//           <div className="flex flex-wrap justify-center gap-4 pt-4">
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="bg-[#F39C12] text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-[#D68910] transition-all active:scale-95"
//             >
//               Demander le Kit Média
//             </button>

//             <a 
//               href="https://wa.me/229XXXXXXXX" 
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 bg-[#1DB954] text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-[#179443] transition-all active:scale-95"
//             >
//               <MessageCircle size={18} />
//               Contact WhatsApp
//             </a>
//           </div>

//           {/* 3. Réseaux Sociaux */}
//           <div className="pt-6">
//             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-6">
//               Suivez-nous sur les réseaux
//             </p>
//             <div className="flex flex-wrap justify-center gap-4">
//               {socialLinks.map((social, idx) => (
//                 <a 
//                   key={idx} 
//                   href={social.link}
//                   title={social.name}
//                   className={`${social.color} text-white p-4 rounded-full hover:scale-110 hover:rotate-6 transition-all shadow-md active:scale-90`}
//                 >
//                   {social.icon}
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <ModaleAnnonceur 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//       />
//     </section>
//   );
// };

// export default ContactCTASection;