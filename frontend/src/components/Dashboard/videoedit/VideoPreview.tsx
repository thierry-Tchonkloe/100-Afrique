// src/components/Dashboard/videoedit/VideoPreview.tsx
"use client";
import React, { useState } from 'react';
import { Play, Clock } from 'lucide-react';
import FieldLabel from '@/components/shared/backoffice/FieldLabel';

function toEmbedUrl(raw: string): string {
  if (!raw) return '';
  if (raw.includes('/embed/') || raw.includes('player.vimeo')) return raw;
  const ytShort = raw.match(/youtu\.be\/([^?&]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
  const ytWatch = raw.match(/[?&]v=([^?&]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
  const vimeo = raw.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return raw;
}

interface VideoPreviewProps {
  rawUrl: string;
  duration: string;
  onUrlChange: (v: string) => void;
  onDurationChange: (v: string) => void;
}

const VideoPreview = ({ rawUrl, duration, onUrlChange, onDurationChange }: VideoPreviewProps) => {
  const [inputVal, setInputVal] = useState(rawUrl);
  const embedUrl = toEmbedUrl(rawUrl);

  const apply = () => onUrlChange(inputVal.trim());

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Aperçu de la Vidéo</h2>

      <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video shadow-xl shadow-slate-300/40">
        {embedUrl ? (
          <iframe
            key={embedUrl}
            src={embedUrl}
            title="Aperçu vidéo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
            <p className="text-white/50 text-xs font-medium">Saisissez une URL YouTube / Vimeo</p>
          </div>
        )}
        {duration && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm font-mono">
            {duration}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <FieldLabel>URL Source <span className="text-slate-400 normal-case font-normal">(YouTube / Vimeo)</span></FieldLabel>
        <div className="flex gap-2">
          <input
            type="url"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            placeholder="https://www.youtube.com/watch?v=… ou embed"
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          />
          <button onClick={apply} className="px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-sm">
            ▶ Lire
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel>Durée</FieldLabel>
        <div className="flex items-center gap-3">
          <input
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
            placeholder="12:35"
            className="w-28 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Format : MM:SS
          </span>
        </div>
      </div>
    </section>
  );
};

export default VideoPreview;