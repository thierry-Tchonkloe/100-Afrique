'use client';
// src/components/emploi/CandidatHeader.tsx

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ChevronLeft, Menu, User, LogOut, Settings, CheckCheck } from 'lucide-react';
import type { CandidatProfile, CandidatNotification } from '@/types/emploi.types';
import { markAllNotificationsRead, markNotificationRead } from '@/services/emploi.service';

// ── Notification type icon colors ─────────────────────────────────────────────
const NOTIF_COLORS: Record<string, string> = {
  new_offer:            'bg-[#FFF3EC] text-[#E8622A]',
  profile_viewed:       'bg-blue-50 text-blue-500',
  application_accepted: 'bg-green-50 text-green-500',
  application_refused:  'bg-red-50 text-red-500',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `il y a ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

// ── Notification Panel ────────────────────────────────────────────────────────
interface NotifPanelProps {
  notifications: CandidatNotification[];
  onRead: (id: string) => void;
  onReadAll: () => void;
  onClose: () => void;
}

function NotificationPanel({ notifications, onRead, onReadAll, onClose }: NotifPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-sm">Notifications</span>
          {unread > 0 && (
            <span className="bg-[#E8622A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={onReadAll}
            className="flex items-center gap-1 text-xs text-[#E8622A] font-medium hover:underline"
          >
            <CheckCheck size={12} /> Tout lire
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Aucune notification</p>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => { onRead(n.id); onClose(); }}
              className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition text-left ${
                !n.read ? 'bg-orange-50/30' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                NOTIF_COLORS[n.type] ?? 'bg-gray-100 text-gray-500'
              }`}>
                <Bell size={13} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs leading-tight ${!n.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                  {n.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{n.description}</p>
                <p className="text-[10px] text-gray-300 mt-0.5">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 bg-[#E8622A] rounded-full flex-shrink-0 mt-1.5" />
              )}
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100">
        <Link
          href="/candidat/notifications"
          onClick={onClose}
          className="text-xs text-[#E8622A] font-medium hover:underline"
        >
          Voir toutes les notifications →
        </Link>
      </div>
    </div>
  );
}

// ── Profile Dropdown ──────────────────────────────────────────────────────────
interface ProfileDropdownProps {
  profile: CandidatProfile;
  onClose: () => void;
}

function ProfileDropdown({ profile, onClose }: ProfileDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('emploi_token');
      window.location.href = '/emploi';
    }
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
    >
      {/* Identity */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-800">
          {profile.firstName} {profile.lastName ?? ''}
        </p>
        <p className="text-xs text-gray-400 truncate">{profile.email ?? 'Candidat'}</p>
      </div>

      {/* Actions */}
      <div className="py-1">
        <Link
          href="/candidat/profil"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          <User size={15} className="text-gray-400" />
          Mon Profil
        </Link>
        <Link
          href="/candidat/parametres"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          <Settings size={15} className="text-gray-400" />
          Paramètres
        </Link>
      </div>

      <div className="border-t border-gray-100 py-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={15} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────────

interface CandidatHeaderProps {
  profile?: CandidatProfile;
  notifications?: CandidatNotification[];
  onMenuClick: () => void;
  onNotificationsChange?: (notifs: CandidatNotification[]) => void;
}

export default function CandidatHeader({
  profile,
  notifications = [],
  onMenuClick,
  onNotificationsChange,
}: CandidatHeaderProps) {
  const [showNotifs, setShowNotifs]   = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;

  async function handleRead(id: string) {
    try { await markNotificationRead(id); } catch {}
    onNotificationsChange?.(
      notifications.map((n) => n.id === id ? { ...n, read: true } : n)
    );
  }

  async function handleReadAll() {
    try { await markAllNotificationsRead(); } catch {}
    onNotificationsChange?.(notifications.map((n) => ({ ...n, read: true })));
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-4">
      {/* Mobile hamburger */}
      <button onClick={onMenuClick} className="lg:hidden p-1.5 rounded-md hover:bg-gray-100">
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

      <div className="flex-1" />

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setShowNotifs((v) => !v); setShowProfile(false); }}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Bell size={18} className="text-gray-600" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white
                             text-[9px] font-bold flex items-center justify-center leading-none">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {showNotifs && (
          <NotificationPanel
            notifications={notifications}
            onRead={handleRead}
            onReadAll={handleReadAll}
            onClose={() => setShowNotifs(false)}
          />
        )}
      </div>

      {/* Mini profile */}
      <div className="relative">
        <button
          onClick={() => { setShowProfile((v) => !v); setShowNotifs(false); }}
          className="flex items-center gap-2 cursor-pointer group"
        >
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
        </button>

        {showProfile && profile && (
          <ProfileDropdown
            profile={profile}
            onClose={() => setShowProfile(false)}
          />
        )}
      </div>
    </header>
  );
}























// // src/components/emploi/CandidatHeader.tsx
// 'use client';

// import Link from 'next/link';
// import { Bell, ChevronLeft, Menu, User } from 'lucide-react';
// import type { CandidatProfile, CandidatNotification } from '@/types/emploi.types';

// interface CandidatHeaderProps {
//   profile?: CandidatProfile;
//   notifications?: CandidatNotification[];
//   onMenuClick: () => void;
// }

// export default function CandidatHeader({
//   profile,
//   notifications = [],
//   onMenuClick,
// }: CandidatHeaderProps) {
//   const unread = notifications.filter((n) => !n.read).length;

//   return (
//     <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-4">
//       {/* Mobile hamburger */}
//       <button
//         onClick={onMenuClick}
//         className="lg:hidden p-1.5 rounded-md hover:bg-gray-100"
//       >
//         <Menu size={20} className="text-gray-600" />
//       </button>

//       {/* Back link */}
//       <Link
//         href="/"
//         className="hidden lg:flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
//       >
//         <ChevronLeft size={14} />
//         Retour au Mag | 100% Afrique
//       </Link>

//       {/* Spacer */}
//       <div className="flex-1" />

//       {/* Notifications */}
//       <div className="relative">
//         <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
//           <Bell size={18} className="text-gray-600" />
//           {unread > 0 && (
//             <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
//               {unread > 9 ? '9+' : unread}
//             </span>
//           )}
//         </button>
//       </div>

//       {/* Mini profile */}
//       <div className="flex items-center gap-2 cursor-pointer group">
//         <div className="w-8 h-8 rounded-full bg-[#E8622A] flex items-center justify-center overflow-hidden">
//           {profile?.avatar ? (
//             <img src={profile.avatar} alt={profile.firstName} className="w-full h-full object-cover" />
//           ) : (
//             <User size={16} className="text-white" />
//           )}
//         </div>
//         <span className="text-sm font-medium text-gray-700 hidden sm:block">
//           {profile?.firstName ?? 'Candidat'}
//         </span>
//       </div>
//     </header>
//   );
// }