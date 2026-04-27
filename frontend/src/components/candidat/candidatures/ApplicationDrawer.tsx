// src/components/candidatures/ApplicationDrawer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { X, FileText, MessageCircle, AlertTriangle, CheckCircle, Eye, Send, Clock, Star, CalendarCheck } from 'lucide-react';
import type { Application, ApplicationStatus, TimelineEvent } from '@/types/candidatures.types';
import StatusBadge from '../dashboard/StatusBadge';
import { withdrawApplication } from '@/services/candidatures.service';

// ── Timeline ──────────────────────────────────────────────────────────────────

const STATUS_ICONS: Record<ApplicationStatus, typeof Send> = {
  pending:     Clock,
  sent:        Send,
  viewed:      Eye,
  in_progress: Clock,
  selected:    Star,
  interview:   CalendarCheck,
  accepted:    CheckCircle,
  refused:     X,
  archived:    Clock,
};

function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const Icon = STATUS_ICONS[event.status] ?? Clock;
  const date = new Date(event.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="flex gap-3 relative">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[15px] top-7 bottom-0 w-px bg-gray-100" />
      )}
      <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 z-10">
        <Icon size={13} className="text-gray-500" />
      </div>
      <div className="pb-5 min-w-0">
        <StatusBadge status={event.status} showIcon={false} />
        <p className="text-xs text-gray-400 mt-1">{date}</p>
        {event.note && <p className="text-xs text-gray-600 mt-1">{event.note}</p>}
      </div>
    </div>
  );
}

// ── Withdraw Modal ────────────────────────────────────────────────────────────

function WithdrawModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">Retirer la candidature</p>
            <p className="text-xs text-gray-500 mt-1">
              Cette action est irréversible. Le recruteur sera informé du retrait.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition">
            Annuler
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition">
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Drawer ────────────────────────────────────────────────────────────────────

interface DrawerProps {
  application: Application | null;
  onClose: () => void;
  onWithdrawn: (id: string) => void;
}

export default function ApplicationDrawer({ application, onClose, onWithdrawn }: DrawerProps) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function handleWithdraw() {
    if (!application) return;
    setWithdrawing(true);
    try {
      await withdrawApplication(application.id);
    } catch {}
    onWithdrawn(application.id);
    setShowWithdrawModal(false);
    onClose();
    setWithdrawing(false);
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${application ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50
                    transform transition-transform duration-300 flex flex-col
                    ${application ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {!application ? null : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
              <div className="min-w-0 pr-3">
                <p className="font-bold text-gray-900 text-sm">{application.jobTitle}</p>
                <p className="text-xs text-gray-500 mt-0.5">Chez {application.companyName}</p>
                <div className="mt-2">
                  <StatusBadge status={application.status} />
                </div>
              </div>
              <button onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition flex-shrink-0">
                <X size={18} />
              </button>
            </div>

            {/* Body (scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* Timeline */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Historique
                </p>
                <div>
                  {application.timeline.map((event, i) => (
                    <TimelineItem
                      key={event.id}
                      event={event}
                      isLast={i === application.timeline.length - 1}
                    />
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Documents envoyés
                </p>
                <div className="space-y-2">
                  {application.cvSent && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                        <FileText size={14} className="text-red-500" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{application.cvSent}</span>
                    </div>
                  )}
                  {application.coverLetterSent && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FileText size={14} className="text-blue-500" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Lettre de motivation</span>
                    </div>
                  )}
                  {!application.cvSent && !application.coverLetterSent && (
                    <p className="text-xs text-gray-400">Aucun document joint.</p>
                  )}
                </div>
              </div>

              {/* Chat */}
              {application.hasChat && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Messagerie
                  </p>
                  <button className="w-full flex items-center gap-3 p-3 bg-[#FFF3EC] rounded-xl border
                                     border-[#FDDCC8] text-[#E8622A] text-sm font-semibold hover:bg-[#FFE8D5] transition">
                    <MessageCircle size={16} />
                    Ouvrir la conversation
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100">
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={withdrawing || ['refused', 'archived'].includes(application.status)}
                className="w-full py-2.5 text-sm font-semibold text-red-500 border border-red-100
                           rounded-xl hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Retirer ma candidature
              </button>
            </div>
          </>
        )}
      </div>

      {showWithdrawModal && (
        <WithdrawModal
          onConfirm={handleWithdraw}
          onCancel={() => setShowWithdrawModal(false)}
        />
      )}
    </>
  );
}