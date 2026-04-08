// src/app/(front-office)/layout.tsx
import TopBar from '@/components/shared/TopBar';
import Header from '@/components/shared/Header';
import SubBar from '@/components/shared/SubBar';
import Footer from '@/components/shared/Footer';
import ChatWidget from '@/components/shared/ChatWidget';

export default function FrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />
      <SubBar />
      <main className="flex-grow">
        {children}
        <ChatWidget />
      </main>
      <Footer />
    </div>
  );
}