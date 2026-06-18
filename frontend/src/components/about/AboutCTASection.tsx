// src/components/about/AboutCTASection.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

const AboutCTASection = () => {
  return (
    <section className="py-20 px-6" style={{ background: '#1A5C43' }}>
      <div className="max-w-4xl mx-auto text-center">

        <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: '#C8A84B' }}>
          Travaillons ensemble
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white uppercase tracking-tight mb-4">
          Construisons ensemble votre présence dans le tourisme africain
        </h2>
        <p className="text-white/65 text-sm max-w-xl mx-auto mb-10">
          Vous avez un projet, une opportunité de partenariat ou une question ? Notre équipe est prête à vous accompagner.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-bold py-3.5 px-8 rounded-full text-sm uppercase tracking-widest text-white transition-all shadow-lg hover:shadow-xl active:scale-95"
            style={{ background: '#B85C38' }}
          >
            <Mail size={15} /> Nous contacter <ArrowRight size={15} />
          </Link>
          <Link
            href="/partenaires"
            className="inline-flex items-center gap-2 font-bold py-3.5 px-8 rounded-full text-sm uppercase tracking-widest transition-all border-2"
            style={{ borderColor: '#C8A84B', color: '#C8A84B' }}
          >
            Devenir partenaire
          </Link>
        </div>

      </div>
    </section>
  );
};

export default AboutCTASection;