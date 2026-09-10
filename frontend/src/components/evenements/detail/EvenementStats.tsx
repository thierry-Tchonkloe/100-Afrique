// src/components/evenements/detail/EvenementStats.tsx
"use client";
import React from 'react';
import { Clock, Building2, Users, Eye } from 'lucide-react';
import type { Evenement } from './useEvenementDetail';

function StatCard({ icon: Icon, label, value, delay = 0, visible }: {
  icon: React.ElementType; label: string; value: string | number; delay?: number; visible: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl p-5 text-center gap-2 transition-all duration-700"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1A5C43' }}>
        <Icon size={18} style={{ color: '#C8A84B' }} />
      </div>
      <span className="text-2xl font-black text-white">{value}</span>
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
    </div>
  );
}

interface EvenementStatsProps {
  evenement: Evenement;
  durationDays: number | null;
  visible: boolean;
}

const EvenementStats = ({ evenement, durationDays, visible }: EvenementStatsProps) => {
  const hasStats = durationDays || evenement.exhibitorCount || evenement.visitorCount || evenement.views > 0;
  if (!hasStats) return null;

  return (
    <>
      <div className="py-10" style={{ background: '#0D2B1A' }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {durationDays && <StatCard icon={Clock} label="Jours" value={durationDays} delay={0} visible={visible} />}
          {evenement.exhibitorCount && <StatCard icon={Building2} label="Exposants" value={evenement.exhibitorCount.toLocaleString('fr-FR')} delay={80} visible={visible} />}
          {evenement.visitorCount && <StatCard icon={Users} label="Visiteurs" value={evenement.visitorCount.toLocaleString('fr-FR')} delay={160} visible={visible} />}
          {evenement.views > 0 && <StatCard icon={Eye} label="Lectures" value={evenement.views.toLocaleString('fr-FR')} delay={240} visible={visible} />}
        </div>
      </div>

      {/* Transition vers le blanc */}
      <div style={{ height: 48, background: 'linear-gradient(to bottom, #0D2B1A, #fff)' }} />
    </>
  );
};

export default EvenementStats;