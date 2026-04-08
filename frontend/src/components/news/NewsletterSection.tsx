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




// src/components/news/NewsletterSection.tsx
"use client";
 
import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '@/lib/api';
 
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
 
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
 
    setStatus('loading');
    setErrorMessage("");
 
    try {
      // ✅ Endpoint à créer dans le backend
      await api.post('/newsletter/subscribe', {
        email,
        source: 'actualites_page'
      });
      
      setStatus('success');
      setEmail("");
      
      // Retour à l'état initial après 5 secondes
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Erreur newsletter:", error);
      setStatus('error');
      
      // Gestion des erreurs spécifiques avec type guard
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setErrorMessage("Cet email est déjà inscrit à notre newsletter.");
        } else if (error.response?.status === 400) {
          setErrorMessage("Adresse email invalide.");
        } else {
          setErrorMessage("Une erreur est survenue. Veuillez réessayer ultérieurement.");
        }
      } else {
        setErrorMessage("Une erreur est survenue. Veuillez réessayer ultérieurement.");
      }
      
      // Retour à idle après 5 secondes
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage("");
      }, 5000);
    }
  };
 
  return (
    <section className="bg-[#1A3A8A] py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        
        <h2 className="text-2xl md:text-4xl font-bold text-white uppercase mb-4 tracking-tight">
          Abonnez-vous à notre Newsletter Pro
        </h2>
        
        <p className="text-blue-100 text-sm md:text-base mb-10 opacity-90">
          Recevez les dernières actualités du tourisme africain et international
        </p>
 
        {status === 'success' ? (
          <div className="bg-white/10 border border-green-500/50 rounded-2xl p-6 flex flex-col items-center animate-in zoom-in-95 duration-300">
            <CheckCircle2 className="text-green-400 mb-2" size={32} />
            <p className="text-white font-medium">Merci ! Votre inscription est validée.</p>
            <p className="text-blue-100 text-sm mt-1">
              Consultez votre boîte mail pour confirmer votre abonnement.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="relative max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-0 overflow-hidden rounded-xl md:rounded-full bg-white p-1">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email professionnelle"
                disabled={status === 'loading'}
                className="w-full bg-transparent px-6 py-4 text-[#1A3A8A] outline-none placeholder:text-gray-400 text-sm md:text-base disabled:opacity-50"
              />
              <button
                disabled={status === 'loading'}
                type="submit"
                className="w-full md:w-auto bg-[#F19300] hover:bg-[#d98400] text-white font-black px-10 py-4 rounded-lg md:rounded-full transition-all flex items-center justify-center gap-2 min-w-[180px] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Inscription...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>S&apos;ABONNER</span>
                  </>
                )}
              </button>
            </div>
            
            {status === 'error' && errorMessage && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm font-medium">
                  {errorMessage}
                </p>
              </div>
            )}
          </form>
        )}
 
        <p className="text-blue-200 text-xs mt-6 opacity-70">
          En vous inscrivant, vous acceptez de recevoir nos communications.
          Vous pouvez vous désabonner à tout moment.
        </p>
 
      </div>
    </section>
  );
};
 
export default NewsletterSection;