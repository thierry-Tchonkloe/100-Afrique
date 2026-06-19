// src/components/news/NewsletterSection.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '@/lib/api';

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setErrorMessage("");
    try {
      await api.post('/newsletter/subscribe', { email, source: 'actualites_page' });
      setStatus('success');
      setEmail("");
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) setErrorMessage("Cet email est déjà inscrit.");
        else if (error.response?.status === 400) setErrorMessage("Adresse email invalide.");
        else setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      } else {
        setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      }
      setTimeout(() => { setStatus('idle'); setErrorMessage(""); }, 5000);
    }
  };

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 px-4 overflow-hidden" style={{ background: '#0D2B1A' }}>

      {/* Décorations */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-15" style={{ background: 'radial-gradient(ellipse at 100% 30%, #B85C38 0%, transparent 65%)' }} />
      <div className="absolute bottom-0 left-0 w-1/3 h-2/3 opacity-20" style={{ background: 'radial-gradient(ellipse at 0% 100%, #1A5C43 0%, transparent 70%)' }} />

      <div className="max-w-2xl mx-auto relative z-10">

        {/* Icône */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-all duration-700"
          style={{
            background: '#1A5C43',
            boxShadow: '0 8px 32px rgba(26,92,67,0.4)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.7)',
          }}
        >
          <Mail size={28} style={{ color: '#C8A84B' }} />
        </div>

        {/* Texte */}
        <div
          className="text-center mb-10 transition-all duration-700 delay-100"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)' }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: '#C8A84B' }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: '#C8A84B' }}>Newsletter Pro</span>
            <div className="h-px w-8" style={{ background: '#C8A84B' }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 " style={{ letterSpacing: '-0.02em' }}>
            Restez informé,<br />
            <span style={{ color: '#C8A84B' }}>chaque semaine</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed">
            Recevez les dernières actualités du tourisme africain et international directement dans votre boîte mail.
          </p>
        </div>

        {/* Formulaire */}
        <div
          className="transition-all duration-700 delay-200"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)' }}
        >
          {status === 'success' ? (
            <div
              className="rounded-2xl p-8 flex flex-col items-center text-center"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,168,75,0.25)' }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(26,92,67,0.4)' }}>
                <CheckCircle2 size={28} style={{ color: '#C8A84B' }} />
              </div>
              <p className="text-white font-bold text-lg mb-1">Inscription réussie !</p>
              <p className="text-white/50 text-sm">Consultez votre boîte mail pour confirmer votre abonnement.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe}>
              <div
                className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-2xl p-1.5"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email professionnelle"
                  disabled={status === 'loading'}
                  className="flex-1 bg-transparent px-5 py-3.5 outline-none text-white placeholder-white/30 text-sm disabled:opacity-50"
                />
                <button
                  disabled={status === 'loading'}
                  type="submit"
                  className="flex items-center justify-center gap-2 font-bold text-sm px-8 py-3.5 rounded-xl text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                  style={{ background: '#B85C38' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
                >
                  {status === 'loading'
                    ? <><Loader2 size={16} className="animate-spin" /><span>Envoi…</span></>
                    : <><Send size={16} /><span>S&apos;abonner</span></>
                  }
                </button>
              </div>

              {status === 'error' && errorMessage && (
                <div className="mt-3 rounded-xl px-4 py-3" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <p className="text-red-400 text-xs font-medium">{errorMessage}</p>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Légal */}
        <p
          className="text-center text-[11px] mt-6 transition-all duration-700 delay-300"
          style={{ color: 'rgba(255,255,255,0.25)', opacity: visible ? 1 : 0 }}
        >
          En vous inscrivant, vous acceptez nos communications. Désabonnement possible à tout moment.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;

















// // src/components/news/NewsletterSection.tsx
// "use client";

// import React, { useState } from 'react';
// import { Send, Loader2, CheckCircle2 } from 'lucide-react';
// import { AxiosError } from 'axios';
// import api from '@/lib/api';

// const NewsletterSection = () => {
//   const [email, setEmail]             = useState("");
//   const [status, setStatus]           = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSubscribe = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email) return;
//     setStatus('loading');
//     setErrorMessage("");
//     try {
//       await api.post('/newsletter/subscribe', { email, source: 'actualites_page' });
//       setStatus('success');
//       setEmail("");
//       setTimeout(() => setStatus('idle'), 5000);
//     } catch (error) {
//       console.error("Erreur newsletter:", error);
//       setStatus('error');
//       if (error instanceof AxiosError) {
//         if (error.response?.status === 409)      setErrorMessage("Cet email est déjà inscrit à notre newsletter.");
//         else if (error.response?.status === 400) setErrorMessage("Adresse email invalide.");
//         else                                     setErrorMessage("Une erreur est survenue. Veuillez réessayer ultérieurement.");
//       } else {
//         setErrorMessage("Une erreur est survenue. Veuillez réessayer ultérieurement.");
//       }
//       setTimeout(() => { setStatus('idle'); setErrorMessage(""); }, 5000);
//     }
//   };

//   return (
//     /* Fond — émeraude foncé */
//     <section className="py-16 px-4" style={{ background: '#1A5C43' }}>
//       <div className="max-w-4xl mx-auto text-center">

//         <h2 className="text-2xl md:text-4xl font-bold text-white uppercase mb-4 tracking-tight">
//           Abonnez-vous à notre Newsletter Pro
//         </h2>

//         <p className="text-sm md:text-base mb-10" style={{ color: 'rgba(255,255,255,0.75)' }}>
//           Recevez les dernières actualités du tourisme africain et international
//         </p>

//         {status === 'success' ? (
//           <div
//             className="rounded-2xl p-6 flex flex-col items-center animate-in zoom-in-95 duration-300"
//             style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(200,168,75,0.4)' }}
//           >
//             <CheckCircle2 size={32} className="mb-2" style={{ color: '#C8A84B' }} />
//             <p className="text-white font-medium">Merci ! Votre inscription est validée.</p>
//             <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
//               Consultez votre boîte mail pour confirmer votre abonnement.
//             </p>
//           </div>
//         ) : (
//           <form onSubmit={handleSubscribe} className="relative max-w-2xl mx-auto">
//             <div className="flex flex-col md:flex-row items-center gap-0 overflow-hidden rounded-xl md:rounded-full bg-white p-1">
//               <input
//                 required
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Votre adresse email professionnelle"
//                 disabled={status === 'loading'}
//                 className="w-full bg-transparent px-6 py-4 outline-none placeholder:text-gray-400 text-sm md:text-base disabled:opacity-50"
//                 style={{ color: '#1A5C43' }}
//               />
//               {/* Bouton — terre cuite */}
//               <button
//                 disabled={status === 'loading'}
//                 type="submit"
//                 className="w-full md:w-auto text-white font-black px-10 py-4 rounded-lg md:rounded-full transition-all flex items-center justify-center gap-2 min-w-[180px] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
//                 style={{ background: '#B85C38' }}
//                 onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
//                 onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
//               >
//                 {status === 'loading' ? (
//                   <><Loader2 size={20} className="animate-spin" /><span>Inscription...</span></>
//                 ) : (
//                   <><Send size={18} /><span>S&apos;ABONNER</span></>
//                 )}
//               </button>
//             </div>

//             {status === 'error' && errorMessage && (
//               <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
//                 <p className="text-red-300 text-sm font-medium">{errorMessage}</p>
//               </div>
//             )}
//           </form>
//         )}

//         <p className="text-xs mt-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
//           En vous inscrivant, vous acceptez de recevoir nos communications.
//           Vous pouvez vous désabonner à tout moment.
//         </p>

//       </div>
//     </section>
//   );
// };

// export default NewsletterSection;



















// // src/components/news/NewsletterSection.tsx
// "use client";
 
// import React, { useState } from 'react';
// import { Send, Loader2, CheckCircle2 } from 'lucide-react';
// import { AxiosError } from 'axios';
// import api from '@/lib/api';
 
// const NewsletterSection = () => {
//   const [email, setEmail] = useState("");
//   const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
//   const [errorMessage, setErrorMessage] = useState("");
 
//   const handleSubscribe = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email) return;
 
//     setStatus('loading');
//     setErrorMessage("");
 
//     try {
//       // ✅ Endpoint à créer dans le backend
//       await api.post('/newsletter/subscribe', {
//         email,
//         source: 'actualites_page'
//       });
      
//       setStatus('success');
//       setEmail("");
      
//       // Retour à l'état initial après 5 secondes
//       setTimeout(() => setStatus('idle'), 5000);
//     } catch (error) {
//       console.error("Erreur newsletter:", error);
//       setStatus('error');
      
//       // Gestion des erreurs spécifiques avec type guard
//       if (error instanceof AxiosError) {
//         if (error.response?.status === 409) {
//           setErrorMessage("Cet email est déjà inscrit à notre newsletter.");
//         } else if (error.response?.status === 400) {
//           setErrorMessage("Adresse email invalide.");
//         } else {
//           setErrorMessage("Une erreur est survenue. Veuillez réessayer ultérieurement.");
//         }
//       } else {
//         setErrorMessage("Une erreur est survenue. Veuillez réessayer ultérieurement.");
//       }
      
//       // Retour à idle après 5 secondes
//       setTimeout(() => {
//         setStatus('idle');
//         setErrorMessage("");
//       }, 5000);
//     }
//   };
 
//   return (
//     <section className="bg-[#1A3A8A] py-16 px-4">
//       <div className="max-w-4xl mx-auto text-center">
        
//         <h2 className="text-2xl md:text-4xl font-bold text-white uppercase mb-4 tracking-tight">
//           Abonnez-vous à notre Newsletter Pro
//         </h2>
        
//         <p className="text-blue-100 text-sm md:text-base mb-10 opacity-90">
//           Recevez les dernières actualités du tourisme africain et international
//         </p>
 
//         {status === 'success' ? (
//           <div className="bg-white/10 border border-green-500/50 rounded-2xl p-6 flex flex-col items-center animate-in zoom-in-95 duration-300">
//             <CheckCircle2 className="text-green-400 mb-2" size={32} />
//             <p className="text-white font-medium">Merci ! Votre inscription est validée.</p>
//             <p className="text-blue-100 text-sm mt-1">
//               Consultez votre boîte mail pour confirmer votre abonnement.
//             </p>
//           </div>
//         ) : (
//           <form onSubmit={handleSubscribe} className="relative max-w-2xl mx-auto">
//             <div className="flex flex-col md:flex-row items-center gap-0 overflow-hidden rounded-xl md:rounded-full bg-white p-1">
//               <input
//                 required
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Votre adresse email professionnelle"
//                 disabled={status === 'loading'}
//                 className="w-full bg-transparent px-6 py-4 text-[#1A3A8A] outline-none placeholder:text-gray-400 text-sm md:text-base disabled:opacity-50"
//               />
//               <button
//                 disabled={status === 'loading'}
//                 type="submit"
//                 className="w-full md:w-auto bg-[#F19300] hover:bg-[#d98400] text-white font-black px-10 py-4 rounded-lg md:rounded-full transition-all flex items-center justify-center gap-2 min-w-[180px] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {status === 'loading' ? (
//                   <>
//                     <Loader2 size={20} className="animate-spin" />
//                     <span>Inscription...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Send size={18} />
//                     <span>S&apos;ABONNER</span>
//                   </>
//                 )}
//               </button>
//             </div>
            
//             {status === 'error' && errorMessage && (
//               <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
//                 <p className="text-red-300 text-sm font-medium">
//                   {errorMessage}
//                 </p>
//               </div>
//             )}
//           </form>
//         )}
 
//         <p className="text-blue-200 text-xs mt-6 opacity-70">
//           En vous inscrivant, vous acceptez de recevoir nos communications.
//           Vous pouvez vous désabonner à tout moment.
//         </p>
 
//       </div>
//     </section>
//   );
// };
 
// export default NewsletterSection;