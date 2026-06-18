// src/app/(front-office)/a-propos/page.tsx
"use client";

import React from 'react';
import AboutHeroSection from '@/components/about/AboutHeroSection';
import MissionVisionSection from '@/components/about/MissionVisionSection';
import EditorialTeamSection from '@/components/about/EditorialTeamSection';
import AboutCTASection from '@/components/about/AboutCTASection';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <AboutHeroSection />
      <MissionVisionSection />
      <EditorialTeamSection />
      <AboutCTASection />
    </main>
  );
};

export default AboutPage;