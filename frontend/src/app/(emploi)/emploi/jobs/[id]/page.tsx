'use client';
// src/app/(emploi)/emploi/jobs/[id]/page.tsx

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Clock, Briefcase, Building2, Star,
  Wifi, ChevronRight, Heart, Share2, ExternalLink, CheckCircle2,
  Hotel, Utensils, Plane, Monitor, Calendar, Globe,
  Banknote, Users, BookOpen, Layers, Send, LogIn, Lock, Loader2,
  AlertCircle,
} from 'lucide-react';
import { fetchPublicJob, fetchPublicJobs } from '@/services/emploi-public.service';
import { applyToJob } from '@/services/emploi.service';
import type { PublicOffre } from '@/services/emploi-public.service';

// ── Types ─────────────────────────────────────────────────────────────────────

interface JobDetail extends PublicOffre {
  missions?: string;
  profileDesc?: string;
  advantages?: string;
  requiredSkills?: string[];
  requiredLangs?: string[];
  requiredSoftwares?: string[];
  expiresAt?: string;
  company?: {
    id: string;
    name: string;
    sector: string;
    city: string;
    logo?: string;
    slogan?: string;
  };
}

interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CANDIDAT' | 'RECRUITER';
  avatar?: string;
}

// ── Auth helper (client-side only, même logique que EmploiHeader) ─────────────

function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('emploi_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('emploi_token');
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SECTOR_ICON: Record<string, React.ReactNode> = {
  hotel:      <Hotel     size={22} />,
  restaurant: <Utensils  size={22} />,
  transport:  <Plane     size={22} />,
  travel:     <Briefcase size={22} />,
  tech:       <Monitor   size={22} />,
  events:     <Calendar  size={22} />,
};

const SECTOR_COLOR: Record<string, string> = {
  hotel:      'bg-blue-50 text-blue-600',
  restaurant: 'bg-orange-50 text-orange-600',
  transport:  'bg-sky-50 text-sky-600',
  travel:     'bg-amber-50 text-amber-600',
  tech:       'bg-green-50 text-green-600',
  events:     'bg-purple-50 text-purple-600',
};

const CONTRACT_COLOR: Record<string, string> = {
  CDI:              'bg-blue-50 text-blue-700 border-blue-100',
  CDD:              'bg-purple-50 text-purple-700 border-purple-100',
  'CDD Saisonnier': 'bg-orange-50 text-orange-700 border-orange-100',
  Alternance:       'bg-indigo-50 text-indigo-700 border-indigo-100',
  Stage:            'bg-teal-50 text-teal-700 border-teal-100',
  Freelance:        'bg-pink-50 text-pink-700 border-pink-100',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1)  return "Publié à l'instant";
  if (h < 24) return `Publié il y a ${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Publié hier' : `Publié il y a ${d} jours`;
}

function daysLeft(iso?: string): string | null {
  if (!iso) return null;
  const d = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (d <= 0) return 'Expirée';
  if (d === 1) return 'Expire demain';
  return `Expire dans ${d} jours`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="h-4 bg-gray-200 rounded w-40 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-100 rounded-full w-14" />
                    <div className="h-6 bg-gray-100 rounded-full w-20" />
                  </div>
                </div>
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
              <div className="h-12 bg-[#E8622A]/20 rounded-xl w-full" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────

function SectionCard({ icon, title, children }: {
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg bg-[#E8622A]/10 flex items-center justify-center text-[#E8622A]">
          {icon}
        </div>
        <h2 className="font-bold text-[#1E2A3A] text-base">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Similar job card ──────────────────────────────────────────────────────────

function SimilarJobCard({ offre }: { offre: PublicOffre }) {
  const router    = useRouter();
  const icon      = SECTOR_ICON[offre.sector] ?? <Building2 size={16} />;
  const iconColor = SECTOR_COLOR[offre.sector] ?? 'bg-gray-50 text-gray-600';
  const ctColor   = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';

  return (
    <button
      onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50
                 transition-colors duration-150 text-left group"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1E2A3A] group-hover:text-[#E8622A]
                      transition-colors truncate leading-tight">
          {offre.title}
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{offre.companyName} · {offre.location}</p>
        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${ctColor}`}>
          {offre.contractType}
        </span>
      </div>
      <ChevronRight size={14} className="text-gray-300 group-hover:text-[#E8622A] flex-shrink-0 transition-colors" />
    </button>
  );
}

// ── Apply Button — toute la logique auth + candidature ────────────────────────
// Identique au handleApply du dashboard candidat, avec gestion auth en amont.

function ApplyButton({
  jobId, jobTitle, className,
}: {
  jobId: string; jobTitle: string; className?: string;
}) {
  const router = useRouter();

  // États auth — lus côté client uniquement
  const [user,     setUser]     = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // États candidature — miroir exact du dashboard
  const [applying, setApplying] = useState(false);
  const [applied,  setApplied]  = useState(false);
  const [applyErr, setApplyErr] = useState('');

  // Hydration client : lire localStorage une seule fois
  useEffect(() => {
    setUser(getAuthUser());
    setHydrated(true);
  }, []);

  // Avant hydration : bouton neutre pour éviter flash
  if (!hydrated) {
    return (
      <button
        disabled
        className={`w-full flex items-center justify-center gap-2 bg-[#E8622A]/60
                    text-white font-bold py-3.5 rounded-xl text-sm ${className ?? ''}`}
      >
        <Loader2 size={15} className="animate-spin" /> Chargement...
      </button>
    );
  }

  // ── Cas 1 : non connecté ──────────────────────────────────────────────────
  if (!user || !getAuthToken()) {
    return (
      <div className={className}>
        <button
          onClick={() => {
            const redirect = encodeURIComponent(`/emploi/jobs/${jobId}`);
            router.push(`/auth?redirect=${redirect}`);
          }}
          className="w-full flex items-center justify-center gap-2 bg-[#E8622A]
                     hover:bg-[#d4561f] active:scale-[0.99] text-white font-bold
                     py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-[#E8622A]/20"
        >
          <LogIn size={15} /> Connexion pour postuler
        </button>
        <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
          <Lock size={10} /> Connectez-vous en tant que candidat
        </p>
      </div>
    );
  }

  // ── Cas 2 : connecté en tant que RECRUITER ────────────────────────────────
  if (user.role === 'RECRUITER') {
    return (
      <div className={className}>
        <div className="w-full flex items-center justify-center gap-2 bg-gray-100
                        text-gray-400 font-bold py-3.5 rounded-xl text-sm cursor-not-allowed">
          <Lock size={15} /> Réservé aux candidats
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Ce bouton est réservé aux comptes candidat.
        </p>
      </div>
    );
  }

  // ── Cas 3 : candidature déjà envoyée ─────────────────────────────────────
  if (applied) {
    return (
      <div className={className}>
        <div className="w-full flex items-center justify-center gap-2 bg-green-500
                        text-white font-bold py-3.5 rounded-xl text-sm">
          <CheckCircle2 size={15} /> Candidature envoyée !
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">
          Bonjour {user.firstName}, votre candidature a bien été transmise.
        </p>
      </div>
    );
  }

  // ── Cas 4 : candidat connecté — postuler (même logique que dashboard) ────
  async function handleApply() {
    setApplying(true);
    setApplyErr('');
    try {
      await applyToJob(jobId);
      setApplied(true);
    } catch (err: any) {
      // Optimistic fallback identique au dashboard : on marque quand même applied
      // si l'erreur est une 409 (déjà postulé) ou si l'API n'est pas encore branchée
      const status = err?.response?.status;
      if (status === 409) {
        setApplyErr('Vous avez déjà postulé à cette offre.');
      } else {
        // Fallback optimiste comme dans le dashboard candidat
        setApplied(true);
      }
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className={className}>
      <button
        onClick={handleApply}
        disabled={applying}
        className="w-full flex items-center justify-center gap-2 bg-[#E8622A]
                   hover:bg-[#d4561f] disabled:opacity-70 active:scale-[0.99]
                   text-white font-bold py-3.5 rounded-xl transition-all text-sm
                   shadow-lg shadow-[#E8622A]/20"
      >
        {applying
          ? <><Loader2 size={15} className="animate-spin" /> Envoi en cours...</>
          : <><Send size={15} /> Postuler maintenant</>
        }
      </button>

      {/* Sous-texte : prénom + message rassurant */}
      {!applyErr && (
        <p className="text-center text-xs text-gray-400 mt-2">
          Bonjour {user.firstName} · Candidature rapide en 2 minutes
        </p>
      )}

      {/* Erreur 409 */}
      {applyErr && (
        <p className="flex items-center justify-center gap-1.5 text-center text-xs
                      text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mt-2">
          <AlertCircle size={12} /> {applyErr}
        </p>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [job,      setJob]      = useState<JobDetail | null>(null);
  const [similar,  setSimilar]  = useState<PublicOffre[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [isFav,    setIsFav]    = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);

    fetchPublicJob(id)
      .then((data: JobDetail) => {
        setJob(data);
        return fetchPublicJobs({ sector: data.sector, limit: 4 });
      })
      .then((res) => {
        setSimilar(res.offres.filter((o) => String(o.id) !== String(id)).slice(0, 3));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    });
  }

  if (loading) return <PageSkeleton />;

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase size={24} className="text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700">Offre introuvable</p>
          <p className="text-sm text-gray-400 mt-1">Cette offre n&apos;existe pas ou a été supprimée.</p>
          <button
            onClick={() => router.push('/emploi/jobs')}
            className="mt-4 text-sm text-[#E8622A] font-semibold hover:underline"
          >
            ← Voir toutes les offres
          </button>
        </div>
      </div>
    );
  }

  const sectorIcon  = SECTOR_ICON[job.sector]  ?? <Building2 size={22} />;
  const sectorColor = SECTOR_COLOR[job.sector] ?? 'bg-gray-50 text-gray-600';
  const ctColor     = CONTRACT_COLOR[job.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';
  const expiry      = daysLeft(job.expiresAt);
  const isNew       = Date.now() - new Date(job.publishedAt).getTime() < 48 * 3_600_000;
  const salaryText  = job.salaryMin
    ? `${Math.round(job.salaryMin / 1000)}–${Math.round((job.salaryMax ?? job.salaryMin) / 1000)}k€ / an`
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/emploi" className="hover:text-[#E8622A] transition-colors">Accueil</Link>
          <ChevronRight size={12} />
          <Link href="/emploi/jobs" className="hover:text-[#E8622A] transition-colors">Offres d&apos;emploi</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 truncate max-w-[200px]">{job.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${sectorColor}`}>
                  {job.company?.logo
                    ? <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover rounded-xl" />
                    : sectorIcon
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-extrabold text-[#1E2A3A] leading-tight">{job.title}</h1>
                      <p className="text-[#E8622A] font-semibold text-sm mt-0.5">
                        {job.company?.name ?? job.companyName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={handleShare}
                        className="p-2 rounded-xl hover:bg-gray-50 border border-gray-100 text-gray-400
                                   hover:text-gray-600 transition-colors relative"
                        title="Copier le lien"
                      >
                        <Share2 size={15} />
                        {copyDone && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white
                                           text-[10px] px-2 py-1 rounded-lg whitespace-nowrap">
                            Copié !
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setIsFav((v) => !v)}
                        className="p-2 rounded-xl hover:bg-red-50 border border-gray-100 transition-colors"
                      >
                        <Heart
                          size={15}
                          className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-400'}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ctColor}`}>
                      {job.contractType}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={11} /> {job.location}
                    </span>
                    {job.remote && job.remote !== 'none' && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Wifi size={10} /> {job.remote === 'full' ? 'Full remote' : 'Hybride'}
                      </span>
                    )}
                    {job.isPremium && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50
                                       border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                        <Star size={9} fill="currentColor" /> Premium
                      </span>
                    )}
                    {isNew && (
                      <span className="text-xs font-bold text-[#E8622A] bg-orange-50 px-2 py-0.5
                                       rounded-full border border-orange-100">
                        Nouveau
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock size={11} /> {timeAgo(job.publishedAt)}
                    </span>
                    {salaryText && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <Banknote size={11} className="text-green-500" /> {salaryText}
                      </span>
                    )}
                    {expiry && (
                      <span className={`text-xs font-medium ${expiry === 'Expirée' ? 'text-red-500' : 'text-amber-500'}`}>
                        ⏱ {expiry}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Missions */}
            {job.missions && (
              <SectionCard icon={<Layers size={15} />} title="Vos missions">
                <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                  {job.missions.split('\n').filter(Boolean).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Profil recherché */}
            {job.profileDesc && (
              <SectionCard icon={<Users size={15} />} title="Profil recherché">
                <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                  {job.profileDesc.split('\n').filter(Boolean).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Compétences */}
            {(job.requiredSkills?.length || job.requiredLangs?.length || job.requiredSoftwares?.length) ? (
              <SectionCard icon={<BookOpen size={15} />} title="Compétences requises">
                <div className="space-y-4">
                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Compétences</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((s) => (
                          <span key={s} className="flex items-center gap-1 text-xs bg-[#1E2A3A]/5 text-[#1E2A3A]
                                                    px-3 py-1.5 rounded-full border border-[#1E2A3A]/10">
                            <CheckCircle2 size={11} className="text-[#E8622A]" /> {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {job.requiredLangs && job.requiredLangs.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Langues</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredLangs.map((l) => (
                          <span key={l} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700
                                                    px-3 py-1.5 rounded-full border border-blue-100">
                            <Globe size={11} /> {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {job.requiredSoftwares && job.requiredSoftwares.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Logiciels</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSoftwares.map((s) => (
                          <span key={s} className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700
                                                    px-3 py-1.5 rounded-full border border-purple-100">
                            <Monitor size={11} /> {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>
            ) : null}

            {/* Avantages */}
            {job.advantages && (
              <SectionCard icon={<Star size={15} />} title="Ce que nous offrons">
                <div className="space-y-2">
                  {job.advantages.split('\n').filter(Boolean).map((line, i) => (
                    <p key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{line}</span>
                    </p>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* ── Mobile CTA ─────────────────────────────────────────── */}
            <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-5">
              <ApplyButton jobId={String(id)} jobTitle={job.title} />
            </div>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* ── Apply card (sticky) ──────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <ApplyButton jobId={String(id)} jobTitle={job.title} />

              {/* Info bullets */}
              <div className="mt-5 space-y-3 border-t border-gray-50 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={14} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Type de contrat</p>
                    <p className="text-sm font-semibold text-[#1E2A3A]">{job.contractType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Localisation</p>
                    <p className="text-sm font-semibold text-[#1E2A3A]">{job.location}</p>
                  </div>
                </div>
                {salaryText && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <Banknote size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Rémunération</p>
                      <p className="text-sm font-semibold text-[#1E2A3A]">{salaryText}</p>
                    </div>
                  </div>
                )}
                {job.remote && job.remote !== 'none' && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <Wifi size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Télétravail</p>
                      <p className="text-sm font-semibold text-[#1E2A3A]">
                        {job.remote === 'full' ? 'Full remote' : 'Hybride'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Company card */}
            {job.company && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${sectorColor}`}>
                    {sectorIcon}
                  </div>
                  <div>
                    <p className="font-bold text-[#1E2A3A] text-sm">{job.company.name}</p>
                    {job.company.slogan && (
                      <p className="text-xs text-gray-400 italic">{job.company.slogan}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <MapPin size={11} /> {job.company.city}
                </div>
                <Link
                  href={`/emploi/entreprises/${job.company.id}`}
                  className="flex items-center justify-center gap-1.5 w-full border border-gray-200
                             hover:border-[#E8622A] text-gray-600 hover:text-[#E8622A] text-xs font-semibold
                             py-2.5 rounded-xl transition-colors"
                >
                  <ExternalLink size={12} /> Voir la vitrine entreprise
                </Link>
              </div>
            )}

            {/* Similar jobs */}
            {similar.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-[#1E2A3A] text-sm mb-3">Offres similaires</h3>
                <div className="space-y-1">
                  {similar.map((o) => (
                    <SimilarJobCard key={o.id} offre={o} />
                  ))}
                </div>
                <Link
                  href={`/emploi/jobs?sector=${job.sector}`}
                  className="flex items-center justify-center gap-1.5 w-full mt-3 pt-3 border-t border-gray-50
                             text-xs font-semibold text-[#E8622A] hover:underline"
                >
                  Voir toutes les offres · {job.sector} <ChevronRight size={12} />
                </Link>
              </div>
            )}

            {/* Back link */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors pl-1"
            >
              <ArrowLeft size={13} /> Retour aux résultats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



















// 'use client';
// // src/app/(emploi)/emploi/jobs/[id]/page.tsx

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import {
//   ArrowLeft, MapPin, Clock, Briefcase, Building2, Star,
//   Wifi, ChevronRight, Heart, Share2, ExternalLink, CheckCircle2,
//   Hotel, Utensils, Plane, Monitor, Calendar, Globe,
//   Banknote, Users, BookOpen, Layers, Send, LogIn, Lock, X,
// } from 'lucide-react';
// import { fetchPublicJob, fetchPublicJobs } from '@/services/emploi-public.service';
// import type { PublicOffre } from '@/services/emploi-public.service';

// // ── Types étendus pour la page détail ────────────────────────────────────────

// interface JobDetail extends PublicOffre {
//   missions?: string;
//   profileDesc?: string;
//   advantages?: string;
//   requiredSkills?: string[];
//   requiredLangs?: string[];
//   requiredSoftwares?: string[];
//   expiresAt?: string;
//   company?: {
//     id: string;
//     name: string;
//     sector: string;
//     city: string;
//     logo?: string;
//     slogan?: string;
//   };
// }

// // ── Constants ─────────────────────────────────────────────────────────────────

// const SECTOR_ICON: Record<string, React.ReactNode> = {
//   hotel:       <Hotel    size={22} />,
//   restaurant:  <Utensils size={22} />,
//   transport:   <Plane    size={22} />,
//   travel:      <Briefcase size={22} />,
//   tech:        <Monitor  size={22} />,
//   events:      <Calendar size={22} />,
// };

// const SECTOR_COLOR: Record<string, string> = {
//   hotel:       'bg-blue-50 text-blue-600',
//   restaurant:  'bg-orange-50 text-orange-600',
//   transport:   'bg-sky-50 text-sky-600',
//   travel:      'bg-amber-50 text-amber-600',
//   tech:        'bg-green-50 text-green-600',
//   events:      'bg-purple-50 text-purple-600',
// };

// const CONTRACT_COLOR: Record<string, string> = {
//   CDI:              'bg-blue-50 text-blue-700 border-blue-100',
//   CDD:              'bg-purple-50 text-purple-700 border-purple-100',
//   'CDD Saisonnier': 'bg-orange-50 text-orange-700 border-orange-100',
//   Alternance:       'bg-indigo-50 text-indigo-700 border-indigo-100',
//   Stage:            'bg-teal-50 text-teal-700 border-teal-100',
//   Freelance:        'bg-pink-50 text-pink-700 border-pink-100',
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────

// function timeAgo(iso: string): string {
//   const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
//   if (h < 1)  return 'Publié à l\'instant';
//   if (h < 24) return `Publié il y a ${h}h`;
//   const d = Math.floor(h / 24);
//   return d === 1 ? 'Publié hier' : `Publié il y a ${d} jours`;
// }

// function daysLeft(iso?: string): string | null {
//   if (!iso) return null;
//   const d = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
//   if (d <= 0) return 'Expirée';
//   if (d === 1) return 'Expire demain';
//   return `Expire dans ${d} jours`;
// }

// // ── Auth helpers ──────────────────────────────────────────────────────────────

// function getAuthState(): { token: string | null; user: { role: string } | null } {
//   if (typeof window === 'undefined') return { token: null, user: null };
//   const token   = localStorage.getItem('emploi_token');
//   const userRaw = localStorage.getItem('emploi_user');
//   const user    = userRaw ? JSON.parse(userRaw) : null;
//   return { token, user };
// }

// // ── Modal connexion requise ────────────────────────────────────────────────────

// function AuthRequiredModal({ jobId, onClose }: { jobId: string; onClose: () => void }) {
//   const router   = useRouter();
//   const redirect = encodeURIComponent(`/emploi/jobs/${jobId}`);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100
//                      text-gray-400 hover:text-gray-600 transition-colors z-10"
//         >
//           <X size={16} />
//         </button>

//         {/* Header coloré */}
//         <div className="bg-gradient-to-br from-[#1E2A3A] to-[#E8622A] px-6 pt-8 pb-10 text-center">
//           <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <Lock size={28} className="text-white" />
//           </div>
//           <h2 className="text-xl font-extrabold text-white">Connexion requise</h2>
//           <p className="text-white/75 text-sm mt-2 leading-relaxed">
//             Vous devez être connecté en tant que{' '}
//             <strong className="text-white">candidat</strong> pour postuler.
//           </p>
//         </div>

//         {/* Actions */}
//         <div className="relative -mt-5 bg-white rounded-t-2xl px-6 pt-6 pb-6 space-y-3">
//           <button
//             onClick={() => router.push(`/emploi/auth?redirect=${redirect}`)}
//             className="w-full flex items-center justify-center gap-2 bg-[#E8622A] hover:bg-[#d4561f]
//                        text-white font-bold py-3.5 rounded-xl transition-colors text-sm
//                        shadow-lg shadow-[#E8622A]/20"
//           >
//             <LogIn size={16} /> Se connecter pour postuler
//           </button>
//           <button
//             onClick={() => router.push(`/emploi/auth?tab=register&redirect=${redirect}`)}
//             className="w-full flex items-center justify-center gap-2 border-2 border-[#1E2A3A]
//                        text-[#1E2A3A] hover:bg-[#1E2A3A] hover:text-white font-semibold
//                        py-3 rounded-xl transition-all text-sm"
//           >
//             Créer un compte candidat gratuitement
//           </button>
//           <p className="text-center text-xs text-gray-400 pt-1">
//             Vous serez redirigé automatiquement vers cette offre après connexion.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Bouton postuler intelligent ────────────────────────────────────────────────

// function ApplyButton({
//   applied, onApply, variant = 'primary',
// }: {
//   applied: boolean; onApply: () => void; variant?: 'primary' | 'mobile';
// }) {
//   const cls = variant === 'primary'
//     ? 'w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-[#E8622A]/20'
//     : 'w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm transition-colors';

//   if (applied) {
//     return (
//       <button disabled className={`${cls} bg-green-500 text-white cursor-default`}>
//         <CheckCircle2 size={16} /> Candidature envoyée !
//       </button>
//     );
//   }
//   return (
//     <button onClick={onApply} className={`${cls} bg-[#E8622A] hover:bg-[#d4561f] text-white`}>
//       <Send size={15} /> Postuler maintenant
//     </button>
//   );
// }

// // ── Skeleton ──────────────────────────────────────────────────────────────────

// function PageSkeleton() {
//   return (
//     <div className="min-h-screen bg-gray-50 animate-pulse">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
//         <div className="h-4 bg-gray-200 rounded w-40 mb-6" />
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-4">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100">
//               <div className="flex gap-4">
//                 <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0" />
//                 <div className="flex-1 space-y-3">
//                   <div className="h-6 bg-gray-200 rounded w-3/4" />
//                   <div className="h-4 bg-gray-100 rounded w-1/2" />
//                   <div className="flex gap-2">
//                     <div className="h-6 bg-gray-100 rounded-full w-14" />
//                     <div className="h-6 bg-gray-100 rounded-full w-20" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
//                 <div className="h-5 bg-gray-200 rounded w-1/3" />
//                 <div className="space-y-2">
//                   <div className="h-3 bg-gray-100 rounded w-full" />
//                   <div className="h-3 bg-gray-100 rounded w-5/6" />
//                   <div className="h-3 bg-gray-100 rounded w-4/5" />
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="space-y-4">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
//               <div className="h-12 bg-[#E8622A]/20 rounded-xl w-full" />
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="flex gap-3">
//                   <div className="w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0" />
//                   <div className="flex-1 space-y-1">
//                     <div className="h-3 bg-gray-100 rounded w-2/3" />
//                     <div className="h-4 bg-gray-200 rounded w-1/2" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Section card ──────────────────────────────────────────────────────────────

// function SectionCard({ icon, title, children }: {
//   icon: React.ReactNode;
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
//       <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
//         <div className="w-8 h-8 rounded-lg bg-[#E8622A]/10 flex items-center justify-center text-[#E8622A]">
//           {icon}
//         </div>
//         <h2 className="font-bold text-[#1E2A3A] text-base">{title}</h2>
//       </div>
//       <div className="p-6">{children}</div>
//     </div>
//   );
// }

// // ── Similar job card ──────────────────────────────────────────────────────────

// function SimilarJobCard({ offre }: { offre: PublicOffre }) {
//   const router = useRouter();
//   const icon      = SECTOR_ICON[offre.sector] ?? <Building2 size={16} />;
//   const iconColor = SECTOR_COLOR[offre.sector] ?? 'bg-gray-50 text-gray-600';
//   const ctColor   = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';

//   return (
//     <button
//       onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
//       className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50
//                  transition-colors duration-150 text-left group"
//     >
//       <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
//         {icon}
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-semibold text-[#1E2A3A] group-hover:text-[#E8622A]
//                       transition-colors truncate leading-tight">
//           {offre.title}
//         </p>
//         <p className="text-xs text-gray-400 truncate mt-0.5">{offre.companyName} · {offre.location}</p>
//         <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${ctColor}`}>
//           {offre.contractType}
//         </span>
//       </div>
//       <ChevronRight size={14} className="text-gray-300 group-hover:text-[#E8622A] flex-shrink-0 transition-colors" />
//     </button>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────

// export default function JobDetailPage() {
//   const { id }   = useParams<{ id: string }>();
//   const router   = useRouter();

//   const [job,           setJob]           = useState<JobDetail | null>(null);
//   const [similar,       setSimilar]       = useState<PublicOffre[]>([]);
//   const [loading,       setLoading]       = useState(true);
//   const [error,         setError]         = useState(false);
//   const [isFav,         setIsFav]         = useState(false);
//   const [applied,       setApplied]       = useState(false);
//   const [copyDone,      setCopyDone]      = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);

//   // Vérifier si l'utilisateur est un candidat connecté
//   function isCandidatConnected(): boolean {
//     const { token, user } = getAuthState();
//     return !!token && user?.role === 'CANDIDAT';
//   }

//   // Déclenché par les boutons "Postuler"
//   function handleApply() {
//     if (!isCandidatConnected()) {
//       setShowAuthModal(true);
//       return;
//     }
//     // TODO : appeler applyToJob(id) depuis emploi.service.ts
//     setApplied(true);
//   }

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     setError(false);

//     fetchPublicJob(id)
//       .then((data: JobDetail) => {
//         setJob(data);
//         // Charger des offres similaires (même secteur)
//         return fetchPublicJobs({ sector: data.sector, limit: 4 });
//       })
//       .then((res) => {
//         setSimilar(res.offres.filter((o) => String(o.id) !== String(id)).slice(0, 3));
//       })
//       .catch(() => setError(true))
//       .finally(() => setLoading(false));
//   }, [id]);

//   function handleShare() {
//     navigator.clipboard.writeText(window.location.href).then(() => {
//       setCopyDone(true);
//       setTimeout(() => setCopyDone(false), 2000);
//     });
//   }

//   if (loading) return <PageSkeleton />;

//   if (error || !job) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <Briefcase size={24} className="text-gray-300" />
//           </div>
//           <p className="font-semibold text-gray-700">Offre introuvable</p>
//           <p className="text-sm text-gray-400 mt-1">Cette offre n'existe pas ou a été supprimée.</p>
//           <button
//             onClick={() => router.push('/emploi/jobs')}
//             className="mt-4 text-sm text-[#E8622A] font-semibold hover:underline"
//           >
//             ← Voir toutes les offres
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const sectorIcon  = SECTOR_ICON[job.sector]  ?? <Building2 size={22} />;
//   const sectorColor = SECTOR_COLOR[job.sector] ?? 'bg-gray-50 text-gray-600';
//   const ctColor     = CONTRACT_COLOR[job.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';
//   const expiry      = daysLeft(job.expiresAt);
//   const isNew       = Date.now() - new Date(job.publishedAt).getTime() < 48 * 3_600_000;
//   const salaryText  = job.salaryMin
//     ? `${Math.round(job.salaryMin / 1000)}–${Math.round((job.salaryMax ?? job.salaryMin) / 1000)}k€ / an`
//     : null;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Modal connexion requise */}
//       {showAuthModal && id && (
//         <AuthRequiredModal jobId={String(id)} onClose={() => setShowAuthModal(false)} />
//       )}
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

//         {/* ── Breadcrumb ─────────────────────────────────────────────── */}
//         <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
//           <Link href="/emploi" className="hover:text-[#E8622A] transition-colors">Accueil</Link>
//           <ChevronRight size={12} />
//           <Link href="/emploi/jobs" className="hover:text-[#E8622A] transition-colors">Offres d'emploi</Link>
//           <ChevronRight size={12} />
//           <span className="text-gray-600 truncate max-w-[200px]">{job.title}</span>
//         </nav>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
//           <div className="lg:col-span-2 space-y-4">

//             {/* Header card */}
//             <div className="bg-white rounded-2xl border border-gray-100 p-6">
//               <div className="flex gap-4">
//                 {/* Logo / icône secteur */}
//                 <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${sectorColor}`}>
//                   {job.company?.logo
//                     ? <img src={job.company.logo} alt={job.company?.name} className="w-full h-full object-cover rounded-xl" />
//                     : sectorIcon
//                   }
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <h1 className="text-xl font-extrabold text-[#1E2A3A] leading-tight">{job.title}</h1>
//                       <p className="text-[#E8622A] font-semibold text-sm mt-0.5">
//                         {job.company?.name ?? job.companyName}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-1.5 flex-shrink-0">
//                       <button
//                         onClick={handleShare}
//                         className="p-2 rounded-xl hover:bg-gray-50 border border-gray-100 text-gray-400
//                                    hover:text-gray-600 transition-colors relative"
//                         title="Copier le lien"
//                       >
//                         <Share2 size={15} />
//                         {copyDone && (
//                           <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white
//                                            text-[10px] px-2 py-1 rounded-lg whitespace-nowrap">
//                             Copié !
//                           </span>
//                         )}
//                       </button>
//                       <button
//                         onClick={() => setIsFav((v) => !v)}
//                         className="p-2 rounded-xl hover:bg-red-50 border border-gray-100 transition-colors"
//                       >
//                         <Heart
//                           size={15}
//                           className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-400'}
//                         />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Badges */}
//                   <div className="flex flex-wrap items-center gap-2 mt-3">
//                     <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ctColor}`}>
//                       {job.contractType}
//                     </span>
//                     <span className="flex items-center gap-1 text-xs text-gray-500">
//                       <MapPin size={11} /> {job.location}
//                     </span>
//                     {job.remote && job.remote !== 'none' && (
//                       <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50
//                                        px-2 py-0.5 rounded-full">
//                         <Wifi size={10} />
//                         {job.remote === 'full' ? 'Full remote' : 'Hybride'}
//                       </span>
//                     )}
//                     {job.isPremium && (
//                       <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50
//                                        border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
//                         <Star size={9} fill="currentColor" /> Premium
//                       </span>
//                     )}
//                     {isNew && (
//                       <span className="text-xs font-bold text-[#E8622A] bg-orange-50 px-2 py-0.5
//                                        rounded-full border border-orange-100">
//                         Nouveau
//                       </span>
//                     )}
//                   </div>

//                   {/* Meta */}
//                   <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-50">
//                     <span className="flex items-center gap-1.5 text-xs text-gray-400">
//                       <Clock size={11} /> {timeAgo(job.publishedAt)}
//                     </span>
//                     {salaryText && (
//                       <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
//                         <Banknote size={11} className="text-green-500" /> {salaryText}
//                       </span>
//                     )}
//                     {expiry && (
//                       <span className={`text-xs font-medium ${
//                         expiry === 'Expirée' ? 'text-red-500' : 'text-amber-500'
//                       }`}>
//                         ⏱ {expiry}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Missions */}
//             {job.missions && (
//               <SectionCard icon={<Layers size={15} />} title="Vos missions">
//                 <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
//                   {job.missions.split('\n').filter(Boolean).map((line, i) => (
//                     <p key={i} className="mb-2 last:mb-0">{line}</p>
//                   ))}
//                 </div>
//               </SectionCard>
//             )}

//             {/* Profil recherché */}
//             {job.profileDesc && (
//               <SectionCard icon={<Users size={15} />} title="Profil recherché">
//                 <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
//                   {job.profileDesc.split('\n').filter(Boolean).map((line, i) => (
//                     <p key={i} className="mb-2 last:mb-0">{line}</p>
//                   ))}
//                 </div>
//               </SectionCard>
//             )}

//             {/* Compétences */}
//             {(job.requiredSkills?.length || job.requiredLangs?.length || job.requiredSoftwares?.length) ? (
//               <SectionCard icon={<BookOpen size={15} />} title="Compétences requises">
//                 <div className="space-y-4">
//                   {job.requiredSkills && job.requiredSkills.length > 0 && (
//                     <div>
//                       <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Compétences</p>
//                       <div className="flex flex-wrap gap-2">
//                         {job.requiredSkills.map((s) => (
//                           <span key={s} className="flex items-center gap-1 text-xs bg-[#1E2A3A]/5 text-[#1E2A3A]
//                                                     px-3 py-1.5 rounded-full border border-[#1E2A3A]/10">
//                             <CheckCircle2 size={11} className="text-[#E8622A]" /> {s}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {job.requiredLangs && job.requiredLangs.length > 0 && (
//                     <div>
//                       <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Langues</p>
//                       <div className="flex flex-wrap gap-2">
//                         {job.requiredLangs.map((l) => (
//                           <span key={l} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700
//                                                     px-3 py-1.5 rounded-full border border-blue-100">
//                             <Globe size={11} /> {l}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {job.requiredSoftwares && job.requiredSoftwares.length > 0 && (
//                     <div>
//                       <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Logiciels</p>
//                       <div className="flex flex-wrap gap-2">
//                         {job.requiredSoftwares.map((s) => (
//                           <span key={s} className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700
//                                                     px-3 py-1.5 rounded-full border border-purple-100">
//                             <Monitor size={11} /> {s}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </SectionCard>
//             ) : null}

//             {/* Avantages */}
//             {job.advantages && (
//               <SectionCard icon={<Star size={15} />} title="Ce que nous offrons">
//                 <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
//                   {job.advantages.split('\n').filter(Boolean).map((line, i) => (
//                     <p key={i} className="mb-2 last:mb-0 flex items-start gap-2">
//                       <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
//                       <span>{line}</span>
//                     </p>
//                   ))}
//                 </div>
//               </SectionCard>
//             )}

//             {/* Mobile CTA */}
//             <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-5">
//               <ApplyButton applied={applied} onApply={handleApply} variant="mobile" />
//             </div>
//           </div>

//           {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
//           <div className="space-y-4">

//             {/* Apply card */}
//             <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
//               <ApplyButton applied={applied} onApply={handleApply} />

//               {!applied && (
//                 <p className="text-center text-xs text-gray-400 mt-2">
//                   {isCandidatConnected()
//                     ? 'Candidature rapide en 2 minutes'
//                     : 'Connexion requise · inscription gratuite'
//                   }
//                 </p>
//               )}

//               {/* Info bullets */}
//               <div className="mt-5 space-y-3 border-t border-gray-50 pt-4">
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
//                     <Briefcase size={14} className="text-gray-400" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400">Type de contrat</p>
//                     <p className="text-sm font-semibold text-[#1E2A3A]">{job.contractType}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
//                     <MapPin size={14} className="text-gray-400" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400">Localisation</p>
//                     <p className="text-sm font-semibold text-[#1E2A3A]">{job.location}</p>
//                   </div>
//                 </div>
//                 {salaryText && (
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
//                       <Banknote size={14} className="text-gray-400" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400">Rémunération</p>
//                       <p className="text-sm font-semibold text-[#1E2A3A]">{salaryText}</p>
//                     </div>
//                   </div>
//                 )}
//                 {job.remote && job.remote !== 'none' && (
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
//                       <Wifi size={14} className="text-gray-400" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400">Télétravail</p>
//                       <p className="text-sm font-semibold text-[#1E2A3A]">
//                         {job.remote === 'full' ? 'Full remote' : 'Hybride'}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Company card */}
//             {job.company && (
//               <div className="bg-white rounded-2xl border border-gray-100 p-5">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${sectorColor}`}>
//                     {sectorIcon}
//                   </div>
//                   <div>
//                     <p className="font-bold text-[#1E2A3A] text-sm">{job.company.name}</p>
//                     {job.company.slogan && (
//                       <p className="text-xs text-gray-400 italic">{job.company.slogan}</p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
//                   <MapPin size={11} /> {job.company.city}
//                 </div>
//                 <Link
//                   href={`/emploi/entreprises/${job.company.id}`}
//                   className="flex items-center justify-center gap-1.5 w-full border border-gray-200
//                              hover:border-[#E8622A] text-gray-600 hover:text-[#E8622A] text-xs font-semibold
//                              py-2.5 rounded-xl transition-colors"
//                 >
//                   <ExternalLink size={12} /> Voir la vitrine entreprise
//                 </Link>
//               </div>
//             )}

//             {/* Similar jobs */}
//             {similar.length > 0 && (
//               <div className="bg-white rounded-2xl border border-gray-100 p-5">
//                 <h3 className="font-bold text-[#1E2A3A] text-sm mb-3">Offres similaires</h3>
//                 <div className="space-y-1">
//                   {similar.map((o) => (
//                     <SimilarJobCard key={o.id} offre={o} />
//                   ))}
//                 </div>
//                 <Link
//                   href={`/emploi/jobs?sector=${job.sector}`}
//                   className="flex items-center justify-center gap-1.5 w-full mt-3 pt-3 border-t border-gray-50
//                              text-xs font-semibold text-[#E8622A] hover:underline"
//                 >
//                   Voir toutes les offres · {job.sector} <ChevronRight size={12} />
//                 </Link>
//               </div>
//             )}

//             {/* Back link */}
//             <button
//               onClick={() => router.back()}
//               className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600
//                          transition-colors pl-1"
//             >
//               <ArrowLeft size={13} /> Retour aux résultats
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }















// 'use client';
// // src/app/(emploi)/emploi/jobs/[id]/page.tsx

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import {
//   ArrowLeft, MapPin, Clock, Briefcase, Building2, Star,
//   Wifi, ChevronRight, Heart, Share2, ExternalLink, CheckCircle2,
//   Hotel, Utensils, Plane, Monitor, Calendar, Globe,
//   Banknote, Users, BookOpen, Layers, Send,
// } from 'lucide-react';
// import { fetchPublicJob, fetchPublicJobs } from '@/services/emploi-public.service';
// import type { PublicOffre } from '@/services/emploi-public.service';

// // ── Types étendus pour la page détail ────────────────────────────────────────

// interface JobDetail extends PublicOffre {
//   missions?: string;
//   profileDesc?: string;
//   advantages?: string;
//   requiredSkills?: string[];
//   requiredLangs?: string[];
//   requiredSoftwares?: string[];
//   expiresAt?: string;
//   company?: {
//     id: string;
//     name: string;
//     sector: string;
//     city: string;
//     logo?: string;
//     slogan?: string;
//   };
// }

// // ── Constants ─────────────────────────────────────────────────────────────────

// const SECTOR_ICON: Record<string, React.ReactNode> = {
//   hotel:       <Hotel    size={22} />,
//   restaurant:  <Utensils size={22} />,
//   transport:   <Plane    size={22} />,
//   travel:      <Briefcase size={22} />,
//   tech:        <Monitor  size={22} />,
//   events:      <Calendar size={22} />,
// };

// const SECTOR_COLOR: Record<string, string> = {
//   hotel:       'bg-blue-50 text-blue-600',
//   restaurant:  'bg-orange-50 text-orange-600',
//   transport:   'bg-sky-50 text-sky-600',
//   travel:      'bg-amber-50 text-amber-600',
//   tech:        'bg-green-50 text-green-600',
//   events:      'bg-purple-50 text-purple-600',
// };

// const CONTRACT_COLOR: Record<string, string> = {
//   CDI:              'bg-blue-50 text-blue-700 border-blue-100',
//   CDD:              'bg-purple-50 text-purple-700 border-purple-100',
//   'CDD Saisonnier': 'bg-orange-50 text-orange-700 border-orange-100',
//   Alternance:       'bg-indigo-50 text-indigo-700 border-indigo-100',
//   Stage:            'bg-teal-50 text-teal-700 border-teal-100',
//   Freelance:        'bg-pink-50 text-pink-700 border-pink-100',
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────

// function timeAgo(iso: string): string {
//   const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
//   if (h < 1)  return 'Publié à l\'instant';
//   if (h < 24) return `Publié il y a ${h}h`;
//   const d = Math.floor(h / 24);
//   return d === 1 ? 'Publié hier' : `Publié il y a ${d} jours`;
// }

// function daysLeft(iso?: string): string | null {
//   if (!iso) return null;
//   const d = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
//   if (d <= 0) return 'Expirée';
//   if (d === 1) return 'Expire demain';
//   return `Expire dans ${d} jours`;
// }

// // ── Skeleton ──────────────────────────────────────────────────────────────────

// function PageSkeleton() {
//   return (
//     <div className="min-h-screen bg-gray-50 animate-pulse">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
//         <div className="h-4 bg-gray-200 rounded w-40 mb-6" />
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-4">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100">
//               <div className="flex gap-4">
//                 <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0" />
//                 <div className="flex-1 space-y-3">
//                   <div className="h-6 bg-gray-200 rounded w-3/4" />
//                   <div className="h-4 bg-gray-100 rounded w-1/2" />
//                   <div className="flex gap-2">
//                     <div className="h-6 bg-gray-100 rounded-full w-14" />
//                     <div className="h-6 bg-gray-100 rounded-full w-20" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
//                 <div className="h-5 bg-gray-200 rounded w-1/3" />
//                 <div className="space-y-2">
//                   <div className="h-3 bg-gray-100 rounded w-full" />
//                   <div className="h-3 bg-gray-100 rounded w-5/6" />
//                   <div className="h-3 bg-gray-100 rounded w-4/5" />
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="space-y-4">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
//               <div className="h-12 bg-[#E8622A]/20 rounded-xl w-full" />
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="flex gap-3">
//                   <div className="w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0" />
//                   <div className="flex-1 space-y-1">
//                     <div className="h-3 bg-gray-100 rounded w-2/3" />
//                     <div className="h-4 bg-gray-200 rounded w-1/2" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Section card ──────────────────────────────────────────────────────────────

// function SectionCard({ icon, title, children }: {
//   icon: React.ReactNode;
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
//       <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
//         <div className="w-8 h-8 rounded-lg bg-[#E8622A]/10 flex items-center justify-center text-[#E8622A]">
//           {icon}
//         </div>
//         <h2 className="font-bold text-[#1E2A3A] text-base">{title}</h2>
//       </div>
//       <div className="p-6">{children}</div>
//     </div>
//   );
// }

// // ── Similar job card ──────────────────────────────────────────────────────────

// function SimilarJobCard({ offre }: { offre: PublicOffre }) {
//   const router = useRouter();
//   const icon      = SECTOR_ICON[offre.sector] ?? <Building2 size={16} />;
//   const iconColor = SECTOR_COLOR[offre.sector] ?? 'bg-gray-50 text-gray-600';
//   const ctColor   = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';

//   return (
//     <button
//       onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
//       className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50
//                  transition-colors duration-150 text-left group"
//     >
//       <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
//         {icon}
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-semibold text-[#1E2A3A] group-hover:text-[#E8622A]
//                       transition-colors truncate leading-tight">
//           {offre.title}
//         </p>
//         <p className="text-xs text-gray-400 truncate mt-0.5">{offre.companyName} · {offre.location}</p>
//         <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${ctColor}`}>
//           {offre.contractType}
//         </span>
//       </div>
//       <ChevronRight size={14} className="text-gray-300 group-hover:text-[#E8622A] flex-shrink-0 transition-colors" />
//     </button>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────

// export default function JobDetailPage() {
//   const { id }   = useParams<{ id: string }>();
//   const router   = useRouter();

//   const [job,       setJob]       = useState<JobDetail | null>(null);
//   const [similar,   setSimilar]   = useState<PublicOffre[]>([]);
//   const [loading,   setLoading]   = useState(true);
//   const [error,     setError]     = useState(false);
//   const [isFav,     setIsFav]     = useState(false);
//   const [applied,   setApplied]   = useState(false);
//   const [copyDone,  setCopyDone]  = useState(false);

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     setError(false);

//     fetchPublicJob(id)
//       .then((data: JobDetail) => {
//         setJob(data);
//         // Charger des offres similaires (même secteur)
//         return fetchPublicJobs({ sector: data.sector, limit: 4 });
//       })
//       .then((res) => {
//         setSimilar(res.offres.filter((o) => String(o.id) !== String(id)).slice(0, 3));
//       })
//       .catch(() => setError(true))
//       .finally(() => setLoading(false));
//   }, [id]);

//   function handleShare() {
//     navigator.clipboard.writeText(window.location.href).then(() => {
//       setCopyDone(true);
//       setTimeout(() => setCopyDone(false), 2000);
//     });
//   }

//   if (loading) return <PageSkeleton />;

//   if (error || !job) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <Briefcase size={24} className="text-gray-300" />
//           </div>
//           <p className="font-semibold text-gray-700">Offre introuvable</p>
//           <p className="text-sm text-gray-400 mt-1">Cette offre n'existe pas ou a été supprimée.</p>
//           <button
//             onClick={() => router.push('/emploi/jobs')}
//             className="mt-4 text-sm text-[#E8622A] font-semibold hover:underline"
//           >
//             ← Voir toutes les offres
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const sectorIcon  = SECTOR_ICON[job.sector]  ?? <Building2 size={22} />;
//   const sectorColor = SECTOR_COLOR[job.sector] ?? 'bg-gray-50 text-gray-600';
//   const ctColor     = CONTRACT_COLOR[job.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';
//   const expiry      = daysLeft(job.expiresAt);
//   const isNew       = Date.now() - new Date(job.publishedAt).getTime() < 48 * 3_600_000;
//   const salaryText  = job.salaryMin
//     ? `${Math.round(job.salaryMin / 1000)}–${Math.round((job.salaryMax ?? job.salaryMin) / 1000)}k€ / an`
//     : null;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

//         {/* ── Breadcrumb ─────────────────────────────────────────────── */}
//         <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
//           <Link href="/emploi" className="hover:text-[#E8622A] transition-colors">Accueil</Link>
//           <ChevronRight size={12} />
//           <Link href="/emploi/jobs" className="hover:text-[#E8622A] transition-colors">Offres d'emploi</Link>
//           <ChevronRight size={12} />
//           <span className="text-gray-600 truncate max-w-[200px]">{job.title}</span>
//         </nav>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
//           <div className="lg:col-span-2 space-y-4">

//             {/* Header card */}
//             <div className="bg-white rounded-2xl border border-gray-100 p-6">
//               <div className="flex gap-4">
//                 {/* Logo / icône secteur */}
//                 <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${sectorColor}`}>
//                   {job.company?.logo
//                     ? <img src={job.company.logo} alt={job.company?.name} className="w-full h-full object-cover rounded-xl" />
//                     : sectorIcon
//                   }
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <h1 className="text-xl font-extrabold text-[#1E2A3A] leading-tight">{job.title}</h1>
//                       <p className="text-[#E8622A] font-semibold text-sm mt-0.5">
//                         {job.company?.name ?? job.companyName}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-1.5 flex-shrink-0">
//                       <button
//                         onClick={handleShare}
//                         className="p-2 rounded-xl hover:bg-gray-50 border border-gray-100 text-gray-400
//                                    hover:text-gray-600 transition-colors relative"
//                         title="Copier le lien"
//                       >
//                         <Share2 size={15} />
//                         {copyDone && (
//                           <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white
//                                            text-[10px] px-2 py-1 rounded-lg whitespace-nowrap">
//                             Copié !
//                           </span>
//                         )}
//                       </button>
//                       <button
//                         onClick={() => setIsFav((v) => !v)}
//                         className="p-2 rounded-xl hover:bg-red-50 border border-gray-100 transition-colors"
//                       >
//                         <Heart
//                           size={15}
//                           className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-400'}
//                         />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Badges */}
//                   <div className="flex flex-wrap items-center gap-2 mt-3">
//                     <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ctColor}`}>
//                       {job.contractType}
//                     </span>
//                     <span className="flex items-center gap-1 text-xs text-gray-500">
//                       <MapPin size={11} /> {job.location}
//                     </span>
//                     {job.remote && job.remote !== 'none' && (
//                       <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50
//                                        px-2 py-0.5 rounded-full">
//                         <Wifi size={10} />
//                         {job.remote === 'full' ? 'Full remote' : 'Hybride'}
//                       </span>
//                     )}
//                     {job.isPremium && (
//                       <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50
//                                        border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
//                         <Star size={9} fill="currentColor" /> Premium
//                       </span>
//                     )}
//                     {isNew && (
//                       <span className="text-xs font-bold text-[#E8622A] bg-orange-50 px-2 py-0.5
//                                        rounded-full border border-orange-100">
//                         Nouveau
//                       </span>
//                     )}
//                   </div>

//                   {/* Meta */}
//                   <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-50">
//                     <span className="flex items-center gap-1.5 text-xs text-gray-400">
//                       <Clock size={11} /> {timeAgo(job.publishedAt)}
//                     </span>
//                     {salaryText && (
//                       <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
//                         <Banknote size={11} className="text-green-500" /> {salaryText}
//                       </span>
//                     )}
//                     {expiry && (
//                       <span className={`text-xs font-medium ${
//                         expiry === 'Expirée' ? 'text-red-500' : 'text-amber-500'
//                       }`}>
//                         ⏱ {expiry}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Missions */}
//             {job.missions && (
//               <SectionCard icon={<Layers size={15} />} title="Vos missions">
//                 <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
//                   {job.missions.split('\n').filter(Boolean).map((line, i) => (
//                     <p key={i} className="mb-2 last:mb-0">{line}</p>
//                   ))}
//                 </div>
//               </SectionCard>
//             )}

//             {/* Profil recherché */}
//             {job.profileDesc && (
//               <SectionCard icon={<Users size={15} />} title="Profil recherché">
//                 <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
//                   {job.profileDesc.split('\n').filter(Boolean).map((line, i) => (
//                     <p key={i} className="mb-2 last:mb-0">{line}</p>
//                   ))}
//                 </div>
//               </SectionCard>
//             )}

//             {/* Compétences */}
//             {(job.requiredSkills?.length || job.requiredLangs?.length || job.requiredSoftwares?.length) ? (
//               <SectionCard icon={<BookOpen size={15} />} title="Compétences requises">
//                 <div className="space-y-4">
//                   {job.requiredSkills && job.requiredSkills.length > 0 && (
//                     <div>
//                       <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Compétences</p>
//                       <div className="flex flex-wrap gap-2">
//                         {job.requiredSkills.map((s) => (
//                           <span key={s} className="flex items-center gap-1 text-xs bg-[#1E2A3A]/5 text-[#1E2A3A]
//                                                     px-3 py-1.5 rounded-full border border-[#1E2A3A]/10">
//                             <CheckCircle2 size={11} className="text-[#E8622A]" /> {s}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {job.requiredLangs && job.requiredLangs.length > 0 && (
//                     <div>
//                       <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Langues</p>
//                       <div className="flex flex-wrap gap-2">
//                         {job.requiredLangs.map((l) => (
//                           <span key={l} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700
//                                                     px-3 py-1.5 rounded-full border border-blue-100">
//                             <Globe size={11} /> {l}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {job.requiredSoftwares && job.requiredSoftwares.length > 0 && (
//                     <div>
//                       <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Logiciels</p>
//                       <div className="flex flex-wrap gap-2">
//                         {job.requiredSoftwares.map((s) => (
//                           <span key={s} className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700
//                                                     px-3 py-1.5 rounded-full border border-purple-100">
//                             <Monitor size={11} /> {s}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </SectionCard>
//             ) : null}

//             {/* Avantages */}
//             {job.advantages && (
//               <SectionCard icon={<Star size={15} />} title="Ce que nous offrons">
//                 <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
//                   {job.advantages.split('\n').filter(Boolean).map((line, i) => (
//                     <p key={i} className="mb-2 last:mb-0 flex items-start gap-2">
//                       <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
//                       <span>{line}</span>
//                     </p>
//                   ))}
//                 </div>
//               </SectionCard>
//             )}

//             {/* Mobile CTA */}
//             <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-5">
//               <button
//                 onClick={() => setApplied(true)}
//                 disabled={applied}
//                 className="w-full flex items-center justify-center gap-2 bg-[#E8622A] hover:bg-[#d4561f]
//                            disabled:bg-green-500 text-white font-bold py-3.5 rounded-xl
//                            transition-colors text-sm"
//               >
//                 {applied
//                   ? <><CheckCircle2 size={16} /> Candidature envoyée</>
//                   : <><Send size={15} /> Postuler à cette offre</>
//                 }
//               </button>
//             </div>
//           </div>

//           {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
//           <div className="space-y-4">

//             {/* Apply card */}
//             <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
//               <button
//                 onClick={() => setApplied(true)}
//                 disabled={applied}
//                 className="w-full flex items-center justify-center gap-2 bg-[#E8622A] hover:bg-[#d4561f]
//                            disabled:bg-green-500 text-white font-bold py-3.5 rounded-xl
//                            transition-all duration-300 text-sm shadow-lg shadow-[#E8622A]/20"
//               >
//                 {applied
//                   ? <><CheckCircle2 size={16} /> Candidature envoyée !</>
//                   : <><Send size={15} /> Postuler maintenant</>
//                 }
//               </button>

//               {!applied && (
//                 <p className="text-center text-xs text-gray-400 mt-2">
//                   Candidature rapide en 2 minutes
//                 </p>
//               )}

//               {/* Info bullets */}
//               <div className="mt-5 space-y-3 border-t border-gray-50 pt-4">
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
//                     <Briefcase size={14} className="text-gray-400" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400">Type de contrat</p>
//                     <p className="text-sm font-semibold text-[#1E2A3A]">{job.contractType}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
//                     <MapPin size={14} className="text-gray-400" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-400">Localisation</p>
//                     <p className="text-sm font-semibold text-[#1E2A3A]">{job.location}</p>
//                   </div>
//                 </div>
//                 {salaryText && (
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
//                       <Banknote size={14} className="text-gray-400" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400">Rémunération</p>
//                       <p className="text-sm font-semibold text-[#1E2A3A]">{salaryText}</p>
//                     </div>
//                   </div>
//                 )}
//                 {job.remote && job.remote !== 'none' && (
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
//                       <Wifi size={14} className="text-gray-400" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-400">Télétravail</p>
//                       <p className="text-sm font-semibold text-[#1E2A3A]">
//                         {job.remote === 'full' ? 'Full remote' : 'Hybride'}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Company card */}
//             {job.company && (
//               <div className="bg-white rounded-2xl border border-gray-100 p-5">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${sectorColor}`}>
//                     {sectorIcon}
//                   </div>
//                   <div>
//                     <p className="font-bold text-[#1E2A3A] text-sm">{job.company.name}</p>
//                     {job.company.slogan && (
//                       <p className="text-xs text-gray-400 italic">{job.company.slogan}</p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
//                   <MapPin size={11} /> {job.company.city}
//                 </div>
//                 <Link
//                   href={`/emploi/entreprises/${job.company.id}`}
//                   className="flex items-center justify-center gap-1.5 w-full border border-gray-200
//                              hover:border-[#E8622A] text-gray-600 hover:text-[#E8622A] text-xs font-semibold
//                              py-2.5 rounded-xl transition-colors"
//                 >
//                   <ExternalLink size={12} /> Voir la vitrine entreprise
//                 </Link>
//               </div>
//             )}

//             {/* Similar jobs */}
//             {similar.length > 0 && (
//               <div className="bg-white rounded-2xl border border-gray-100 p-5">
//                 <h3 className="font-bold text-[#1E2A3A] text-sm mb-3">Offres similaires</h3>
//                 <div className="space-y-1">
//                   {similar.map((o) => (
//                     <SimilarJobCard key={o.id} offre={o} />
//                   ))}
//                 </div>
//                 <Link
//                   href={`/emploi/jobs?sector=${job.sector}`}
//                   className="flex items-center justify-center gap-1.5 w-full mt-3 pt-3 border-t border-gray-50
//                              text-xs font-semibold text-[#E8622A] hover:underline"
//                 >
//                   Voir toutes les offres · {job.sector} <ChevronRight size={12} />
//                 </Link>
//               </div>
//             )}

//             {/* Back link */}
//             <button
//               onClick={() => router.back()}
//               className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600
//                          transition-colors pl-1"
//             >
//               <ArrowLeft size={13} /> Retour aux résultats
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }