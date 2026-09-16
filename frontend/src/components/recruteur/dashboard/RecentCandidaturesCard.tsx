'use client';
// src/components/recruteur/dashboard/RecentCandidaturesCard.tsx
import Link from 'next/link';
import { Eye, Star, ArrowRight } from 'lucide-react';
import Avatar from '@/components/recruteur/Avatar';
import { timeAgoShort } from '@/utils/date';

interface RecentCandidature {
  id: string;
  candidatName: string;
  candidatAvatar?: string;
  jobTitle: string;
  receivedAt: string;
  starred: boolean;
}

export default function RecentCandidaturesCard({
  candidatures, onToggleStar,
}: {
  candidatures: RecentCandidature[];
  onToggleStar: (id: string, current: boolean) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h2 className="font-semibold text-gray-800 text-sm">Candidatures récentes</h2>
        <Link href="/recruteur/candidatures" className="text-xs font-semibold text-[#E8622A] hover:underline flex items-center gap-1">
          Voir toutes <ArrowRight size={12} />
        </Link>
      </div>

      {candidatures.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <p className="text-sm text-gray-400">Aucune candidature reçue pour le moment.</p>
          <Link href="/recruteur/offres" className="mt-3 text-xs font-semibold text-[#E8622A] hover:underline">
            Publier une offre →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {candidatures.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition">
              <Avatar name={c.candidatName} src={c.candidatAvatar} size={36} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{c.candidatName}</p>
                <p className="text-xs text-gray-400">{c.jobTitle} · {timeAgoShort(c.receivedAt)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href="/recruteur/candidatures" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition" title="Voir les candidatures">
                  <Eye size={16} />
                </Link>
                <button onClick={() => onToggleStar(c.id, c.starred)}
                  className={`p-1.5 rounded-lg transition ${c.starred ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'}`}
                  title={c.starred ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                  <Star size={16} fill={c.starred ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
