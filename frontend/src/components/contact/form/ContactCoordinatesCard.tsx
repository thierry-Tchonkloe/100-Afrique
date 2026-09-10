// src/components/contact/form/ContactCoordinatesCard.tsx
"use client";
import React from 'react';
import { MissiveMark, RingMark, LocaleMark, WaveMark } from '@/components/icons/CustomIcons';

const COORDINATES = [
  { Icon: MissiveMark, label: 'Email',     value: 'contact@waxeho.com',  sub: null,             href: 'mailto:contact@waxeho.com' },
  { Icon: RingMark,    label: 'Téléphone', value: '+229 01 XX XX XX XX', sub: 'Lun-Ven 9h–18h', href: 'tel:+22901XXXXXXXX'         },
  { Icon: LocaleMark,  label: 'Adresse',   value: 'Cotonou, Bénin',      sub: null,             href: null                         },
];

const ContactCoordinatesCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
    <div className="flex flex-col md:flex-row">

      <div className="relative md:w-2/5 h-52 md:h-auto shrink-0 overflow-hidden">
        <img
          src="/images/service-client.jpg"
          alt="Notre équipe à votre service"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent to-white/20" />
        <div
          className="absolute bottom-4 left-4 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm"
          style={{ background: 'rgba(26,44,74,0.85)' }}
        >
          Disponible 24h/7j
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="px-7 pt-6 pb-4 border-b border-gray-100">
          <h3 className="font-bold text-xl tracking-wide" style={{ color: '#1A2B4A' }}>
            Coordonnées Directes
          </h3>
        </div>

        <div className="p-7 space-y-5 flex-1">
          {COORDINATES.map(({ Icon, label, value, sub, href }) => (
            <div key={label} className="flex gap-4 items-start">
              <div className="p-2.5 rounded-lg shrink-0" style={{ background: '#EAF3EE' }}>
                <Icon size={22} style={{ color: '#1A5C43' }} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                {href ? (
                  <a href={href} className="text-sm font-medium whitespace-pre-line leading-snug hover:underline" style={{ color: '#1A2B4A' }}>
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-medium whitespace-pre-line leading-snug" style={{ color: '#1A2B4A' }}>{value}</p>
                )}
                {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="px-7 pb-7">
          <a
            href="https://wa.me/22901XXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
            style={{ background: '#25D366' }}
          >
            <WaveMark size={20} />
            Discuter sur WhatsApp
          </a>
        </div>
      </div>

    </div>
  </div>
);

export default ContactCoordinatesCard;