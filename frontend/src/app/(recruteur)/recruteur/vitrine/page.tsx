// src/app/(recruteur)/recruteur/vitrine/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Save, Eye, Linkedin, Instagram, Facebook, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { useVitrine } from '@/hooks/useVitrine';
import { updateVitrine } from '@/services/vitrine.service';
import {
  IdentiteSection,
  ChiffresSection,
  CultureSection,
  MediaSection,
} from '@/components/recruteur/vitrine/VitrineSections';
import type { VitrineData, VitrineTab } from '@/types/vitrine.types';
import { VITRINE_TABS } from '@/types/vitrine.types';
import clsx from 'clsx';

const INPUT = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition';

// ─── Réseaux sociaux ──────────────────────────────────────────────────────────
function ReseauxSection({
  vitrine,
  onChange,
}: {
  vitrine: VitrineData;
  onChange: (v: Partial<VitrineData>) => void;
}) {
  const socials = vitrine.socials;
  const fields: {
    key: keyof typeof socials;
    label: string;
    icon: React.ReactNode;
    placeholder: string;
  }[] = [
    { key: 'linkedin',  label: 'LinkedIn',  icon: <Linkedin  size={16} />, placeholder: 'https://linkedin.com/company/…' },
    { key: 'instagram', label: 'Instagram', icon: <Instagram size={16} />, placeholder: 'https://instagram.com/…'         },
    { key: 'facebook',  label: 'Facebook',  icon: <Facebook  size={16} />, placeholder: 'https://facebook.com/…'          },
    { key: 'website',   label: 'Site web',  icon: <Globe     size={16} />, placeholder: 'https://votre-site.com'          },
  ];

  return (
    <div id="reseaux" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div>
        <h2 className="font-bold text-gray-900 text-base">Réseaux Sociaux &amp; Liens</h2>
        <p className="text-xs text-gray-400 mt-0.5">Renforcez votre présence digitale</p>
      </div>
      <div className="space-y-3">
        {fields.map(({ key, label, icon, placeholder }) => (
          <div key={key} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
              <input
                value={socials[key] ?? ''}
                onChange={(e) => onChange({ socials: { ...socials, [key]: e.target.value } })}
                placeholder={placeholder}
                className={INPUT}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({
  message,
  type,
  onDone,
}: {
  message: string;
  type: 'success' | 'error';
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, type === 'error' ? 5000 : 2500);
    return () => clearTimeout(t);
  }, [onDone, type]);

  return (
    <div
      className={clsx(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 text-white text-sm font-medium',
        'px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 max-w-md',
        type === 'success' ? 'bg-gray-900' : 'bg-red-600',
      )}
    >
      {type === 'success'
        ? <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
        : <AlertCircle size={16} className="text-white flex-shrink-0" />}
      <span>{message}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MaVitrineEntreprisePage() {
  const { vitrine, loading, setVitrine } = useVitrine();

  const [activeTab, setActiveTab] = useState<VitrineTab>('identite');
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync active tab with scroll position
  useEffect(() => {
    if (loading || !vitrine) return;
    const ids = [...VITRINE_TABS.map((t) => t.key), 'reseaux'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveTab(visible.target.id as VitrineTab);
      },
      { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loading, vitrine]);

  function patch(update: Partial<VitrineData>) {
    setVitrine((prev) => (prev ? { ...prev, ...update } : prev));
  }

  async function handleSave() {
    if (!vitrine) return;
    setSaving(true);
    setToast(null);
    try {
      const saved = await updateVitrine(vitrine);
      // Mettre à jour le state avec la réponse du serveur
      // (le score de complétion et d'autres champs peuvent avoir changé)
      setVitrine(saved);
      setToast({ message: 'Vitrine enregistrée avec succès !', type: 'success' });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "L'enregistrement a échoué. Vérifiez votre connexion.";
      setToast({ message: msg, type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (loading || !vitrine) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── Sticky top bar ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-gray-900">Ma Vitrine Entreprise</h1>
          <p className="text-xs text-gray-400">
            Construisez votre marque employeur pour attirer les meilleurs talents
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/emploi/vitrine/preview"
            className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm
                       font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition"
          >
            <Eye size={15} /> Prévisualiser
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-[#E8622A] hover:bg-[#D45520] text-white text-sm
                       font-semibold px-5 py-2 rounded-xl transition disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>

      {/* ── Tab nav ───────────────────────────────────────────────────────── */}
      <div className="sticky top-[57px] z-10 bg-white border-b border-gray-200 px-6">
        <div className="flex items-center gap-0 overflow-x-auto">
          {[...VITRINE_TABS, { key: 'reseaux' as VitrineTab, label: 'Réseaux Sociaux' }].map(
            ({ key, label }) => (
              <button
                key={key}
                onClick={() => scrollTo(key)}
                className={clsx(
                  'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition -mb-px',
                  activeTab === key
                    ? 'border-[#E8622A] text-[#E8622A]'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                )}
              >
                {label}
              </button>
            ),
          )}
        </div>
      </div>

      {/* ── Scrollable content ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-16">
        <IdentiteSection vitrine={vitrine} onChange={patch} />
        <ChiffresSection vitrine={vitrine} onChange={patch} />
        <CultureSection  vitrine={vitrine} onChange={patch} />
        <MediaSection    vitrine={vitrine} onChange={patch} />
        <ReseauxSection  vitrine={vitrine} onChange={patch} />
      </div>

      {/* ── Toast ───────────────────────────────────────────────────────── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
}

















// // src/app/(recruteur)/recruteur/vitrine/page.tsx
// 'use client';

// import { useState, useEffect, useRef, useCallback } from 'react';
// import Link from 'next/link';
// import { Save, Eye, Linkedin, Instagram, Facebook, Globe } from 'lucide-react';
// import { useVitrine } from '@/hooks/useVitrine';
// import { updateVitrine } from '@/services/vitrine.service';
// import {
//   IdentiteSection,
//   ChiffresSection,
//   CultureSection,
//   MediaSection,
// } from '@/components/recruteur/vitrine/VitrineSections';
// import type { VitrineData, VitrineTab } from '@/types/vitrine.types';
// import { VITRINE_TABS } from '@/types/vitrine.types';
// import clsx from 'clsx';

// const INPUT = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition';

// // ─── Réseaux sociaux section ──────────────────────────────────────────────────
// function ReseauxSection({ vitrine, onChange }: { vitrine: VitrineData; onChange: (v: Partial<VitrineData>) => void }) {
//   const socials = vitrine.socials;
//   const fields: { key: keyof typeof socials; label: string; icon: React.ReactNode; placeholder: string }[] = [
//     { key: 'linkedin',  label: 'LinkedIn',  icon: <Linkedin  size={16} />, placeholder: 'https://linkedin.com/company/…' },
//     { key: 'instagram', label: 'Instagram', icon: <Instagram size={16} />, placeholder: 'https://instagram.com/…' },
//     { key: 'facebook',  label: 'Facebook',  icon: <Facebook  size={16} />, placeholder: 'https://facebook.com/…' },
//     { key: 'website',   label: 'Site web',  icon: <Globe     size={16} />, placeholder: 'https://votre-site.com' },
//   ];

//   return (
//     <div id="reseaux" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
//       <div>
//         <h2 className="font-bold text-gray-900 text-base">Réseaux Sociaux &amp; Liens</h2>
//         <p className="text-xs text-gray-400 mt-0.5">Renforcez votre présence digitale</p>
//       </div>
//       <div className="space-y-3">
//         {fields.map(({ key, label, icon, placeholder }) => (
//           <div key={key} className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 flex-shrink-0">
//               {icon}
//             </div>
//             <div className="flex-1 min-w-0">
//               <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
//               <input
//                 value={socials[key] ?? ''}
//                 onChange={(e) => onChange({ socials: { ...socials, [key]: e.target.value } })}
//                 placeholder={placeholder}
//                 className={INPUT}
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Toast ────────────────────────────────────────────────────────────────────
// function Toast({ message, onDone }: { message: string; onDone: () => void }) {
//   useEffect(() => {
//     const t = setTimeout(onDone, 2500);
//     return () => clearTimeout(t);
//   }, [onDone]);
//   return (
//     <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm
//                     font-medium px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in
//                     slide-in-from-bottom-4">
//       <span className="text-green-400">✓</span> {message}
//     </div>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────
// export default function MaVitrineEntreprisePage() {
//   const { vitrine, loading, setVitrine } = useVitrine();
//   const [activeTab,  setActiveTab]  = useState<VitrineTab>('identite');
//   const [saving,     setSaving]     = useState(false);
//   const [toast,      setToast]      = useState('');
//   const mainRef = useRef<HTMLDivElement>(null);

//   // Sync active tab with scroll
//   useEffect(() => {
//     const sectionIds = VITRINE_TABS.map((t) => t.key).concat(['reseaux']);
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visible = entries.find((e) => e.isIntersecting);
//         if (visible) setActiveTab(visible.target.id as VitrineTab);
//       },
//       { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' }
//     );
//     sectionIds.forEach((id) => {
//       const el = document.getElementById(id);
//       if (el) observer.observe(el);
//     });
//     return () => observer.disconnect();
//   }, [loading]);

//   function patch(update: Partial<VitrineData>) {
//     setVitrine((prev) => prev ? { ...prev, ...update } : prev);
//   }

//   async function handleSave() {
//     if (!vitrine) return;
//     setSaving(true);
//     try {
//       await updateVitrine(vitrine);
//       setToast('Vitrine enregistrée avec succès !');
//     } catch {
//       setToast('Modifications enregistrées (mode hors ligne)');
//     } finally {
//       setSaving(false);
//     }
//   }

//   function scrollTo(id: string) {
//     document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   }

//   if (loading || !vitrine) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full">

//       {/* ── Sticky top bar ──────────────────────────────────────────────── */}
//       <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
//         <div className="flex-1 min-w-0">
//           <h1 className="text-base font-bold text-gray-900">Ma Vitrine Entreprise</h1>
//           <p className="text-xs text-gray-400">Construisez votre marque employeur pour attirer les meilleurs talents</p>
//         </div>
//         <div className="flex items-center gap-2 flex-shrink-0">
//           <Link href="/emploi/vitrine/preview"
//             className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm
//                        font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition">
//             <Eye size={15} /> Prévisualiser
//           </Link>
//           <button onClick={handleSave} disabled={saving}
//             className="flex items-center gap-1.5 bg-[#E8622A] hover:bg-[#D45520] text-white text-sm
//                        font-semibold px-5 py-2 rounded-xl transition disabled:opacity-60">
//             <Save size={15} />
//             {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
//           </button>
//         </div>
//       </div>

//       {/* ── Tab nav ───────────────────────────────────────────────────────── */}
//       <div className="sticky top-[57px] z-10 bg-white border-b border-gray-200 px-6">
//         <div className="flex items-center gap-0 overflow-x-auto">
//           {[...VITRINE_TABS, { key: 'reseaux' as VitrineTab, label: 'Réseaux Sociaux' }].map(({ key, label }) => (
//             <button key={key} onClick={() => scrollTo(key)}
//               className={clsx(
//                 'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition -mb-px',
//                 activeTab === key
//                   ? 'border-[#E8622A] text-[#E8622A]'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               )}>
//               {label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── Scrollable content ────────────────────────────────────────────── */}
//       <div ref={mainRef} className="flex-1 overflow-y-auto p-6 space-y-5 pb-16">
//         <IdentiteSection vitrine={vitrine} onChange={patch} />
//         <ChiffresSection vitrine={vitrine} onChange={patch} />
//         <CultureSection  vitrine={vitrine} onChange={patch} />
//         <MediaSection    vitrine={vitrine} onChange={patch} />
//         <ReseauxSection  vitrine={vitrine} onChange={patch} />
//       </div>

//       {/* Toast */}
//       {toast && <Toast message={toast} onDone={() => setToast('')} />}
//     </div>
//   );
// }