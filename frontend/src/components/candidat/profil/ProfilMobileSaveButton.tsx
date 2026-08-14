// src/components/candidat/profil/ProfilMobileSaveButton.tsx
import { Save } from 'lucide-react';

export default function ProfilMobileSaveButton() {
  return (
    <div className="lg:hidden fixed bottom-5 left-0 right-0 flex justify-center z-20 pointer-events-none">
      <button className="pointer-events-auto flex items-center gap-2 bg-[#E8622A] text-white text-sm font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-[#E8622A]/30">
        <Save size={16} />
        Enregistrer les modifications
      </button>
    </div>
  );
}
