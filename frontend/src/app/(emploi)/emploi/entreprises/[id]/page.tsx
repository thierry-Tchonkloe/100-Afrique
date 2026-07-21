'use client';
// src/app/(emploi)/emploi/entreprises/[id]/page.tsx

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart, Globe, MapPin, Briefcase, Building2, ChevronLeft, ChevronRight,
  Linkedin, Instagram, Facebook, Hotel, Clock, Eye, Send, WifiOff,
  Phone, Mail, Award,
} from 'lucide-react';
import {
  fetchPublicCompanyDetail,
  type PublicCompanyDetail,
  type PublicOffre,
} from '@/services/emploi-public.service';
import { KPI_ICONS } from '@/types/vitrine.types';
import { sectorLabel } from '@/lib/sectors';

const PERK_META: Record<string, { emoji: string; description: string }> = {
  'Télétravail':          { emoji: '💻', description: 'Travail à distance selon les modalités de l’entreprise.' },
  'Mutuelle':             { emoji: '🏥', description: 'Complémentaire santé prise en charge par l’employeur.' },
  'Tickets Restaurant':   { emoji: '🍽️', description: 'Titres-restaurant pour les jours travaillés.' },
  'Salle de sport':       { emoji: '🏋️', description: 'Accès à une salle de sport ou abonnement pris en charge.' },
  'Formation continue':   { emoji: '🎓', description: 'Programmes de formation pour développer vos compétences.' },
  'Prime annuelle':       { emoji: '💰', description: 'Prime versée selon la performance de l’entreprise.' },
  'Horaires flexibles':   { emoji: '🕒', description: 'Organisation du temps de travail flexible.' },
  'RTT':                  { emoji: '🌴', description: 'Jours de repos supplémentaires.' },
  'Crèche entreprise':    { emoji: '🧸', description: 'Solution de garde d’enfants proposée par l’entreprise.' },
  'Véhicule de fonction': { emoji: '🚗', description: 'Véhicule mis à disposition pour vos déplacements.' },
  'Stock options':        { emoji: '📈', description: 'Participation à la croissance de l’entreprise.' },
  'Intéressement':        { emoji: '🤝', description: 'Part des bénéfices reversée aux collaborateurs.' },
};

const VALUE_STYLES = [
  { icon: '💡', color: 'bg-amber-50 text-amber-600'  },
  { icon: '🤝', color: 'bg-blue-50 text-blue-600'    },
  { icon: '🌿', color: 'bg-green-50 text-green-600'  },
  { icon: '⭐', color: 'bg-purple-50 text-purple-600' },
];

const CONTRACT_COLOR: Record<string, string> = {
  CDI: 'bg-blue-50 text-blue-700', CDD: 'bg-purple-50 text-purple-700',
  Stage: 'bg-teal-50 text-teal-700', Alternance: 'bg-orange-50 text-orange-700',
  'CDD Saisonnier': 'bg-orange-50 text-orange-700',
};

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '';
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return 'À l\'instant';
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Il y a 1 jour' : `Il y a ${d} jours`;
}

function fmtSalary(o: PublicOffre): string {
  if (!o.salaryMin) return '';
  const min = Math.round(o.salaryMin / 1000);
  const max = Math.round((o.salaryMax ?? o.salaryMin) / 1000);
  return min === max ? `${min}k€` : `${min}-${max}k€`;
}

function Lightbox({ photos, initial, onClose }: {
  photos: { id: string; url: string; alt?: string }[]; initial: number; onClose: () => void;
}) {
  const [idx, setIdx] = useState(initial);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft')  setIdx((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose, photos.length]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white">✕</button>
      <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + photos.length) % photos.length); }}
              className="absolute left-4 p-3 text-white/70 hover:text-white">
        <ChevronLeft size={32} />
      </button>
      <img src={photos[idx].url} alt={photos[idx].alt ?? ''}
           className="max-w-[88vw] max-h-[82vh] object-contain rounded-2xl shadow-2xl"
           onClick={(e) => e.stopPropagation()} />
      <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % photos.length); }}
              className="absolute right-4 p-3 text-white/70 hover:text-white">
        <ChevronRight size={32} />
      </button>
      <p className="absolute bottom-5 text-white/50 text-sm">{idx + 1} / {photos.length}</p>
    </div>
  );
}

function Sidebar({ data }: { data: PublicCompanyDetail }) {
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

function PresentationTab({ data }: { data: PublicCompanyDetail }) {
  const values  = (data.values ?? []).map((v, i) => ({ ...v, ...VALUE_STYLES[i % VALUE_STYLES.length] }));
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

function VieTab({ data }: { data: PublicCompanyDetail }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const photos = data.photos ?? [];
  const perks  = data.perks ?? [];
  const hasContent = photos.length > 0 || perks.length > 0;

  if (!hasContent) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400">
        Cette entreprise n'a pas encore ajouté de photos ni d'avantages.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {photos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-4">Nos Espaces de Travail</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {photos.map((p, i) => (
              <div key={p.id} onClick={() => setLightbox(i)}
                   className="aspect-square rounded-xl overflow-hidden cursor-pointer group">
                <img src={p.url} alt={p.alt ?? ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {perks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-5">Nos Avantages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {perks.map((label) => {
              const meta = PERK_META[label] ?? { emoji: '✨', description: '' };
              return (
                <div key={label} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#E8622A]/20 transition">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{meta.emoji}</span>
                    <h3 className="font-bold text-gray-800 text-sm">{label}</h3>
                  </div>
                  {meta.description && <p className="text-xs text-gray-500 leading-relaxed">{meta.description}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {lightbox !== null && (
        <Lightbox photos={photos} initial={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}

function OffresTab({ data }: { data: PublicCompanyDetail }) {
  const [search,       setSearch]       = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [page,         setPage]         = useState(1);
  const PER_PAGE = 5;

  const offres = data.offres ?? [];

  const filtered = offres.filter((o) => {
    const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === 'Tous' ||
      activeFilter === o.contractType ||
      (activeFilter === 'Télétravail possible' && (o.remote === 'partial' || o.remote === 'full'));
    return matchSearch && matchFilter;
  });

  const counts: Record<string, number> = { Tous: offres.length };
  for (const o of offres) counts[o.contractType] = (counts[o.contractType] ?? 0) + 1;
  const teleCount = offres.filter((o) => o.remote === 'partial' || o.remote === 'full').length;

  const filterOptions = ['Tous', 'CDI', 'CDD', 'Alternance', 'Stage', 'Télétravail possible'];
  const shown = filtered.slice(0, page * PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={`Rechercher un métier chez ${data.name}...`}
            className="w-full pl-4 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((f) => {
            const count = f === 'Tous' ? offres.length
                        : f === 'Télétravail possible' ? teleCount
                        : (counts[f] ?? 0);
            if (f !== 'Tous' && f !== 'Télétravail possible' && count === 0) return null;
            return (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setPage(1); }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                  activeFilter === f
                    ? 'bg-[#E8622A] border-[#E8622A] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                }`}
              >
                {f} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm font-semibold text-gray-700">
        <span className="text-[#1E2A3A]">{filtered.length}</span> offre{filtered.length > 1 ? 's' : ''} d'emploi
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center bg-white rounded-2xl border border-gray-100">
          <p className="text-sm font-semibold text-gray-500">Aucune offre trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((offre) => (
            <div key={offre.id}
                 className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-[#1E2A3A] text-base leading-tight">{offre.title}</h3>
                    <p className="text-[#E8622A] font-semibold text-xs mt-0.5 flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600'}`}>
                        {offre.contractType}
                      </span>
                      •&nbsp;{offre.location}
                    </p>
                  </div>
                  {fmtSalary(offre) && (
                    <p className="font-extrabold text-[#1E2A3A] text-base flex-shrink-0">{fmtSalary(offre)}</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> Publié {timeAgo(offre.publishedAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link href={`/emploi/jobs/${offre.id}`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500
                                     border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition">
                      <Eye size={12} /> Voir détails
                    </Link>
                    <Link href={`/emploi/jobs/${offre.id}`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-white
                                     bg-[#E8622A] hover:bg-[#d4561f] px-3 py-1.5 rounded-xl transition">
                      <Send size={12} /> Postuler
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {shown.length < filtered.length && (
        <div className="flex justify-center pt-2">
          <button onClick={() => setPage((p) => p + 1)}
                  className="border border-gray-200 bg-white text-gray-600 font-semibold text-sm px-8 py-3 rounded-xl hover:bg-gray-50 transition">
            Charger plus d'offres
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

type LoadState = 'loading' | 'ok' | 'not_found' | 'network_error';

// FIX Next.js 15 : `params` est une Promise même dans un Client Component.
// On la déballe avec React.use() avant de lire `.id`.
export default function VitrineEntreprisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [data,  setData]  = useState<PublicCompanyDetail | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const [tab,      setTab]      = useState<'presentation' | 'vie' | 'offres'>('presentation');
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setState('loading');

    fetchPublicCompanyDetail(id)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setState('ok');
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          setState('not_found');
        } else {
          setState('network_error');
        }
      });

    return () => { cancelled = true; };
  }, [id]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (state === 'network_error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <WifiOff size={24} className="text-red-400" />
          </div>
          <p className="font-semibold text-gray-700">Impossible de contacter le serveur</p>
          <p className="text-sm text-gray-400 mt-1">
            Vérifiez que l'API est démarrée et accessible depuis ce navigateur
            (problème réseau ou de configuration CORS).
          </p>
          <Link href="/emploi/entreprises" className="mt-4 inline-block text-sm text-[#E8622A] font-semibold hover:underline">
            ← Voir toutes les entreprises
          </Link>
        </div>
      </div>
    );
  }

  if (state === 'not_found' || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} className="text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700">Entreprise introuvable</p>
          <Link href="/emploi/entreprises" className="mt-4 inline-block text-sm text-[#E8622A] font-semibold hover:underline">
            ← Voir toutes les entreprises
          </Link>
        </div>
      </div>
    );
  }

  const banner     = data.vitrine?.bannerUrl;
  const logo       = data.logo ?? data.vitrine?.logoUrl;
  const sectorText = data.sector ? sectorLabel(data.sector) : '';

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="relative h-56 md:h-64 overflow-hidden bg-[#1E2A3A]">
        {banner ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Hotel size={120} className="text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 flex items-end gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center
                          flex-shrink-0 border-2 border-white overflow-hidden">
            {logo
              ? <img src={logo} alt={data.name} className="w-full h-full object-contain p-1" />
              : <Building2 size={22} className="text-[#E8622A]" />}
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-xl font-extrabold text-white leading-tight">{data.name}</h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {sectorText && (
                <span className="text-xs text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  {sectorText}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-white/70">
                <MapPin size={11} /> {data.city || 'Localisation non renseignée'}
              </span>
              <button
                onClick={() => setFollowed((v) => !v)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition ${
                  followed ? 'bg-[#E8622A] border-[#E8622A] text-white' : 'border-white/50 text-white hover:bg-white/10'
                }`}
              >
                <Heart size={10} className={followed ? 'fill-white' : ''} />
                {followed ? 'Suivi' : 'Suivre'}
              </button>
            </div>
            {data.vitrine?.slogan && (
              <p className="text-white/70 text-xs mt-1.5 italic">{data.vitrine.slogan}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── KPI BAR ─────────────────────────────────────────────────────── */}
      {data.kpis && data.kpis.length > 0 && (
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {data.kpis.map((kpi) => {
                const emoji = KPI_ICONS.find((i) => i.key === kpi.icon)?.emoji ?? '📊';
                return (
                  <div key={kpi.id} className="text-center">
                    <div className="flex justify-center mb-1 text-2xl">{emoji}</div>
                    <p className="text-xl font-extrabold text-[#1E2A3A]">{kpi.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-7">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
              <div className="flex">
                {([
                  { key: 'presentation', label: 'Présentation'     },
                  { key: 'vie',          label: 'Vie au Travail'   },
                  { key: 'offres',       label: `Offres (${data.offresCount})` },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex-1 py-3.5 text-sm font-semibold border-b-2 transition-all ${
                      tab === key
                        ? 'border-[#E8622A] text-[#E8622A] bg-orange-50/40'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {tab === 'presentation' && <PresentationTab data={data} />}
            {tab === 'vie'          && <VieTab          data={data} />}
            {tab === 'offres'       && <OffresTab        data={data} />}
          </div>

          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
