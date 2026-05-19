'use client';
// src/app/(emploi)/emploi/page.tsx

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  FileText,
  Clock,
  ArrowRight,
  Building2,
  Utensils,
  Plane,
  Briefcase,
  Monitor,
  Calendar,
  Hotel,
} from 'lucide-react';
import { fetchPublicJobs, fetchFeaturedCompanies, MOCK_OFFRES, MOCK_COMPANIES } from '@/services/emploi-public.service';
import type { PublicOffre, PublicEtablissement } from '@/services/emploi-public.service';

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'À l\'instant';
  if (h < 24) return `Il y a ${h} heure${h > 1 ? 's' : ''}`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Il y a 1 jour';
  return `Il y a ${d} jours`;
}

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  hotel:       <Hotel      size={20} />,
  restaurant:  <Utensils   size={20} />,
  transport:   <Plane      size={20} />,
  travel:      <Briefcase  size={20} />,
  tech:        <Monitor    size={20} />,
  events:      <Calendar   size={20} />,
  Hôtellerie:  <Hotel      size={20} />,
  Restauration:<Utensils   size={20} />,
};

const SECTOR_COLORS: Record<string, string> = {
  hotel:       'bg-blue-50 text-blue-600',
  restaurant:  'bg-orange-50 text-orange-600',
  transport:   'bg-sky-50 text-sky-600',
  travel:      'bg-amber-50 text-amber-600',
  tech:        'bg-green-50 text-green-600',
  events:      'bg-purple-50 text-purple-600',
  Hôtellerie:  'bg-blue-50 text-blue-600',
  Restauration:'bg-orange-50 text-orange-600',
};

// Sector images via Unsplash for company cards (fallback backgrounds)
const SECTOR_BG: Record<string, string> = {
  hotel:       'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  restaurant:  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  transport:   'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
  travel:      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
  tech:        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  events:      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  Hôtellerie:  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  Restauration:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
};

const METIERS = [
  { label: 'Hôtellerie',        icon: <Hotel      size={28} />, color: 'text-blue-600   bg-blue-50',   sector: 'hotel'      },
  { label: 'Restauration',      icon: <Utensils   size={28} />, color: 'text-orange-600 bg-orange-50', sector: 'restaurant' },
  { label: 'Aérien & Transport',icon: <Plane      size={28} />, color: 'text-sky-600    bg-sky-50',    sector: 'transport'  },
  { label: 'Agence de Voyage',  icon: <Briefcase  size={28} />, color: 'text-amber-600  bg-amber-50',  sector: 'travel'     },
  { label: 'Tech & Digital',    icon: <Monitor    size={28} />, color: 'text-green-600  bg-green-50',  sector: 'tech'       },
  { label: 'MICE & Événementiel',icon:<Calendar   size={28} />, color: 'text-purple-600 bg-purple-50', sector: 'events'     },
];

// ── Company Card Component ────────────────────────────────────────────────────

function CompanyCard({ company }: { company: PublicEtablissement }) {
  const bg = SECTOR_BG[company.sector] ?? SECTOR_BG['hotel'];
  const icon = SECTOR_ICONS[company.sector] ?? <Building2 size={20} />;
  const iconColor = SECTOR_COLORS[company.sector] ?? 'bg-gray-50 text-gray-600';

  return (
    <Link
      href={`/emploi/entreprises/${company.id}`}
      className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${bg})` }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Sector icon badge */}
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${iconColor} shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-white font-bold text-base leading-tight">{company.name}</h3>
        <p className="text-gray-300 text-xs mt-0.5">{company.offresCount} offres disponibles</p>
      </div>
    </Link>
  );
}

// ── Job Card Component ────────────────────────────────────────────────────────

function JobCard({ offre }: { offre: PublicOffre }) {
  const icon = SECTOR_ICONS[offre.sector] ?? <Building2 size={18} />;
  const iconColor = SECTOR_COLORS[offre.sector] ?? 'bg-gray-50 text-gray-600';
  const isNew = Date.now() - new Date(offre.publishedAt).getTime() < 24 * 3600000;

  return (
    <Link
      href={`/emploi/jobs/${offre.id}`}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100
                 hover:border-[#E8622A]/30 hover:shadow-md transition-all duration-200 group"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[#1E2A3A] text-sm group-hover:text-[#E8622A] transition-colors truncate">
            {offre.title}
          </h3>
          {isNew && (
            <span className="flex-shrink-0 text-xs font-semibold text-[#E8622A] bg-orange-50 px-2 py-0.5 rounded-full">
              Nouveau
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{offre.companyName}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={11} /> {offre.location}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <FileText size={11} /> {offre.contractType}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={11} /> {timeAgo(offre.publishedAt)}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ArrowRight
        size={16}
        className="flex-shrink-0 text-gray-300 group-hover:text-[#E8622A] group-hover:translate-x-0.5 transition-all"
      />
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function EmploiHomePage() {
  const router = useRouter();

  const [search,       setSearch]       = useState('');
  const [location,     setLocation]     = useState('');
  const [contractType, setContractType] = useState('');
  const [offres,       setOffres]       = useState<PublicOffre[]>(MOCK_OFFRES);
  const [companies,    setCompanies]    = useState<PublicEtablissement[]>(MOCK_COMPANIES);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          fetchPublicJobs({ limit: 6 }),
          fetchFeaturedCompanies(),
        ]);
        setOffres(jobsRes.offres.length  ? jobsRes.offres  : MOCK_OFFRES);
        setCompanies(companiesRes.length ? companiesRes    : MOCK_COMPANIES);
      } catch {
        // Fallback to mock data (already set as default state)
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search)       params.set('search',       search);
    if (location)     params.set('location',     location);
    if (contractType) params.set('contractType', contractType);
    router.push(`/emploi/jobs?${params.toString()}`);
  }

  function handleMetier(sector: string) {
    router.push(`/emploi/jobs?sector=${sector}`);
  }

  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[420px] flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-[#1E2A3A]/70" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-8">
            Propulsez votre carrière dans l'industrie du tourisme
          </h1>

          {/* Search card */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl p-6 text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Quoi */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Quoi ?</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E8622A] transition-colors">
                  <Building2 size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Métier, poste..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Où */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Où ?</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E8622A] transition-colors">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Ville, région..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Contrat */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Contrat</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E8622A] transition-colors">
                  <FileText size={16} className="text-gray-400 flex-shrink-0" />
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent appearance-none cursor-pointer"
                  >
                    <option value="">Tous les contrats</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="CDD Saisonnier">CDD Saisonnier</option>
                    <option value="Alternance">Alternance</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#E8622A] hover:bg-[#d4561f]
                         text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              <Search size={16} />
              Rechercher
            </button>
          </form>
        </div>
      </section>

      {/* ── COMPANIES ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
            Découvrez les entreprises qui recrutent
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Explorez les marques employeurs du secteur touristique
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      </section>

      {/* ── MÉTIERS ───────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
              Parcourir par Métiers
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Trouvez rapidement les opportunités dans votre domaine
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {METIERS.map((m) => (
              <button
                key={m.sector}
                onClick={() => handleMetier(m.sector)}
                className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100
                           hover:border-[#E8622A]/40 hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${m.color} group-hover:scale-110 transition-transform`}>
                  {m.icon}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST JOBS ───────────────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
            Les dernières opportunités à saisir
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Postes fraîchement publiés par nos partenaires</p>
        </div>

        <div className="space-y-3">
          {offres.map((offre) => (
            <JobCard key={offre.id} offre={offre} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/emploi/jobs"
            className="inline-flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white
                       font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
          >
            Voir toutes les offres
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── RECRUITER CTA ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 px-6"
        style={{
          background: 'linear-gradient(135deg, #1E2A3A 0%, #E8622A 100%)',
        }}
      >
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 size={28} className="text-white" />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Vous êtes un recruteur ?
          </h2>
          <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            Valorisez votre marque employeur et trouvez les meilleurs talents du tourisme grâce à notre plateforme dédiée.
          </p>

          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
                       px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm"
          >
            Créer votre vitrine entreprise
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}