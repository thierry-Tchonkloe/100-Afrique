// src/components/evenements/detail/EventDestinationCard.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface EventDestinationCardProps {
  destination: { name: string; slug: string };
}

const EventDestinationCard = ({ destination }: EventDestinationCardProps) => (
  <div
    className="mt-8 p-6 rounded-2xl flex items-center justify-between gap-4"
    style={{
      background: 'linear-gradient(135deg, rgba(26,92,67,0.05) 0%, rgba(200,168,75,0.05) 100%)',
      border: '1px solid rgba(26,92,67,0.1)',
    }}
  >
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: '#B85C38' }}>Destination liée</p>
      <p className="font-bold text-lg" style={{ color: '#0D1A10' }}>{destination.name}</p>
    </div>
    <Link
      href={`/destinations/${destination.slug}`}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all shrink-0 hover:shadow-lg active:scale-95"
      style={{ background: '#1A5C43' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
      onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
    >
      Découvrir <ArrowRight size={13} />
    </Link>
  </div>
);

export default EventDestinationCard;