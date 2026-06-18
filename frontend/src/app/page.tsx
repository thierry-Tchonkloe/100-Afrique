// src/app/(front-office)/page.tsx
import HeroSlider from '@/components/home/HeroSlider';
import NewsSection from '@/components/home/NewsSection';
import VideoSection from '@/components/home/VideoSection';
import MagazineSection from '@/components/home/MagazineSection';
import EventsDestinationsSection from '@/components/home/EventsDestinationsSection';
import ContactCTASection from '@/components/home/ContactCTASection';
import { AdvertisingBanner } from '@/components/AdvertisingBanner';

import TopBar from '@/components/shared/TopBar';
import Header from '@/components/shared/Header';
import SubBar from '@/components/shared/SubBar';
import Footer from '@/components/shared/Footer';
import ChatWidget from '@/components/shared/ChatWidget';
import LanguageSwitcher from '@/components/shared/Languageswitcher';

export const metadata = {
  title: '100%Afrique | La voix du tourisme en Afrique',
  description: 'Connectez-vous à l\'écosystème touristique africain. Actualités pro, magazine exclusif, et opportunités d\'affaires pour les acteurs du voyage.',
  keywords: ['tourisme africain', 'voyages Afrique', 'B2B tourisme', '100%Afrique', '100-Afrique'],
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <SubBar />
      <main className="flex-grow">
        <div className="space-y-0">
          <HeroSlider />
          <NewsSection />
          <VideoSection />
          {/* <MagazineSection /> */}
          <EventsDestinationsSection />
          <ContactCTASection />
        </div>

        {/* Pub banner — déplacée ici */}
        <div className="max-w-[1300px] mx-auto px-6 my-12 rounded-2xl overflow-hidden">
          <AdvertisingBanner zoneSlug="leaderboards-footer" showDots className="" />
        </div>

        <ChatWidget />
        <LanguageSwitcher />
      </main>
      <Footer />
    </div>
  );
}