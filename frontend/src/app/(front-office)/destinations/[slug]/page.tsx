// src/app/(front-office)/destinations/[slug]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Clock, Eye, Calendar, MapPin, Tag, User,
  Loader2, Globe, Thermometer, Languages, Coins, FileText,
  Newspaper, Play, ChevronRight, Compass, Camera,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentBlock {
  type: 'text' | 'heading' | 'image' | 'video';
  value?: string;
  url?: string;
}

interface ArticleCard {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  createdAt: string;
  type?: 'ARTICLE' | 'VIDEO';
  views?: number;
  category: { name: string; color?: string };
  author: { name: string };
}

interface Destination {
  id: number;
  name: string;
  slug: string;
  description?: string;
  coverImage: string;
  continent?: string;
  articleCount?: number;
  capital?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  climate?: string;
  bestPeriod?: string;
  visaRequired?: boolean;
  content?: ContentBlock[];
  articles?: ArticleCard[];
  tags?: { id: number; name: string; slug: string }[];
}

interface ApiResponse {
  success: boolean;
  data: Destination;
}

interface ArticlesApiResponse {
  success: boolean;
  data: ArticleCard[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getContentHref(article: ArticleCard): string {
  return article.type === 'VIDEO' ? `/videos/${article.slug}` : `/actualites/${article.slug}`;
}

// ─── Content Renderer ─────────────────────────────────────────────────────────

const ContentRenderer = ({ blocks }: { blocks: ContentBlock[] }) => (
  <div className="prose prose-lg max-w-none">
    {blocks.map((block, index) => {
      switch (block.type) {
        case 'heading':
          return (
            /* Titres → text-it-blue */
            <h2 key={index} className="text-2xl md:text-3xl font-bold text-it-blue mt-10 mb-4 leading-snug">
              {block.value}
            </h2>
          );
        case 'text':
          return (
            <p key={index} className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 whitespace-pre-line">
              {block.value}
            </p>
          );
        case 'image':
          return (
            <div key={index} className="my-8 rounded-2xl overflow-hidden shadow-md">
              <img src={block.url} alt="Illustration" className="w-full h-auto object-cover" />
            </div>
          );
        case 'video':
          return (
            <div key={index} className="my-8 aspect-video rounded-2xl overflow-hidden shadow-md">
              <iframe
                src={block.url}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          );
        default:
          return null;
      }
    })}
  </div>
);

// ─── Info Badge ───────────────────────────────────────────────────────────────

const InfoBadge = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | React.ReactNode;
}) => (
  <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
    {/* Icône fond → bg-it-gold/10 / icône → text-it-gold */}
    <div className="p-2 bg-it-gold/10 rounded-xl shrink-0">
      <Icon size={18} className="text-it-gold" />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">{label}</p>
      <p className="text-it-blue font-bold text-sm">{value}</p>
    </div>
  </div>
);

// ─── Article/Video Card ───────────────────────────────────────────────────────

const ArticleCardItem = ({ article }: { article: ArticleCard }) => {
  const isVideo = article.type === 'VIDEO';
  const href    = getContentHref(article);

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={article.coverImage || '/images/placeholder.jpg'}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            {/* Play → bg-it-terracotta */}
            <div className="w-12 h-12 bg-it-terracotta rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play size={20} fill="white" className="text-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Badge type → bg-it-terracotta */}
        <span className="absolute top-3 left-3 bg-it-terracotta text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
          {isVideo ? (
            <><Play size={9} fill="white" />Vidéo</>
          ) : (
            <><Newspaper size={9} />Article</>
          )}
        </span>

        {/* Catégorie → bg-it-blue/80 */}
        <span className="absolute bottom-3 left-3 bg-it-blue/80 backdrop-blur-sm text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          {article.category.name}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Titre → text-it-blue / hover text-it-gold */}
        <h3 className="text-base font-bold text-it-blue leading-snug mb-2 group-hover:text-it-gold transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{article.excerpt}</p>
        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            {/* Icône auteur → text-it-gold */}
            <User size={11} className="text-it-gold" />
            <span className="font-medium text-gray-500">{article.author.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {article.views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye size={11} />
                <span>{article.views.toLocaleString('fr-FR')}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={11} />
              <span>
                {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'short',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ─── Stat Pill ────────────────────────────────────────────────────────────────

const StatPill = ({ value, label }: { value: string | number; label: string }) => (
  <div className="text-center">
    <p className="text-3xl md:text-4xl font-black text-white">{value}</p>
    <p className="text-[11px] text-white/70 uppercase tracking-widest font-medium mt-1">{label}</p>
  </div>
);

// ─── Main Page Component ──────────────────────────────────────────────────────

const DestinationDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug   = params?.slug as string;

  const [destination,    setDestination]    = useState<Destination | null>(null);
  const [articles,       setArticles]       = useState<ArticleCard[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [notFound,       setNotFound]       = useState(false);
  const [articlesPage,   setArticlesPage]   = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(false);
  const [loadingMore,    setLoadingMore]    = useState(false);

  const fetchArticles = async (destId: number, page: number, append = false) => {
    try {
      if (append) setLoadingMore(true);
      const res = await api.get<ArticlesApiResponse>('/mag/articles', {
        params: { destinationId: destId, page, pageSize: 6, status: 'PUBLISHED' },
      });
      const newArticles = res.data.data ?? [];
      const pagination  = res.data.pagination;
      if (append) setArticles((prev) => [...prev, ...newArticles]);
      else        setArticles(newArticles);
      setHasMoreArticles(pagination?.hasNextPage ?? false);
      setArticlesPage(page + 1);
    } catch { /* fail silently */ }
    finally { setLoadingMore(false); }
  };

  useEffect(() => {
    if (!slug) return;
    const fetchDestination = async () => {
      try {
        const res  = await api.get<ApiResponse>(`/destinations/${slug}`);
        const data = res.data.data ?? res.data;
        setDestination(data);
        await fetchArticles(data.id, 1, false);
      } catch (error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status === 404) setNotFound(true);
        else { console.error('Erreur chargement destination:', error); setNotFound(true); }
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-it-gold" size={44} />
        <p className="text-it-blue font-medium text-sm uppercase tracking-widest animate-pulse">
          Chargement de la destination...
        </p>
      </div>
    );
  }

  // ── 404 ──
  if (notFound || !destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 px-4">
        <div className="text-center">
          <p className="text-8xl font-black text-it-blue/10 mb-2">404</p>
          <h1 className="text-2xl font-bold text-it-blue mb-3">Destination introuvable</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Cette destination n&apos;existe pas ou a été supprimée.
          </p>
          {/* CTA → bg-it-emerald-dark / hover bg-it-terracotta */}
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 bg-it-emerald-dark text-white px-6 py-3 rounded-lg font-bold hover:bg-it-terracotta transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux destinations
          </Link>
        </div>
      </div>
    );
  }

  const parsedContent = Array.isArray(destination.content) ? destination.content : [];
  const hasPracticalInfo =
    destination.capital || destination.currency || destination.language ||
    destination.timezone || destination.climate || destination.bestPeriod;

  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero Cover Image ── */}
      <div className="relative w-full h-[500px] md:h-[620px]">
        <Image
          src={destination.coverImage || '/images/placeholder-dest.jpg'}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay → from-it-blue */}
        <div className="absolute inset-0 bg-gradient-to-t from-it-blue/95 via-it-blue/40 to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={15} />
            Retour
          </button>
        </div>

        {destination.continent && (
          <div className="absolute top-6 right-6 z-10">
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-full text-sm font-bold">
              <Compass size={14} />
              {destination.continent}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-4">
            {/* Ligne déco + label → text-it-gold */}
            <div className="w-8 h-0.5 bg-it-gold" />
            <span className="text-it-gold text-xs font-bold uppercase tracking-[0.25em]">Destination</span>
          </div>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-none drop-shadow-lg max-w-4xl mb-5 uppercase tracking-tight">
            {destination.name}
          </h1>
          {destination.description && (
            <p className="text-white/80 text-base md:text-lg max-w-2xl leading-relaxed line-clamp-2">
              {destination.description}
            </p>
          )}
          {destination.articleCount !== undefined && destination.articleCount > 0 && (
            <div className="mt-8 flex items-center gap-8">
              <StatPill value={destination.articleCount} label="Articles & Vidéos" />
            </div>
          )}
        </div>
      </div>

      {/* ── Infos Pratiques ── */}
      {hasPracticalInfo && (
        /* Fond → bg-it-emerald-dark → bg-it-blue dégradé */
        <section className="bg-gradient-to-r from-it-emerald-dark to-it-blue py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex items-center gap-3 mb-8">
              {/* Icône → text-it-gold */}
              <FileText size={18} className="text-it-gold" />
              <h2 className="text-white font-bold text-sm uppercase tracking-[0.2em]">Infos pratiques</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {destination.capital   && <InfoBadge icon={MapPin}      label="Capitale"          value={destination.capital}    />}
              {destination.currency  && <InfoBadge icon={Coins}       label="Monnaie"           value={destination.currency}   />}
              {destination.language  && <InfoBadge icon={Languages}   label="Langue"            value={destination.language}   />}
              {destination.timezone  && <InfoBadge icon={Clock}       label="Fuseau horaire"    value={destination.timezone}   />}
              {destination.climate   && <InfoBadge icon={Thermometer} label="Climat"            value={destination.climate}    />}
              {destination.bestPeriod && <InfoBadge icon={Calendar}   label="Meilleure période" value={destination.bestPeriod} />}
            </div>
            {destination.visaRequired !== undefined && (
              <div className="mt-4">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                    destination.visaRequired
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-it-emerald/20 text-it-emerald-light border border-it-emerald/30'
                  }`}
                >
                  <Globe size={14} />
                  {destination.visaRequired ? 'Visa requis' : 'Sans visa requis'}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Corps éditorial ── */}
      {parsedContent.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-14">
          {destination.description && (
            /* Chapô → border-it-gold */
            <p className="text-xl text-it-blue font-medium leading-relaxed border-l-4 border-it-gold pl-6 mb-10 italic">
              {destination.description}
            </p>
          )}
          <ContentRenderer blocks={parsedContent} />
        </section>
      )}

      {parsedContent.length === 0 && destination.description && (
        <section className="max-w-4xl mx-auto px-4 md:px-8 py-14">
          <p className="text-xl text-it-blue font-medium leading-relaxed border-l-4 border-it-gold pl-6 italic">
            {destination.description}
          </p>
        </section>
      )}

      {/* ── Tags ── */}
      {destination.tags && destination.tags.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 pb-10">
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-100">
            <Tag size={16} className="text-gray-400" />
            {destination.tags.map((tag) => (
              /* Hover → bg-it-gold/10 text-it-gold */
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-it-gold/10 hover:text-it-gold transition-colors cursor-default"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Articles & Vidéos ── */}
      <section className="bg-it-gray-light py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* Icône → text-it-gold */}
                <Camera size={18} className="text-it-gold" />
                <span className="text-it-gold text-xs font-bold uppercase tracking-[0.2em]">Nos reportages</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-it-blue uppercase tracking-wide">
                Articles & Vidéos sur{' '}
                {/* Mise en valeur du nom → text-it-terracotta */}
                <span className="text-it-terracotta">{destination.name}</span>
              </h2>
              <div className="w-14 h-1 bg-it-gold mt-3 rounded-full" />
            </div>
            {destination.articleCount !== undefined && destination.articleCount > 6 && (
              <span className="hidden md:block text-sm text-gray-400 font-medium">
                {destination.articleCount} contenus disponibles
              </span>
            )}
          </div>

          {articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCardItem key={article.id} article={article} />
                ))}
              </div>

              {hasMoreArticles && (
                <div className="mt-12 flex justify-center">
                  {/* Bouton charger plus → bg-it-emerald-dark / hover bg-it-terracotta */}
                  <button
                    onClick={() => fetchArticles(destination.id, articlesPage, true)}
                    disabled={loadingMore}
                    className="bg-it-emerald-dark hover:bg-it-terracotta disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-10 py-4 rounded-lg font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center gap-2"
                  >
                    {loadingMore ? (
                      <><Loader2 className="animate-spin" size={16} />Chargement...</>
                    ) : (
                      <>Voir plus de contenus<ChevronRight size={16} /></>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Compass size={40} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 text-lg font-medium">
                Aucun contenu disponible pour cette destination pour le moment.
              </p>
              <p className="text-gray-300 text-sm mt-2">Revenez bientôt !</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA retour ── */}
      <div className="py-12 flex justify-center bg-white border-t border-gray-100">
        {/* bg-it-emerald-dark / hover bg-it-terracotta */}
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 bg-it-emerald-dark text-white px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-it-terracotta transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Toutes les destinations
        </Link>
      </div>
    </main>
  );
};

export default DestinationDetailPage;
