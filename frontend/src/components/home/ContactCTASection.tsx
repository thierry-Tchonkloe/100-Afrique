// src/components/home/ContactCTASection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, TrendingUp, Users, Award } from 'lucide-react';
import { RoutePlanet, WaveMark, CordeMark } from '@/components/icons/CustomIcons';
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
  { icon: <Users size={26} />,         value: 45000, suffix: '+',    label: 'Professionnels du tourisme' },
  { icon: <RoutePlanet size={30} />,   value: 32,    suffix: ' pays',label: 'Présence en Afrique'        },
  { icon: <TrendingUp size={26} />,    value: 98,    suffix: '%',    label: 'Satisfaction partenaires'   },
  { icon: <Award size={26} />,         value: 12,    suffix: ' ans', label: "D'expertise média"          },
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
      <div className="absolute top-0 left-0 w-1/2 h-full opacity-20"
        style={{ background: 'radial-gradient(ellipse at 0% 50%, #1A5C43 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-15"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, #B85C38 0%, transparent 70%)' }} />

      <div ref={sectionRef} className="relative z-10 max-w-[1300px] mx-auto px-6 py-12 md:py-18">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-16 overflow-hidden rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
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
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: '#1A5C43' }}>
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
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12" style={{ background: '#C8A84B' }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: '#C8A84B' }}>
              Rejoignez-nous
            </span>
            <div className="h-px w-12" style={{ background: '#C8A84B' }} />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}>
            Devenez Partenaire<br />
            <span style={{ color: '#C8A84B' }}>de la Voix Africaine</span>
          </h2>

          <p className="max-w-xl text-white/55 text-lg leading-relaxed mb-10">
            Rejoignez notre réseau de partenaires et bénéficiez d&apos;une visibilité unique
            auprès des professionnels du tourisme africain et international.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
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
              href="https://wa.me/22901974480097"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-full text-white transition-all hover:shadow-xl active:scale-95"
              style={{ background: '#1DB954', border: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#179443')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1DB954')}
            >
              {/* WaveMark remplace MessageCircle */}
              <WaveMark size={20} />
              WhatsApp
            </a>
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
