// src/components/recruteur/RecruteurSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Building2, Inbox, LogOut, X, Briefcase } from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/recruteur/dashboard',      label: 'Tableau de bord',     icon: LayoutDashboard },
  { href: '/recruteur/offres',         label: 'Gérer mes offres',    icon: FileText },
  { href: '/recruteur/vitrine',        label: 'Ma Vitrine Entreprise', icon: Building2 },
  { href: '/recruteur/candidatures',   label: 'Candidatures reçues', icon: Inbox, badge: true },
];

interface RecruteurSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  newCandidaturesCount?: number;
}

export default function RecruteurSidebar({
  isOpen,
  onClose,
  newCandidaturesCount = 0,
}: RecruteurSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-200 z-40',
          'flex flex-col transition-transform duration-300',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link href="/emploi" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1E2A3A] flex items-center justify-center">
              <Briefcase size={14} className="text-[#E8622A]" />
            </div>
            <div>
              <span className="font-bold text-xs text-gray-900 block leading-tight">
                <span className="text-[#E8622A]">i</span>Tourisme Emploi
              </span>
              <span className="text-[9px] text-gray-400 uppercase tracking-wider">Espace Recruteur</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 rounded-md hover:bg-gray-100">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#FFF3EC] text-[#E8622A] border border-[#FDDCC8]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon size={17} className={isActive ? 'text-[#E8622A]' : 'text-gray-400'} />
                <span className="flex-1">{label}</span>
                {badge && newCandidaturesCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full
                                   flex items-center justify-center flex-shrink-0">
                    {newCandidaturesCount > 9 ? '9+' : newCandidaturesCount}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="my-3 border-t border-gray-100" />

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