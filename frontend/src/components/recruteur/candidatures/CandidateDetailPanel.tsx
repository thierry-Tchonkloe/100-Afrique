// src/components/recruteur/candidatures/CandidateDetailPanel.tsx
'use client';

import { useState, useCallback } from 'react';
import { Download, Star, Mail, X, ChevronDown, Check } from 'lucide-react';
import type { CandidatureRec, CandidatureRecStatus } from '@/types/candidatures-rec.types';
import { STATUS_LABELS, STATUS_COLORS, MESSAGE_TEMPLATES } from '@/types/candidatures-rec.types';
import {
  updateCandidatureStatus,
  toggleCandidatureFavorite,
  saveRecruiterNotes,
  refuseCandidature,
  sendMessage,
} from '@/services/candidatures-rec.service';
import clsx from 'clsx';

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, src, size = 14 }: { name: string; src?: string; size?: number }) {
  const initials = name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'];
  const color  = colors[name.charCodeAt(0) % colors.length];
  const cls    = `w-${size} h-${size}`;
  return (
    <div className={`${cls} rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center ${src ? '' : color}`}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" />
           : <span className="text-white font-bold text-sm">{initials}</span>}
    </div>
  );
}

// ── Skill tag ─────────────────────────────────────────────────────────────────
function SkillTag({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <span className={clsx(
      'text-xs font-medium px-2.5 py-1 rounded-full border',
      highlight
        ? 'bg-[#FFF3EC] text-[#E8622A] border-[#FDDCC8]'
        : 'bg-gray-50 text-gray-600 border-gray-200'
    )}>
      {label}
    </span>
  );
}

// ── Message modal ─────────────────────────────────────────────────────────────
function MessageModal({ candidat, onSend, onClose }: {
  candidat: CandidatureRec;
  onSend: (subject: string, body: string) => void;
  onClose: () => void;
}) {
  const [subject, setSubject] = useState('');
  const [body,    setBody]    = useState('');
  const [tplId,   setTplId]   = useState('');

  function applyTemplate(id: string) {
    const tpl = MESSAGE_TEMPLATES.find((t) => t.id === id);
    if (tpl) { setSubject(tpl.subject); setBody(tpl.body); }
    setTplId(id);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Contacter {candidat.candidatName}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Message type</label>
            <select value={tplId} onChange={(e) => applyTemplate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition">
              <option value="">Choisir un modèle…</option>
              {MESSAGE_TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Objet</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Message</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white resize-none
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition" />
          </div>
        </div>
        <div className="flex gap-2 justify-end p-5 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition">
            Annuler
          </button>
          <button onClick={() => onSend(subject, body)} disabled={!subject || !body}
            className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white text-sm
                       font-semibold px-5 py-2 rounded-xl transition disabled:opacity-50">
            <Mail size={14} /> Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
interface DetailPanelProps {
  candidature: CandidatureRec;
  onChange: (updated: Partial<CandidatureRec>) => void;
}

export default function CandidateDetailPanel({ candidature: c, onChange }: DetailPanelProps) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [notesValue,       setNotesValue]       = useState(c.recruiterNotes);
  const [notesSaved,       setNotesSaved]       = useState(false);
  const [showStatusMenu,   setShowStatusMenu]   = useState(false);

  async function handleStatusChange(status: CandidatureRecStatus) {
    onChange({ status });
    setShowStatusMenu(false);
    try { await updateCandidatureStatus(c.id, status); } catch {}
  }

  async function handleFavorite() {
    const next = !c.isFavorite;
    onChange({ isFavorite: next });
    try { await toggleCandidatureFavorite(c.id, next); } catch {}
  }

  async function handleRefuse() {
    if (!confirm('Refuser cette candidature ?')) return;
    onChange({ status: 'refused' });
    try { await refuseCandidature(c.id); } catch {}
  }

  const saveNotes = useCallback(async () => {
    onChange({ recruiterNotes: notesValue });
    try { await saveRecruiterNotes(c.id, notesValue); } catch {}
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 1500);
  }, [c.id, notesValue, onChange]);

  async function handleSendMessage(subject: string, body: string) {
    try { await sendMessage(c.id, { subject, body }); } catch {}
    setShowContactModal(false);
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <Avatar name={c.candidatName} src={c.candidatAvatar} size={14} />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 text-lg">{c.candidatName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{c.candidatTitle}</p>
            <p className="text-xs text-gray-400 mt-1">
              Candidature reçue {(() => {
                const h = Math.floor((Date.now() - new Date(c.receivedAt).getTime()) / 3600000);
                return h < 24 ? `il y a ${h}h` : `il y a ${Math.floor(h / 24)}j`;
              })()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {c.cvUrl && (
            <a href={c.cvUrl} download
              className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-xs font-medium
                         px-3 py-2 rounded-xl hover:bg-gray-50 transition">
              <Download size={13} /> Télécharger CV
            </a>
          )}
          {!c.cvUrl && (
            <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-xs font-medium
                               px-3 py-2 rounded-xl hover:bg-gray-50 transition">
              <Download size={13} /> Télécharger CV
            </button>
          )}
          <button onClick={handleFavorite}
            className={clsx(
              'flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border transition',
              c.isFavorite
                ? 'bg-yellow-50 border-yellow-200 text-yellow-600'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            )}>
            <Star size={13} fill={c.isFavorite ? 'currentColor' : 'none'} />
            Favoris
          </button>
          <button onClick={() => setShowContactModal(true)}
            className="flex items-center gap-1.5 bg-[#E8622A] hover:bg-[#D45520] text-white text-xs
                       font-semibold px-3 py-2 rounded-xl transition">
            <Mail size={13} /> Contacter
          </button>
          <button onClick={handleRefuse}
            className="flex items-center gap-1.5 border border-red-100 text-red-500 text-xs font-medium
                       px-3 py-2 rounded-xl hover:bg-red-50 transition">
            <X size={13} /> Refuser
          </button>
        </div>
      </div>

      {/* ── Status + Score ───────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-6 flex-wrap">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 mb-1.5">Statut de la candidature</p>
          <div className="relative">
            <button onClick={() => setShowStatusMenu((v) => !v)}
              className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-sm
                         font-medium text-gray-700 hover:bg-gray-50 transition min-w-36">
              <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_COLORS[c.status])}>
                {STATUS_LABELS[c.status]}
              </span>
              <ChevronDown size={13} className="text-gray-400 ml-auto" />
            </button>
            {showStatusMenu && (
              <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-2xl
                              shadow-xl z-20 py-1 min-w-36 overflow-hidden">
                {(Object.entries(STATUS_LABELS) as [CandidatureRecStatus, string][]).map(([k, v]) => (
                  <button key={k} onClick={() => handleStatusChange(k)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition">
                    <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_COLORS[k])}>
                      {v}
                    </span>
                    {k === c.status && <Check size={12} className="text-[#E8622A] ml-auto" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">Score de matching</p>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${c.matchScore}%` }}
              />
            </div>
            <span className="text-sm font-bold text-green-600">{c.matchScore}%</span>
          </div>
        </div>
      </div>

      {/* ── Profile summary ──────────────────────────────────────────── */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Expériences */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Expérience professionnelle
          </p>
          <div className="space-y-3">
            {c.experiences.map((exp, i) => (
              <div key={i} className="border-l-2 border-[#E8622A]/30 pl-3">
                <p className="text-sm font-semibold text-gray-800">{exp.jobTitle}</p>
                <p className="text-xs text-gray-500">{exp.company} • {exp.period}</p>
                {exp.description && (
                  <p className="text-xs text-gray-400 mt-0.5">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formation + Info complémentaires */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Formation
            </p>
            {c.formations.map((f, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-gray-800">{f.diploma}</p>
                <p className="text-xs text-gray-500">{f.school} • {f.year}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Informations complémentaires
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium text-gray-700">Localisation :</span> {c.location}</p>
              <p><span className="font-medium text-gray-700">Mobilité :</span> {c.mobility}</p>
              <p><span className="font-medium text-gray-700">Disponibilité :</span> {c.availability}</p>
              {c.salarySought && (
                <p><span className="font-medium text-gray-700">Salaire souhaité :</span> {c.salarySought}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compétences */}
      <div className="px-5 pb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Compétences clés
        </p>
        <div className="flex flex-wrap gap-2">
          {c.skills.map((s) => <SkillTag key={s} label={s} highlight />)}
        </div>
      </div>

      {/* Notes privées */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Notes privées
          </p>
          {notesSaved && (
            <span className="text-xs text-green-500 flex items-center gap-1">
              <Check size={11} /> Sauvegardé
            </span>
          )}
        </div>
        <textarea
          value={notesValue}
          onChange={(e) => setNotesValue(e.target.value)}
          onBlur={saveNotes}
          rows={4}
          placeholder="Ajoutez vos notes et impressions sur cette candidature…"
          className="w-full border border-gray-200 rounded-2xl px-3 py-2.5 text-sm text-gray-800
                     resize-none focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30
                     focus:border-[#E8622A] transition"
        />
      </div>

      {/* Actions rapides */}
      <div className="px-5 pb-6 pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Actions rapides
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { handleStatusChange('interview'); }}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600
                       text-white text-sm font-semibold py-3 rounded-xl transition">
            📅 Programmer un entretien
          </button>
          <button onClick={() => setShowContactModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600
                       text-white text-sm font-semibold py-3 rounded-xl transition">
            ✉️ Envoyer message type
          </button>
        </div>
      </div>

      {/* Message modal */}
      {showContactModal && (
        <MessageModal
          candidat={c}
          onSend={handleSendMessage}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
}