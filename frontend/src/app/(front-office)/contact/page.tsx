// src/app/(front-office)/contact/page.tsx
"use client";

import React from 'react';
import ContactHeroSection from '@/components/contact/ContactHeroSection';
import ContactFormSection from '@/components/contact/ContactFormSection';
import ContactMapSection from '@/components/contact/ContactMapSection';

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* SECTION 1 : HERO */}
      <ContactHeroSection />

      {/* SECTION 2 : Formulaire + Coordonnées */}
      <ContactFormSection />

      {/* SECTION 3 : Carte interactive + Légal */}
      <ContactMapSection />
    </main>
  );
};

export default ContactPage;
