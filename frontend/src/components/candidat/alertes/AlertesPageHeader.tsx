// src/components/candidat/alertes/AlertesPageHeader.tsx
import { Plus } from 'lucide-react';

export default function AlertesPageHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Mes Alertes Job</h1>
        <p className="text-sm text-gray-400 mt-1">
          Configurez vos veilles pour recevoir les nouvelles offres en priorité par email.
        </p>
      </div>
      <button
        onClick={onCreate}
        className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white
                   text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex-shrink-0"
      >
        <Plus size={16} />
        Créer une nouvelle alerte
      </button>
    </div>
  );
}
