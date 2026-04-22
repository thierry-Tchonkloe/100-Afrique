// src/components/emploi/CandidatHeader.tsx
'use client';

import Link from 'next/link';
import { Bell, ChevronLeft, Menu, User } from 'lucide-react';
import type { CandidatProfile, CandidatNotification } from '@/types/emploi.types';

interface CandidatHeaderProps {
  profile?: CandidatProfile;
  notifications?: CandidatNotification[];
  onMenuClick: () => void;
}

export default function CandidatHeader({
  profile,
  notifications = [],
  onMenuClick,
}: CandidatHeaderProps) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-md hover:bg-gray-100"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      {/* Back link */}
      <Link
        href="/"
        className="hidden lg:flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ChevronLeft size={14} />
        Retour au Mag | 100% Afrique
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notifications */}
      <div className="relative">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-600" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      </div>

      {/* Mini profile */}
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="w-8 h-8 rounded-full bg-[#E8622A] flex items-center justify-center overflow-hidden">
          {profile?.avatar ? (
            <img src={profile.avatar} alt={profile.firstName} className="w-full h-full object-cover" />
          ) : (
            <User size={16} className="text-white" />
          )}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {profile?.firstName ?? 'Candidat'}
        </span>
      </div>
    </header>
  );
}