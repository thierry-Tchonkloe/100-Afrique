'use client';
// src/app/(emploi)/emploi/entreprises/[id]/page.tsx

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Heart, Globe, MapPin, Users, TrendingUp, Building2,
  ChevronLeft, ChevronRight, Linkedin, Instagram, Twitter,
  Award, Leaf, Shield, Hotel, Utensils, Plane, Briefcase,
  Monitor, Calendar, Clock, FileText, ArrowRight, Search,
  X, Eye, Send, LayoutGrid, List, ChevronDown,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Kpi       { icon: string; value: string; label: string }
interface Value     { id: string; title: string; description: string; icon: string; color: string }
interface Photo     { id: string; url: string; alt?: string }
interface Video     { id: string; url: string; thumbnailUrl?: string; title?: string }
interface Perk      { label: string; emoji: string; description: string }
interface TeamMoment{ id: string; title: string; description: string; url: string }
interface Offre {
  id: string; title: string; contractType: string; location: string;
  publishedAt: string; sector: string; salaryMin?: number; salaryMax?: number;
  salaryNote?: string; description?: string; tags?: string[]; remote?: string;
}

interface VitrinePublic {
  id: string; etablissementId: string; name: string; sector: string; city: string;
  logoUrl?: string; bannerUrl?: string; slogan: string; aboutUs: string;
  kpis: Kpi[]; values: Value[]; perks: Perk[]; photos: Photo[]; videos: Video[];
  socials: { linkedin?: string; instagram?: string; twitter?: string; website?: string };
  location: string; offres: Offre[]; completionScore: number; views: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA (rich, matching the screenshots)
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_VITRINE: VitrinePublic = {
  id: 'vit-001', etablissementId: '1',
  name: 'Hôtel Majestic Paris', sector: 'Hôtellerie de luxe', city: 'Paris 8ème',
  logoUrl: undefined,
  bannerUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=80',
  slogan: 'Rejoignez une équipe passionnée au service de l\'excellence hôtelière',
  aboutUs: `<p>Grand Palace Hotels est une chaîne hôtelière de prestige qui redéfinit l'art de l'hospitalité depuis plus de 30 ans. Présents dans les plus belles destinations européennes, nous créons des expériences mémorables pour nos clients comme pour nos collaborateurs.</p><br/><p>Notre groupe emploie plus de 2 000 professionnels passionnés à travers la France, l'Espagne et l'Italie. Nous croyons fermement que l'excellence du service naît d'équipes épanouies et valorisées.</p>`,
  kpis: [
    { icon: 'users',    value: '150',  label: 'collaborateurs'  },
    { icon: 'gender',   value: '52%',  label: 'de femmes'       },
    { icon: 'calendar', value: '29',   label: 'ans d\'âge moyen'},
    { icon: 'building', value: '4',    label: 'bureaux'         },
    { icon: 'trend',    value: '+20%', label: 'croissance/an'   },
  ],
  values: [
    { id:'v1', icon:'💡', color:'bg-amber-50 text-amber-600',  title:'Innovation',    description:'Nous repoussons constamment les limites de l\'excellence hôtelière en adoptant les dernières technologies.' },
    { id:'v2', icon:'🤝', color:'bg-blue-50 text-blue-600',   title:'Bienveillance', description:'Le respect et l\'écoute sont au cœur de toutes nos interactions, avec nos équipes et nos clients.'         },
    { id:'v3', icon:'🌿', color:'bg-green-50 text-green-600', title:'Durabilité',    description:'Nous nous engageons pour un tourisme responsable avec des pratiques éco-responsables certifiées.'          },
    { id:'v4', icon:'⭐', color:'bg-purple-50 text-purple-600',title:'Excellence',   description:'La qualité de service est notre signature. Chaque détail compte pour offrir une expérience unique.'        },
  ],
  perks: [
    { label:'Tickets Restaurant', emoji:'🍽️', description:'Tickets restaurant d\'une valeur de 12€ par jour travaillé, pris en charge à 60% par l\'entreprise.' },
    { label:'Télétravail',        emoji:'💻', description:'Jusqu\'à 2 jours de télétravail par semaine pour tous les postes éligibles.'                          },
    { label:'Logement',           emoji:'🏠', description:'Aide au logement et chambres d\'hôtel disponibles pour les équipes en déplacement.'                    },
    { label:'Sport & Bien-être',  emoji:'🏋️', description:'Abonnement salle de sport pris en charge + accès au spa de l\'hôtel pour tous les employés.'          },
    { label:'Formation',          emoji:'🎓', description:'Programme de formation continue et budget annuel de 2000€ par collaborateur.'                          },
    { label:'Voyages',            emoji:'✈️', description:'Tarifs préférentiels dans tous nos établissements et hôtels partenaires dans le monde.'                },
  ],
  photos: [
    { id:'p1', url:'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', alt:'Hall de l\'hôtel'      },
    { id:'p2', url:'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', alt:'Salon principal'       },
    { id:'p3', url:'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',    alt:'Chambre Deluxe'        },
    { id:'p4', url:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', alt:'Restaurant gastronomique'},
    { id:'p5', url:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', alt:'Équipe en action'      },
    { id:'p6', url:'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&q=80', alt:'Spa & Bien-être'       },
    { id:'p7', url:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', alt:'Séminaire équipe'      },
    { id:'p8', url:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', alt:'Piscine'               },
  ],
  videos: [],
  socials: { linkedin:'#', instagram:'#', twitter:'#', website:'https://majestic-paris.com' },
  location: 'Paris 8ème',
  offres: [
    { id:'1', title:'Revenue Manager', contractType:'CDI', location:'Paris 8ème', publishedAt: new Date(Date.now()-2*86400000).toISOString(), sector:'tech',       salaryMin:45000, salaryMax:55000, salaryNote:'+variables',  description:'Rejoignez notre équipe Revenue Management pour optimiser la performance de nos hôtels parisiens. Vous piloterez la stratégie tarifaire et développerez les revenus de notre portefeuille premium.', tags:['Télétravail hybride','Mutuelle 100%','Primes objectifs'] },
    { id:'2', title:'Chef de Réception', contractType:'CDI', location:'Lyon Centre', publishedAt: new Date(Date.now()-5*86400000).toISOString(), sector:'hotel',    salaryMin:38000, salaryMax:42000, salaryNote:'+primes',     description:'Encadrez une équipe de 8 réceptionnistes dans notre hôtel 4 étoiles. Garantissez l\'excellence de l\'accueil et développez la satisfaction client.',                                           tags:['Logement possible','Formation continue','Évolution interne'] },
    { id:'3', title:'Développeur Full-Stack', contractType:'CDI', location:'Remote / Paris', publishedAt: new Date(Date.now()-7*86400000).toISOString(), sector:'tech', salaryMin:55000, salaryMax:70000, salaryNote:'selon exp.', description:'Rejoignez notre équipe tech pour développer nos solutions digitales innovantes. Stack moderne : React, Node.js, MongoDB. Environnement startup au sein du groupe.',                    tags:['100% télétravail','Stock options','Budget formation 2k€'] },
    { id:'4', title:'Alternance Marketing Digital', contractType:'Alternance', location:'Paris La Défense', publishedAt: new Date(Date.now()-3*86400000).toISOString(), sector:'tech', salaryMin:1200, salaryMax:1200, salaryNote:'+formation', description:'Intégrez notre équipe marketing pour développer nos campagnes digitales. Formation Master en Marketing Digital en parallèle. Encadrement par des experts.',                                  tags:['Formation payée','Télétravail 3j/sem','Mentoring'] },
    { id:'5', title:'Spa Manager',         contractType:'CDI',        location:'Cannes',        publishedAt: new Date(Date.now()-10*86400000).toISOString(), sector:'hotel', salaryMin:32000, salaryMax:38000, salaryNote:'',         description:'Gérez et développez notre espace spa haut de gamme. Recrutez et formez les équipes, développez les revenus et assurez la qualité des soins.',                                                tags:['Logement fourni','Soins offerts'] },
    { id:'6', title:'Chef de Partie Pâtisserie', contractType:'CDD', location:'Paris 8ème',  publishedAt: new Date(Date.now()-1*86400000).toISOString(),  sector:'restaurant', salaryMin:28000, salaryMax:32000, salaryNote:'',    description:'Intégrez notre brigade pâtisserie dans un palace parisien. Vous contribuerez à la création de notre carte desserts et des mignardises.',                                                         tags:['Repas fournis','Primes','Logement possible'] },
  ],
  completionScore: 92, views: 1247,
};

const TEAM_MOMENTS: TeamMoment[] = [
  { id:'m1', title:'Événements d\'Équipe',  description:'Soirées mensuelles, séminaires annuels et célébrations des succès de l\'équipe dans des cadres exceptionnels.', url:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80' },
  { id:'m2', title:'Activités Saisonnières',description:'Pique-niques d\'été, marchés de Noël et activités sportives organisées tout au long de l\'année.',               url:'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80' },
];

const SIDEBAR_INFOS = [
  { icon:'📍', label:'Siège Social - Paris 8ème' },
  { icon:'🏨', label:'12 hôtels en France'       },
  { icon:'🌍', label:'3 pays européens'           },
  { icon:'📞', label:'+33 1 42 86 54 32'          },
  { icon:'✉️', label:'contact@majestic-paris.com' },
];

const CERTIFICATIONS = [
  { label:'Great Place to Work 2024', icon:<Award  size={14} className="text-amber-500" /> },
  { label:'Green Key Eco-Label',      icon:<Leaf   size={14} className="text-green-500" /> },
  { label:'Label Diversité',          icon:<Shield size={14} className="text-purple-500" /> },
];

const CONTRACT_FILTERS = ['Tous', 'CDI', 'CDD', 'Alternance', 'Télétravail possible'];

const KPI_ICONS: Record<string, React.ReactNode> = {
  users:    <Users      size={24} className="text-[#E8622A]" />,
  gender:   <span className="text-[22px] leading-none">⚧</span>,
  calendar: <Calendar  size={24} className="text-[#E8622A]" />,
  building: <MapPin    size={24} className="text-[#E8622A]" />,
  trend:    <TrendingUp size={24} className="text-[#E8622A]" />,
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return 'À l\'instant';
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Il y a 1 jour' : `Il y a ${d} jours`;
}

function fmtSalary(o: Offre): string {
  if (!o.salaryMin) return '';
  if (o.contractType === 'Alternance') return `${(o.salaryMin/1000).toFixed(1)}k€/mois`;
  const min = Math.round(o.salaryMin / 1000);
  const max = Math.round((o.salaryMax ?? o.salaryMin) / 1000);
  return min === max ? `${min}k€` : `${min}-${max}k€`;
}

const CONTRACT_COLOR: Record<string, string> = {
  CDI:       'bg-blue-50 text-blue-700',
  CDD:       'bg-purple-50 text-purple-700',
  Stage:     'bg-teal-50 text-teal-700',
  Alternance:'bg-orange-50 text-orange-700',
};

// ─────────────────────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────────────────────

async function fetchVitrinePublic(id: string): Promise<VitrinePublic> {
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
  try {
    const [vRes, oRes] = await Promise.all([
      fetch(`${BASE}/emploi/vitrines/${id}`),
      fetch(`${BASE}/emploi/jobs?limit=20`),
    ]);
    if (!vRes.ok) throw new Error('not found');
    const vData = await vRes.json();
    const oData = await oRes.json();
    const offres: Offre[] = oData.data?.offres ?? [];
    return {
      ...MOCK_VITRINE,
      ...(vData.data ?? {}),
      offres: offres.length ? offres : MOCK_VITRINE.offres,
    };
  } catch {
    return MOCK_VITRINE;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTBOX
// ─────────────────────────────────────────────────────────────────────────────

function Lightbox({ photos, initial, onClose }: { photos: Photo[]; initial: number; onClose: () => void }) {
  const [idx, setIdx] = useState(initial);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowRight')  setIdx((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft')   setIdx((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose, photos.length]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"><X size={24} /></button>
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

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR — shared by all tabs
// ─────────────────────────────────────────────────────────────────────────────

function Sidebar({ vitrine }: { vitrine: VitrinePublic }) {
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm mb-3">Majestic Paris en chiffres</h3>
        {[
          { label:'Collaborateurs', value:'150'         },
          { label:'Parité H/F',     value:'52% / 48%',  },
          { label:'Âge moyen',      value:'29 ans'      },
          { label:'Implantations',  value:'4 bureaux'   },
          { label:'Croissance',     value:'+20% / an', highlight: true },
        ].map((r) => (
          <div key={r.label} className="flex items-center justify-between text-xs py-2 border-b border-gray-50 last:border-0">
            <span className="text-gray-500">{r.label}</span>
            <span className={`font-bold ${r.highlight ? 'text-green-600' : 'text-gray-800'}`}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Socials */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm mb-3">Suivez-nous</h3>
        <div className="flex gap-2">
          {vitrine.socials.linkedin && (
            <a href={vitrine.socials.linkedin} target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition">
              <Linkedin size={16} />
            </a>
          )}
          {vitrine.socials.instagram && (
            <a href={vitrine.socials.instagram} target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition"
               style={{ background: 'linear-gradient(135deg,#e1306c,#833ab4)' }}>
              <Instagram size={16} />
            </a>
          )}
          {vitrine.socials.twitter && (
            <a href={vitrine.socials.twitter} target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 bg-sky-400 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition">
              <Twitter size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm mb-3">Nos Bureaux</h3>
        <div className="w-full h-36 rounded-xl overflow-hidden mb-3">
          <img
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80"
            alt="Paris"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1.5">
          {SIDEBAR_INFOS.map((info) => (
            <p key={info.label} className="flex items-center gap-2 text-xs text-gray-600 leading-tight">
              <span className="flex-shrink-0">{info.icon}</span>
              <span>{info.label}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm mb-3">Nos Certifications</h3>
        <div className="space-y-2.5">
          {CERTIFICATIONS.map((c) => (
            <div key={c.label} className="flex items-center gap-2.5 text-xs text-gray-600">
              <span className="flex-shrink-0">{c.icon}</span> {c.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: PRÉSENTATION
// ─────────────────────────────────────────────────────────────────────────────

function PresentationTab({ vitrine }: { vitrine: VitrinePublic }) {
  return (
    <div className="space-y-6">
      {/* Who are we */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-4">Qui sommes-nous ?</h2>
        <div
          className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: vitrine.aboutUs || '<p>Présentation bientôt disponible.</p>' }}
        />
      </div>

      {/* Values */}
      {vitrine.values.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-5">Nos Valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vitrine.values.map((v) => (
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

      {/* Testimonials */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-5">Ils témoignent</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name:'Sophie Martin', role:'Directrice Réception', avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', quote:'"Une entreprise où l\'humain est vraiment au centre. L\'évolution est encouragée à chaque étape."' },
            { name:'Thomas Dubois', role:'Chef de Cuisine',      avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', quote:'"La créativité est valorisée ici. J\'ai pu développer mes propres concepts avec le soutien total de la direction."' },
          ].map((t, i) => (
            <div key={i} className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-3 mb-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic leading-relaxed">{t.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: VIE AU TRAVAIL
// ─────────────────────────────────────────────────────────────────────────────

function VieTab({ vitrine }: { vitrine: VitrinePublic }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const firstRow = vitrine.photos.slice(0, 2);
  const grid     = vitrine.photos.slice(2);

  return (
    <div className="space-y-6">

      {/* Gallery — "Nos Espaces de Travail" */}
      {vitrine.photos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-4">Nos Espaces de Travail</h2>

          {/* Top row: 2 large */}
          {firstRow.length > 0 && (
            <div className={`grid gap-2 mb-2 ${firstRow.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {firstRow.map((p, i) => (
                <div key={p.id} onClick={() => setLightbox(i)}
                     className="relative aspect-[16/9] rounded-xl overflow-hidden cursor-pointer group">
                  <img src={p.url} alt={p.alt ?? ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                </div>
              ))}
            </div>
          )}

          {/* Lower grid: small */}
          {grid.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {grid.map((p, i) => (
                <div key={p.id} onClick={() => setLightbox(i + firstRow.length)}
                     className="aspect-square rounded-xl overflow-hidden cursor-pointer group">
                  <img src={p.url} alt={p.alt ?? ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Perks — card grid */}
      {vitrine.perks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-5">Nos Avantages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {vitrine.perks.map((perk) => (
              <div key={perk.label} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#E8622A]/20 transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{perk.emoji}</span>
                  <h3 className="font-bold text-gray-800 text-sm">{perk.label}</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team moments */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-[#1E2A3A] mb-5">Moments de Convivialité</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEAM_MOMENTS.map((m) => (
            <div key={m.id} className="rounded-2xl overflow-hidden border border-gray-100">
              <img src={m.url} alt={m.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-[#E8622A] text-sm mb-1">{m.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox photos={vitrine.photos} initial={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: OFFRES
// ─────────────────────────────────────────────────────────────────────────────

function OffresTab({ vitrine }: { vitrine: VitrinePublic }) {
  const [search,      setSearch]      = useState('');
  const [activeFilter,setActiveFilter]= useState('Tous');
  const [sort,        setSort]        = useState('Plus récentes');
  const [viewMode,    setViewMode]    = useState<'list' | 'grid'>('list');
  const [page,        setPage]        = useState(1);
  const PER_PAGE = 4;

  const filtered = vitrine.offres.filter((o) => {
    const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === 'Tous' ||
      activeFilter === o.contractType ||
      (activeFilter === 'Télétravail possible' && (o.remote === 'partial' || o.remote === 'full' || o.tags?.some((t) => t.toLowerCase().includes('télétravail'))));
    return matchSearch && matchFilter;
  });

  const counts: Record<string, number> = { Tous: vitrine.offres.length };
  for (const o of vitrine.offres) counts[o.contractType] = (counts[o.contractType] ?? 0) + 1;
  const teleCount = vitrine.offres.filter((o) => o.tags?.some((t) => t.toLowerCase().includes('télétravail'))).length;

  const shown = filtered.slice(0, page * PER_PAGE);

  return (
    <div className="space-y-4">
      {/* Search + filter bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher un métier chez Accor..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#E8622A] text-white font-semibold
                             text-sm px-5 py-2.5 rounded-xl hover:bg-[#d4561f] transition">
            Rechercher
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {CONTRACT_FILTERS.map((f) => {
            const count = f === 'Tous' ? vitrine.offres.length
                        : f === 'Télétravail possible' ? teleCount
                        : (counts[f] ?? 0);
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

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">
          <span className="text-[#1E2A3A]">{filtered.length}</span> offres d'emploi
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none border border-gray-200 bg-white rounded-xl pl-3 pr-8 py-2
                         text-xs text-gray-600 focus:outline-none focus:border-[#E8622A] transition"
            >
              {['Plus récentes', 'Salaire croissant', 'Pertinence'].map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode==='list' ? 'bg-[#E8622A] text-white' : 'bg-white text-gray-400 hover:bg-gray-50'} transition`}>
              <List size={14} />
            </button>
            <button onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode==='grid' ? 'bg-[#E8622A] text-white' : 'bg-white text-gray-400 hover:bg-gray-50'} transition`}>
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Offres list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center bg-white rounded-2xl border border-gray-100">
          <Search size={24} className="text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-500">Aucune offre trouvée</p>
          <button onClick={() => { setSearch(''); setActiveFilter('Tous'); }}
                  className="mt-3 text-xs text-[#E8622A] font-semibold hover:underline">
            Réinitialiser
          </button>
        </div>
      ) : (
        <div className={`space-y-3`}>
          {shown.map((offre) => (
            <div key={offre.id}
                 className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200
                            hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-5">
                {/* Header row */}
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
                    <div className="text-right flex-shrink-0">
                      <p className="font-extrabold text-[#1E2A3A] text-base">{fmtSalary(offre)}</p>
                      {offre.salaryNote && <p className="text-xs text-gray-400">{offre.salaryNote}</p>}
                    </div>
                  )}
                </div>

                {/* Description */}
                {offre.description && (
                  <p className="text-xs text-gray-500 mt-2.5 leading-relaxed line-clamp-2">{offre.description}</p>
                )}

                {/* Tags */}
                {offre.tags && offre.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {offre.tags.map((t) => (
                      <span key={t} className="text-[10px] font-medium bg-orange-50 text-[#E8622A]
                                               border border-orange-100 px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
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
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-white
                                       bg-[#E8622A] hover:bg-[#d4561f] px-3 py-1.5 rounded-xl transition">
                      <Send size={12} /> Postuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load more */}
      {shown.length < filtered.length && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="border border-gray-200 bg-white text-gray-600 font-semibold text-sm
                       px-8 py-3 rounded-xl hover:bg-gray-50 transition"
          >
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

export default function VitrineEntreprisePage({ params }: { params: { id: string } }) {
  const [vitrine,  setVitrine]  = useState<VitrinePublic>(MOCK_VITRINE);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState<'presentation'|'vie'|'offres'>('vie');
  const [followed, setFollowed] = useState(false);
  const [bannerIdx,setBannerIdx]= useState(0);

  useEffect(() => {
    fetchVitrinePublic(params.id).then((v) => { setVitrine(v); setLoading(false); });
  }, [params.id]);

  // Banner auto-slide
  const bannerPhotos = vitrine.photos.slice(0, 5);
  useEffect(() => {
    if (bannerPhotos.length < 2) return;
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % bannerPhotos.length), 5000);
    return () => clearInterval(t);
  }, [bannerPhotos.length]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <div className="relative h-64 md:h-72 overflow-hidden bg-[#1E2A3A]">
        {/* Slides */}
        {bannerPhotos.map((p, i) => (
          <div key={p.id}
               className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
               style={{ backgroundImage:`url(${p.url})`, opacity: i === bannerIdx ? 1 : 0 }} />
        ))}
        {!bannerPhotos.length && vitrine.bannerUrl && (
          <div className="absolute inset-0 bg-cover bg-center"
               style={{ backgroundImage:`url(${vitrine.bannerUrl})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        {/* Slide dots */}
        {bannerPhotos.length > 1 && (
          <div className="absolute bottom-16 right-5 flex gap-1.5">
            {bannerPhotos.map((_, i) => (
              <button key={i} onClick={() => setBannerIdx(i)}
                      className={`w-1.5 h-1.5 rounded-full transition ${i === bannerIdx ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        )}

        {/* Identity overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 flex items-end gap-4">
          {/* Logo */}
          <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center
                          flex-shrink-0 border-2 border-white overflow-hidden">
            {vitrine.logoUrl
              ? <img src={vitrine.logoUrl} alt={vitrine.name} className="w-full h-full object-contain p-1" />
              : <Hotel size={22} className="text-[#E8622A]" />}
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-xl font-extrabold text-white leading-tight">{vitrine.name}</h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                {vitrine.sector}
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
              {vitrine.socials.website && (
                <a href={vitrine.socials.website} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition">
                  <Globe size={11} /> Site web
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI BAR ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {vitrine.kpis.map((kpi, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-1">
                  {KPI_ICONS[kpi.icon] ?? <Users size={22} className="text-[#E8622A]" />}
                </div>
                <p className="text-xl font-extrabold text-[#1E2A3A]">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-7">

          {/* ── LEFT: tabs + content ──────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Tab nav */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
              <div className="flex">
                {([
                  { key:'presentation', label:'Présentation',    icon:<Building2 size={14}/> },
                  { key:'vie',          label:'Vie au Travail',   icon:<Heart     size={14}/> },
                  { key:'offres',       label:'Offres d\'Emploi', icon:<Briefcase size={14}/> },
                ] as const).map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold
                               border-b-2 transition-all ${
                      tab === key
                        ? 'border-[#E8622A] text-[#E8622A] bg-orange-50/40'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                    }`}
                  >
                    {icon}
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden text-xs">{label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            {tab === 'presentation' && <PresentationTab vitrine={vitrine} />}
            {tab === 'vie'          && <VieTab          vitrine={vitrine} />}
            {tab === 'offres'       && <OffresTab       vitrine={vitrine} />}
          </div>

          {/* ── RIGHT: sidebar ────────────────────────────────────────── */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar vitrine={vitrine} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}