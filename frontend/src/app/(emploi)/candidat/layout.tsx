'use client';
// src/app/(emploi)/candidat/layout.tsx
//
// FIX SÉCURITÉ : ce layout affichait directement la sidebar, le header et le
// contenu enfant sans jamais vérifier qu'un utilisateur CANDIDAT authentifié
// était bien connecté — exactement la même faille que RecruteurLayout avant
// correction. Le middleware (src/middleware.ts) bloque déjà la navigation
// initiale vers /candidat/*, mais ce garde-fou côté client couvre les cas où
// il serait contourné (cookies désactivés, certaines navigations client) et
// gère une session qui expirerait en cours d'utilisation.

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CandidatSidebar from '@/components/candidat/CandidatSidebar';
import CandidatHeader  from '@/components/candidat/CandidatHeader';
import { useCandidatDashboard } from '@/hooks/useCandidatDashboard';
import { clearAuth, getAuthToken, getAuthUser } from '@/services/emploi-auth.service';
import type { CandidatNotification } from '@/types/emploi.types';

// ── Loader plein écran affiché pendant la vérification d'authentification
// ou pendant la redirection vers /auth.
function FullscreenLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function CandidatLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── FIX SÉCURITÉ : vérification immédiate côté client, en complément du
  // middleware serveur. `authChecked` reste false tant qu'on n'a pas confirmé
  // la présence d'un token + rôle CANDIDAT valides — aucun contenu du sous-
  // univers candidat ne doit s'afficher avant cette confirmation.
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized,  setAuthorized]  = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const user  = getAuthUser();

    if (!token || !user || user.role !== 'CANDIDAT') {
      clearAuth();
      const current = typeof window !== 'undefined' ? window.location.pathname : '/candidat/dashboard';
      router.replace(`/auth?redirect=${encodeURIComponent(current)}`);
      return;
    }

    setAuthorized(true);
    setAuthChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Source de vérité : profil + notifications depuis le hook dashboard.
  // Le hook n'est utile qu'une fois l'authentification confirmée — on
  // continue de l'appeler inconditionnellement (règles des Hooks), mais son
  // résultat n'est exploité que si `authorized` est vrai (voir rendu ci-dessous).
  const { data, setData } = useCandidatDashboard();

  // Mise à jour locale des notifications (marquer lu) sans re-fetch réseau
  const handleNotificationsChange = useCallback(
    (updated: CandidatNotification[]) => {
      setData((prev) => (prev ? { ...prev, notifications: updated } : prev));
    },
    [setData],
  );

  // FIX SÉCURITÉ : tant que l'authentification n'est pas confirmée (ou que
  // la redirection vers /auth est en cours), on n'affiche jamais la sidebar,
  // le header, ni {children} — uniquement un loader neutre.
  if (!authChecked || !authorized) {
    return <FullscreenLoader />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <CandidatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header dynamique — profil et notifications réels */}
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
