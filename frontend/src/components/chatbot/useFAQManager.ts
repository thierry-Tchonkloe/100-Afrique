// src/components/chatbot/useFAQManager.ts
"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FAQItem, getApiErrorMessage } from './types';

export function useFAQManager() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  const fetchFAQs = async () => {
    try {
      const response = await api.get('/admin/chatbot/faqs');
      if (response.data.data) setFaqs(response.data.data);
    } catch (err) {
      console.error('Erreur chargement FAQ:', err);
    }
  };

  useEffect(() => { fetchFAQs(); }, []);

  const openCreateModal = () => { setEditingFaq(null); setIsModalOpen(true); };
  const openEditModal = (faq: FAQItem) => { setEditingFaq(faq); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingFaq(null); };

  const handleSaveFAQ = async (faq: FAQItem) => {
    try {
      setSaving(true);
      if (faq.id) {
        const response = await api.put(`/admin/chatbot/faqs/${faq.id}`, faq);
        setFaqs((prev) => prev.map((f) => (f.id === faq.id ? response.data.data : f)));
      } else {
        const response = await api.post('/admin/chatbot/faqs', faq);
        setFaqs((prev) => [...prev, response.data.data]);
      }
      closeModal();
    } catch (err) {
      alert(getApiErrorMessage(err, 'Erreur lors de la sauvegarde'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return;
    try {
      setSaving(true);
      await api.delete(`/admin/chatbot/faqs/${id}`);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(getApiErrorMessage(err, 'Erreur lors de la suppression'));
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicateFAQ = async (faq: FAQItem) => {
    const duplicate: FAQItem = {
      question: `${faq.question} (Copie)`,
      answer: faq.answer,
      priority: faq.priority,
      isActive: faq.isActive,
    };
    try {
      setSaving(true);
      const response = await api.post('/admin/chatbot/faqs', duplicate);
      setFaqs((prev) => [...prev, response.data.data]);
    } catch (err) {
      alert(getApiErrorMessage(err, 'Erreur lors de la duplication'));
    } finally {
      setSaving(false);
    }
  };

  return {
    faqs, saving, isModalOpen, editingFaq,
    openCreateModal, openEditModal, closeModal,
    handleSaveFAQ, handleDeleteFAQ, handleDuplicateFAQ,
  };
}