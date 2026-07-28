// src/components/candidat/dashboard/DashboardHeader.tsx
import Link from 'next/link';
import { Search } from 'lucide-react';
import { todayLabel } from '@/utils/date';

interface DashboardHeaderProps {
  firstName: string;
}

export default function DashboardHeader({ firstName }: DashboardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {firstName}&nbsp;! Ravi de vous revoir.
        </h1>
        <p className="text-sm text-gray-400 mt-1 capitalize">{todayLabel()}</p>
      </div>
      <Link
        href="/candidat/jobs"
        className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white
                   text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
      >
        <Search size={15} />
        Rechercher une offre
      </Link>
    </div>
  );
}