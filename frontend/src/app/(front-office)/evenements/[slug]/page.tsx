// src/app/(front-office)/salons/[slug]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Eye, Calendar, MapPin, Tag, User, Loader2, Play, ExternalLink, Globe, Users, Building2,} from 'lucide-react';
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
    metaTitle?: string;
    metaDescription?: string;
    // Champs spécifiques événement
    startDate?: string;
    endDate?: string;
    location?: string;
    city?: string;
    country?: string;
    website?: string;
    exhibitorCount?: number;
    visitorCount?: number;
    edition?: string;
    category: {
        id: number;
        name: string;
        slug: string;
        color?: string;
    };
    author: {
        id: number;
        name: string;
    };
    tags?: { id: number; name: string; slug: string }[];
    destination?: {
        id: number;
        name: string;
        slug: string;
    } | null;
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

// ─── Content Renderer ────────────────────────────────────────────────────────

const ContentRenderer = ({ blocks }: { blocks: ContentBlock[] }) => (
    <div className="prose prose-lg max-w-none">
        {blocks.map((block, index) => {
        switch (block.type) {
            case 'heading':
            return (
                <h2
                key={index}
                className="text-2xl md:text-3xl font-bold text-[#001A4D] mt-10 mb-4 leading-snug"
                >
                {block.value}
                </h2>
            );
            case 'text':
            return (
                <p
                key={index}
                className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 whitespace-pre-line"
                >
                {block.value}
                </p>
            );
            case 'image':
            return (
                <div key={index} className="my-8 rounded-2xl overflow-hidden shadow-md">
                <img
                    src={block.url}
                    alt="Illustration"
                    className="w-full h-auto object-cover"
                />
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

// ─── Date Range Display ───────────────────────────────────────────────────────

const DateRange = ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    const fmtDay = (d: Date) =>
        d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    if (!end || start.toDateString() === end.toDateString()) {
        return <span>{fmtDay(start)}</span>;
    }

    // Même mois/année → "12 – 15 mai 2025"
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return (
        <span>
            {start.getDate()} – {fmtDay(end)}
        </span>
        );
    }

    return (
        <span>
        {fmtDay(start)} – {fmtDay(end)}
        </span>
    );
};

// ─── Related Event Card ───────────────────────────────────────────────────────

const RelatedCard = ({ event }: { event: RelatedEvenement }) => (
    <Link href={`/salons/${event.slug}`} className="group flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4">
        <img
            src={event.coverImage || '/images/placeholder.jpg'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-[#F39C12] text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wide">
            {event.category.name}
        </span>
        </div>
        <h3 className="text-base font-bold text-[#001A4D] leading-snug mb-2 group-hover:text-[#F39C12] transition-colors line-clamp-2">
        {event.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{event.excerpt}</p>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 mt-auto">
        {event.location && (
            <>
            <MapPin size={11} className="text-[#F39C12]" />
            <span>{event.location}</span>
            <span>•</span>
            </>
        )}
        <span>
            {new Date(event.startDate ?? event.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            })}
        </span>
        </div>
    </Link>
);

// ─── Info Stat Badge ──────────────────────────────────────────────────────────

const StatBadge = ({ icon: Icon, label, value,}: { icon: React.ElementType; label: string; value: string | number;}) => (
    <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center gap-2">
        <Icon size={22} className="text-[#F39C12]" />
        <span className="text-2xl font-black text-[#001A4D]">{value}</span>
        <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">{label}</span>
    </div>
);

// ─── Main Page Component ──────────────────────────────────────────────────────

const EvenementDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;

    const [evenement, setEvenement] = useState<Evenement | null>(null);
    const [related, setRelated] = useState<RelatedEvenement[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const calculateReadingTime = (blocks: ContentBlock[]): number => {
        const totalWords = blocks
        .filter((b) => b.type === 'text' || b.type === 'heading')
        .map((b) => (b.value || '').split(' ').length)
        .reduce((a, b) => a + b, 0);
        return Math.max(1, Math.ceil(totalWords / 200));
    };

    useEffect(() => {
        if (!slug) return;

        const fetchEvenement = async () => {
        try {
            // Adapter l'endpoint selon votre API — ex: /mag/articles/{slug} ou /salons/{slug}
            const res = await api.get(`/mag/articles/${slug}`);
            const data: Evenement = res.data.data ?? res.data;
            setEvenement(data);

            // Articles similaires de la même catégorie
            try {
            const relRes = await api.get('/mag/articles', {
                params: {
                categoryId: data.category.id,
                pageSize: 4,
                status: 'PUBLISHED',
                },
            });
            const relData: RelatedEvenement[] = relRes.data.data ?? [];
            setRelated(relData.filter((a) => a.slug !== slug).slice(0, 3));
            } catch {
            // Fail silently
            }
        } catch (error) {
            const axiosError = error as { response?: { status?: number } };
            if (axiosError?.response?.status === 404) {
            setNotFound(true);
            } else {
            console.error('Erreur chargement événement:', error);
            setNotFound(true);
            }
        } finally {
            setLoading(false);
        }
        };

        fetchEvenement();
    }, [slug]);

    // ── Loading ──
    if (loading) {
        return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
            <Loader2 className="animate-spin text-[#F39C12]" size={44} />
            <p className="text-[#001A4D] font-medium text-sm uppercase tracking-widest animate-pulse">
            Chargement de l&apos;événement...
            </p>
        </div>
        );
    }

    // ── 404 ──
    if (notFound || !evenement) {
        return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 px-4">
            <div className="text-center">
            <p className="text-8xl font-black text-[#001A4D]/10 mb-2">404</p>
            <h1 className="text-2xl font-bold text-[#001A4D] mb-3">Événement introuvable</h1>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Cet événement n&apos;existe pas ou a été supprimé.
            </p>
            <Link
                href="/salons"
                className="inline-flex items-center gap-2 bg-[#001A4D] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#F39C12] transition-colors"
            >
                <ArrowLeft size={16} />
                Retour aux salons
            </Link>
            </div>
        </div>
        );
    }

    const readingTime = calculateReadingTime(evenement.content);
    const parsedContent: ContentBlock[] = Array.isArray(evenement.content)
        ? evenement.content
        : [];

    // Durée de l'événement en jours
    const durationDays =
        evenement.startDate && evenement.endDate
        ? Math.ceil(
            (new Date(evenement.endDate).getTime() - new Date(evenement.startDate).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1
        : null;

    return (
        <main className="min-h-screen bg-white">

        {/* ── Hero Cover Image ─────────────────────────────────────── */}
        <div className="relative w-full h-[420px] md:h-[560px]">
            <Image
            src={evenement.coverImage || '/images/placeholder.jpg'}
            alt={evenement.title}
            fill
            className="object-cover"
            priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#001A4D]/90 via-[#001A4D]/35 to-transparent" />

            {/* Back button */}
            <div className="absolute top-6 left-6 z-10">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all"
            >
                <ArrowLeft size={15} />
                Retour
            </button>
            </div>

            {/* Edition badge (si disponible) */}
            {evenement.edition && (
            <div className="absolute top-6 right-6 z-10">
                <span className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-full text-sm font-bold">
                {evenement.edition}
                </span>
            </div>
            )}

            {/* Hero text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-5xl mx-auto w-full">
            <span className="inline-block bg-[#F39C12] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
                {evenement.category.name}
            </span>
            <h1 className="text-white text-3xl md:text-5xl font-black leading-tight drop-shadow-lg max-w-4xl mb-4">
                {evenement.title}
            </h1>

            {/* Date + lieu inline sur le hero */}
            {(evenement.startDate || evenement.location) && (
                <div className="flex flex-wrap items-center gap-4 text-white/85 text-sm">
                {evenement.startDate && (
                    <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-[#F39C12]" />
                    <DateRange startDate={evenement.startDate} endDate={evenement.endDate} />
                    </div>
                )}
                {evenement.location && (
                    <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-[#F39C12]" />
                    <span>
                        {evenement.location}
                        {evenement.city && `, ${evenement.city}`}
                        {evenement.country && ` — ${evenement.country}`}
                    </span>
                    </div>
                )}
                </div>
            )}
            </div>
        </div>

        {/* ── Stats rapides ─────────────────────────────────────────── */}
        {(durationDays || evenement.exhibitorCount || evenement.visitorCount) && (
            <div className="bg-gray-50 border-b border-gray-100">
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {durationDays && (
                    <StatBadge icon={Clock} label="Jours" value={durationDays} />
                )}
                {evenement.exhibitorCount && (
                    <StatBadge
                    icon={Building2}
                    label="Exposants"
                    value={evenement.exhibitorCount.toLocaleString('fr-FR')}
                    />
                )}
                {evenement.visitorCount && (
                    <StatBadge
                    icon={Users}
                    label="Visiteurs"
                    value={evenement.visitorCount.toLocaleString('fr-FR')}
                    />
                )}
                {evenement.views > 0 && (
                    <StatBadge
                    icon={Eye}
                    label="Lectures"
                    value={evenement.views.toLocaleString('fr-FR')}
                    />
                )}
                </div>
            </div>
            </div>
        )}

        {/* ── Article Body ──────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">

            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 border-b border-gray-100 pb-8 mb-10">
            <div className="flex items-center gap-2">
                <User size={15} className="text-[#F39C12]" />
                <span>
                Par <strong className="text-[#001A4D]">{evenement.author.name}</strong>
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#F39C12]" />
                <span>
                {new Date(evenement.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#F39C12]" />
                <span>{readingTime} min de lecture</span>
            </div>
            {evenement.views > 0 && (
                <div className="flex items-center gap-2">
                <Eye size={15} className="text-[#F39C12]" />
                <span>{evenement.views.toLocaleString('fr-FR')} lectures</span>
                </div>
            )}
            </div>

            {/* Chapô / Excerpt */}
            {evenement.excerpt && (
            <p className="text-xl text-[#1A365D] font-medium leading-relaxed border-l-4 border-[#F39C12] pl-6 mb-10 italic">
                {evenement.excerpt}
            </p>
            )}

            {/* Bloc Infos Pratiques ─────────────────────────────────── */}
            {(evenement.startDate || evenement.location || evenement.website) && (
            <div className="mb-10 bg-[#001A4D]/4 border border-[#001A4D]/10 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                <h3 className="md:col-span-2 text-[#001A4D] font-bold text-sm uppercase tracking-widest mb-1">
                Informations pratiques
                </h3>

                {evenement.startDate && (
                <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-[#F39C12] mt-0.5 shrink-0" />
                    <div>
                    <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-0.5">
                        Date{evenement.endDate ? 's' : ''}
                    </p>
                    <p className="text-[#001A4D] font-semibold text-sm">
                        <DateRange startDate={evenement.startDate} endDate={evenement.endDate} />
                    </p>
                    </div>
                </div>
                )}

                {evenement.location && (
                <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#F39C12] mt-0.5 shrink-0" />
                    <div>
                    <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-0.5">
                        Lieu
                    </p>
                    <p className="text-[#001A4D] font-semibold text-sm">
                        {evenement.location}
                        {evenement.city && `, ${evenement.city}`}
                        {evenement.country && ` — ${evenement.country}`}
                    </p>
                    </div>
                </div>
                )}

                {evenement.website && (
                <div className="flex items-start gap-3">
                    <Globe size={18} className="text-[#F39C12] mt-0.5 shrink-0" />
                    <div>
                    <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-0.5">
                        Site officiel
                    </p>
                    <a
                        href={evenement.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#001A4D] font-semibold text-sm hover:text-[#F39C12] transition-colors flex items-center gap-1 underline underline-offset-4"
                    >
                        {evenement.website.replace(/^https?:\/\//, '')}
                        <ExternalLink size={12} />
                    </a>
                    </div>
                </div>
                )}
            </div>
            )}

            {/* Article content */}
            <ContentRenderer blocks={parsedContent} />

            {/* Tags */}
            {evenement.tags && evenement.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-3">
                <Tag size={16} className="text-gray-400" />
                {evenement.tags.map((tag) => (
                <span
                    key={tag.id}
                    className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#F39C12]/10 hover:text-[#F39C12] transition-colors cursor-default"
                >
                    #{tag.name}
                </span>
                ))}
            </div>
            )}

            {/* Destination liée */}
            {evenement.destination && (
            <div className="mt-6 p-5 bg-[#001A4D]/5 rounded-2xl flex items-center justify-between">
                <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Destination liée
                </p>
                <p className="text-[#001A4D] font-bold text-lg">{evenement.destination.name}</p>
                </div>
                <Link
                href={`/destinations/${evenement.destination.slug}`}
                className="bg-[#001A4D] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#F39C12] transition-colors"
                >
                Découvrir
                </Link>
            </div>
            )}

            {/* CTA Site officiel */}
            {evenement.website && (
            <div className="mt-6">
                <a
                href={evenement.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F39C12] text-white px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#001A4D] transition-colors shadow-sm"
                >
                <ExternalLink size={16} />
                Visiter le site officiel
                </a>
            </div>
            )}
        </div>

        {/* ── Événements similaires ─────────────────────────────────── */}
        {related.length > 0 && (
            <section className="bg-gray-50 py-16 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-2xl font-bold text-[#001A4D] uppercase tracking-wide">
                    Événements similaires
                    </h2>
                    <div className="w-12 h-1 bg-[#F39C12] mt-2 rounded-full" />
                </div>
                <Link
                    href="/salons"
                    className="text-sm font-bold text-[#001A4D] hover:text-[#F39C12] transition-colors flex items-center gap-1"
                >
                    Voir tout
                    <ArrowLeft size={14} className="rotate-180" />
                </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((e) => (
                    <RelatedCard key={e.id} event={e} />
                ))}
                </div>
            </div>
            </section>
        )}

        {/* ── Back to salons CTA ────────────────────────────────────── */}
        <div className="py-12 flex justify-center bg-white border-t border-gray-100">
            <Link
            href="/salons"
            className="inline-flex items-center gap-2 bg-[#001A4D] text-white px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#F39C12] transition-colors shadow-sm"
            >
            <ArrowLeft size={16} />
            Tous les salons & événements
            </Link>
        </div>
        </main>
    );
};

export default EvenementDetailPage;