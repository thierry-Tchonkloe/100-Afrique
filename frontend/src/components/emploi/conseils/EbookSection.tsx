'use client';
// src/components/emploi/conseils/EbookSection.tsx
import { useState } from 'react';
import { CheckCircle2, Download, Loader2, AlertCircle } from 'lucide-react';

export default function EbookSection() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailErr, setEmailErr] = useState('');

  async function handleDownload(e: React.FormEvent) {
    e.preventDefault();
    setEmailErr('');

    if (!email.trim()) { setEmailErr('Email requis'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailErr('Email invalide'); return; }

    setSending(true);
    try {
      // TODO: POST /api/emploi/conseils/ebook { email }
      await new Promise((r) => setTimeout(r, 600));
      setSent(true);
    } catch {
      setEmailErr('Une erreur est survenue. Réessayez.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-3xl overflow-hidden my-10 bg-[#1E2A3A]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

        <div className="p-10 flex flex-col justify-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#E8622A]
                           bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full w-fit mb-5">
            E-book Gratuit
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4">
            Guide des Salaires du Tourisme 2026
          </h2>
          <p className="text-sm text-white/60 leading-relaxed mb-6">
            Fourchettes de rémunération par poste, région et niveau d&apos;expérience.
          </p>

          <ul className="space-y-2.5 mb-8">
            {['Données 2026 actualisées', 'Comparatifs par région', 'Conseils de négociation'].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                <CheckCircle2 size={15} className="text-[#E8622A] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {sent ? (
            <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/30 rounded-2xl p-4">
              <CheckCircle2 size={20} className="text-green-400" />
              <div>
                <p className="text-sm font-bold text-white">Envoyé !</p>
                <p className="text-xs text-white/60 mt-0.5">Vérifiez votre boîte mail.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDownload} className="space-y-2">
              <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailErr(''); }}
                    placeholder="Votre email professionnel"
                    className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-sm text-white
                               placeholder-white/40 focus:outline-none focus:ring-2
                               focus:ring-[#E8622A]/30 transition
                               ${emailErr ? 'border-red-400' : 'border-white/20 focus:border-[#E8622A]'}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#d4561f] disabled:opacity-60
                             text-white font-semibold text-sm px-5 py-3 rounded-xl transition flex-shrink-0"
                >
                  {sending
                    ? <><Loader2 size={14} className="animate-spin" /> Envoi...</>
                    : <><Download size={14} /> Télécharger</>}
                </button>
              </div>
              {emailErr && (
                <p className="flex items-center gap-1.5 text-xs text-red-300">
                  <AlertCircle size={11} /> {emailErr}
                </p>
              )}
            </form>
          )}
        </div>

        <div className="hidden md:flex items-center justify-center p-10 bg-white/5">
          <div className="relative w-56 h-72 shadow-2xl rounded-lg overflow-hidden
                          transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80"
              alt="Guide des Salaires"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center
                            bg-gradient-to-br from-[#E8622A]/90 to-[#1E2A3A]/90 p-6 text-center">
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-3">Guide Officiel</p>
              <h3 className="text-2xl font-extrabold text-white leading-tight mb-2">
                SALAIRES<br />TOURISME
              </h3>
              <div className="w-10 h-0.5 bg-[#E8622A] mx-auto my-3" />
              <p className="text-xs text-white/60">Édition 2026</p>
              <p className="text-[10px] text-white/40 mt-4">i Tourisme Emploi · 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
