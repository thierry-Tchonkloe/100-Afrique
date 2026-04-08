// src/app/(front-office)/page.tsx
import HeroSlider from '@/components/home/HeroSlider';
import NewsSection from '@/components/home/NewsSection';
import VideoSection from '@/components/home/VideoSection';
import MagazineSection from '@/components/home/MagazineSection';
import EventsDestinationsSection from '@/components/home/EventsDestinationsSection';
import ContactCTASection from '@/components/home/ContactCTASection';

export const metadata = {
  title: 'Waxeho | La Plateforme de Référence du Tourisme en Afrique',
  description: 'Connectez-vous à l\'écosystème touristique africain. Actualités pro, magazine exclusif, et opportunités d\'affaires pour les acteurs du voyage.',
  keywords: ['tourisme africain', 'voyages Afrique', 'B2B tourisme', 'Waxeho'],
};

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSlider />
      <NewsSection />
      <VideoSection />
      <MagazineSection />
      <EventsDestinationsSection />
      <ContactCTASection />
    </div>
  );
}