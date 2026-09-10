// src/components/magazine/detail/MagazineSidebarActions.tsx
"use client";
import React, { useState } from 'react';
import { Check, Copy, Download, Eye, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import type { Magazine } from '@/services/Dashboard/magazineService';
import MagazineImage from '@/components/shared/MagazineImage';
import SocialShareBtn from './SocialShareBtn';
import { getDownloadHref, type SharePlatform } from './magazineUtils';

interface MagazineSidebarActionsProps {
  magazine: Magazine;
  onOpenPreview: () => void;
}

const MagazineSidebarActions = ({ magazine, onOpenPreview }: MagazineSidebarActionsProps) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const downloadHref = getDownloadHref(magazine);

  const currentUrl = typeof window !== "undefined"
    ? window.location.href
    : `${process.env.NEXT_PUBLIC_SITE_URL || ""}/magazine/${magazine.slug || ""}`;

  const handleShare = (p: SharePlatform) => {
    const urls: Record<SharePlatform, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${magazine?.title || ""} ${currentUrl}`)}`,
    };
    window.open(urls[p], "_blank", "width=640,height=540");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <aside className="border-b border-gray-100 lg:border-b-0 lg:border-r p-6 md:p-8 lg:p-10" style={{ background: "#FAFBFC" }}>

      {/* Cover */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg mb-8">
        <MagazineImage src={magazine.coverImage} alt={magazine.title} className="h-auto w-full object-cover" />
      </div>

      {/* Boutons CTA principaux */}
      <div className="flex flex-col gap-3 mb-8">
        <button
          onClick={onOpenPreview}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:shadow-lg active:scale-95"
          style={{ background: "#1A5C43" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#B85C38")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1A5C43")}
        >
          <Eye size={16} /> Aperçu du magazine
        </button>
        {downloadHref && (
          <a
            href={downloadHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-md active:scale-95 border-2"
            style={{ borderColor: "#1A5C43", color: "#1A5C43" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1A5C43"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1A5C43"; }}
          >
            <Download size={16} /> Télécharger
          </a>
        )}
      </div>

      {/* Partage */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: "#0D1A10" }}>Partager</p>
        <div className="grid grid-cols-1 gap-2">
          <SocialShareBtn platform="facebook" label="Facebook" icon={<Facebook size={15} />} color="#1877F2" onClick={() => handleShare("facebook")} />
          <SocialShareBtn platform="linkedin" label="LinkedIn" icon={<Linkedin size={15} />} color="#0A66C2" onClick={() => handleShare("linkedin")} />
          <SocialShareBtn platform="whatsapp" label="WhatsApp" icon={<MessageCircle size={15} />} color="#25D366" onClick={() => handleShare("whatsapp")} />
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all active:scale-95"
            style={{
              borderColor: copySuccess ? "#1A5C43" : "#F3F4F6",
              color: copySuccess ? "#1A5C43" : "#374151",
              background: copySuccess ? "rgba(26,92,67,0.06)" : "#fff",
            }}
          >
            {copySuccess ? <Check size={15} /> : <Copy size={15} />}
            {copySuccess ? "Lien copié !" : "Copier le lien"}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default MagazineSidebarActions;