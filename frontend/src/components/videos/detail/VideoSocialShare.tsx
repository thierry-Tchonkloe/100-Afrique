// src/components/videos/detail/VideoSocialShare.tsx
"use client";
import React from 'react';
import {
  SocialFacette, SocialEnvol, SocialNoeud, WaveMark,
} from '@/components/icons/CustomIcons';

const SHARE_NETWORKS = [
  { key: 'facebook', bg: 'bg-[#3B5998]', Icon: SocialFacette, label: 'Facebook' },
  { key: 'twitter',  bg: 'bg-black',     Icon: SocialEnvol,   label: 'Twitter'  },
  { key: 'linkedin', bg: 'bg-[#0077B5]', Icon: SocialNoeud,   label: 'LinkedIn' },
  { key: 'whatsapp', bg: 'bg-[#25D366]', Icon: WaveMark,      label: 'WhatsApp' },
];

const VideoSocialShare = ({ title }: { title: string }) => {
  const handleShare = (platform: string) => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    };
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Partager :</span>
      <div className="flex gap-2">
        {SHARE_NETWORKS.map(({ key, bg, Icon, label }) => (
          <div key={key} className="relative group/social">
            <button
              onClick={() => handleShare(key)}
              className={`cursor-pointer p-2 ${bg} text-white rounded-full hover:opacity-80 transition-opacity`}
              aria-label={`Partager sur ${label}`}
            >
              <Icon size={24} />
            </button>
            <span
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-9 whitespace-nowrap
                         rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider
                         bg-it-emerald-dark text-white
                         opacity-0 scale-95 transition-all duration-200
                         group-hover/social:opacity-100 group-hover/social:scale-100"
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSocialShare;