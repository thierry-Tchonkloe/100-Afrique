'use client';
// src/components/recruteur/vitrine/VitrineTopBar.tsx
import Link from 'next/link';
import { Save, Eye } from 'lucide-react';

export default function VitrineTopBar({
  saving, onSave,
}: { saving: boolean; onSave: () => void }) {
  return (
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
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 bg-[#E8622A] hover:bg-[#D45520] text-white text-sm
                     font-semibold px-5 py-2 rounded-xl transition disabled:opacity-60"
        >
          <Save size={15} />
          {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
}
