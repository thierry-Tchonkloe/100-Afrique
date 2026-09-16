// src/components/emploi/metiers/SectorHero.tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { SectorConfig } from '@/data/sectorPageConfig';

export default function SectorHero({
  cfg, total, loading, onRoleClick,
}: { cfg: SectorConfig; total: number; loading: boolean; onRoleClick: (role: string) => void }) {
  return (
    <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cfg.banner})` }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${cfg.colorHex}DD 0%, #1E2A3A99 60%, #1E2A3Acc 100%)` }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <nav className="flex items-center gap-2 text-xs text-white/60 mb-6">
          <Link href="/emploi" className="hover:text-white transition-colors">Emploi</Link>
          <ChevronRight size={12} />
          <Link href="/emploi/jobs" className="hover:text-white transition-colors">Offres</Link>
          <ChevronRight size={12} />
          <span className="text-white font-medium">{cfg.label}</span>
        </nav>

        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0
                          bg-white/20 backdrop-blur-sm border border-white/30 text-white">
            {cfg.iconLg}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                {cfg.label}
              </h1>
              {!loading && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-bold
                                 px-3 py-1 rounded-full border border-white/30">
                  {total} offre{total > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-2xl">
              {cfg.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {cfg.roles.map((r) => (
                <button
                  key={r}
                  onClick={() => onRoleClick(r)}
                  className="text-xs text-white/90 bg-white/15 hover:bg-white/25
                             border border-white/30 px-3 py-1 rounded-full transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
