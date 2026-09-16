// src/components/magazine/detail/SocialShareBtn.tsx
"use client";
import React from 'react';
import type { SharePlatform } from './magazineUtils';

interface SocialShareBtnProps {
  platform: SharePlatform;
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const SocialShareBtn = ({ label, icon, color, onClick }: SocialShareBtnProps) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-700 transition-all hover:shadow-md active:scale-95"
    style={{ background: "#fff" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "#F3F4F6"; e.currentTarget.style.color = "#374151"; }}
  >
    {icon} {label}
  </button>
);

export default SocialShareBtn;