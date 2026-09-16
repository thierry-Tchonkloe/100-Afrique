// src/components/partners/PartnersContact.tsx
"use client";

import React from 'react';
import PartnersContactForm from './contact/PartnersContactForm';
import PartnersDirectContact from './contact/PartnersDirectContact';

const PartnersContact = () => (
  <section
    id="contact-form"
    className="relative py-28 px-6 overflow-hidden"
    style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=80')",
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

    <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-it-gold/20 blur-3xl pointer-events-none" />
    <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-it-emerald/25 blur-3xl pointer-events-none" />

    <div className="relative z-10 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center uppercase mb-4">
        Prêt à lancer votre campagne ?
      </h2>
      <p className="text-center text-slate-300 text-sm mb-16 tracking-wide">
        Notre équipe régie vous répond sous 24h ouvrées
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <PartnersContactForm />
        <PartnersDirectContact />
      </div>
    </div>
  </section>
);

export default PartnersContact;