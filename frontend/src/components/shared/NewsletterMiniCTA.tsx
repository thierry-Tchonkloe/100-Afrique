// src/components/shared/NewsletterMiniCTA.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

interface NewsletterMiniCTAProps {
  /** Le nom mis en avant dans le titre, ex: "Hôtellerie" ou "salon" */
  highlight: string;
  /** Texte avant le highlight, ex: "Abonnez-vous pour suivre" ou "Ne manquez aucun" */
  prefix: string;
  href?: string;
}

const NewsletterMiniCTA = ({ highlight, prefix, href = '/actualites#newsletter' }: NewsletterMiniCTAProps) => {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);

  return (
    <section
      className="py-16 px-4 relative overflow-hidden"
      style={{ background: '#0D2B1A' }}
    >
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)', backgroundSize: '20px 20px' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"
        style={{ background: 'radial-gradient(ellipse at 100% 0%, #B85C38, transparent 70%)' }} />
      <div
        ref={ref}
        className="relative z-10 max-w-xl mx-auto text-center transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)' }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: '#C8A84B' }}>
          — Ne manquez rien
        </p>
        <h3 className="text-2xl md:text-3xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
          {prefix} <span style={{ color: '#C8A84B' }}>{highlight}</span>
        </h3>
        <p className="text-white/40 text-sm mb-8">
          Les actualités du secteur directement dans votre boîte mail.
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full text-white transition-all hover:shadow-xl active:scale-95"
          style={{ background: '#B85C38' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
          onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
        >
          S&apos;abonner gratuitement <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};

export default NewsletterMiniCTA;