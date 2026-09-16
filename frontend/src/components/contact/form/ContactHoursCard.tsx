// src/components/contact/form/ContactHoursCard.tsx
"use client";
import React from 'react';

const HOURS = [
  { days: 'Lundi – Vendredi', hours: '9h00 – 18h00'  },
  { days: 'Samedi',           hours: '10h00 – 14h00' },
  { days: 'Dimanche',         hours: 'Fermé'         },
];

const ContactHoursCard = () => (
  <div className="rounded-2xl p-6 border" style={{ background: '#F8FAF9', borderColor: '#D1E8DC' }}>
    <h3 className="font-bold text-sm uppercase tracking-wide mb-4" style={{ color: '#1A5C43' }}>
      Horaires d&apos;ouverture
    </h3>
    <ul className="space-y-2 text-sm">
      {HOURS.map(({ days, hours }) => (
        <li key={days} className="flex justify-between items-center">
          <span className="text-slate-600">{days}</span>
          <span
            className="font-semibold text-xs px-2.5 py-1 rounded-full"
            style={{
              background: hours === 'Fermé' ? '#FEE2E2' : '#EAF3EE',
              color:      hours === 'Fermé' ? '#DC2626' : '#1A5C43',
            }}
          >
            {hours}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default ContactHoursCard;