// src/components/shared/Footer.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import {
  SocialFacette, SocialEnvol, SocialNoeud, SocialEcran, SocialObjectif,
  MissiveMark, RingMark, LocaleMark,
} from '@/components/icons/CustomIcons';
import NewsletterButton from '@/components/shared/Newsletterbutton';

const SECTEURS = [
  { label: 'Hôtellerie',         slug: 'hotellerie'       },
  { label: 'Transport',          slug: 'transport'        },
  { label: 'Restauration',       slug: 'restauration'     },
  { label: "Voyages d'Affaires", slug: 'voyages-affaires' },
  { label: 'MICE & Événements',  slug: 'mice-evenements'  },
  { label: 'Divertissement',     slug: 'divertissement'   },
  { label: 'Tourisme Durable',   slug: 'tourisme-durable' },
];

// Chaque icône est maintenant associée à un nom de réseau, affiché en tooltip au survol
const SOCIAL_ICONS = [
  { Icon: SocialFacette,  label: 'Facebook'  },
  { Icon: SocialEnvol,    label: 'Twitter'   },
  { Icon: SocialNoeud,    label: 'LinkedIn'  },
  { Icon: SocialObjectif, label: 'Instagram' },
  { Icon: SocialEcran,    label: 'YouTube' },
];

const Footer = () => {
  return (
    <footer className="w-full pt-16 pb-8" style={{ backgroundColor: '#1A5C43', color: '#ffffff' }}>
      <div className="max-w-[1400px] mx-auto px-6">

        {/* --- ZONE PRINCIPALE (GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Colonne 1 : À Propos & Réseaux */}
          <div className="space-y-6">
            <p className="text-sm leading-relaxed" style={{ color: '#D4EDE5' }}>
              Le média de référence dédié au tourisme international et africain.
              Une plateforme interactive pour les professionnels et passionnés du secteur.
            </p>
            <div className="flex gap-4">
              {SOCIAL_ICONS.map(({ Icon, label }, i) => (
                <div key={i} className="relative group">
                  <Icon
                    size={30}
                    className="cursor-pointer transition-colors"
                    style={{ color: '#D4EDE5' }}
                    aria-label={label}
                    onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#D4EDE5')}
                  />
                  {/* Tooltip affiché au survol */}
                  <span
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-9 whitespace-nowrap
                               rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider
                               opacity-0 scale-95 transition-all duration-200
                               group-hover:opacity-100 group-hover:scale-100"
                    style={{ background: '#0D1A10', color: '#C8A84B' }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne 2 : Plan du Site */}
          <div>
            <h4
              className="font-bold text-lg mb-6 uppercase tracking-wider"
              style={{ color: '#C8A84B' }}
            >
              Plan du Site
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: '#D4EDE5' }}>
              {[
                { href: '/actualites',  label: 'Actualités du Tourisme'       },
                { href: '/evenements',  label: 'Salons & Événements'           },
                { href: '/partenaires', label: 'Partenaires & Annonceurs'      },
                { href: '/destinations',label: 'Destinations Afrique & Monde' },
                { href: '/videos',      label: 'Vidéos / Web TV'               },
                { href: '/offres',      label: 'Nos offres'                    },
                { href: '/a-propos',    label: 'À propos'                      },
                { href: '/contact',     label: 'Contact'                       },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition-colors"
                    style={{ color: '#D4EDE5' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#D4EDE5')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/emploi"
                  className="font-bold transition-colors"
                  style={{ color: '#C8A84B' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#C8A84B')}
                >
                  Espace EMPLOI
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Secteurs */}
          <div>
            <h4
              className="font-bold text-lg mb-6 uppercase tracking-wider"
              style={{ color: '#C8A84B' }}
            >
              Secteurs
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: '#D4EDE5' }}>
              {SECTEURS.map(({ label, slug }) => (
                <li key={slug}>
                  <Link
                    href={`/secteurs/${slug}`}
                    className="transition-colors"
                    style={{ color: '#D4EDE5' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#D4EDE5')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h4
              className="font-bold text-lg mb-6 uppercase tracking-wider"
              style={{ color: '#C8A84B' }}
            >
              Contact
            </h4>
            <ul className="space-y-4 text-sm mb-6" style={{ color: '#D4EDE5' }}>
              <li className="flex items-start gap-3">
                <LocaleMark size={28} className="shrink-0" style={{ color: '#C8A84B' }} />
                <span>Siège Social, Quartier International,<br />Cotonou, Bénin</span>
              </li>
              <li className="flex items-center gap-3">
                <a href="tel:+229 01 97 44 80 97" className="flex items-center gap-3">
                  <RingMark size={26} className="shrink-0" style={{ color: '#C8A84B' }} />
                  <span>+229 01 97 44 80 97</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <a href="mailto:contact@100-afrique.com" className="flex items-center gap-3">
                  <MissiveMark size={26} className="shrink-0" style={{ color: '#C8A84B' }} />
                  <span>contact@100-afrique.com</span>
                </a>
              </li>
            </ul>

            {/* Newsletter — déplacée depuis le Header */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#C8A84B' }}>
                Restez informé
              </p>
              <NewsletterButton />
            </div>
          </div>

        </div>

        {/* --- BARRE DE COPYRIGHT --- */}
        <div
          className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs"
          style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#D4EDE5' }}
        >
          <p>© {new Date().getFullYear()} 100% Afrique. Tous droits réservés.</p>
          <div className="flex gap-6">
            {[
              { href: '/mentions-legales', label: 'Mentions Légales'              },
              { href: '/confidentialite',  label: 'Politique de Confidentialité' },
              { href: '/cookies',          label: 'Gestion des Cookies'           },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{ color: '#D4EDE5' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#D4EDE5')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
