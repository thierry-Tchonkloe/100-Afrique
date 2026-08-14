// src/components/emploi/entreprise-detail/CompanySidebar.tsx
import { MapPin, Briefcase, Phone, Mail, Eye, Linkedin, Instagram, Facebook, Globe, Award } from 'lucide-react';
import { sectorLabel } from '@/lib/sectors';
import type { PublicCompanyDetail } from '@/services/emploi-public.service';

export default function CompanySidebar({ data }: { data: PublicCompanyDetail }) {
  const s = data.socials ?? {};
  const hasSocials = s.linkedin || s.instagram || s.facebook || s.website;
  const hasCertifications = (data.certifications ?? []).length > 0;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm mb-3">Informations</h3>
        <div className="space-y-1.5">
          <p className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin size={12} className="text-gray-400 flex-shrink-0" />
            {data.city || 'Localisation non renseignée'}
          </p>
          {data.sector && (
            <p className="flex items-center gap-2 text-xs text-gray-600">
              <Briefcase size={12} className="text-gray-400 flex-shrink-0" />
              {sectorLabel(data.sector)}
            </p>
          )}
          {data.phone && (
            <p className="flex items-center gap-2 text-xs text-gray-600">
              <Phone size={12} className="text-gray-400 flex-shrink-0" />
              {data.phone}
            </p>
          )}
          {data.email && (
            <p className="flex items-center gap-2 text-xs text-gray-600">
              <Mail size={12} className="text-gray-400 flex-shrink-0" />
              {data.email}
            </p>
          )}
          <p className="flex items-center gap-2 text-xs text-gray-600">
            <Eye size={12} className="text-gray-400 flex-shrink-0" />
            {data.vitrine?.views ?? 0} vues du profil
          </p>
          <p className="flex items-center gap-2 text-xs text-gray-600">
            <Briefcase size={12} className="text-gray-400 flex-shrink-0" />
            {data.offresCount} offre{data.offresCount > 1 ? 's' : ''} active{data.offresCount > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {hasSocials && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Suivez-nous</h3>
          <div className="flex gap-2">
            {s.linkedin && (
              <a href={s.linkedin} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition">
                <Linkedin size={16} />
              </a>
            )}
            {s.instagram && (
              <a href={s.instagram} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition"
                 style={{ background: 'linear-gradient(135deg,#e1306c,#833ab4)' }}>
                <Instagram size={16} />
              </a>
            )}
            {s.facebook && (
              <a href={s.facebook} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition">
                <Facebook size={16} />
              </a>
            )}
            {s.website && (
              <a href={s.website} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 bg-gray-700 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition">
                <Globe size={16} />
              </a>
            )}
          </div>
        </div>
      )}

      {hasCertifications && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Nos Certifications</h3>
          <div className="space-y-2.5">
            {data.certifications.map((c) => (
              <div key={c} className="flex items-center gap-2.5 text-xs text-gray-600">
                <Award size={14} className="text-amber-500 flex-shrink-0" /> {c}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
