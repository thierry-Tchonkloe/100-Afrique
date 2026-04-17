// src/app/(front-office)/actualites/page.tsx
import ActualitesPage from '@/components/news/ActualitesPage';
 
export const metadata = {
  title: 'Actualités du Tourisme | Waxeho News',
  description: 'Suivez en direct les dernières tendances, les analyses de marché et les événements majeurs du secteur touristique en Afrique et à l\'international.',
};
 
export default function ActualitesPageWrapper() {
  return <ActualitesPage />;
}