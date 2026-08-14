// src/hooks/useJobDetail.ts
import { useState, useEffect } from 'react';
import { fetchPublicJob, fetchPublicJobs } from '@/services/emploi-public.service';
import type { PublicOffre } from '@/services/emploi-public.service';

export interface JobDetail extends PublicOffre {
  missions?: string;
  profileDesc?: string;
  advantages?: string;
  requiredSkills?: string[];
  requiredLangs?: string[];
  requiredSoftwares?: string[];
  expiresAt?: string;
  company?: {
    id: string;
    name: string;
    sector: string;
    city: string;
    logo?: string;
    slogan?: string;
  };
}

export function useJobDetail(id: string | undefined) {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [similar, setSimilar] = useState<PublicOffre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);

    fetchPublicJob(id)
      .then((data: JobDetail) => {
        setJob(data);
        return fetchPublicJobs({ sector: data.sector, limit: 4 });
      })
      .then((res) => {
        setSimilar(res.offres.filter((o) => String(o.id) !== String(id)).slice(0, 3));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  return { job, similar, loading, error };
}
