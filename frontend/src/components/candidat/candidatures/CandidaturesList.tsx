// src/components/candidat/candidatures/CandidaturesList.tsx
import { Send } from 'lucide-react';
import ApplicationRow from '@/components/candidat/candidatures/ApplicationRow';
import type { Application } from '@/types/candidatures.types';

export default function CandidaturesList({
  applications, onSelect,
}: { applications: Application[]; onSelect: (app: Application) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <Send size={22} className="text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-500">Aucune candidature trouvée</p>
          <p className="text-xs text-gray-400 mt-1">Modifiez vos filtres ou commencez à postuler.</p>
        </div>
      ) : (
        <div>
          {applications.map((app) => (
            <ApplicationRow key={app.id} application={app} onClick={() => onSelect(app)} />
          ))}
        </div>
      )}
    </div>
  );
}
