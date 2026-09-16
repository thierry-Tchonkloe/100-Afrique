'use client';
// src/app/(emploi)/emploi/page.tsx
// Home publique Emploi — chaque section (hero, entreprises, métiers,
// dernières offres, CTA recruteur) est un composant dédié sous
// src/components/emploi/home/*. Les données viennent du hook
// useEmploiHomeData.

import HomeHero from '@/components/emploi/home/HomeHero';
import CompaniesSection from '@/components/emploi/home/CompaniesSection';
import MetiersSection from '@/components/emploi/home/MetiersSection';
import LatestJobsSection from '@/components/emploi/home/LatestJobsSection';
import RecruiterCtaSection from '@/components/emploi/home/RecruiterCtaSection';
import { useEmploiHomeData } from '@/hooks/useEmploiHomeData';

export default function EmploiHomePage() {
  const {
    offres, companies, loadingJobs, loadingComp, jobsError, compError, totalJobs,
  } = useEmploiHomeData();

  return (
    <div className="bg-white">
      <HomeHero totalJobs={totalJobs} />
      <CompaniesSection companies={companies} loading={loadingComp} error={compError} />
      <MetiersSection offres={offres} loadingJobs={loadingJobs} />
      <LatestJobsSection offres={offres} loading={loadingJobs} error={jobsError} totalJobs={totalJobs} />
      <RecruiterCtaSection />
    </div>
  );
}
