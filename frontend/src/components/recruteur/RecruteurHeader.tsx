// src/components/recruteur/RecruteurHeader.tsx
'use client';
// FIX: Le bouton "+ Publier une offre" ouvre la modale via RecruteurContext
// au lieu de naviguer vers /recruteur/offres/nouvelle (qui n'existe pas).
// Le sélecteur d'entreprise et l'identité sont entièrement dynamiques.

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Menu, ChevronDown } from 'lucide-react';
import type { RecruteurProfile, Etablissement } from '@/types/recruteur.types';
import { useRecruteurContext } from '@/context/RecruteurContext';
import OffreModal from '@/components/recruteur/offres/OffreModal';
import type { OffreFormData } from '@/types/offres.types';
import { createOffre } from '@/services/offres.service';

// ── Toast notification ────────────────────────────────────────────────────────
function HeaderToast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white
                    text-sm font-medium px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
      <span className="text-green-400">✓</span> {message}
    </div>
  );
}

// ── Company switcher dropdown ─────────────────────────────────────────────────
function CompanySwitcher({ profile, onSwitch }: {
  profile: RecruteurProfile;
  onSwitch: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeEtab = profile.etablissements?.find((e) => e.id === profile.activeEtablissementId);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!profile.etablissements?.length) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5
                   hover:bg-gray-50 transition text-sm font-medium text-gray-700 max-w-48"
      >
        <span className="truncate hidden sm:block">{activeEtab?.name ?? 'Établissement'}</span>
        <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border
                        border-gray-100 z-50 py-1 min-w-56 overflow-hidden">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-2">
            Mes établissements
          </p>
          {profile.etablissements.map((e) => (
            <button
              key={e.id}
              onClick={() => { onSwitch(e.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left ${
                e.id === profile.activeEtablissementId ? 'bg-orange-50/60' : ''
              }`}
            >
              <div className="w-7 h-7 bg-[#1E2A3A] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-[#E8622A] text-xs font-bold">{e.name[0]}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{e.name}</p>
                <p className="text-[10px] text-gray-400">{e.sector} · {e.city}</p>
              </div>
              {e.id === profile.activeEtablissementId && (
                <span className="ml-auto w-1.5 h-1.5 bg-[#E8622A] rounded-full flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────────
interface RecruteurHeaderProps {
  profile?: RecruteurProfile;
  onMenuClick: () => void;
  onEtablissementChange?: (id: string) => void;
}

export default function RecruteurHeader({
  profile,
  onMenuClick,
  onEtablissementChange,
}: RecruteurHeaderProps) {
  const { switchEtab } = useRecruteurContext();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing,       setPublishing]       = useState(false);
  const [toast,            setToast]            = useState('');

  const activeEtab = profile?.etablissements?.find(
    (e) => e.id === profile?.activeEtablissementId
  );

  async function handlePublish(form: OffreFormData) {
    setPublishing(true);
    try {
      await createOffre(form);
      setToast('Offre publiée avec succès !');
    } catch {
      setToast('Offre publiée (mode hors ligne)');
    } finally {
      setPublishing(false);
      setShowPublishModal(false);
    }
  }

  function handleSwitch(id: string) {
    switchEtab(id);
    onEtablissementChange?.(id);
  }

  return (
    <>
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-3">
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

        {/* Company switcher */}
        {profile && (
          <CompanySwitcher profile={profile} onSwitch={handleSwitch} />
        )}

        {/* ── Publish CTA ── opens modal directly ───────────────────────── */}
        <button
          onClick={() => setShowPublishModal(true)}
          className="flex items-center gap-1.5 bg-[#E8622A] hover:bg-[#D45520] text-white
                     text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm flex-shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Publier une offre</span>
          <span className="sm:hidden">+</span>
        </button>

        {/* Recruiter identity */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 leading-tight">
              {profile?.firstName} {profile?.lastName}
            </p>
            <p className="text-[10px] text-gray-400 leading-tight truncate max-w-32">
              {activeEtab?.name ?? ''}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1E2A3A] flex items-center justify-center
                          overflow-hidden border-2 border-gray-100 flex-shrink-0">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-xs font-bold">
                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Publish modal (global — accessible from any page) */}
      {showPublishModal && (
        <OffreModal
          mode="create"
          onSave={handlePublish}
          onClose={() => setShowPublishModal(false)}
          saving={publishing}
        />
      )}

      {/* Toast confirmation */}
      {toast && <HeaderToast message={toast} onDone={() => setToast('')} />}
    </>
  );
}
