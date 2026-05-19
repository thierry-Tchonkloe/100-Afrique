'use client';
// src/components/emploi/public/EmploiHeader.tsx

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, User, ChevronDown, Briefcase, LayoutDashboard, LogOut } from 'lucide-react';

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) cb(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [ref, cb]);
}

function AccountDropdown({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('emploi_token');
    localStorage.removeItem('emploi_user');
    onClose();
    router.push('/emploi');
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('emploi_token') : null;
  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('emploi_user') : null;
  const user = userRaw ? JSON.parse(userRaw) : null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl
                 border border-gray-100 z-50 overflow-hidden py-1"
    >
      {token && user ? (
        <>
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs text-gray-400">Connecté en tant que</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{user.firstName} {user.lastName}</p>
          </div>
          {user.role === 'CANDIDAT' ? (
            <Link href="/candidat/dashboard" onClick={onClose}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
              <User size={15} className="text-[#E8622A]" /> Espace Candidat
            </Link>
          ) : (
            <Link href="/recruteur/dashboard" onClick={onClose}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
              <LayoutDashboard size={15} className="text-[#E8622A]" /> Espace Recruteur
            </Link>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition border-t border-gray-50">
            <LogOut size={15} /> Déconnexion
          </button>
        </>
      ) : (
        <>
          <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Je suis…</p>
          <Link href="/auth" onClick={onClose}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
            <User size={15} className="text-[#E8622A]" /> Candidat — Mon espace
          </Link>
          <Link href="/auth" onClick={onClose}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
            <Briefcase size={15} className="text-[#E8622A]" /> Recruteur — Mon espace
          </Link>
        </>
      )}
    </div>
  );
}

export default function EmploiHeader() {
  const [showAccount, setShowAccount] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="bg-[#1E2A3A] h-8 flex items-center px-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition group"
        >
          <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Retour au Mag i Tourisme Nomade
        </Link>
      </div>

      {/* ── Main header ─────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 bg-white transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : 'border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">

          {/* Logo */}
          <Link href="/emploi" className="flex items-center gap-0 flex-shrink-0">
            <span className="text-xl font-bold text-[#1E2A3A] tracking-tight">
              i Tourisme{' '}
            </span>
            <span className="text-xl font-bold text-[#E8622A] tracking-tight ml-1">Emploi</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
            <Link href="/emploi/jobs"
              className="text-sm font-medium text-gray-600 hover:text-[#E8622A] transition-colors">
              Trouver un Job
            </Link>
            <Link href="/emploi/entreprises"
              className="text-sm font-medium text-gray-600 hover:text-[#E8622A] transition-colors">
              Découvrir les Entreprises
            </Link>
            <Link href="/emploi/conseils"
              className="text-sm font-medium text-gray-600 hover:text-[#E8622A] transition-colors">
              Conseils Carrière
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
            <Link
              href="/auth"
              className="hidden sm:inline-flex items-center gap-1.5 border-2 border-[#E8622A] text-[#E8622A]
                         text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#E8622A] hover:text-white
                         transition-all duration-200"
            >
              Recruter
            </Link>

            {/* Account dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAccount((v) => !v)}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700
                           text-sm font-medium px-3 py-2 rounded-xl transition-colors"
              >
                <User size={16} />
                <ChevronDown size={13} className={`transition-transform ${showAccount ? 'rotate-180' : ''}`} />
              </button>
              {showAccount && <AccountDropdown onClose={() => setShowAccount(false)} />}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}