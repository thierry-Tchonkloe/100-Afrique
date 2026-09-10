// src/components/partners/contact/usePartnersContactForm.ts
"use client";
import { useState } from 'react';
import { AxiosError } from 'axios';
import api from '@/lib/api';

interface ApiErrorResponse {
  message?: string;
}

export function usePartnersContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => { payload[key] = value.toString(); });

    try {
      await api.post('/contacts/partners', payload);
      setSubmitted(true);
      formElement.reset();
      setTimeout(() => setSubmitted(false), 10000);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const msg = axiosError.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return { loading, submitted, error, setSubmitted, handleSubmit };
}