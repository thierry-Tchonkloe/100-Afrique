// src/app/(front-office)/videos/page.tsx
import VideoHeroSection from '@/components/videos/VideoHeroSection';
import VideoExplorer from '@/components/videos/VideoExplorer';
import VideoCTASection from '@/components/videos/VideoCTASection';
import { getFeaturedVideo } from '@/lib/server-data';
import type { VideoArticle } from '@/lib/server-data';

export const metadata = {
  title: 'Vidéos et Web TV | Reportages, Interviews & Émissions - 100% Afrique',
  description:
    'Découvrez nos reportages exclusifs, interviews et émissions sur le tourisme africain et international. i Tourisme TV.',
  keywords: ['vidéos tourisme', 'web tv', 'reportages salons', 'interviews', 'émissions tourisme'],
};

export default async function VideosPage() {
  const [videoResult] = await Promise.allSettled([getFeaturedVideo()]);

  const featuredVideo: VideoArticle | null =
    videoResult.status === 'fulfilled' ? videoResult.value : null;

  return (
    <main className="min-h-screen bg-white">
      <VideoHeroSection featuredVideo={featuredVideo} />
      <VideoExplorer />
      <VideoCTASection />
    </main>
  );
}
