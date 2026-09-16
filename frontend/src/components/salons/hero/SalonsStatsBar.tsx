// src/components/salons/hero/SalonsStatsBar.tsx
"use client";
import React from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useAnimatedCounter } from './useAnimatedCounter';
import type { Salon } from '@/lib/server-data';

interface StatItemProps {
  label: string;
  value: number;
  suffix: string;
  delay: number;
  visible: boolean;
}

function StatItem({ label, value, suffix, delay, visible }: StatItemProps) {
  const count = useAnimatedCounter(value, visible);
  return (
    <div
      className="flex flex-col items-center justify-center py-6 px-4 text-center transition-all duration-700"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)' }}
    >
      <p className="text-2xl md:text-3xl font-black" style={{ color: '#1A5C43' }}>
        {count.toLocaleString('fr-FR')}{suffix}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-gray-500">{label}</p>
    </div>
  );
}

const SalonsStatsBar = ({ salons }: { salons: Salon[] }) => {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);
  const totalEvents = salons.length;
  if (totalEvents === 0) return null;

  const countries = [...new Set(salons.map((s) => s.country).filter(Boolean))].length || 12;

  return (
    <div className="max-w-[1200px] mx-auto px-6 -mt-2 mb-10">
      <div
        ref={ref}
        className="grid grid-cols-3 gap-3 overflow-hidden rounded-2xl"
        style={{ background: 'rgba(26,92,67,0.06)', border: '1px solid rgba(26,92,67,0.1)' }}
      >
        <StatItem label="Événements"   value={totalEvents} suffix="+" delay={0}   visible={visible} />
        <StatItem label="Pays couverts" value={countries}   suffix=""  delay={100} visible={visible} />
        <StatItem label="Partenaires"   value={38}          suffix=""  delay={200} visible={visible} />
      </div>
    </div>
  );
};

export default SalonsStatsBar;