// src/components/emploi/job-detail/JobSkillsSection.tsx
import { CheckCircle2, Globe, Monitor, BookOpen } from 'lucide-react';
import SectionCard from './SectionCard';
import type { JobDetail } from '@/hooks/useJobDetail';

export default function JobSkillsSection({ job }: { job: JobDetail }) {
  if (!(job.requiredSkills?.length || job.requiredLangs?.length || job.requiredSoftwares?.length)) return null;

  return (
    <SectionCard icon={<BookOpen size={15} />} title="Compétences requises">
      <div className="space-y-4">
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Compétences</p>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((s) => (
                <span key={s} className="flex items-center gap-1 text-xs bg-[#1E2A3A]/5 text-[#1E2A3A]
                                          px-3 py-1.5 rounded-full border border-[#1E2A3A]/10">
                  <CheckCircle2 size={11} className="text-[#E8622A]" /> {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {job.requiredLangs && job.requiredLangs.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Langues</p>
            <div className="flex flex-wrap gap-2">
              {job.requiredLangs.map((l) => (
                <span key={l} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700
                                          px-3 py-1.5 rounded-full border border-blue-100">
                  <Globe size={11} /> {l}
                </span>
              ))}
            </div>
          </div>
        )}
        {job.requiredSoftwares && job.requiredSoftwares.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Logiciels</p>
            <div className="flex flex-wrap gap-2">
              {job.requiredSoftwares.map((s) => (
                <span key={s} className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700
                                          px-3 py-1.5 rounded-full border border-purple-100">
                  <Monitor size={11} /> {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
