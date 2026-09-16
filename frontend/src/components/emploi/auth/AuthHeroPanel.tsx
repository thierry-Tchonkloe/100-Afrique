// src/components/emploi/auth/AuthHeroPanel.tsx
import { CheckCircle2, Users } from 'lucide-react';

const FEATURES = [
  "Accès aux meilleures opportunités d'emploi",
  'Networking avec les leaders du secteur',
  'Conseils carrière personnalisés',
];

export default function AuthHeroPanel() {
  return (
    <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-10">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80')" }} />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E2A3A]/80 via-[#1E2A3A]/60 to-[#E8622A]/30" />

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white leading-tight">
          Rejoignez la plus grande communauté des professionnels du tourisme
        </h2>
        <ul className="mt-8 space-y-4">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-white/90 text-sm">
              <CheckCircle2 size={18} className="text-[#E8622A] flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <Users size={16} />
          <span>Déjà +15,000 professionnels nous font confiance</span>
        </div>
      </div>
    </div>
  );
}
