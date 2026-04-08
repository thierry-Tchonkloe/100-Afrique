// src/app/(front-office)/magazine/page.tsx
import React from 'react';
import MagazineHero from '@/components/magazine/MagazineHero';
import FeaturedMagazine from '@/components/magazine/FeaturedMagazine';
import SubscriptionPlans from '@/components/magazine/SubscriptionPlans';
import MagazineLibrary from '@/components/magazine/MagazineLibrary';
import EditorialCTA from '@/components/magazine/EditorialCTA';

export const metadata = {
  title: 'Magazine Waxeho | Voyages & Décryptage du Tourisme',
  description: 'Découvrez le magazine de référence pour les professionnels du tourisme et les passionnés de voyages en Afrique et à l\'international.',
};

const MagazinePage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header Hero : Titre imposant et identité visuelle */}
      <MagazineHero />

      {/* 2. Nouveau Numéro : Focus sur le dernier magazine avec accès API */}
      <FeaturedMagazine />

      {/* 3. Abonnements : Grille de prix et offres (Papier / Digital) */}
      <SubscriptionPlans />

      {/* 4. Bibliothèque : Système de filtres et anciens numéros */}
      <MagazineLibrary />

      {/* 5. Section Équipe & CTA : Modales de partenariat et rédaction */}
      <EditorialCTA />
    </main>
  );
};

export default MagazinePage;