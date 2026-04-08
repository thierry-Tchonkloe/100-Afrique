// // src/app/(front-office)/actualites/page.tsx
// import NewsHero from '@/components/news/NewsHero';
// import LatestNews from '@/components/news/LatestNews';
// import NewsletterSection from '@/components/news/NewsletterSection';

// export const metadata = {
//   title: 'Actualités du Tourisme | Waxeho News',
//   description: 'Suivez en direct les dernières tendances, les analyses de marché et les événements majeurs du secteur touristique en Afrique et à l\'international.',
// };

// export default function ActualitesPage() {
//   return (
//     <main className="min-h-screen bg-white">
//       {/* Section 1 : Le Héro Bleu (3 articles) */}
//       <NewsHero />

//       {/* Section 2 : La Grille Secteurs & Tendances + Sidebar */}
//       <LatestNews />

//       {/* Section 3 : La Newsletter Pro */}
//       <NewsletterSection />
//     </main>
//   );
// }



// src/app/(front-office)/actualites/page.tsx
import ActualitesPage from '@/components/news/ActualitesPage';
 
export const metadata = {
  title: 'Actualités du Tourisme | Waxeho News',
  description: 'Suivez en direct les dernières tendances, les analyses de marché et les événements majeurs du secteur touristique en Afrique et à l\'international.',
};
 
export default function ActualitesPageWrapper() {
  return <ActualitesPage />;
}