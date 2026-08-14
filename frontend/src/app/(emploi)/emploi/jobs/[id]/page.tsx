'use client';
// src/app/(emploi)/emploi/jobs/[id]/page.tsx

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, ChevronRight, Layers, Users, Star, CheckCircle2 } from 'lucide-react';
import { useJobDetail } from '@/hooks/useJobDetail';
import JobDetailSkeleton from '@/components/emploi/job-detail/JobDetailSkeleton';
import JobHeaderCard from '@/components/emploi/job-detail/JobHeaderCard';
import SectionCard from '@/components/emploi/job-detail/SectionCard';
import JobSkillsSection from '@/components/emploi/job-detail/JobSkillsSection';
import JobInfoSidebar from '@/components/emploi/job-detail/JobInfoSidebar';
import JobApplyButton from '@/components/emploi/job-detail/JobApplyButton';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { job, similar, loading, error } = useJobDetail(id);

  if (loading) return <JobDetailSkeleton />;

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase size={24} className="text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700">Offre introuvable</p>
          <p className="text-sm text-gray-400 mt-1">Cette offre n&apos;existe pas ou a été supprimée.</p>
          <button
            onClick={() => router.push('/emploi/jobs')}
            className="mt-4 text-sm text-[#E8622A] font-semibold hover:underline"
          >
            ← Voir toutes les offres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/emploi" className="hover:text-[#E8622A] transition-colors">Accueil</Link>
          <ChevronRight size={12} />
          <Link href="/emploi/jobs" className="hover:text-[#E8622A] transition-colors">Offres d&apos;emploi</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 truncate max-w-[200px]">{job.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-4">
            <JobHeaderCard job={job} />

            {job.missions && (
              <SectionCard icon={<Layers size={15} />} title="Vos missions">
                <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                  {job.missions.split('\n').filter(Boolean).map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </SectionCard>
            )}

            {job.profileDesc && (
              <SectionCard icon={<Users size={15} />} title="Profil recherché">
                <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
                  {job.profileDesc.split('\n').filter(Boolean).map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </SectionCard>
            )}

            <JobSkillsSection job={job} />

            {job.advantages && (
              <SectionCard icon={<Star size={15} />} title="Ce que nous offrons">
                <div className="space-y-2">
                  {job.advantages.split('\n').filter(Boolean).map((line, i) => (
                    <p key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{line}</span>
                    </p>
                  ))}
                </div>
              </SectionCard>
            )}

            <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-5">
              <JobApplyButton jobId={String(id)} />
            </div>
          </div>

          <JobInfoSidebar jobId={String(id)} job={job} similar={similar} />
        </div>
      </div>
    </div>
  );
}
