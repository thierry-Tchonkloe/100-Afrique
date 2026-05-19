'use client';
// src/app/(emploi)/emploi/conseils/page.tsx

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search, Clock, ArrowRight, Download, MapPin, Euro,
  BookOpen, Target, Briefcase, Heart, TrendingUp,
  LayoutGrid, ChevronRight, Send, CheckCircle2,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  readTime: number;
  date: string;
  coverUrl: string;
  author: { name: string; role: string; avatar: string };
  featured?: boolean;
}

interface SuggestedOffre {
  id: string;
  title: string;
  company: string;
  city: string;
  salaryMin: number;
  salaryMax: number;
  contractType: string;
  contractColor: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: '',                    label: 'Tous les articles',     icon: <LayoutGrid  size={14} />, color: 'bg-[#E8622A] text-white border-[#E8622A]'                 },
  { key: 'Recherche d\'Emploi', label: 'Recherche d\'Emploi',   icon: <Search      size={14} />, color: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300' },
  { key: 'Entretien & Coaching',label: 'Entretien & Coaching',  icon: <Target      size={14} />, color: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300' },
  { key: 'Métiers & Formations',label: 'Métiers & Formations',  icon: <BookOpen    size={14} />, color: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300' },
  { key: 'Vie au Travail',      label: 'Vie au Travail',        icon: <Heart       size={14} />, color: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300' },
  { key: 'Tendances du Marché', label: 'Tendances du Marché',   icon: <TrendingUp  size={14} />, color: 'bg-white text-gray-600 border-gray-200 hover:border-gray-300' },
];

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  'Coaching':            'bg-orange-500',
  'Recherche d\'Emploi': 'bg-blue-600',
  'Entretien & Coaching':'bg-orange-500',
  'Métiers & Formations':'bg-[#1E2A3A]',
  'Vie au Travail':      'bg-green-600',
  'Tendances du Marché': 'bg-teal-600',
  'Tendances':           'bg-teal-600',
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_ARTICLES: Article[] = [
  {
    id: '1', featured: true,
    title: 'Les 10 questions pièges en entretien et comment y répondre',
    excerpt: 'Découvrez les questions les plus fréquentes posées par les recruteurs et préparez vos réponses pour marquer des points.',
    category: 'Coaching', categoryColor: 'bg-orange-500',
    readTime: 5, date: '12 Jan 2026',
    coverUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    author: { name: 'Sophie Martin', role: 'Coach RH', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
  },
  {
    id: '2', featured: true,
    title: 'Comment créer un CV qui se démarque dans le tourisme',
    excerpt: 'Les spécificités du secteur touristique nécessitent une approche unique. Voici nos conseils d\'experts.',
    category: 'Recherche d\'Emploi', categoryColor: 'bg-blue-600',
    readTime: 8, date: '10 Jan 2026',
    coverUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
    author: { name: 'Thomas Dubois', role: 'Consultant Carrière', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
  },
  {
    id: '3', featured: true,
    title: 'Négocier son salaire : le guide complet 2026',
    excerpt: 'Techniques éprouvées et fourchettes de salaires pour négocier efficacement votre rémunération.',
    category: 'Coaching', categoryColor: 'bg-orange-500',
    readTime: 6, date: '8 Jan 2026',
    coverUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80',
    author: { name: 'Marie Laurent', role: 'Experte RH', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&q=80' },
  },
  {
    id: '4',
    title: 'Revenue Manager : le métier qui monte dans l\'hôtellerie',
    excerpt: 'Découvrez ce métier stratégique, ses missions, les compétences requises et les perspectives de carrière.',
    category: 'Métiers & Formations', categoryColor: 'bg-[#1E2A3A]',
    readTime: 10, date: '6 Jan 2026',
    coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    author: { name: 'Antoine Mercier', role: 'Expert Hôtellerie', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
  },
  {
    id: '5',
    title: 'Optimiser son profil LinkedIn pour être repéré',
    excerpt: 'Les recruteurs utilisent LinkedIn pour sourcer. Voici comment rendre votre profil irrésistible.',
    category: 'Recherche d\'Emploi', categoryColor: 'bg-blue-600',
    readTime: 7, date: '4 Jan 2026',
    coverUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&q=80',
    author: { name: 'Camille Rousseau', role: 'Consultante Digital', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&q=80' },
  },
  {
    id: '6',
    title: 'Équilibre vie pro / vie perso dans le tourisme',
    excerpt: 'Le secteur du tourisme est exigeant. Découvrez comment préserver votre bien-être au quotidien.',
    category: 'Vie au Travail', categoryColor: 'bg-green-600',
    readTime: 5, date: '2 Jan 2026',
    coverUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
    author: { name: 'Léa Fontaine', role: 'Psychologue du Travail', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80' },
  },
  {
    id: '7',
    title: 'Tourisme durable : les nouveaux métiers qui émergent',
    excerpt: 'L\'éco-tourisme crée de nouvelles opportunités professionnelles. Découvrez les métiers de demain.',
    category: 'Tendances', categoryColor: 'bg-teal-600',
    readTime: 9, date: '30 Déc 2025',
    coverUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    author: { name: 'Lucas Bernard', role: 'Analyste Tendances', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
  },
  {
    id: '8',
    title: 'S\'expatrier dans le tourisme : guide pratique complet',
    excerpt: 'Visa, fiscalité, logement, assurance : tout ce qu\'il faut savoir avant de partir travailler à l\'étranger.',
    category: 'Vie au Travail', categoryColor: 'bg-green-600',
    readTime: 12, date: '28 Déc 2025',
    coverUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    author: { name: 'Julie Chen', role: 'Experte Mobilité Internationale', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
  },
];

const MOCK_OFFRES: SuggestedOffre[] = [
  { id:'1', title:'Revenue Manager', company:'Hôtel Luxe Paris',             city:'Paris',  salaryMin:45, salaryMax:55, contractType:'CDI', contractColor:'bg-green-100 text-green-700' },
  { id:'2', title:'Chef de Réception', company:'Resort 5* Côte d\'Azur',     city:'Nice',   salaryMin:35, salaryMax:40, contractType:'CDD', contractColor:'bg-purple-100 text-purple-700' },
  { id:'3', title:'Yield Manager', company:'Groupe Hôtelier International',   city:'Lyon',   salaryMin:50, salaryMax:60, contractType:'CDI', contractColor:'bg-green-100 text-green-700' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function fetchArticles(category?: string, search?: string): Promise<Article[]> {
  // Real API would be: GET /api/emploi/conseils?category=&search=
  // Fallback to mock
  await new Promise((r) => setTimeout(r, 400));
  let list = MOCK_ARTICLES;
  if (category) list = list.filter((a) => a.category === category || a.category.includes(category));
  if (search)   list = list.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(search.toLowerCase())
  );
  return list;
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLE CARD
// ─────────────────────────────────────────────────────────────────────────────

function ArticleCard({ article, size = 'normal' }: { article: Article; size?: 'normal' | 'compact' }) {
  const badgeColor = CATEGORY_BADGE_COLORS[article.category] ?? 'bg-gray-600';

  return (
    <Link href={`/emploi/conseils/${article.id}`}
          className="group bg-white rounded-2xl border border-gray-100 overflow-hidden
                     hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col">
      {/* Cover */}
      <div className={`relative overflow-hidden flex-shrink-0 ${size === 'compact' ? 'h-44' : 'h-52'}`}>
        <img
          src={article.coverUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[11px] font-bold text-white px-2.5 py-1 rounded-full ${badgeColor}`}>
            {article.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2.5">
          <span className="flex items-center gap-1">
            <Clock size={11} /> {article.readTime} min
          </span>
          <span>{article.date}</span>
        </div>

        {/* Title */}
        <h3 className={`font-bold text-[#1E2A3A] leading-snug group-hover:text-[#E8622A] transition-colors
                        ${size === 'compact' ? 'text-sm' : 'text-[15px]'}`}>
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2 flex-1">
          {article.excerpt}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-gray-50">
          <img src={article.author.avatar} alt={article.author.name}
               className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-gray-700 leading-tight">{article.author.name}</p>
            <p className="text-[10px] text-gray-400">{article.author.role}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OFFRES WIDGET
// ─────────────────────────────────────────────────────────────────────────────

function OffresWidget() {
  return (
    <div className="rounded-3xl overflow-hidden my-10"
         style={{ background: 'linear-gradient(135deg, #E8622A 0%, #f5892c 100%)' }}>
      <div className="px-8 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-white">Les offres pour vous</h2>
          <p className="text-white/75 text-sm mt-1.5">Basées sur vos lectures et votre profil</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_OFFRES.map((offre) => (
            <div key={offre.id} className="bg-white rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-[#1E2A3A] text-sm leading-tight">{offre.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{offre.company}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${offre.contractColor}`}>
                  {offre.contractType}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={10} /> {offre.city}</span>
                <span className="flex items-center gap-1"><Euro size={10} /> {offre.salaryMin}-{offre.salaryMax}K</span>
              </div>

              <button className="w-full bg-[#E8622A] hover:bg-[#d4561f] text-white font-semibold
                                 text-xs py-2.5 rounded-xl transition-colors">
                Postuler
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EBOOK LEAD MAGNET
// ─────────────────────────────────────────────────────────────────────────────

function EbookSection() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleDownload(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  }

  return (
    <div className="rounded-3xl overflow-hidden my-10 bg-[#1E2A3A]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left: content */}
        <div className="p-10 flex flex-col justify-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#E8622A]
                           bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full w-fit mb-5">
            E-book Gratuit
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4">
            Guide des Salaires du Tourisme 2026
          </h2>
          <p className="text-sm text-white/60 leading-relaxed mb-6">
            Découvrez les fourchettes de rémunération par poste, région et niveau d'expérience.
          </p>

          <ul className="space-y-2.5 mb-8">
            {['Données 2026 actualisées', 'Comparatifs par région', 'Conseils de négociation'].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                <CheckCircle2 size={15} className="text-[#E8622A] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {sent ? (
            <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/30 rounded-2xl p-4">
              <CheckCircle2 size={20} className="text-green-400" />
              <div>
                <p className="text-sm font-bold text-white">Envoyé !</p>
                <p className="text-xs text-white/60 mt-0.5">Vérifiez votre boîte mail.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDownload} className="flex gap-3 flex-wrap sm:flex-nowrap">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email professionnel"
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3
                           text-sm text-white placeholder-white/40 focus:outline-none
                           focus:border-[#E8622A] focus:ring-2 focus:ring-[#E8622A]/20 transition"
              />
              <button type="submit"
                      className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#d4561f] text-white
                                 font-semibold text-sm px-5 py-3 rounded-xl transition flex-shrink-0">
                Télécharger <Download size={14} />
              </button>
            </form>
          )}
        </div>

        {/* Right: book visual */}
        <div className="hidden md:flex items-center justify-center p-10 bg-white/5">
          <div className="relative w-56 h-72 shadow-2xl rounded-lg overflow-hidden
                          transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80"
              alt="Guide des Salaires"
              className="w-full h-full object-cover"
            />
            {/* Book overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center
                            bg-gradient-to-br from-[#E8622A]/90 to-[#1E2A3A]/90 p-6 text-center">
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-3">Guide Officiel</p>
              <h3 className="text-2xl font-extrabold text-white leading-tight mb-2">
                SALAIRES<br/>TOURISME
              </h3>
              <div className="w-10 h-0.5 bg-[#E8622A] mx-auto my-3" />
              <p className="text-xs text-white/60">Édition 2026</p>
              <p className="text-[10px] text-white/40 mt-4">iTourisme Emploi × SyStates 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWSLETTER BANNER
// ─────────────────────────────────────────────────────────────────────────────

function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 my-10 text-center">
      <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Send size={20} className="text-[#E8622A]" />
      </div>
      <h2 className="text-xl font-extrabold text-[#1E2A3A] mb-2">Newsletter Carrière</h2>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
        Recevez chaque semaine les meilleurs conseils carrière, les tendances du marché et les offres qui recrutent.
      </p>
      {sent ? (
        <div className="flex items-center justify-center gap-3 text-green-600">
          <CheckCircle2 size={18} />
          <span className="font-semibold text-sm">Inscription confirmée !</span>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
              className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:border-[#E8622A] focus:ring-2 focus:ring-[#E8622A]/20 transition"
          />
          <button type="submit"
                  className="bg-[#E8622A] hover:bg-[#d4561f] text-white font-semibold text-sm
                             px-5 py-2.5 rounded-xl transition flex-shrink-0">
            S'inscrire
          </button>
        </form>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLE SKELETON
// ─────────────────────────────────────────────────────────────────────────────

function ArticleSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-4 bg-gray-100 rounded w-4/6" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
          <div className="w-8 h-8 bg-gray-100 rounded-full" />
          <div className="space-y-1">
            <div className="h-3 bg-gray-100 rounded w-24" />
            <div className="h-2 bg-gray-100 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

function ConseilsContent() {
  const searchParams = useSearchParams();

  const [articles,   setArticles]   = useState<Article[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  // Load articles
  useEffect(() => {
    setLoading(true);
    fetchArticles(activeCategory || undefined, search || undefined).then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, [activeCategory, search]);

  // Featured = first 3 for the main grid
  const featuredArticles = articles.filter((a) => a.featured).slice(0, 3);
  const regularArticles  = articles.filter((a) => !a.featured);
  // "Continue reading" = last 2 articles
  const continueArticles = articles.slice(-2);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E2A3A] leading-tight mb-4">
            Boostez votre trajectoire professionnelle.
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto mb-8">
            Analyses, guides et témoignages pour réussir dans l'industrie du tourisme.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un article... (ex: préparer son entretien)"
              className="w-full border border-gray-200 rounded-2xl pl-5 pr-14 py-3.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A]
                         shadow-sm transition"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#E8622A]
                               hover:bg-[#d4561f] rounded-xl flex items-center justify-center transition">
              <Search size={15} className="text-white" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Category tabs */}
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all
                    ${isActive
                      ? 'bg-[#E8622A] text-white border-[#E8622A] shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Main articles grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-700">Aucun article trouvé</p>
            <button onClick={() => { setSearch(''); setActiveCategory(''); }}
                    className="mt-3 text-sm text-[#E8622A] font-semibold hover:underline">
              Voir tous les articles
            </button>
          </div>
        ) : (
          <>
            {/* First row — 3 featured */}
            {(featuredArticles.length > 0 || !activeCategory) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                {(activeCategory ? articles.slice(0, 3) : featuredArticles).map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}

            {/* ── OFFRES WIDGET ── */}
            <OffresWidget />

            {/* Second row — regular articles */}
            {(activeCategory ? articles.slice(3) : regularArticles).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                {(activeCategory ? articles.slice(3) : regularArticles).map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}

            {/* ── EBOOK LEAD MAGNET ── */}
            <EbookSection />

            {/* ── "Continuez votre lecture" ── */}
            {!activeCategory && continueArticles.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-extrabold text-[#1E2A3A] mb-5">Continuez votre lecture</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {continueArticles.map((a) => (
                    <ArticleCard key={a.id} article={a} size="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* ── NEWSLETTER ── */}
            <NewsletterBanner />
          </>
        )}
      </div>
    </div>
  );
}

export default function ConseilsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8622A]/30 border-t-[#E8622A] rounded-full animate-spin" />
      </div>
    }>
      <ConseilsContent />
    </Suspense>
  );
}