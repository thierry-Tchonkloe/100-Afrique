// src/components/evenements/detail/EventPracticalInfo.tsx
"use client";
import React from 'react';
import { Calendar, MapPin, Globe, ExternalLink } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import DateRange from '@/components/shared/DateRange';
import type { Evenement } from './useEvenementDetail';

const EventPracticalInfo = ({ evenement }: { evenement: Evenement }) => {
  const { ref, visible } = useReveal<HTMLDivElement>(0.1);
  const hasInfo = evenement.startDate || evenement.location || evenement.website;
  if (!hasInfo) return null;

  return (
    <div
      ref={ref}
      className="mb-12 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 transition-all duration-700"
      style={{
        background: 'rgba(26,92,67,0.04)',
        border: '1px solid rgba(26,92,67,0.1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
      }}
    >
      <h3 className="md:col-span-2 text-[10px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: '#B85C38' }}>
        Informations pratiques
      </h3>

      {evenement.startDate && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#1A5C43' }}>
            <Calendar size={14} style={{ color: '#C8A84B' }} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Date{evenement.endDate ? 's' : ''}</p>
            <p className="font-semibold text-sm" style={{ color: '#0D1A10' }}>
              <DateRange startDate={evenement.startDate} endDate={evenement.endDate} />
            </p>
          </div>
        </div>
      )}

      {evenement.location && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#1A5C43' }}>
            <MapPin size={14} style={{ color: '#C8A84B' }} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Lieu</p>
            <p className="font-semibold text-sm" style={{ color: '#0D1A10' }}>
              {evenement.location}{evenement.city && `, ${evenement.city}`}{evenement.country && ` — ${evenement.country}`}
            </p>
          </div>
        </div>
      )}

      {evenement.website && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#B85C38' }}>
            <Globe size={14} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Site officiel</p>
            <a
              href={evenement.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm flex items-center gap-1 transition-colors"
              style={{ color: '#1A5C43' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#B85C38')}
              onMouseLeave={e => (e.currentTarget.style.color = '#1A5C43')}
            >
              {evenement.website.replace(/^https?:\/\//, '')} <ExternalLink size={11} />
            </a>
          </div>
        </div>
      )}

      {evenement.website && (
        <div className="md:col-span-2">
          <a
            href={evenement.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:shadow-lg active:scale-95"
            style={{ background: '#1A5C43' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
          >
            <ExternalLink size={14} /> Visiter le site officiel
          </a>
        </div>
      )}
    </div>
  );
};

export default EventPracticalInfo;