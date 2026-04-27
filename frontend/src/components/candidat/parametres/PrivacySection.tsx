'use client';

import { Eye, Building2 } from 'lucide-react';
import { updatePrivacy } from '../../../services/parametres.service';
import type { PrivacySettings, RecentAccess } from '../../../types/parametres.types';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-[#E8622A]' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition flex-shrink-0 ${
          checked ? 'border-[#E8622A] bg-[#E8622A]' : 'border-gray-300 group-hover:border-gray-400'
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Il y a 1 jour';
  if (days < 7)  return `Il y a ${days} jours`;
  return `Il y a ${Math.floor(days / 7)} semaine${Math.floor(days / 7) > 1 ? 's' : ''}`;
}

interface Props {
  privacy: PrivacySettings;
  recentAccess: RecentAccess[];
  onChange: (p: PrivacySettings) => void;
}

export default function PrivacySection({ privacy, recentAccess, onChange }: Props) {
  async function patch(update: Partial<PrivacySettings>) {
    const next = { ...privacy, ...update };
    onChange(next);
    try { await updatePrivacy(update); } catch { onChange(privacy); }
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#FFF3EC] rounded-xl flex items-center justify-center">
          <Eye size={16} className="text-[#E8622A]" />
        </div>
        <h2 className="font-bold text-gray-900">Confidentialité &amp; Visibilité</h2>
      </div>

      {/* Profile visible toggle */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">Visibilité du profil</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {privacy.profileVisible
              ? 'Votre profil est consultable par les recruteurs'
              : 'Votre profil est masqué des recruteurs'}
          </p>
        </div>
        <Toggle checked={privacy.profileVisible} onChange={(v) => patch({ profileVisible: v })} />
      </div>

      {/* Data sharing */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Données partagées
        </p>
        <div className="space-y-3">
          <CheckRow
            label="Masquer mon nom de famille"
            checked={privacy.hideLastName}
            onChange={() => patch({ hideLastName: !privacy.hideLastName })}
          />
          <CheckRow
            label="Masquer ma photo de profil"
            checked={privacy.hidePhoto}
            onChange={() => patch({ hidePhoto: !privacy.hidePhoto })}
          />
          <CheckRow
            label="Masquer mes coordonnées"
            checked={privacy.hideContactInfo}
            onChange={() => patch({ hideContactInfo: !privacy.hideContactInfo })}
          />
        </div>
      </div>

      {/* Recent access */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Historique des accès récents
        </p>
        <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
          {recentAccess.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 size={13} className="text-gray-400" />
                </div>
                <span className="text-sm text-gray-700">{r.companyName}</span>
              </div>
              <span className="text-xs text-gray-400">{timeAgo(r.accessedAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}