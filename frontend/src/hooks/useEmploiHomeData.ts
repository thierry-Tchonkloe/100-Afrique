// src/hooks/useEmploiHomeData.ts
// Récupère les offres et entreprises mises en avant sur la home Emploi,
// avec repli sur des données mock en cas d'échec réseau.

import { useState, useEffect } from 'react';
import {
  fetchPublicJobs, fetchFeaturedCompanies, MOCK_OFFRES, MOCK_COMPANIES,
} from '@/services/emploi-public.service';
import type { PublicOffre, PublicEtablissement } from '@/services/emploi-public.service';

export function useEmploiHomeData() {
  const [offres, setOffres] = useState<PublicOffre[]>([]);
  const [companies, setCompanies] = useState<PublicEtablissement[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingComp, setLoadingComp] = useState(true);
  const [jobsError, setJobsError] = useState(false);
  const [compError, setCompError] = useState(false);
  const [totalJobs, setTotalJobs] = useState<number | null>(null);

  useEffect(() => {
    setLoadingJobs(true);
    fetchPublicJobs({ limit: 6, page: 1 })
      .then((res) => {
        // Un tableau vide légitime (aucune offre active) doit s'afficher
        // tel quel — on ne bascule sur le mock qu'en cas de vrai échec.
        console.info('[useEmploiHomeData] /jobs OK — total:', res.total, 'offres reçues:', res.offres?.length ?? 0);
        setOffres(res.offres ?? []);
        setTotalJobs(res.total ?? null);
        setJobsError(false);
      })
      .catch((err) => {
        console.error('[useEmploiHomeData] /jobs a échoué —', err?.response?.status, err?.response?.data ?? err?.message);
        setOffres(MOCK_OFFRES);
        setJobsError(true);
      })
      .finally(() => setLoadingJobs(false));
  }, []);

  useEffect(() => {
    setLoadingComp(true);
    fetchFeaturedCompanies()
      .then((list) => {
        console.info('[useEmploiHomeData] /entreprises OK — reçues:', list?.length ?? 0);
        setCompanies(list ?? []);
        setCompError(false);
      })
      .catch((err) => {
        console.error('[useEmploiHomeData] /entreprises a échoué —', err?.response?.status, err?.response?.data ?? err?.message);
        setCompanies(MOCK_COMPANIES);
        setCompError(true);
      })
      .finally(() => setLoadingComp(false));
  }, []);

  return { offres, companies, loadingJobs, loadingComp, jobsError, compError, totalJobs };
}
