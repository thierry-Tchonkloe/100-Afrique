// src/components/emploi/metiers/SectorSidebar.tsx
import Link from 'next/link';
import { ChevronRight, Building2, ArrowRight } from 'lucide-react';
import { OTHER_SECTORS, type SectorConfig } from '@/data/sectorPageConfig';
import SectorAlertCtaButton from './SectorAlertCtaButton';

export default function SectorSidebar({ sector, cfg }: { sector: string; cfg: SectorConfig }) {
  const otherSectors = OTHER_SECTORS.filter((s) => s.key !== sector).slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${cfg.colorHex} 0%, #1E2A3A 100%)` }}>
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
          {cfg.icon}
        </div>
        <p className="font-bold text-base mb-1">Alerte emploi {cfg.label}</p>
        <p className="text-white/75 text-xs leading-relaxed mb-4">
          Recevez les nouvelles offres {cfg.labelPlural} directement par email.
        </p>
        <SectorAlertCtaButton sectorColorHex={cfg.colorHex} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="font-bold text-[#1E2A3A] text-sm mb-3">Autres secteurs</p>
        <div className="space-y-1">
          {otherSectors.map((s) => (
            <Link
              key={s.key}
              href={`/emploi/metiers/${s.key}`}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50
                         transition-colors group"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700 group-hover:text-[#E8622A]
                             transition-colors truncate">
                  {s.label}
                </p>
              </div>
              <ChevronRight size={13} className="text-gray-300 group-hover:text-[#E8622A] transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="font-bold text-[#1E2A3A] text-sm mb-3">Conseils pour {cfg.label}</p>
        <div className="space-y-2">
          {[
            `Préparez votre entretien en ${cfg.label}`,
            `CV parfait pour le secteur ${cfg.label}`,
            'Salaires & négociation en 2024',
          ].map((tip) => (
            <Link
              key={tip}
              href="/emploi/conseils"
              className="flex items-start gap-2 p-2 rounded-xl hover:bg-gray-50
                         transition-colors group"
            >
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: cfg.colorHex }} />
              <p className="text-xs text-gray-600 group-hover:text-[#1E2A3A] transition-colors
                            leading-relaxed">
                {tip}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/emploi/jobs"
        className="flex items-center justify-center gap-2 w-full bg-[#1E2A3A]
                   hover:bg-[#2d3f55] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
      >
        <Building2 size={15} /> Toutes les offres <ArrowRight size={14} />
      </Link>
    </div>
  );
}
