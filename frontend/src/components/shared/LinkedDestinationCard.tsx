// src/components/shared/LinkedDestinationCard.tsx
"use client";
import React from 'react';
import Link from 'next/link';

interface LinkedDestinationCardProps {
  destination: { name: string; slug: string };
}

const LinkedDestinationCard = ({ destination }: LinkedDestinationCardProps) => (
  <div className="mt-6 p-5 bg-it-blue/5 rounded-2xl flex items-center justify-between">
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Destination liée</p>
      <p className="text-it-blue font-bold text-lg">{destination.name}</p>
    </div>
    <Link
      href={`/destinations/${destination.slug}`}
      className="bg-it-emerald-dark text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-it-terracotta transition-colors"
    >
      Découvrir
    </Link>
  </div>
);

export default LinkedDestinationCard;