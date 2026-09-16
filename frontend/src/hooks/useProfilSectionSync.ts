// src/hooks/useProfilSectionSync.ts
// Synchronise la section active de la page Profil avec la position de
// scroll (IntersectionObserver), pour piloter la nav latérale (SectionNav).

import { useState, useEffect } from 'react';
import { SECTIONS } from '@/components/candidat/profil/SectionNav';

export function useProfilSectionSync(ready: boolean) {
  const [activeSection, setActiveSection] = useState('identite');

  useEffect(() => {
    if (!ready) return; // le guard est DANS le hook, pas avant lui

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
  }, [ready]); // se relance quand ready passe à true

  return activeSection;
}
