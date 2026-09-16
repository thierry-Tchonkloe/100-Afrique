// src/components/chatbot/FAQModal.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { FAQItem, Priority } from './types';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faq: FAQItem) => void;
  editingFaq?: FAQItem | null;
}

const FAQModal = ({ isOpen, onClose, onSave, editingFaq }: FAQModalProps) => {
  const [question, setQuestion] = useState(editingFaq?.question || '');
  const [answer, setAnswer] = useState(editingFaq?.answer || '');
  const [priority, setPriority] = useState<Priority>(editingFaq?.priority || 'MEDIUM');

  useEffect(() => {
    if (editingFaq) {
      setQuestion(editingFaq.question);
      setAnswer(editingFaq.answer);
      setPriority(editingFaq.priority);
    } else if (!isOpen) {
      setQuestion('');
      setAnswer('');
      setPriority('MEDIUM');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingFaq?.id, isOpen]);

  const handleSubmit = () => {
    if (!question.trim() || !answer.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    onSave({
      id: editingFaq?.id,
      question: question.trim(),
      answer: answer.trim(),
      priority,
      isActive: true,
      order: editingFaq?.order || 0,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            {editingFaq ? 'Modifier la Question/Réponse' : 'Ajouter une Question/Réponse'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
              placeholder="Ex: Comment puis-je réserver un salon de tourisme ?"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Réponse</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 min-h-[120px]"
              placeholder="Entrez la réponse complète..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Priorité</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
            >
              <option value="HIGH">Priorité Élevée</option>
              <option value="MEDIUM">Priorité Normale</option>
              <option value="LOW">Priorité Basse</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
            Annuler
          </button>
          <button onClick={handleSubmit} className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors">
            {editingFaq ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQModal;