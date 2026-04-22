// src/components/emploi/CandidatSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  FolderOpen,
  Bell,
  Settings,
  LogOut,
  X,
  Briefcase,
} from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/candidat/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/candidat/profil', label: 'Mon Profil', icon: User },
  { href: '/candidat/candidatures', label: 'Mes Candidatures', icon: FolderOpen },
  { href: '/candidat/alertes', label: 'Mes Alertes Job', icon: Bell },
];

interface CandidatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CandidatSidebar({ isOpen, onClose }: CandidatSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-200 z-40',
          'flex flex-col pt-0 transition-transform duration-300',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link href="/emploi" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8622A] flex items-center justify-center">
              <Briefcase size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm text-gray-900">
              <span className="text-[#E8622A]">i</span>Tourisme Emploi
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => onClose()}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#FFF3EC] text-[#E8622A] border border-[#FDDCC8]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon
                  size={17}
                  className={isActive ? 'text-[#E8622A]' : 'text-gray-400'}
                />
                {label}
              </Link>
            );
          })}

          {/* Separator */}
          <div className="my-3 border-t border-gray-100" />

          <Link
            href="/candidat/parametres"
            onClick={() => onClose()}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              pathname === '/candidat/parametres'
                ? 'bg-[#FFF3EC] text-[#E8622A] border border-[#FDDCC8]'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Settings
              size={17}
              className={pathname === '/candidat/parametres' ? 'text-[#E8622A]' : 'text-gray-400'}
            />
            Paramètres
          </Link>

          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                       text-red-500 hover:bg-red-50 transition-colors"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('emploi_token');
                window.location.href = '/emploi';
              }
            }}
          >
            <LogOut size={17} />
            Déconnexion
          </button>
        </nav>
      </aside>
    </>
  );
}