// src/app/(front-office)/emploi/page.tsx
import React from 'react';
import HeroSection from '@/components/emploi/HeroSection';
import CandidateExperience from '@/components/emploi/CandidateExperience';
import RecruiterExperience from '@/components/emploi/RecruiterExperience';
import MediaExpertise from '@/components/emploi/MediaExpertise';
import NewsletterSection from '@/components/emploi/NewsletterSection';

export default function EmploiPage() {
  return (
    <main className="min-h-screen bg-white font-sans antialiased">
      <HeroSection />

      {/* Ajoutez l'ID 'candidats' ici */}
      <div id="candidats" className="scroll-mt-20"> 
        <CandidateExperience />
      </div>

      {/* Ajoutez l'ID 'recruteurs' ici */}
      <div id="recruteurs" className="scroll-mt-20 border-t border-slate-50">
        <RecruiterExperience />
      </div>

      <MediaExpertise />
      <NewsletterSection />
    </main>
  );
}


