// src/components/candidat/dashboard/ProfileStrengthCard.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProfileStrengthRing from './ProfileStrengthRing';

interface ProfileStrengthCardProps {
  percentage: number;
  message?: string;
}

export default function ProfileStrengthCard({ percentage, message }: ProfileStrengthCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-5">
      <ProfileStrengthRing percentage={percentage} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">Force de votre profil</p>
        <p className="text-xs text-gray-500 mt-0.5">{message}</p>
      </div>
      <Link
        href="/candidat/profil"
        className="flex-shrink-0 text-sm font-semibold text-[#E8622A] hover:underline flex items-center gap-1"
      >
        Compléter mon profil <ArrowRight size={14} />
      </Link>
    </div>
  );
}