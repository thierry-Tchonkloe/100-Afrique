// src/components/candidat/alertes/AlertesEmptyState.tsx
import { Bell, Plus } from 'lucide-react';

export default function AlertesEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-[#FFF3EC] rounded-2xl flex items-center justify-center mb-4">
        <Bell size={28} className="text-[#E8622A]" />
      </div>
      <p className="font-semibold text-gray-700 text-base">Aucune alerte configurée</p>
      <p className="text-sm text-gray-400 mt-1 max-w-xs">
        Créez votre première alerte pour être notifié dès qu'une offre correspond à vos critères.
      </p>
      <button
        onClick={onCreate}
        className="mt-5 flex items-center gap-2 bg-[#E8622A] text-white text-sm font-semibold
                   px-5 py-2.5 rounded-xl hover:bg-[#D45520] transition"
      >
        <Plus size={15} /> Créer ma première alerte
      </button>
    </div>
  );
}
