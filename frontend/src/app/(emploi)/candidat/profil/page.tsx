// src/app/(emploi)/candidat/profil/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Save } from 'lucide-react';
import { useProfil } from '@/hooks/useProfil';
import SectionNav, { SECTIONS } from '@/components/candidat/profil/SectionNav';
import IdentiteSection from '@/components/candidat/profil/IdentiteSection';
import ExperiencesSection from '@/components/candidat/profil/ExperiencesSection';
import FormationsSection from '@/components/candidat/profil/FormationsSection';
import CompetencesSection from '@/components/candidat/profil/CompetencesSection';
import { CvSection, VisibilitySection } from '@/components/candidat/profil/CvVisibilitySection';
import type { CandidatProfil, AvailabilityOption } from '@/types/profil.types';

export default function MonProfilPage() {
  const { profil, loading, setProfil } = useProfil();
  const [activeSection, setActiveSection] = useState('identite');
  const mainRef = useRef<HTMLDivElement>(null);

  // Track which section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loading]);

  function update(patch: Partial<CandidatProfil>) {
    setProfil((prev) => prev ? { ...prev, ...patch } : prev);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#E8622A] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Chargement du profil…</p>
        </div>
      </div>
    );
  }

  if (!profil) return null;

  return (
    <div className="flex gap-0 h-full">
      {/* ── Sticky Left Nav ───────────────────────────────────────────────── */}
      <aside className="hidden lg:block w-52 flex-shrink-0 p-5 sticky top-0 h-screen overflow-y-auto">
        <SectionNav active={activeSection} />
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div ref={mainRef} className="flex-1 min-w-0 p-6 space-y-6 pb-24 overflow-y-auto">
        {/* Page Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-sm text-gray-400 mt-1">
            Créez et gérez votre CV numérique pour maximiser vos opportunités
          </p>
        </div>

        {/* Sections */}
        <IdentiteSection
          profil={profil}
          onChange={(patch) => update(patch)}
        />

        <ExperiencesSection
          experiences={profil.experiences}
          onChange={(exps) => update({ experiences: exps })}
        />

        <FormationsSection
          formations={profil.formations}
          onChange={(forms) => update({ formations: forms })}
        />

        <CompetencesSection
          hardSkills={profil.hardSkills}
          softSkills={profil.softSkills}
          languages={profil.languages}
          onChange={(skills) => update(skills)}
        />

        <CvSection
          cvFile={profil.cvFile}
          onChange={(cv) => update({ cvFile: cv ?? undefined })}
        />

        <VisibilitySection
          isVisible={profil.isVisible}
          availability={profil.availability}
          onChange={(v) => update(v as Pick<CandidatProfil, 'isVisible' | 'availability'>)}
        />
      </div>

      {/* ── Floating Save Button (mobile) ─────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-5 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <button
          className="pointer-events-auto flex items-center gap-2 bg-[#E8622A] text-white text-sm
                     font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-[#E8622A]/30"
        >
          <Save size={16} />
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}