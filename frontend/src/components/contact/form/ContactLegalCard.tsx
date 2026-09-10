// src/components/contact/form/ContactLegalCard.tsx
"use client";
import React from 'react';
import { FileText, Shield, Cookie } from 'lucide-react';

const LEGAL_LINKS = [
  { Icon: FileText, label: 'Mentions Légales',             href: '/mentions-legales' },
  { Icon: Shield,   label: 'Politique de Confidentialité', href: '/confidentialite'  },
  { Icon: Cookie,   label: 'Gestion des Cookies',          href: '/cookies'          },
];

const ContactLegalCard = () => (
  <div className="rounded-2xl p-6 border" style={{ background: '#F8FAF9', borderColor: '#D1E8DC' }}>
    <h3 className="font-bold text-sm uppercase tracking-wide mb-4" style={{ color: '#1A5C43' }}>
      Informations Légales
    </h3>
    <ul className="space-y-3">
      {LEGAL_LINKS.map(({ Icon, label, href }) => (
        <li key={label}>
          <a
            href={href}
            className="flex items-center gap-3 group transition-colors"
            style={{ color: '#64748b' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1A5C43')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
          >
            <div className="p-2 rounded-lg shrink-0 transition-colors" style={{ background: '#EAF3EE' }}>
              <Icon size={14} style={{ color: '#1A5C43' }} />
            </div>
            <span className="text-sm font-medium">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default ContactLegalCard;