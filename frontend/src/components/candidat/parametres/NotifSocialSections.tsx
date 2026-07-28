// src/components/candidat/parametres/NotifSocialSections.tsx
'use client';

import Link from 'next/link';
import { Mail, Linkedin, ArrowRight } from 'lucide-react';
import { updateNotifications, linkLinkedIn } from '@/services/parametres.service';
import type { NotificationPrefs, SocialIntegrations } from '@/types/parametres.types';
import Toggle from '@/components/ui/Toggle';

// ── Notifications ─────────────────────────────────────────────────────────────
export function NotificationsSection({ prefs, onChange }: {
  prefs: NotificationPrefs;
  onChange: (p: NotificationPrefs) => void;
}) {
  async function patch(update: Partial<NotificationPrefs>) {
    const next = { ...prefs, ...update };
    onChange(next); // optimistic
    try {
      await updateNotifications(update);
    } catch {
      onChange(prefs); // revert
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#FFF3EC] rounded-xl flex items-center justify-center">
          <Mail size={16} className="text-[#E8622A]" />
        </div>
        <h2 className="font-bold text-gray-900">Préférences de Notifications</h2>
      </div>

      {/* Newsletter */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">Newsletter i Tourisme Nomade</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Recevez nos actualités, conseils carrière et offres exclusives
          </p>
        </div>
        <Toggle
          checked={prefs.newsletter}
          onChange={(v) => patch({ newsletter: v })}
        />
      </div>

      {/* Alertes service — non modifiable */}
      <div className="flex items-start justify-between gap-4 py-4 border-t border-gray-50">
        <div>
          <p className="text-sm font-semibold text-gray-800">Alertes de service</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Notifications sur l'état de vos candidatures (obligatoire)
          </p>
        </div>
        <Toggle checked={true} disabled />
      </div>

      {/* Lien vers alertes job */}
      <div className="flex items-start justify-between gap-4 pt-1 border-t border-gray-50">
        <div>
          <p className="text-sm font-semibold text-gray-800">Alertes Job personnalisées</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Gérez vos critères de veille et fréquences d'envoi
          </p>
        </div>
        <Link
          href="/candidat/alertes"
          className="flex items-center gap-1 text-sm font-semibold text-[#E8622A]
                     hover:underline flex-shrink-0"
        >
          Configurer <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

// ── Social Integrations ───────────────────────────────────────────────────────
export function SocialSection({ socials, onChange }: {
  socials: SocialIntegrations;
  onChange: (s: SocialIntegrations) => void;
}) {
  async function handleLinkedIn() {
    if (socials.linkedinConnected) return;
    try {
      const { authUrl } = await linkLinkedIn();
      // En production : redirection OAuth
      window.open(authUrl, '_blank', 'width=600,height=700');
    } catch {
      // Mock : simule la connexion si l'API n'est pas disponible
      onChange({
        ...socials,
        linkedinConnected: true,
        linkedinEmail: 'marie.dubois@linkedin.com',
      });
    }
  }

  async function handleUnlink() {
    onChange({ ...socials, linkedinConnected: false, linkedinEmail: undefined });
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
          <Linkedin size={16} className="text-blue-600" />
        </div>
        <h2 className="font-bold text-gray-900">Réseaux Sociaux &amp; Intégrations</h2>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0A66C2] rounded-xl flex items-center justify-center flex-shrink-0">
            <Linkedin size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">LinkedIn</p>
            <p className="text-xs text-gray-400">
              {socials.linkedinConnected
                ? `Connecté${socials.linkedinEmail ? ` — ${socials.linkedinEmail}` : ''}`
                : 'Importez automatiquement vos expériences et formation'}
            </p>
          </div>
        </div>

        {socials.linkedinConnected ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-semibold text-green-600 bg-green-50 border
                             border-green-200 px-3 py-1.5 rounded-xl">
              ✓ Connecté
            </span>
            <button
              onClick={handleUnlink}
              className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50
                         px-3 py-1.5 rounded-xl border border-transparent
                         hover:border-red-100 transition"
            >
              Délier
            </button>
          </div>
        ) : (
          <button
            onClick={handleLinkedIn}
            className="text-sm font-semibold px-4 py-2 rounded-xl border border-gray-200
                       text-gray-700 hover:bg-gray-50 transition flex-shrink-0"
          >
            Lier mon compte
          </button>
        )}
      </div>
    </section>
  );
}
