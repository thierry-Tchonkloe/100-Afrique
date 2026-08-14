'use client';
// src/app/(emploi)/candidat/profil/page.tsx

import { useRef } from 'react';
import { useProfil } from '@/hooks/useProfil';
import { useProfilSectionSync } from '@/hooks/useProfilSectionSync';
import SectionNav from '@/components/candidat/profil/SectionNav';
import IdentiteSection from '@/components/candidat/profil/IdentiteSection';
import ExperiencesSection from '@/components/candidat/profil/ExperiencesSection';
import FormationsSection from '@/components/candidat/profil/FormationsSection';
import CompetencesSection from '@/components/candidat/profil/CompetencesSection';
import { CvSection, VisibilitySection } from '@/components/candidat/profil/CvVisibilitySection';
import ProfilMobileSaveButton from '@/components/candidat/profil/ProfilMobileSaveButton';
import type { CandidatProfil } from '@/types/profil.types';

export default function MonProfilPage() {
  const { profil, loading, setProfil } = useProfil();
  const mainRef = useRef<HTMLDivElement>(null);

  // Tous les hooks AVANT tout return conditionnel — le hook gère lui-même
  // le cas "pas encore prêt" en interne.
  const activeSection = useProfilSectionSync(!loading);

  function update(patch: Partial<CandidatProfil>) {
    setProfil((prev) => ({ ...prev, ...patch }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Chargement du profil…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-0 h-full">
      <aside className="hidden lg:block w-52 flex-shrink-0 p-5 sticky top-0 h-screen overflow-y-auto">
        <SectionNav active={activeSection} />
      </aside>

      <div ref={mainRef} className="flex-1 min-w-0 p-6 space-y-6 pb-24 overflow-y-auto">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-sm text-gray-400 mt-1">
            Créez et gérez votre CV numérique pour maximiser vos opportunités
          </p>
        </div>

        <IdentiteSection profil={profil} onChange={(patch) => update(patch)} />

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

      <ProfilMobileSaveButton />
    </div>
  );
}
