// src/app/(front-office)/videos/[slug]/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Eye, Loader2, Tag, User } from 'lucide-react';

import { useVideoDetail } from '@/components/videos/detail/useVideoDetail';
import VideoPlayerCard from '@/components/videos/detail/VideoPlayerCard';
import VideoSocialShare from '@/components/videos/detail/VideoSocialShare';
import RelatedVideos from '@/components/videos/detail/RelatedVideos';
import ContentBlockRenderer from '@/components/shared/ContentBlockRenderer';
import LinkedDestinationCard from '@/components/shared/LinkedDestinationCard';

const VideoDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { video, related, loading, notFound, parsedContent, videoType, sourceUrl } = useVideoDetail(slug);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-it-gold" size={44} />
        <p className="text-it-blue font-medium text-sm uppercase tracking-widest animate-pulse">
          Chargement de la vidéo...
        </p>
      </div>
    );
  }

  if (notFound || !video) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 px-4">
        <div className="text-center">
          <p className="text-8xl font-black text-it-blue/10 mb-2">404</p>
          <h1 className="text-2xl font-bold text-it-blue mb-3">Vidéo introuvable</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Cette vidéo n&apos;existe pas ou a été supprimée.
          </p>
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 bg-it-emerald-dark text-white px-6 py-3 rounded-lg font-bold hover:bg-it-terracotta transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux vidéos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-it-blue text-sm font-medium transition-colors"
          >
            <ArrowLeft size={15} />
            Retour
          </button>
          <span className="text-gray-300">/</span>
          <Link href="/videos" className="text-gray-500 hover:text-it-blue text-sm transition-colors">
            Vidéos
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-it-blue text-sm font-medium truncate max-w-[200px]">{video.title}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">

        <div className="mb-5">
          <span className="inline-block bg-it-terracotta text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            {videoType}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-it-blue leading-tight mb-6 max-w-4xl">
          {video.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 border-b border-gray-100 pb-6 mb-8">
          <div className="flex items-center gap-2">
            <User size={15} className="text-it-gold" />
            <span>Par <strong className="text-it-blue">{video.author.name}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-it-gold" />
            <span>
              {new Date(video.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
          {video.views > 0 && (
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-it-gold" />
              <span>{video.views.toLocaleString('fr-FR')} vues</span>
            </div>
          )}
        </div>

        {video.excerpt && (
          <p className="text-xl text-it-blue font-medium leading-relaxed border-l-4 border-it-gold pl-6 mb-8 italic">
            {video.excerpt}
          </p>
        )}

        <VideoPlayerCard
          sourceUrl={sourceUrl}
          coverImage={video.coverImage || '/images/placeholder.jpg'}
          title={video.title}
        />

        <div className="mt-6 pt-6 border-t border-gray-100">
          <VideoSocialShare title={video.title} />
        </div>

        <ContentBlockRenderer blocks={parsedContent} excludeVideo className="mt-10" />

        {video.tags && video.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-3">
            <Tag size={16} className="text-gray-400" />
            {video.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-it-gold/10 hover:text-it-gold transition-colors cursor-default"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {video.destination && <LinkedDestinationCard destination={video.destination} />}
      </div>

      <RelatedVideos videos={related} />

      <div className="py-12 flex justify-center bg-white border-t border-gray-100">
        <Link
          href="/videos"
          className="inline-flex items-center gap-2 bg-it-emerald-dark text-white px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-it-terracotta transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Toutes les vidéos
        </Link>
      </div>
    </main>
  );
};

export default VideoDetailPage;