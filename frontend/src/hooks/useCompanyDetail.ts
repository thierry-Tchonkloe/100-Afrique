// src/hooks/useCompanyDetail.ts
import { useState, useEffect } from 'react';
import { fetchPublicCompanyDetail, type PublicCompanyDetail } from '@/services/emploi-public.service';

export type CompanyLoadState = 'loading' | 'ok' | 'not_found' | 'network_error';

export function useCompanyDetail(id: string) {
  const [data, setData] = useState<PublicCompanyDetail | null>(null);
  const [state, setState] = useState<CompanyLoadState>('loading');

  useEffect(() => {
    let cancelled = false;
    setState('loading');

    fetchPublicCompanyDetail(id)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setState('ok');
      })
      .catch((err) => {
        if (cancelled) return;
        setState(err?.response?.status === 404 ? 'not_found' : 'network_error');
      });

    return () => { cancelled = true; };
  }, [id]);

  return { data, state };
}
