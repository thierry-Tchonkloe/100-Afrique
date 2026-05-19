// src/app/(emploi)/emploi/layout.tsx
import type { Metadata } from 'next';
import EmploiHeader from '@/components/emploi/public/EmploiHeader';
import EmploiFooter from '@/components/emploi/public/EmploiFooter';

export const metadata: Metadata = {
  title: 'i Tourisme Emploi — Recrutement dans le tourisme & l\'hôtellerie',
  description: 'Trouvez votre prochain poste dans l\'industrie du tourisme, hôtellerie et restauration.',
};

export default function EmploiPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <EmploiHeader />
      <main className="flex-1">{children}</main>
      <EmploiFooter />
    </div>
  );
}