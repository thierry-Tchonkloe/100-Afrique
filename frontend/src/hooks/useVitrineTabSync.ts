// src/hooks/useVitrineTabSync.ts
// Synchronise l'onglet actif de la page Vitrine avec la position de scroll
// (IntersectionObserver), et fournit un scrollTo pour la navigation par clic.

import { useState, useEffect } from 'react';
import type { VitrineTab } from '@/types/vitrine.types';
import { VITRINE_TABS } from '@/types/vitrine.types';

export function useVitrineTabSync(ready: boolean) {
  const [activeTab, setActiveTab] = useState<VitrineTab>('identite');

  useEffect(() => {
    if (!ready) return;
    const ids = [...VITRINE_TABS.map((t) => t.key), 'reseaux'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveTab(visible.target.id as VitrineTab);
      },
      { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ready]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return { activeTab, scrollTo };
}
