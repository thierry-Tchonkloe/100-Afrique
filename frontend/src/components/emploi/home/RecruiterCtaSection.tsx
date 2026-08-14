// src/components/emploi/home/RecruiterCtaSection.tsx
import { Building2 } from 'lucide-react';
import RecruiterCtaButton from './RecruiterCtaButton';

export default function RecruiterCtaSection() {
  return (
    <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #1E2A3A 0%, #E8622A 100%)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Building2 size={28} className="text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Vous êtes un recruteur ?</h2>
        <p className="text-white/75 text-sm leading-relaxed mb-8 max-w-md mx-auto">
          Valorisez votre marque employeur et trouvez les meilleurs talents du tourisme grâce à notre plateforme dédiée.
        </p>
        <RecruiterCtaButton />
      </div>
    </section>
  );
}
