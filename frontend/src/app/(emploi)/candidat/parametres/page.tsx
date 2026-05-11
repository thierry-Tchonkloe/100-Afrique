// src/app/(emploi)/candidat/parametres/page.tsx
'use client';

import { useSettings } from '@/hooks/useSettings';
import SecuritySection from '@/components/candidat/parametres/SecuritySection';
import PrivacySection from '@/components/candidat/parametres/PrivacySection';
import { NotificationsSection, SocialSection } from '@/components/candidat/parametres/NotifSocialSections';
import DangerZone from '@/components/candidat/parametres/DangerZone';
import type { CandidatSettings } from '@/types/parametres.types';

// ── Skeleton loader ───────────────────────────────────────────────────────────
function SettingsSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {[240, 320, 200, 160, 180].map((h, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm" style={{ height: h }} />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ParametresPage() {
  const { settings, loading, setSettings } = useSettings();

  function patch(update: Partial<CandidatSettings>) {
    setSettings((prev) => prev ? { ...prev, ...update } : prev);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 pb-12">

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Paramètres du compte</h1>
        <p className="text-sm text-gray-400 mt-1">
          Gérez vos informations de sécurité et vos préférences de confidentialité.
        </p>
      </div>

      {loading || !settings ? (
        <SettingsSkeleton />
      ) : (
        <>
          {/* 1 — Security */}
          <SecuritySection
            email={settings.account.email}
            twoFactorEnabled={settings.account.twoFactorEnabled}
            onTwoFactorChange={(v) =>
              patch({ account: { ...settings.account, twoFactorEnabled: v } })
            }
          />

          {/* 2 — Privacy */}
          <PrivacySection
            privacy={settings.privacy}
            recentAccess={settings.recentAccess}
            onChange={(privacy) => patch({ privacy })}
          />

          {/* 3 — Notifications */}
          <NotificationsSection
            prefs={settings.notifications}
            onChange={(notifications) => patch({ notifications })}
          />

          {/* 4 — Social */}
          <SocialSection
            socials={settings.socials}
            onChange={(socials) => patch({ socials })}
          />

          {/* 5 — Danger zone */}
          <DangerZone />
        </>
      )}
    </div>
  );
}