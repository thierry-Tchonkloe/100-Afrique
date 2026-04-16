// src/app/(front-office)/videos/[slug]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Eye, Calendar, Tag, User, ExternalLink, Loader2, Play, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentBlock {
    type: 'text' | 'heading' | 'image' | 'video';
    value?: string;
    url?: string;
}

interface VideoArticle {
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
    sourceUrl?: string | null;
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

interface RelatedVideo {
    id: number;
    title: string;
    slug: string;
    coverImage: string;
    sourceUrl: string | null;
    createdAt: string;
    excerpt: string;
    category: { name: string };
    author: { name: string };
    content: ContentBlock[];
}

interface VideoPlayerProps {
    sourceUrl: string | null;
    coverImage: string;
    title: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Convertit n'importe quelle URL YouTube/Vimeo en URL embed
const toEmbedUrl = (raw: string): string => {
    if (!raw) return "";
    if (raw.includes("/embed/") || raw.includes("player.vimeo")) return raw;
    const ytShort = raw.match(/youtu\.be\/([^?&]+)/);
    if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
    const ytWatch = raw.match(/[?&]v=([^?&]+)/);
    if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
    const vimeo = raw.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return raw;
};

// Extrait l'URL brute depuis les blocs de contenu (url OU value)
const getVideoUrl = (blocks: ContentBlock[]): string | null => {
    const block = blocks.find((b) => b.type === 'video');
    return block?.url ?? block?.value ?? null;
};

const getVideoType = (categoryName: string): string => {
    const name = categoryName.toLowerCase();
    if (name.includes('interview')) return 'INTERVIEW';
    if (name.includes('reportage') || name.includes('salon')) return 'REPORTAGE SALON';
    if (name.includes('destination')) return 'DESTINATION';
    if (name.includes('émission') || name.includes('replay')) return 'ÉMISSION';
    if (name.includes('tutoriel')) return 'TUTORIEL PRO';
    return 'VIDÉO';
};

// ─── Video Player ─────────────────────────────────────────────────────────────

const VideoPlayer = ({ sourceUrl, coverImage, title }: VideoPlayerProps) => {
    const [playing, setPlaying] = useState(false);

    // Reconstruit le lien externe depuis l'URL embed
    const getExternalLink = (url: string) => {
        if (url.includes('youtube.com/embed/')) {
            return url.replace('youtube.com/embed/', 'youtube.com/watch?v=');
        }
        if (url.includes('player.vimeo.com/video/')) {
            return url.replace('player.vimeo.com/video/', 'vimeo.com/');
        }
        return url;
    };

    if (!sourceUrl) {
        return (
            <div className="relative aspect-video bg-[#0F172A] rounded-2xl overflow-hidden flex items-center justify-center">
                <Image src={coverImage || '/images/placeholder.jpg'} alt={title} fill className="object-cover opacity-50" />
                <p className="relative z-10 text-white/60 text-sm">Aucune vidéo disponible</p>
            </div>
        );
    }

    if (playing) {
        return (
            <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                    <iframe
                        src={`${sourceUrl}?autoplay=1`}
                        className="w-full h-full"
                        title={title}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </div>
                <div className="flex justify-center">
                    <a
                        href={getExternalLink(sourceUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#F19300] transition-colors duration-200 py-1"
                    >
                        <ExternalLink size={14} />
                        Regarder directement sur la plateforme
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative aspect-video bg-[#0F172A] rounded-2xl overflow-hidden cursor-pointer group shadow-2xl"
            onClick={() => setPlaying(true)}
        >
            <Image
                src={coverImage || '/images/placeholder.jpg'}
                alt={title}
                fill
                className="object-cover opacity-70 group-hover:opacity-60 transition-opacity duration-300"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-[#F19300] rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <Play size={34} fill="white" className="text-white ml-1" />
                </div>
            </div>
            <p className="absolute bottom-5 left-0 right-0 text-center text-white/70 text-xs tracking-widest uppercase">
                Cliquer pour lancer la vidéo
            </p>
        </div>
    );
};

// ─── Social Share ─────────────────────────────────────────────────────────────

const SocialShare = ({ title }: { title: string }) => {
    const handleShare = (platform: string) => {
        if (typeof window === 'undefined') return;
        const url = window.location.href;
        const shareUrls: Record<string, string> = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
        };
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    return (
        <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Partager :</span>
            <div className="flex gap-2">
                {[
                    { key: 'facebook', bg: 'bg-[#3B5998]', Icon: Facebook },
                    { key: 'twitter', bg: 'bg-black', Icon: Twitter },
                    { key: 'linkedin', bg: 'bg-[#0077B5]', Icon: Linkedin },
                    { key: 'whatsapp', bg: 'bg-[#25D366]', Icon: MessageCircle },
                ].map(({ key, bg, Icon }) => (
                    <button
                        key={key}
                        onClick={() => handleShare(key)}
                        className={`p-2 ${bg} text-white rounded-full hover:opacity-80 transition-opacity`}
                        aria-label={`Partager sur ${key}`}
                    >
                        <Icon size={16} />
                    </button>
                ))}
            </div>
        </div>
    );
};

// ─── Related Video Card ───────────────────────────────────────────────────────

const RelatedCard = ({ video }: { video: RelatedVideo }) => {
    const hasVideo = video.content?.some((b) => b.type === 'video');

    return (
        <Link href={`/videos/${video.slug}`} className="group flex flex-col">
            <div className="relative aspect-video overflow-hidden rounded-xl mb-4">
                <img
                    src={video.coverImage || '/images/placeholder.jpg'}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                {hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-[#F19300] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play size={16} fill="white" className="ml-0.5" />
                        </div>
                    </div>
                )}
                <span className="absolute top-3 left-3 bg-[#F19300] text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wide">
                    {video.category.name}
                </span>
            </div>
            <h3 className="text-base font-bold text-[#163066] leading-snug mb-2 group-hover:text-[#F19300] transition-colors line-clamp-2">
                {video.title}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-3">{video.excerpt}</p>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-auto">
                <span>Par {video.author.name}</span>
                <span>•</span>
                <span>
                    {new Date(video.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </span>
            </div>
        </Link>
    );
};

// ─── Content Renderer ─────────────────────────────────────────────────────────

const ContentRenderer = ({ blocks }: { blocks: ContentBlock[] }) => {
    const textBlocks = blocks.filter((b) => b.type !== 'video');
    if (textBlocks.length === 0) return null;

    return (
        <div className="prose prose-lg max-w-none mt-10">
            {textBlocks.map((block, index) => {
                switch (block.type) {
                    case 'heading':
                        return (
                            <h2 key={index} className="text-2xl md:text-3xl font-bold text-[#163066] mt-10 mb-4 leading-snug">
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
                    default:
                        return null;
                }
            })}
        </div>
    );
};

// ─── Main Page Component ──────────────────────────────────────────────────────

const VideoDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;

    const [video, setVideo] = useState<VideoArticle | null>(null);
    const [related, setRelated] = useState<RelatedVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchVideo = async () => {
            try {
                const res = await api.get(`/mag/articles/${slug}`);
                const data: VideoArticle = res.data.data ?? res.data;
                setVideo(data);

                try {
                    const relRes = await api.get('/mag/articles', {
                        params: {
                            categoryId: data.category.id,
                            pageSize: 4,
                            status: 'PUBLISHED',
                        },
                    });
                    const relData: RelatedVideo[] = relRes.data.data ?? [];
                    setRelated(relData.filter((v) => v.slug !== slug).slice(0, 3));
                } catch {
                    // Fail silently
                }
            } catch (error) {
                const axiosError = error as { response?: { status?: number } };
                if (axiosError?.response?.status === 404) {
                    setNotFound(true);
                } else {
                    console.error('Erreur chargement vidéo:', error);
                    setNotFound(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
                <Loader2 className="animate-spin text-[#F19300]" size={44} />
                <p className="text-[#163066] font-medium text-sm uppercase tracking-widest animate-pulse">
                    Chargement de la vidéo...
                </p>
            </div>
        );
    }

    if (notFound || !video) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 px-4">
                <div className="text-center">
                    <p className="text-8xl font-black text-[#163066]/10 mb-2">404</p>
                    <h1 className="text-2xl font-bold text-[#163066] mb-3">Vidéo introuvable</h1>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Cette vidéo n&apos;existe pas ou a été supprimée.
                    </p>
                    <Link
                        href="/videos"
                        className="inline-flex items-center gap-2 bg-[#163066] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#F19300] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Retour aux vidéos
                    </Link>
                </div>
            </div>
        );
    }

    const parsedContent: ContentBlock[] = Array.isArray(video.content) ? video.content : [];
    const videoType = getVideoType(video.category.name);

    // ── Résolution de l'URL : sourceUrl > bloc video (url|value) ──
    // puis conversion en URL embed pour l'iframe
    const rawUrl = video.sourceUrl || getVideoUrl(parsedContent) || null;
    const sourceUrl = rawUrl ? toEmbedUrl(rawUrl) : null;

    return (
        <main className="min-h-screen bg-white">

            {/* ── Header de navigation ── */}
            <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4">
                <div className="max-w-5xl mx-auto flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-[#163066] text-sm font-medium transition-colors"
                    >
                        <ArrowLeft size={15} />
                        Retour
                    </button>
                    <span className="text-gray-300">/</span>
                    <Link href="/videos" className="text-gray-500 hover:text-[#163066] text-sm transition-colors">
                        Vidéos
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-[#163066] text-sm font-medium truncate max-w-[200px]">{video.title}</span>
                </div>
            </div>

            {/* ── Contenu principal ── */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">

                <div className="mb-5">
                    <span className="inline-block bg-[#F19300] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                        {videoType}
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-[#163066] leading-tight mb-6 max-w-4xl">
                    {video.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 border-b border-gray-100 pb-6 mb-8">
                    <div className="flex items-center gap-2">
                        <User size={15} className="text-[#F19300]" />
                        <span>Par <strong className="text-[#163066]">{video.author.name}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-[#F19300]" />
                        <span>
                            {new Date(video.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'long', year: 'numeric',
                            })}
                        </span>
                    </div>
                    {video.views > 0 && (
                        <div className="flex items-center gap-2">
                            <Eye size={15} className="text-[#F19300]" />
                            <span>{video.views.toLocaleString('fr-FR')} vues</span>
                        </div>
                    )}
                </div>

                {video.excerpt && (
                    <p className="text-xl text-[#1A365D] font-medium leading-relaxed border-l-4 border-[#F19300] pl-6 mb-8 italic">
                        {video.excerpt}
                    </p>
                )}

                {/* ── Player — reçoit l'URL embed prête à l'emploi ── */}
                <VideoPlayer
                    sourceUrl={sourceUrl}
                    coverImage={video.coverImage || '/images/placeholder.jpg'}
                    title={video.title}
                />

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <SocialShare title={video.title} />
                </div>

                <ContentRenderer blocks={parsedContent} />

                {video.tags && video.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-3">
                        <Tag size={16} className="text-gray-400" />
                        {video.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#F19300]/10 hover:text-[#F19300] transition-colors cursor-default"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {video.destination && (
                    <div className="mt-6 p-5 bg-[#163066]/5 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Destination liée</p>
                            <p className="text-[#163066] font-bold text-lg">{video.destination.name}</p>
                        </div>
                        <Link
                            href={`/destinations/${video.destination.slug}`}
                            className="bg-[#163066] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#F19300] transition-colors"
                        >
                            Découvrir
                        </Link>
                    </div>
                )}
            </div>

            {/* ── Vidéos similaires ── */}
            {related.length > 0 && (
                <section className="bg-[#F8FAFC] py-16 px-4 md:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-bold text-[#163066] uppercase tracking-wide">
                                    Vidéos similaires
                                </h2>
                                <div className="w-12 h-1 bg-[#F19300] mt-2 rounded-full" />
                            </div>
                            <Link
                                href="/videos"
                                className="text-sm font-bold text-[#163066] hover:text-[#F19300] transition-colors flex items-center gap-1"
                            >
                                Voir tout
                                <ArrowLeft size={14} className="rotate-180" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {related.map((v) => (
                                <RelatedCard key={v.id} video={v} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Back to videos CTA ── */}
            <div className="py-12 flex justify-center bg-white border-t border-gray-100">
                <Link
                    href="/videos"
                    className="inline-flex items-center gap-2 bg-[#163066] text-white px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#F19300] transition-colors shadow-sm"
                >
                    <ArrowLeft size={16} />
                    Toutes les vidéos
                </Link>
            </div>
        </main>
    );
};

export default VideoDetailPage;