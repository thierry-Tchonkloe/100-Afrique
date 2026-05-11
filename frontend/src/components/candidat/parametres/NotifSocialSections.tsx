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


















// // src/components/candidat/parametres/NotifSocialSections.tsx
// 'use client';

// import Link from 'next/link';
// import { Mail, Linkedin, ArrowRight } from 'lucide-react';
// import { updateNotifications, linkLinkedIn } from '@/services/parametres.service';
// import type { NotificationPrefs, SocialIntegrations } from '@/types/parametres.types';

// function Toggle({ checked, onChange, disabled }: {
//   checked: boolean;
//   onChange?: (v: boolean) => void;
//   disabled?: boolean;
// }) {
//   return (
//     <button
//       onClick={() => onChange && !disabled && onChange(!checked)}
//       disabled={disabled}
//       className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0
//         ${checked ? 'bg-[#E8622A]' : 'bg-gray-200'}
//         ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
//     >
//       <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
//         checked ? 'translate-x-6' : 'translate-x-0.5'
//       }`} />
//     </button>
//   );
// }

// // ── Named export 1 ────────────────────────────────────────────────────────────
// export function NotificationsSection({ prefs, onChange }: {
//   prefs: NotificationPrefs;
//   onChange: (p: NotificationPrefs) => void;
// }) {
//   async function patch(update: Partial<NotificationPrefs>) {
//     const next = { ...prefs, ...update };
//     onChange(next);
//     try { await updateNotifications(update); } catch { onChange(prefs); }
//   }

//   return (
//     <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
//       <div className="flex items-center gap-2.5">
//         <div className="w-8 h-8 bg-[#FFF3EC] rounded-xl flex items-center justify-center">
//           <Mail size={16} className="text-[#E8622A]" />
//         </div>
//         <h2 className="font-bold text-gray-900">Préférences de Notifications</h2>
//       </div>

//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <p className="text-sm font-semibold text-gray-800">Newsletter i Tourisme Nomade</p>
//           <p className="text-xs text-gray-400 mt-0.5">Recevez nos actualités et conseils carrière</p>
//         </div>
//         <Toggle checked={prefs.newsletter} onChange={(v) => patch({ newsletter: v })} />
//       </div>

//       <div className="flex items-start justify-between gap-4 py-4 border-t border-gray-50">
//         <div>
//           <p className="text-sm font-semibold text-gray-800">Alertes de service</p>
//           <p className="text-xs text-gray-400 mt-0.5">Notifications sur vos candidatures (requis)</p>
//         </div>
//         <Toggle checked={true} disabled />
//       </div>

//       <div className="flex items-start justify-between gap-4 pt-1 border-t border-gray-50">
//         <div>
//           <p className="text-sm font-semibold text-gray-800">Alertes Job personnalisées</p>
//           <p className="text-xs text-gray-400 mt-0.5">Gérez vos filtres et fréquences</p>
//         </div>
//         <Link href="/candidat/alertes"
//           className="flex items-center gap-1 text-sm font-semibold text-[#E8622A] hover:underline flex-shrink-0">
//           Configurer <ArrowRight size={14} />
//         </Link>
//       </div>
//     </section>
//   );
// }

// // ── Named export 2 ────────────────────────────────────────────────────────────
// export function SocialSection({ socials, onChange }: {
//   socials: SocialIntegrations;
//   onChange: (s: SocialIntegrations) => void;
// }) {
//   async function handleLinkedIn() {
//     if (socials.linkedinConnected) return;
//     try {
//       const { authUrl } = await linkLinkedIn();
//       window.open(authUrl, '_blank');
//     } catch {
//       onChange({ ...socials, linkedinConnected: true, linkedinEmail: 'marie.dubois@email.com' });
//     }
//   }

//   return (
//     <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
//       <div className="flex items-center gap-2.5">
//         <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
//           <Linkedin size={16} className="text-blue-600" />
//         </div>
//         <h2 className="font-bold text-gray-900">Réseaux Sociaux &amp; Intégrations</h2>
//       </div>

//       <div className="flex items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-[#0A66C2] rounded-xl flex items-center justify-center flex-shrink-0">
//             <Linkedin size={18} className="text-white" />
//           </div>
//           <div>
//             <p className="text-sm font-semibold text-gray-800">LinkedIn</p>
//             <p className="text-xs text-gray-400">
//               {socials.linkedinConnected
//                 ? `Connecté${socials.linkedinEmail ? ` — ${socials.linkedinEmail}` : ''}`
//                 : 'Synchronisez votre profil automatiquement'}
//             </p>
//           </div>
//         </div>
//         <button onClick={handleLinkedIn}
//           className={`text-sm font-semibold px-4 py-2 rounded-xl border transition flex-shrink-0 ${
//             socials.linkedinConnected
//               ? 'border-green-200 text-green-600 bg-green-50 cursor-default'
//               : 'border-gray-200 text-gray-700 hover:bg-gray-50'
//           }`}>
//           {socials.linkedinConnected ? '✓ Connecté' : 'Lier mon compte'}
//         </button>
//       </div>
//     </section>
//   );
// }




















// // src/components/candidat/parametres/PrivacySection.tsx
// 'use client';

// import { Eye, Building2 } from 'lucide-react';
// import { updatePrivacy } from '../../../services/parametres.service';
// import type { PrivacySettings, RecentAccess } from '../../../types/parametres.types';

// function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
//   return (
//     <button
//       onClick={() => onChange(!checked)}
//       className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-[#E8622A]' : 'bg-gray-200'}`}
//     >
//       <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
//     </button>
//   );
// }

// function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
//   return (
//     <label className="flex items-center gap-3 cursor-pointer group">
//       <div
//         onClick={onChange}
//         className={`w-4 h-4 rounded border-2 flex items-center justify-center transition flex-shrink-0 ${
//           checked ? 'border-[#E8622A] bg-[#E8622A]' : 'border-gray-300 group-hover:border-gray-400'
//         }`}
//       >
//         {checked && (
//           <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
//             <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//         )}
//       </div>
//       <span className="text-sm text-gray-700">{label}</span>
//     </label>
//   );
// }

// function timeAgo(iso: string): string {
//   const diff = Date.now() - new Date(iso).getTime();
//   const days = Math.floor(diff / 86400000);
//   if (days === 0) return "Aujourd'hui";
//   if (days === 1) return 'Il y a 1 jour';
//   if (days < 7)  return `Il y a ${days} jours`;
//   return `Il y a ${Math.floor(days / 7)} semaine${Math.floor(days / 7) > 1 ? 's' : ''}`;
// }

// interface Props {
//   privacy: PrivacySettings;
//   recentAccess: RecentAccess[];
//   onChange: (p: PrivacySettings) => void;
// }

// export default function PrivacySection({ privacy, recentAccess, onChange }: Props) {
//   async function patch(update: Partial<PrivacySettings>) {
//     const next = { ...privacy, ...update };
//     onChange(next);
//     try { await updatePrivacy(update); } catch { onChange(privacy); }
//   }

//   return (
//     <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
//       {/* Header */}
//       <div className="flex items-center gap-2.5">
//         <div className="w-8 h-8 bg-[#FFF3EC] rounded-xl flex items-center justify-center">
//           <Eye size={16} className="text-[#E8622A]" />
//         </div>
//         <h2 className="font-bold text-gray-900">Confidentialité &amp; Visibilité</h2>
//       </div>

//       {/* Profile visible toggle */}
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <p className="text-sm font-semibold text-gray-800">Visibilité du profil</p>
//           <p className="text-xs text-gray-400 mt-0.5">
//             {privacy.profileVisible
//               ? 'Votre profil est consultable par les recruteurs'
//               : 'Votre profil est masqué des recruteurs'}
//           </p>
//         </div>
//         <Toggle checked={privacy.profileVisible} onChange={(v) => patch({ profileVisible: v })} />
//       </div>

//       {/* Data sharing */}
//       <div>
//         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
//           Données partagées
//         </p>
//         <div className="space-y-3">
//           <CheckRow
//             label="Masquer mon nom de famille"
//             checked={privacy.hideLastName}
//             onChange={() => patch({ hideLastName: !privacy.hideLastName })}
//           />
//           <CheckRow
//             label="Masquer ma photo de profil"
//             checked={privacy.hidePhoto}
//             onChange={() => patch({ hidePhoto: !privacy.hidePhoto })}
//           />
//           <CheckRow
//             label="Masquer mes coordonnées"
//             checked={privacy.hideContactInfo}
//             onChange={() => patch({ hideContactInfo: !privacy.hideContactInfo })}
//           />
//         </div>
//       </div>

//       {/* Recent access */}
//       <div>
//         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
//           Historique des accès récents
//         </p>
//         <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
//           {recentAccess.map((r) => (
//             <div key={r.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition">
//               <div className="flex items-center gap-3">
//                 <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
//                   <Building2 size={13} className="text-gray-400" />
//                 </div>
//                 <span className="text-sm text-gray-700">{r.companyName}</span>
//               </div>
//               <span className="text-xs text-gray-400">{timeAgo(r.accessedAt)}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }