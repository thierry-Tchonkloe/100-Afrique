// src/app/(front-office)/videos/page.tsx
import VideoHeroSection from '@/components/videos/VideoHeroSection';
import VideoExplorer from '@/components/videos/VideoExplorer';
import VideoCTASection from '@/components/videos/VideoCTASection';

export const metadata = {
  title: 'Vidéos et Web TV | Reportages, Interviews & Émissions - WAXEHO',
  description: 'Découvrez nos reportages exclusifs, interviews et émissions sur le tourisme africain et international. i Tourisme TV.',
  keywords: ['vidéos tourisme', 'web tv', 'reportages salons', 'interviews', 'émissions tourisme'],
};

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-white">
      <VideoHeroSection />
      <VideoExplorer />
      <VideoCTASection />
    </main>
  );
}