'use client';
// src/components/emploi/public/EmploiFooter.tsx

import Link from 'next/link';

export default function EmploiFooter() {
  return (
    <footer className="bg-[#1E2A3A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-1 mb-3">
              <span className="text-xl font-bold text-white">i Tourisme</span>
              <span className="text-xl font-bold text-[#E8622A] ml-1">Emploi</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              La plateforme de référence pour les professionnels du tourisme et de l'hôtellerie.
            </p>
          </div>

          {/* Candidats */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Candidats</h3>
            <ul className="space-y-2">
              {[
                { label: 'Offres d\'emploi',  href: '/emploi/jobs'         },
                { label: 'Les entreprises',   href: '/emploi/entreprises'  },
                { label: 'Conseils carrière', href: '/emploi/conseils'     },
                { label: 'Mon espace',        href: '/candidat/dashboard'  },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recruteurs */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recruteurs</h3>
            <ul className="space-y-2">
              {[
                { label: 'Publier une offre',    href: '/recruteur/dashboard' },
                { label: 'Ma vitrine',           href: '/recruteur/vitrine'   },
                { label: 'Nos solutions',        href: '/emploi/recruteurs'   },
                { label: 'Créer un compte',      href: '/auth'  },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} i Tourisme Emploi — Tous droits réservés
          </p>
          <div className="flex items-center gap-4">
            <Link href="/mentions-legales" className="text-xs text-gray-500 hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-xs text-gray-500 hover:text-white transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}