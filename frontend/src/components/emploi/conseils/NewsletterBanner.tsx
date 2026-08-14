'use client';
// src/components/emploi/conseils/NewsletterBanner.tsx
import { useState } from 'react';
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (!email.trim()) { setErr('Email requis'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErr('Email invalide'); return; }

    setSending(true);
    try {
      // TODO: POST /api/emploi/newsletter { email }
      await new Promise((r) => setTimeout(r, 500));
      setSent(true);
    } catch {
      setErr('Erreur. Réessayez.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 my-10 text-center">
      <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Send size={20} className="text-[#E8622A]" />
      </div>
      <h2 className="text-xl font-extrabold text-[#1E2A3A] mb-2">Newsletter Carrière</h2>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
        Chaque semaine : meilleurs conseils carrière, tendances du marché et offres qui recrutent.
      </p>

      {sent ? (
        <div className="flex items-center justify-center gap-3 text-green-600">
          <CheckCircle2 size={18} />
          <span className="font-semibold text-sm">Inscription confirmée !</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErr(''); }}
              placeholder="votre@email.com"
              className={`flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none
                         focus:ring-2 focus:ring-[#E8622A]/20 transition
                         ${err ? 'border-red-400' : 'border-gray-200 focus:border-[#E8622A]'}`}
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-[#E8622A] hover:bg-[#d4561f] disabled:opacity-60 text-white
                         font-semibold text-sm px-5 py-2.5 rounded-xl transition flex-shrink-0"
            >
              {sending ? <Loader2 size={15} className="animate-spin" /> : "S'inscrire"}
            </button>
          </div>
          {err && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-red-500">
              <AlertCircle size={11} /> {err}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
