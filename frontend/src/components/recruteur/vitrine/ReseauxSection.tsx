'use client';
// src/components/recruteur/vitrine/ReseauxSection.tsx
import { Linkedin, Instagram, Facebook, Globe } from 'lucide-react';
import type { VitrineData } from '@/types/vitrine.types';

const INPUT = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition';

export default function ReseauxSection({
  vitrine, onChange,
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
    { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} />, placeholder: 'https://linkedin.com/company/…' },
    { key: 'instagram', label: 'Instagram', icon: <Instagram size={16} />, placeholder: 'https://instagram.com/…' },
    { key: 'facebook', label: 'Facebook', icon: <Facebook size={16} />, placeholder: 'https://facebook.com/…' },
    { key: 'website', label: 'Site web', icon: <Globe size={16} />, placeholder: 'https://votre-site.com' },
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
