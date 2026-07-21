// src/app/(front-office)/salons/[slug]/page.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Clock, Eye, Calendar, MapPin,
  Tag, User, Loader2, ExternalLink, Globe, Users,
  Building2, Share2, Check,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentBlock {
  type: 'text' | 'heading' | 'image' | 'video';
  value?: string;
  url?: string;
}

interface Evenement {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  featured: boolean;
  startDate?: string;
  endDate?: string;
  location?: string;
  city?: string;
  country?: string;
  website?: string;
  exhibitorCount?: number;
  visitorCount?: number;
  edition?: string;
  category: { id: number; name: string; slug: string; color?: string };
  author: { id: number; name: string };
  tags?: { id: number; name: string; slug: string }[];
  destination?: { id: number; name: string; slug: string } | null;
}

interface RelatedEvenement {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  createdAt: string;
  excerpt: string;
  location?: string;
  startDate?: string;
  category: { name: string };
  author: { name: string };
}

// ─── Hook reveal ─────────────────────────────────────────────────────────────

function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Reading progress ─────────────────────────────────────────────────────────

function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setP(el.scrollHeight > el.clientHeight ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px]" style={{ background: 'rgba(0,0,0,0.07)' }}>
      <div className="h-full rounded-full transition-none" style={{ width: `${p}%`, background: 'linear-gradient(to right, #1A5C43, #C8A84B)' }} />
    </div>
  );
}

// ─── Date range ───────────────────────────────────────────────────────────────

function DateRange({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  if (!startDate) return null;
  const start = new Date(startDate);
  const end   = endDate ? new Date(endDate) : null;
  const fmt   = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  if (!end || start.toDateString() === end.toDateString()) return <span>{fmt(start)}</span>;
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear())
    return <span>{start.getDate()} – {fmt(end)}</span>;
  return <span>{fmt(start)} – {fmt(end)}</span>;
}

// ─── Stat card animée ────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, delay = 0, visible }: {
  icon: React.ElementType; label: string; value: string | number; delay?: number; visible: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl p-5 text-center gap-2 transition-all duration-700"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1A5C43' }}>
        <Icon size={18} style={{ color: '#C8A84B' }} />
      </div>
      <span className="text-2xl font-black text-white">{value}</span>
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
    </div>
  );
}

// ─── Bloc de contenu avec reveal ─────────────────────────────────────────────

function ContentBlockItem({ block, index }: { block: ContentBlock; index: number }) {
  const { ref, visible } = useReveal(0.05);
  const anim = {
    transition: `opacity 0.6s ${index * 25}ms, transform 0.6s ${index * 25}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(14px)',
  };
  switch (block.type) {
    case 'heading':
      return (
        <div ref={ref} style={anim}>
          <h2 className="text-2xl md:text-3xl font-black mt-12 mb-5 leading-snug" style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}>
            {block.value}
          </h2>
        </div>
      );
    case 'text':
      return (
        <div ref={ref} style={anim}>
          <p className="text-gray-700 text-base md:text-lg leading-[1.85] mb-6 whitespace-pre-line">{block.value}</p>
        </div>
      );
    case 'image':
      return (
        <div ref={ref} style={anim} className="my-10 rounded-2xl overflow-hidden shadow-lg">
          <img src={block.url} alt="Illustration" className="w-full h-auto object-cover" />
        </div>
      );
    case 'video':
      return (
        <div ref={ref} style={anim} className="my-10 aspect-video rounded-2xl overflow-hidden shadow-lg">
          <iframe src={block.url} className="w-full h-full" allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
        </div>
      );
    default: return null;
  }
}

// ─── Carte événement similaire ────────────────────────────────────────────────

function RelatedCard({ event, delay = 0 }: { event: RelatedEvenement; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="transition-all duration-700"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}>
      <Link href={`/evenements/${event.slug}`} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-4 bg-gray-100">
          <img src={event.coverImage || '/images/placeholder.jpg'} alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.6) 0%, transparent 60%)' }} />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white" style={{ background: '#B85C38' }}>
            {event.category.name}
          </span>
        </div>
        <h3 className="font-bold text-[14px] leading-snug line-clamp-2 mb-2 transition-colors" style={{ color: '#0D1A10' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1A5C43')}
          onMouseLeave={e => (e.currentTarget.style.color = '#0D1A10')}>
          {event.title}
        </h3>
        <p className="text-gray-400 text-[12px] line-clamp-2 mb-3 leading-relaxed">{event.excerpt}</p>
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400">
          {event.location && <><MapPin size={10} style={{ color: '#C8A84B' }} /><span>{event.location}</span><span>·</span></>}
          <span>{new Date(event.startDate ?? event.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </Link>
    </div>
  );
}

// ─── Share button ─────────────────────────────────────────────────────────────

function ShareButton() {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      if (navigator.share) await navigator.share({ url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    } catch {}
  };
  return (
    <button onClick={handle}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
      style={{ background: copied ? 'rgba(26,92,67,0.2)' : 'rgba(255,255,255,0.12)', color: copied ? '#C8A84B' : '#fff', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
      {copied ? <Check size={12} /> : <Share2 size={12} />}
      {copied ? 'Copié !' : 'Partager'}
    </button>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

const EvenementDetailPage = () => {
  const params  = useParams();
  const router  = useRouter();
  const slug    = params?.slug as string;

  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [related, setRelated]     = useState<RelatedEvenement[]>([]);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const { ref: statsRef, visible: statsVisible } = useReveal(0.15);
  const { ref: infoRef,  visible: infoVisible  } = useReveal(0.1);

  const calcReadingTime = (blocks: ContentBlock[]) =>
    Math.max(1, Math.ceil(blocks.filter(b => b.type === 'text' || b.type === 'heading')
      .reduce((acc, b) => acc + (b.value || '').split(' ').length, 0) / 200));

  useEffect(() => {
    if (!slug) return;
    api.get(`/mag/articles/${slug}`)
      .then(async (res) => {
        const data: Evenement = res.data.data ?? res.data;
        setEvenement(data);
        try {
          const rel = await api.get('/mag/articles', { params: { categoryId: data.category.id, pageSize: 4, status: 'PUBLISHED' } });
          setRelated((rel.data.data ?? []).filter((a: RelatedEvenement) => a.slug !== slug).slice(0, 3));
        } catch {}
      })
      .catch(() => setNotFound(true))
      .finally(() => { setLoading(false); setTimeout(() => setHeroVisible(true), 80); });
  }, [slug]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0D2B1A' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#C8A84B' }} />
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold animate-pulse">Chargement de l&apos;événement…</p>
      </div>
    );
  }

  // ── 404 ──
  if (notFound || !evenement) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ background: '#0D2B1A' }}>
        <p className="text-[120px] font-black leading-none" style={{ color: 'rgba(255,255,255,0.04)' }}>404</p>
        <h1 className="text-2xl font-black text-white">Événement introuvable</h1>
        <p className="text-white/40 text-sm text-center max-w-xs">Cet événement n&apos;existe pas ou a été supprimé.</p>
        <Link href="/evenements"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white"
          style={{ background: '#1A5C43' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}>
          <ArrowLeft size={14} /> Retour aux événements
        </Link>
      </div>
    );
  }

  const readingTime  = calcReadingTime(evenement.content);
  const parsedBlocks = Array.isArray(evenement.content) ? evenement.content : [];
  const durationDays = evenement.startDate && evenement.endDate
    ? Math.ceil((new Date(evenement.endDate).getTime() - new Date(evenement.startDate).getTime()) / 86400000) + 1
    : null;

  return (
    <main className="min-h-screen bg-white">
      <ReadingProgress />

      {/* ═══════════════════════════════════════════════════════
          HERO CINÉMATIQUE
      ═══════════════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '72vh', maxHeight: 820, background: '#0D2B1A' }}>

        {/* Image Ken Burns */}
        <div className="absolute inset-0 transition-transform ease-linear" style={{ transitionDuration: '10000ms', transform: heroVisible ? 'scale(1.07)' : 'scale(1)' }}>
          <Image src={evenement.coverImage || '/images/placeholder.jpg'} alt={evenement.title} fill className="object-cover" priority />
        </div>

        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.98) 0%, rgba(10,35,20,0.55) 45%, rgba(10,35,20,0.15) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,35,20,0.65) 0%, transparent 65%)' }} />

        {/* Barre accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, #1A5C43, #C8A84B, #B85C38)' }} />

        {/* Motif points */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        {/* Retour + Partager */}
        <div className="absolute top-6 left-0 right-0 px-6 md:px-12 flex items-center justify-between z-20">
          <button onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/20 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
            <ArrowLeft size={12} /> Retour
          </button>
          <ShareButton />
        </div>

        {/* Edition badge */}
        {evenement.edition && (
          <div
            className="absolute top-6 left-1/2 -translate-x-1/2 z-20 transition-all duration-500"
            style={{ opacity: heroVisible ? 1 : 0, transitionDelay: '100ms' }}>
            <span className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white"
              style={{ background: 'rgba(200,168,75,0.2)', border: '1px solid rgba(200,168,75,0.4)' }}>
              {evenement.edition}
            </span>
          </div>
        )}

        {/* Contenu hero */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-12 md:pb-16" style={{ minHeight: '72vh' }}>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-5 transition-all duration-500"
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(12px)', transitionDelay: '150ms' }}>
            <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-white" style={{ background: '#B85C38' }}>
              {evenement.category.name}
            </span>
            {evenement.featured && (
              <span className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white/80"
                style={{ background: 'rgba(200,168,75,0.2)', border: '1px solid rgba(200,168,75,0.35)' }}>
                ★ Événement phare
              </span>
            )}
          </div>

          {/* Titre */}
          <h1
            className="text-white font-bold text-3xl md:text-5xl lg:text-6xl max-w-4xl leading-[1.05] mb-6 transition-all duration-700"
            style={{ letterSpacing: '-0.025em', textShadow: '0 4px 24px rgba(0,0,0,0.3)', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(24px)', transitionDelay: '240ms' }}>
            {evenement.title}
          </h1>

          {/* Date + lieu */}
          <div className="flex flex-wrap items-center gap-5 mb-4 transition-all duration-600"
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(14px)', transitionDelay: '350ms' }}>
            {evenement.startDate && (
              <span className="flex items-center gap-1.5 text-white/70 text-sm">
                <Calendar size={14} style={{ color: '#C8A84B' }} />
                <DateRange startDate={evenement.startDate} endDate={evenement.endDate} />
              </span>
            )}
            {evenement.location && (
              <span className="flex items-center gap-1.5 text-white/70 text-sm">
                <MapPin size={14} style={{ color: '#C8A84B' }} />
                {evenement.location}{evenement.city && `, ${evenement.city}`}{evenement.country && ` — ${evenement.country}`}
              </span>
            )}
          </div>

          {/* Meta secondaire */}
          <div className="flex flex-wrap items-center gap-4 transition-all duration-500"
            style={{ opacity: heroVisible ? 1 : 0, transitionDelay: '440ms' }}>
            <span className="flex items-center gap-1.5 text-white/45 text-xs"><User size={11} style={{ color: '#C8A84B' }} />{evenement.author.name}</span>
            <span className="flex items-center gap-1.5 text-white/45 text-xs"><Clock size={11} style={{ color: '#C8A84B' }} />{readingTime} min de lecture</span>
            {evenement.views > 0 && <span className="flex items-center gap-1.5 text-white/45 text-xs"><Eye size={11} style={{ color: '#C8A84B' }} />{evenement.views.toLocaleString('fr-FR')} lectures</span>}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          STATS — fond sombre (suite visuelle du hero)
      ═══════════════════════════════════════════════════════ */}
      {(durationDays || evenement.exhibitorCount || evenement.visitorCount || evenement.views > 0) && (
        <div className="py-10" style={{ background: '#0D2B1A' }}>
          <div
            ref={statsRef}
            className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {durationDays && <StatCard icon={Clock} label="Jours" value={durationDays} delay={0} visible={statsVisible} />}
            {evenement.exhibitorCount && <StatCard icon={Building2} label="Exposants" value={evenement.exhibitorCount.toLocaleString('fr-FR')} delay={80} visible={statsVisible} />}
            {evenement.visitorCount && <StatCard icon={Users} label="Visiteurs" value={evenement.visitorCount.toLocaleString('fr-FR')} delay={160} visible={statsVisible} />}
            {evenement.views > 0 && <StatCard icon={Eye} label="Lectures" value={evenement.views.toLocaleString('fr-FR')} delay={240} visible={statsVisible} />}
          </div>
        </div>
      )}

      {/* Transition vers le blanc */}
      <div style={{ height: 48, background: 'linear-gradient(to bottom, #0D2B1A, #fff)' }} />

      {/* ═══════════════════════════════════════════════════════
          CORPS DE L'ARTICLE
      ═══════════════════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto px-5 md:px-8 pb-16">

        {/* Excerpt / chapô */}
        {evenement.excerpt && (
          <div className="relative pl-6 mb-12" style={{ borderLeft: '3px solid #C8A84B' }}>
            <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed italic">{evenement.excerpt}</p>
          </div>
        )}

        {/* Infos pratiques */}
        {(evenement.startDate || evenement.location || evenement.website) && (
          <div
            ref={infoRef}
            className="mb-12 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 transition-all duration-700"
            style={{
              background: 'rgba(26,92,67,0.04)',
              border: '1px solid rgba(26,92,67,0.1)',
              opacity: infoVisible ? 1 : 0,
              transform: infoVisible ? 'none' : 'translateY(20px)',
            }}
          >
            <h3 className="md:col-span-2 text-[10px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: '#B85C38' }}>
              Informations pratiques
            </h3>

            {evenement.startDate && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#1A5C43' }}>
                  <Calendar size={14} style={{ color: '#C8A84B' }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Date{evenement.endDate ? 's' : ''}</p>
                  <p className="font-semibold text-sm" style={{ color: '#0D1A10' }}>
                    <DateRange startDate={evenement.startDate} endDate={evenement.endDate} />
                  </p>
                </div>
              </div>
            )}

            {evenement.location && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#1A5C43' }}>
                  <MapPin size={14} style={{ color: '#C8A84B' }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Lieu</p>
                  <p className="font-semibold text-sm" style={{ color: '#0D1A10' }}>
                    {evenement.location}{evenement.city && `, ${evenement.city}`}{evenement.country && ` — ${evenement.country}`}
                  </p>
                </div>
              </div>
            )}

            {evenement.website && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#B85C38' }}>
                  <Globe size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Site officiel</p>
                  <a href={evenement.website} target="_blank" rel="noopener noreferrer"
                    className="font-semibold text-sm flex items-center gap-1 transition-colors"
                    style={{ color: '#1A5C43' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#B85C38')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#1A5C43')}>
                    {evenement.website.replace(/^https?:\/\//, '')} <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            )}

            {/* CTA site officiel intégré */}
            {evenement.website && (
              <div className="md:col-span-2">
                <a href={evenement.website} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:shadow-lg active:scale-95"
                  style={{ background: '#1A5C43' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}>
                  <ExternalLink size={14} /> Visiter le site officiel
                </a>
              </div>
            )}
          </div>
        )}

        {/* Contenu article */}
        {parsedBlocks.map((block, i) => <ContentBlockItem key={i} block={block} index={i} />)}

        {/* Tags */}
        {evenement.tags && evenement.tags.length > 0 && (
          <div className="mt-14 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <Tag size={13} className="text-gray-300 mr-1" />
            {evenement.tags.map(tag => (
              <span key={tag.id}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-default hover:scale-105 transition-transform"
                style={{ background: 'rgba(26,92,67,0.07)', color: '#1A5C43', border: '1px solid rgba(26,92,67,0.12)' }}>
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Destination liée */}
        {evenement.destination && (
          <div className="mt-8 p-6 rounded-2xl flex items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg, rgba(26,92,67,0.05) 0%, rgba(200,168,75,0.05) 100%)', border: '1px solid rgba(26,92,67,0.1)' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: '#B85C38' }}>Destination liée</p>
              <p className="font-bold text-lg" style={{ color: '#0D1A10' }}>{evenement.destination.name}</p>
            </div>
            <Link href={`/destinations/${evenement.destination.slug}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all shrink-0 hover:shadow-lg active:scale-95"
              style={{ background: '#1A5C43' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}>
              Découvrir <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Retour */}
        <div className="mt-14 pt-8 border-t border-gray-100 flex items-center justify-between">
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={14} /> Retour
          </button>
          <Link href="/evenements"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all active:scale-95"
            style={{ background: '#1A5C43' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}>
            <Calendar size={13} /> Tous les salons
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          ÉVÉNEMENTS SIMILAIRES
      ═══════════════════════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="py-20 md:py-28 px-4" style={{ background: '#F7F9F8' }}>
          <div className="max-w-[1100px] mx-auto">
            <RelatedHeading />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((e, i) => <RelatedCard key={e.id} event={e} delay={i * 100} />)}
            </div>
          </div>
        </section>
      )}

      {/* Mini CTA newsletter */}
      <MiniCTA />
    </main>
  );
};

function RelatedHeading() {
  const { ref, visible } = useReveal(0.2);
  return (
    <div ref={ref} className="flex items-end justify-between mb-12 transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: '#B85C38' }}>— À ne pas manquer</p>
        <h2 className="text-3xl md:text-4xl font-bold leading-none" style={{ color: '#0D1A10', letterSpacing: '-0.03em' }}>
          Événements <span style={{ color: '#1A5C43' }}>similaires</span>
        </h2>
      </div>
      <Link href="/evenements"
        className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all"
        style={{ background: '#1A5C43' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
        onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}>
        Voir tout <ArrowRight size={13} />
      </Link>
    </div>
  );
}

function MiniCTA() {
  const { ref, visible } = useReveal(0.2);
  return (
    <section ref={ref} className="py-16 px-4 relative overflow-hidden" style={{ background: '#0D2B1A' }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)', backgroundSize: '20px 20px' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"
        style={{ background: 'radial-gradient(ellipse at 100% 0%, #B85C38, transparent 70%)' }} />
      <div className="relative z-10 max-w-xl mx-auto text-center transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)' }}>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: '#C8A84B' }}>— Restez informé</p>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
          Ne manquez aucun <span style={{ color: '#C8A84B' }}>salon</span>
        </h3>
        <p className="text-white/40 text-sm mb-8">Agenda complet, reportages et analyses des grands événements du tourisme.</p>
        <Link href="/evenements"
          className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full text-white transition-all hover:shadow-xl active:scale-95"
          style={{ background: '#B85C38' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
          onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}>
          Voir l&apos;agenda complet <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

export default EvenementDetailPage;
