// // src/components/shared/TopBar.tsx
// "use client";

// import React, { useState } from 'react';
// import { Mail, Loader2, X, Check, AlertCircle } from 'lucide-react';
// import api from '@/lib/api';
// import { AxiosError } from 'axios';

// interface ApiErrorResponse {
//   message?: string;
// }

// const TopBar = () => {
//   const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
//   const [newsletterEmail, setNewsletterEmail] = useState("");
//   const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
//   const [errorMessage, setErrorMessage] = useState<string>(""); // ✅ Message d'erreur dynamique

//   const handleNewsletterSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newsletterEmail) return;

//     setNewsletterStatus('loading');
//     setErrorMessage(""); // ✅ Réinitialiser l'erreur

//     try {
//       await api.post('/newsletter/subscribe', {
//         email: newsletterEmail,
//         source: 'topbar',
//         type: 'general'
//       });

//       setNewsletterStatus('success');
//       setNewsletterEmail("");
      
//       // Auto-fermeture après 3 secondes
//       setTimeout(() => {
//         setNewsletterStatus('idle');
//         setIsNewsletterOpen(false);
//       }, 3000);
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiErrorResponse>;
//       console.error("Erreur newsletter:", axiosError.response?.data);
      
//       // ✅ Récupérer le message d'erreur de l'API
//       const apiMessage = axiosError.response?.data?.message;
      
//       // ✅ Définir le message d'erreur approprié
//       if (axiosError.response?.status === 400) {
//         // Erreur 400 = Email déjà inscrit ou données invalides
//         setErrorMessage(apiMessage || "Cet email est déjà inscrit à notre newsletter.");
//       } else if (axiosError.response?.status === 500) {
//         // Erreur serveur
//         setErrorMessage("Erreur serveur. Veuillez réessayer plus tard.");
//       } else if (!axiosError.response) {
//         // Pas de réponse = problème réseau
//         setErrorMessage("Problème de connexion. Vérifiez votre réseau.");
//       } else {
//         // Autre erreur
//         setErrorMessage(apiMessage || "Une erreur est survenue. Veuillez réessayer.");
//       }
      
//       setNewsletterStatus('error');
      
//       // ✅ Auto-reset après 5 secondes
//       setTimeout(() => {
//         setNewsletterStatus('idle');
//         setErrorMessage("");
//       }, 5000);
//     }
//   };

//   const handleClose = () => {
//     setIsNewsletterOpen(false);
//     setNewsletterEmail("");
//     setNewsletterStatus('idle');
//     setErrorMessage(""); // ✅ Réinitialiser l'erreur
//   };

//   return (
//     <div className="w-full bg-[#F0F2F5] py-3 px-6 flex items-center justify-between border-b border-gray-200">
//       {/* 1. Espace Publicitaire (Centre) */}
//       <div className="flex-1 flex justify-center">
//         <div className="relative w-full max-w-2xl h-[120px] bg-white shadow-sm overflow-hidden rounded-sm border border-gray-300">
//           {/* Simulation de la bannière de la capture */}
//           <img 
//             src="/ads/banner-promo.jpg"
//             alt="Espace Publicitaire"
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               // Fallback si l'image n'existe pas
//               e.currentTarget.style.display = 'none';
//               e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><p class="text-gray-400 text-xs font-medium">Espace Publicitaire 728×90</p></div>';
//             }}
//           />
//           <div className="absolute inset-0 flex flex-col justify-end items-center pb-2 bg-black/10">
//             <span className="text-white font-black text-2xl tracking-tighter shadow-black drop-shadow-md">
//               50% OFF
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* 2. Utilitaires (Droite) : Langue et Newsletter */}
//       <div className="flex items-center gap-6 ml-4 relative">
//         {/* Sélecteur de Langue */}
//         <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white text-[12px] font-medium">
//           <button className="bg-[#002654] text-white px-3 py-1.5 transition-colors">
//             FR
//           </button>
//           <button className="text-gray-500 px-3 py-1.5 hover:bg-gray-100 transition-colors">
//             EN
//           </button>
//         </div>

//         {/* ✅ CTA Newsletter Extensible */}
//         <div className={`
//           flex items-center gap-2 bg-white border rounded-full
//           transition-all duration-300 ease-in-out overflow-hidden
//           ${isNewsletterOpen ? 'w-80' : 'w-auto'}
//           ${newsletterStatus === 'error' ? 'border-red-300' : 'border-gray-300'}
//         `}>
//           {!isNewsletterOpen ? (
//             /* État fermé : Bouton simple */
//             <button 
//               onClick={() => setIsNewsletterOpen(true)}
//               className="flex items-center gap-2 text-[#002654] cursor-pointer hover:text-blue-800 transition-colors px-3 py-1.5"
//             >
//               <div className="border border-gray-300 rounded bg-white">
//                 <Mail size={16} strokeWidth={1.5} />
//               </div>
//               <span className="text-sm font-semibold whitespace-nowrap">Newsletter</span>
//             </button>
//           ) : (
//             /* État ouvert : Formulaire d'inscription */
//             <div className="flex items-center gap-2 w-full px-3 py-1.5">
//               {newsletterStatus === 'success' ? (
//                 /* ✅ Message de succès */
//                 <div className="flex items-center gap-2 text-green-600 text-sm font-medium w-full">
//                   <Check size={16} strokeWidth={2.5} />
//                   <span>Inscription réussie !</span>
//                 </div>
//               ) : newsletterStatus === 'error' ? (
//                 /* ❌ Message d'erreur inline */
//                 <div className="flex items-center gap-2 text-red-600 text-xs font-medium w-full">
//                   <AlertCircle size={16} strokeWidth={2} />
//                   <span className="flex-1 truncate">{errorMessage}</span>
//                 </div>
//               ) : (
//                 /* 📝 Formulaire */
//                 <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 w-full">
//                   <Mail size={16} className="text-gray-400 shrink-0" strokeWidth={1.5} />
//                   <input 
//                     type="email"
//                     value={newsletterEmail}
//                     onChange={(e) => setNewsletterEmail(e.target.value)}
//                     placeholder="Votre email..."
//                     required
//                     disabled={newsletterStatus === 'loading'}
//                     autoFocus
//                     className="
//                       flex-1 bg-transparent border-none outline-none 
//                       text-gray-700 text-sm placeholder:text-gray-400
//                       disabled:opacity-50
//                     "
//                   />
//                   <button 
//                     type="submit"
//                     disabled={newsletterStatus === 'loading'}
//                     className="
//                       bg-[#002654] hover:bg-[#001A4D] text-white 
//                       px-4 py-1.5 rounded-full text-xs font-bold 
//                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed
//                       flex items-center gap-1
//                     "
//                   >
//                     {newsletterStatus === 'loading' ? (
//                       <>
//                         <Loader2 size={12} className="animate-spin" />
//                         <span>Envoi...</span>
//                       </>
//                     ) : (
//                       "OK"
//                     )}
//                   </button>
//                 </form>
//               )}
              
//               {/* Bouton fermer */}
//               <button 
//                 onClick={handleClose}
//                 className="text-gray-400 hover:text-gray-600 transition-colors p-1 shrink-0"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopBar;












// src/components/shared/TopBar.tsx
"use client";

import React, { useState, } from "react";
import { Mail, Loader2, X, Check, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { AxiosError } from "axios";

//import { useAdvertising } from "@/hooks/useAdvertising.public";

import { AdvertisingBanner } from "@/components/AdvertisingBanner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiErrorResponse {
  message?: string;
}

interface TopBarProps {
  /** Slug de la zone défini dans l'admin — défaut: "top-banner-accueil" */
  zoneSlug?: string;
  /** Afficher les points de pagination */
  showDots?: boolean;
  className?: string;
}


// ─── Hook : gestion newsletter ────────────────────────────────────────────────

function useNewsletter() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      await api.post("/newsletter/subscribe", {
        email,
        source: "topbar",
        type: "general",
      });

      setStatus("success");
      setEmail("");

      setTimeout(() => {
        setStatus("idle");
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("Erreur newsletter:", axiosError.response?.data);

      const apiMessage = axiosError.response?.data?.message;

      if (axiosError.response?.status === 400) {
        setErrorMessage(apiMessage || "Cet email est déjà inscrit à notre newsletter.");
      } else if (axiosError.response?.status === 500) {
        setErrorMessage("Erreur serveur. Veuillez réessayer plus tard.");
      } else if (!axiosError.response) {
        setErrorMessage("Problème de connexion. Vérifiez votre réseau.");
      } else {
        setErrorMessage(apiMessage || "Une erreur est survenue. Veuillez réessayer.");
      }

      setStatus("error");

      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEmail("");
    setStatus("idle");
    setErrorMessage("");
  };

  return { isOpen, setIsOpen, email, setEmail, status, errorMessage, handleSubmit, handleClose };
}





// ─── Composant : Bouton Newsletter ───────────────────────────────────────────

function NewsletterButton() {
  const { isOpen, setIsOpen, email, setEmail, status, errorMessage, handleSubmit, handleClose } =
    useNewsletter();

  return (
    <div
      className={`
        flex items-center gap-2 bg-white border rounded-full
        transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? "w-80" : "w-auto"}
        ${status === "error" ? "border-red-300" : "border-gray-300"}
      `}
    >
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-[#002654] cursor-pointer hover:text-blue-800 transition-colors px-3 py-1.5"
        >
          <div className="border border-gray-300 rounded bg-white">
            <Mail size={16} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-semibold whitespace-nowrap">Newsletter</span>
        </button>
      ) : (
        <div className="flex items-center gap-2 w-full px-3 py-1.5">
          {status === "success" ? (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium w-full">
              <Check size={16} strokeWidth={2.5} />
              <span>Inscription réussie !</span>
            </div>
          ) : status === "error" ? (
            <div className="flex items-center gap-2 text-red-600 text-xs font-medium w-full">
              <AlertCircle size={16} strokeWidth={2} />
              <span className="flex-1 truncate">{errorMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
              <Mail size={16} className="text-gray-400 shrink-0" strokeWidth={1.5} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email..."
                required
                disabled={status === "loading"}
                autoFocus
                className="
                  flex-1 bg-transparent border-none outline-none
                  text-gray-700 text-sm placeholder:text-gray-400
                  disabled:opacity-50
                "
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="
                  bg-[#002654] hover:bg-it-blue text-white
                  px-4 py-1.5 rounded-full text-xs font-bold
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-1
                "
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Envoi...</span>
                  </>
                ) : (
                  "OK"
                )}
              </button>
            </form>
          )}

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 shrink-0"
            aria-label="Fermer la newsletter"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Composant principal : TopBar ─────────────────────────────────────────────

const TopBar = ({
  zoneSlug = "top-banner-accueils",
  showDots = true,
  className = "",
}: TopBarProps) => {
  return (
    <div className="w-full bg-it-gray-light py-3 px-6 flex items-center justify-between border-b border-gray-200">
      {/* Zone publicitaire (centre) */}
      <AdvertisingBanner zoneSlug={zoneSlug} showDots={showDots} className={className} />

      {/* Utilitaires (droite) : Langue + Newsletter */}
      <div className="flex items-center gap-6 ml-4">
        {/* Sélecteur de langue */}
        <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white text-[12px] font-medium">
          <button className="bg-[#002654] text-white px-3 py-1.5 transition-colors">
            FR
          </button>
          <button className="text-gray-500 px-3 py-1.5 hover:bg-gray-100 transition-colors">
            EN
          </button>
        </div>

        {/* Newsletter */}
        <NewsletterButton />
      </div>
    </div>
  );
};

export default TopBar;