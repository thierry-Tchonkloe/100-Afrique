// src/components/chatbot/FAQSection.tsx
"use client";
import React from 'react';
import { MessageCircle, Plus, ChevronRight, Edit2, Copy, Trash2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import PriorityBadge from './PriorityBadge';
import type { FAQItem } from './types';

interface FAQSectionProps {
  faqs: FAQItem[];
  saving: boolean;
  onCreate: () => void;
  onEdit: (faq: FAQItem) => void;
  onDuplicate: (faq: FAQItem) => void;
  onDelete: (id: number) => void;
}

const FAQSection = ({ faqs, saving, onCreate, onEdit, onDuplicate, onDelete }: FAQSectionProps) => (
  <SectionCard>
    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-orange-50">
          <MessageCircle className="w-4 h-4 text-orange-500" />
        </div>
        <h2 className="text-[15px] font-bold text-slate-800">Questions/Réponses Clés (FAQ)</h2>
      </div>
      <button
        onClick={onCreate}
        className="bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> Ajouter une Paire Q/R
      </button>
    </div>

    <div className="p-6 space-y-3">
      {faqs.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Aucune question FAQ configurée</p>
          <p className="text-xs text-slate-400 mt-1">Cliquez sur &quot;Ajouter une Paire Q/R&quot; pour commencer</p>
        </div>
      ) : (
        faqs.map((faq) => (
          <div
            key={faq.id}
            className="flex items-center justify-between border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 flex-1">
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <span className="text-[13px] text-slate-700 font-medium">{faq.question}</span>
              <PriorityBadge priority={faq.priority} />
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(faq)} className="p-1.5 text-slate-400 hover:text-slate-600" title="Modifier">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => onDuplicate(faq)} className="p-1.5 text-slate-400 hover:text-slate-600" title="Dupliquer" disabled={saving}>
                <Copy className="w-4 h-4" />
              </button>
              <button onClick={() => faq.id && onDelete(faq.id)} className="p-1.5 text-slate-400 hover:text-red-500" title="Supprimer" disabled={saving}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </SectionCard>
);

export default FAQSection;