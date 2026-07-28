// src/components/recruteur/candidatures/CandidateCard.tsx
'use client';

import type { CandidatureRec } from '@/types/candidatures-rec.types';
import Avatar from '@/components/recruteur/Avatar';
import { timeAgoShort } from '@/utils/date';
import clsx from 'clsx';

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
        <Avatar name={c.candidatName} src={c.candidatAvatar} size={40} />
        {!c.isRead && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={clsx('text-sm truncate', !c.isRead ? 'font-bold text-gray-900' : 'font-semibold text-gray-800')}>
            {c.candidatName}
          </p>
          <span className="text-[10px] text-gray-400 flex-shrink-0">{timeAgoShort(c.receivedAt)}</span>
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
