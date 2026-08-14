// src/components/emploi/entreprise-detail/PresentationTab.tsx
import { VALUE_STYLES } from '@/data/perkMeta';
import type { PublicCompanyDetail } from '@/services/emploi-public.service';

export default function PresentationTab({ data }: { data: PublicCompanyDetail }) {
  const values = (data.values ?? []).map((v, i) => ({ ...v, ...VALUE_STYLES[i % VALUE_STYLES.length] }));
  const moments = data.moments ?? [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-4">Qui sommes-nous ?</h2>
        {data.aboutUs ? (
          <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
               dangerouslySetInnerHTML={{ __html: data.aboutUs }} />
        ) : (
          <p className="text-sm text-gray-400 italic">Cette entreprise n'a pas encore complété sa présentation.</p>
        )}
      </div>

      {values.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-5">Nos Valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v) => (
              <div key={v.id} className="flex gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${v.color}`}>
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{v.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {moments.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-5">Moments de Vie d'Équipe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {moments.map((m) => (
              <div key={m.id} className="rounded-2xl overflow-hidden border border-gray-100">
                {m.photoUrl && (
                  <img src={m.photoUrl} alt={m.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-[#E8622A] text-sm mb-1">{m.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
