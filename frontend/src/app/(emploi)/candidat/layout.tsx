'use client';
// src/app/(emploi)/candidat/layout.tsx
//
// FIX SÉCURITÉ (conservé) : ce layout n'affiche la sidebar, le header et le
// contenu enfant qu'une fois une session CANDIDAT confirmée côté client —
// couvre les cas où le middleware serveur serait contourné (cookies
// désactivés, certaines navigations client) ou une session expirant en
// cours d'utilisation. La logique de vérification vit désormais dans
// useCandidatAuthGuard pour garder ce fichier concentré sur la mise en page.

import { useState, useCallback } from 'react';
import CandidatSidebar from '@/components/candidat/CandidatSidebar';
import CandidatHeader from '@/components/candidat/CandidatHeader';
import { useCandidatDashboard } from '@/hooks/useCandidatDashboard';
import { useCandidatAuthGuard } from '@/hooks/useCandidatAuthGuard';
import type { CandidatNotification } from '@/types/emploi.types';

function FullscreenLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function CandidatLayout({ children }: { children: React.ReactNode }) {
  const { authChecked, authorized } = useCandidatAuthGuard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Source de vérité : profil + notifications depuis le hook dashboard.
  // Appelé inconditionnellement (règles des Hooks) ; son résultat n'est
  // exploité que si `authorized` est vrai (voir rendu ci-dessous).
  const { data, setData } = useCandidatDashboard();

  const handleNotificationsChange = useCallback(
    (updated: CandidatNotification[]) => {
      setData((prev) => (prev ? { ...prev, notifications: updated } : prev));
    },
    [setData],
  );

  // Tant que l'authentification n'est pas confirmée (ou que la redirection
  // vers /auth est en cours), on n'affiche jamais la sidebar, le header,
  // ni {children} — uniquement un loader neutre.
  if (!authChecked || !authorized) {
    return <FullscreenLoader />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <CandidatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <CandidatHeader
          profile={data?.profile}
          notifications={data?.notifications ?? []}
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationsChange={handleNotificationsChange}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
