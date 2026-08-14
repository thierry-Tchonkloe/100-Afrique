// src/components/emploi/home/HomeHero.tsx
import HeroSearchForm from './HeroSearchForm';

export default function HomeHero({ totalJobs }: { totalJobs: number | null }) {
  return (
    <section className="relative min-h-[440px] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80)' }} />
      <div className="absolute inset-0 bg-[#1E2A3A]/70" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 text-center">
        {totalJobs !== null && (
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/80 text-xs font-medium">
              {totalJobs.toLocaleString('fr-FR')} offre{totalJobs > 1 ? 's' : ''} disponible{totalJobs > 1 ? 's' : ''}
            </span>
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
          Propulsez votre carrière dans<br className="hidden md:block" /> l&apos;industrie du tourisme
        </h1>
        <p className="text-white/70 text-sm mb-8">
          Des milliers d&apos;offres dans l&apos;hôtellerie, la restauration, l&apos;aérien et plus encore.
        </p>

        <HeroSearchForm />
      </div>
    </section>
  );
}
