// src/components/magazine/detail/PreviewModal.tsx
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Globe, X, Loader2 } from 'lucide-react';
import type { Magazine } from '@/services/Dashboard/magazineService';
import { getEmbedPreviewUrl, isDomainBlocked } from './magazineUtils';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  magazine: Magazine | null;
}

const PreviewModal = ({ isOpen, onClose, magazine }: PreviewModalProps) => {
  type St = "loading" | "loaded" | "blocked";
  const [state, setState] = useState<St>("loading");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setState("loading");
    timer.current = setTimeout(() => setState((s) => s === "loading" ? "blocked" : s), 8000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [isOpen, magazine?.slug]);

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  if (!isOpen || !magazine) return null;

  const previewUrl  = getEmbedPreviewUrl(magazine);
  const externalUrl = magazine.readOnlineUrl || magazine.url;
  const canTryEmbed = !!previewUrl && !isDomainBlocked(previewUrl);

  const Fallback = () => (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center rounded-2xl" style={{ background: "#F7F9F8" }}>
      <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl mb-6" style={{ background: "rgba(26,92,67,0.08)" }}>
        <Globe size={36} style={{ color: "#1A5C43", opacity: 0.4 }} />
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#B85C38" }}>
          <X size={13} className="text-white" strokeWidth={3} />
        </div>
      </div>
      <h3 className="text-xl font-black mb-3" style={{ color: "#0D1A10" }}>Aperçu non disponible</h3>
      <p className="text-sm leading-relaxed text-gray-500 max-w-sm mb-8">
        La source <strong style={{ color: "#0D1A10" }}>{magazine.source}</strong> n&apos;autorise pas
        l&apos;affichage intégré. Consultez le contenu directement sur le site d&apos;origine.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <a
          href={externalUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white transition-all"
          style={{ background: "#1A5C43" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#B85C38")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1A5C43")}
        >
          <ExternalLink size={14} /> Ouvrir sur {magazine.source}
        </a>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-gray-600 border border-gray-200 hover:border-gray-400 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(13,43,26,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between px-6 py-4 md:px-8 border-b border-gray-100">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: "#B85C38" }}>Aperçu du magazine</p>
            <h2 className="mt-0.5 line-clamp-1 text-lg font-black" style={{ color: "#0D1A10" }}>{magazine.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:border-[#1A5C43] hover:text-[#1A5C43] transition-colors"
            >
              <ExternalLink size={12} /> Ouvrir
            </a>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="relative flex-1 p-3 md:p-4" style={{ background: "#F7F9F8" }}>
          {!canTryEmbed ? <Fallback /> : (
            <>
              {state === "loading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 rounded-2xl" style={{ background: "#F7F9F8" }}>
                  <Loader2 className="animate-spin" size={32} style={{ color: "#1A5C43" }} />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Chargement de l&apos;aperçu…</p>
                </div>
              )}
              {state === "blocked" ? <Fallback /> : (
                <iframe
                  src={previewUrl}
                  title={`Aperçu ${magazine.title}`}
                  className="h-full min-h-[60vh] w-full rounded-2xl border-0 bg-white"
                  allow="fullscreen"
                  loading="lazy"
                  onLoad={() => { if (timer.current) clearTimeout(timer.current); setState("loaded"); }}
                  onError={() => { if (timer.current) clearTimeout(timer.current); setState("blocked"); }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;