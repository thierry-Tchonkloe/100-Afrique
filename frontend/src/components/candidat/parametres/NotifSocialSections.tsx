'use client';

import Link from 'next/link';
import { Mail, Linkedin, ArrowRight } from 'lucide-react';
import { updateNotifications, linkLinkedIn } from '../../../services/parametres.service';
import type { NotificationPrefs, SocialIntegrations } from '../../../types/parametres.types';

function Toggle({
  checked, onChange, disabled,
}: { checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => onChange && !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0
        ${checked ? 'bg-[#E8622A]' : 'bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  );
}

// ── Notifications ─────────────────────────────────────────────────────────────

interface NotifProps {
  prefs: NotificationPrefs;
  onChange: (p: NotificationPrefs) => void;
}

export function NotificationsSection({ prefs, onChange }: NotifProps) {
  async function patch(update: Partial<NotificationPrefs>) {
    const next = { ...prefs, ...update };
    onChange(next);
    try { await updateNotifications(update); } catch { onChange(prefs); }
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
          <p className="text-xs text-gray-400 mt-0.5">Recevez nos actualités et conseils carrière</p>
        </div>
        <Toggle checked={prefs.newsletter} onChange={(v) => patch({ newsletter: v })} />
      </div>

      {/* Service alerts — non-toggleable */}
      <div className="flex items-start justify-between gap-4 py-4 border-t border-gray-50">
        <div>
          <p className="text-sm font-semibold text-gray-800">Alertes de service</p>
          <p className="text-xs text-gray-400 mt-0.5">Notifications sur vos candidatures (requis)</p>
        </div>
        <Toggle checked={true} disabled />
      </div>

      {/* Link to alerts page */}
      <div className="flex items-start justify-between gap-4 pt-1 border-t border-gray-50">
        <div>
          <p className="text-sm font-semibold text-gray-800">Alertes Job personnalisées</p>
          <p className="text-xs text-gray-400 mt-0.5">Gérez vos filtres et fréquences</p>
        </div>
        <Link
          href="/candidat/alertes"
          className="flex items-center gap-1 text-sm font-semibold text-[#E8622A] hover:underline flex-shrink-0"
        >
          Configurer <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

// ── Social Integrations ───────────────────────────────────────────────────────

interface SocialProps {
  socials: SocialIntegrations;
  onChange: (s: SocialIntegrations) => void;
}

export function SocialSection({ socials, onChange }: SocialProps) {
  async function handleLinkedIn() {
    if (socials.linkedinConnected) return;
    try {
      const { authUrl } = await linkLinkedIn();
      window.open(authUrl, '_blank');
    } catch {
      // Mock: simulate connection
      onChange({ ...socials, linkedinConnected: true, linkedinEmail: 'sophie.martin@email.com' });
    }
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
                : 'Synchronisez votre profil automatiquement'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLinkedIn}
          className={`text-sm font-semibold px-4 py-2 rounded-xl border transition flex-shrink-0 ${
            socials.linkedinConnected
              ? 'border-green-200 text-green-600 bg-green-50 cursor-default'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {socials.linkedinConnected ? '✓ Connecté' : 'Lier mon compte'}
        </button>
      </div>
    </section>
  );
}