// src/app/(front-office)/actualites/page.tsx
import ActualitesPage from '@/components/news/ActualitesPage';
import { getNewsHeroMagazines, getNewsSidebarData } from '@/lib/server-data';
import type { Magazine, SidebarArticle } from '@/lib/server-data';

export const metadata = {
  title: 'Actualités du Tourisme | 100% Afrique',
  description:
    "Suivez en direct les dernières tendances, les analyses de marché et les événements majeurs du secteur touristique en Afrique et à l'international.",
};

export default async function ActualitesPageWrapper() {
  // Promise.allSettled : si un fetch échoue (cold start trop long),
  // les autres sections s'affichent quand même avec leur contenu.
  const [heroResult, sidebarResult] = await Promise.allSettled([
    getNewsHeroMagazines(),
    getNewsSidebarData(),
  ]);

  const heroMagazines: Magazine[] =
    heroResult.status === 'fulfilled' ? heroResult.value : [];

  const sidebarAnalyses: SidebarArticle[] =
    sidebarResult.status === 'fulfilled' ? sidebarResult.value.analyses : [];

  const sidebarInterview: SidebarArticle | null =
    sidebarResult.status === 'fulfilled' ? sidebarResult.value.interview : null;

  return (
    <ActualitesPage
      heroMagazines={heroMagazines}
      sidebarAnalyses={sidebarAnalyses}
      sidebarInterview={sidebarInterview}
    />
  );
}










// // src/app/(front-office)/actualites/page.tsx
// import ActualitesPage from '@/components/news/ActualitesPage';
 
// export const metadata = {
//   title: 'Actualités du Tourisme | Waxeho News',
//   description: 'Suivez en direct les dernières tendances, les analyses de marché et les événements majeurs du secteur touristique en Afrique et à l\'international.',
// };
 
// export default function ActualitesPageWrapper() {
//   return <ActualitesPage />;
// }