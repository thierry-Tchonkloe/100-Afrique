'use client';
// src/app/(recruteur)/recruteur/layout.tsx
//
// FIX SÉCURITÉ : le shell recruteur (sidebar, header, contenu) ne s'affiche
// plus tant que RecruteurContext n'a pas confirmé une session valide. Avant
// ce fix, un utilisateur non connecté qui contournait le middleware (ou
// naviguait pendant la vérification) voyait l'interface avec des données
// vides le temps que le fetch échoue en arrière-plan, sans être redirigé.

import { useState } from 'react';
import RecruteurSidebar from '@/components/recruteur/RecruteurSidebar';
import RecruteurHeader from '@/components/recruteur/RecruteurHeader';
import { RecruteurContextProvider, useRecruteurContext } from '@/context/RecruteurContext';

// ── Loader plein écran affiché pendant la vérification d'authentification
// ou pendant la redirection vers /auth déclenchée par le contexte.
function FullscreenLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#F8F9FB]">
      <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ── Inner layout (reads from context) ────────────────────────────────────────
function RecruteurShell({ children }: { children: React.ReactNode }) {
  const { profile, newCandidaturesCount, switchEtab, loading } = useRecruteurContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // FIX SÉCURITÉ : tant que loading=true (vérification en cours) OU que
  // profile est null (session absente/invalide → redirection en cours),
  // on n'affiche jamais le shell recruteur ni son contenu — uniquement
  // un loader neutre, sans aucune donnée métier.
  if (loading || !profile) {
    return <FullscreenLoader />;
  }

  return (
    <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
      <RecruteurSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        newCandidaturesCount={newCandidaturesCount}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <RecruteurHeader
          profile={profile}
          onMenuClick={() => setSidebarOpen(true)}
          onEtablissementChange={switchEtab}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// ── Root layout export ────────────────────────────────────────────────────────
export default function RecruteurLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecruteurContextProvider>
      <RecruteurShell>{children}</RecruteurShell>
    </RecruteurContextProvider>
  );
}
