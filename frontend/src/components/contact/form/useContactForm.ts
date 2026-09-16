// src/components/contact/form/useContactForm.ts
"use client";
import { useState } from 'react';
import api from '@/lib/api';

export interface ContactFormData {
  type: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  message: string;
  rgpd: boolean;
}

const EMPTY_FORM: ContactFormData = {
  type: '', firstname: '', lastname: '', email: '', phone: '', message: '', rgpd: false,
};

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setFormData(EMPTY_FORM);
    } catch {
      setStatus('error');
    }
  };

  return { formData, status, handleChange, handleSubmit };
}