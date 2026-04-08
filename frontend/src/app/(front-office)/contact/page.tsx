// src/app/(front-office)/contact/page.tsx
"use client";

import React from 'react';
import AboutHeroSection from '@/components/contact/AboutHeroSection';
import MissionVisionSection from '@/components/contact/MissionVisionSection';
import EditorialTeamSection from '@/components/contact/EditorialTeamSection';
import ContactSection from '@/components/contact/ContactSection';

/**
 * PAGE PRINCIPALE : À PROPOS / CONTACT
 * Structure assemblée selon les maquettes fournies.
 */
const AboutContactPage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* SECTION 1 : HERO (Titre & Navigation) */}
      <AboutHeroSection />

      {/* SECTION 2 : MISSION, VISION & STATS (API) */}
      <MissionVisionSection />

      {/* SECTION 3 : ÉQUIPE ÉDITORIALE (API) */}
      <EditorialTeamSection />

      {/* SECTION 4 : FORMULAIRE DE CONTACT & INFOS (API) */}
      <div className="bg-white border-t border-gray-100">
        <ContactSection />
      </div>
    </main>
  );
};

export default AboutContactPage;