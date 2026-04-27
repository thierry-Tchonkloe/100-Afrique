'use client';

import type { CandidatureRec } from '@/types/candidatures-rec.types';
import { STATUS_COLORS, STATUS_LABELS } from '@/types/candidatures-rec.types';
import clsx from 'clsx';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'il y a < 1h';
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

function Avatar({ name, src }: { name: string; src?: string }) {
  const initials = name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'];
  const color  = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center ${src ? '' : color}`}>
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover" />
        : <span className="text-white text-sm font-bold">{initials}</span>}
    </div>
  );
}

interface CandidateCardProps {
  candidature: CandidatureRec;
  isSelected: boolean;
  onClick: () => void;
}

export default function CandidateCard({ candidature: c, isSelected, onClick }: CandidateCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-gray-100 last:border-0',
        isSelected ? 'bg-orange-50/70' : 'hover:bg-gray-50/80'
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar name={c.candidatName} src={c.candidatAvatar} />
        {!c.isRead && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={clsx('text-sm truncate', !c.isRead ? 'font-bold text-gray-900' : 'font-semibold text-gray-800')}>
            {c.candidatName}
          </p>
          <span className="text-[10px] text-gray-400 flex-shrink-0">{timeAgo(c.receivedAt)}</span>
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">{c.candidatTitle}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">
            {c.matchScore}% match
          </span>
          <span className="text-[10px] text-gray-400 truncate">Pour : {c.offerTitle}</span>
        </div>
      </div>
    </div>
  );
}