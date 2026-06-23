// src/components/shared/ModaleDestination.tsx
"use client";

import React, { useState } from 'react';
import { X, Send, CheckCircle, Loader2, Handshake } from 'lucide-react';
import api from '@/lib/api';

interface ModaleDestinationProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModaleDestination = ({ isOpen, onClose }: ModaleDestinationProps) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      destinations: formData.get('destinations'),
      collabType: formData.get('collabType'),
      officeName: formData.get('officeName'),
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      email: formData.get('email'),
      objectives: formData.get('objectives'),
    };

    try {
      await api.post('/contacts/partenariat-destination', payload);
      setStep('success');
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire de partenariat:", error);
      alert("Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer ou nous contacter par WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-it-emerald-dark/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl relative flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">

        <button onClick={handleClose} className="absolute top-5 right-5 p-1 text-gray-400 hover:text-gray-600 transition-colors z-20">
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="overflow-y-auto p-6 md:p-10">
          {step === 'form' ? (
            <>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-it-terracotta rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                  <Handshake size={28} />
                </div>
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-it-terracotta uppercase tracking-wider block">
                    WAXEHO & i Tourisme TV
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-it-blue leading-tight">
                    Promouvoir Votre Destination
                  </h2>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[13px] text-gray-600 leading-relaxed mb-2">
                  Nous aidons les territoires à gagner en visibilité auprès de notre audience professionnelle et grand public.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-it-terracotta text-xs">★</span>
                  <span className="text-[10px] font-bold text-it-terracotta uppercase tracking-wide">
                    Contact Partenariat Destination
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1.5">
                    Quelle(s) Destination(s) souhaitez-vous promouvoir ? <span className="text-red-500">*</span>
                  </label>
                  <input required name="destinations" type="text" placeholder="Ex: Sénégal, région de Marrakech, etc." className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none placeholder:text-gray-300" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1.5">
                    Type de collaboration envisagée ? <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select required name="collabType" className="w-full appearance-none bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none cursor-pointer text-gray-700">
                      <option value="">Sélectionnez une option</option>
                      <option value="campaign">Campagne Digitale</option>
                      <option value="video">Production Vidéo</option>
                      <option value="edito">Dossier Éditorial</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1.5">
                    Nom de votre Office de Tourisme / Institution / Agence <span className="text-red-500">*</span>
                  </label>
                  <input required name="officeName" type="text" className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 mb-1.5">Prénom <span className="text-red-500">*</span></label>
                    <input required name="firstname" type="text" className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 mb-1.5">Nom <span className="text-red-500">*</span></label>
                    <input required name="lastname" type="text" className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1.5">Email Professionnel <span className="text-red-500">*</span></label>
                  <input required name="email" type="email" className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1.5">Décrivez brièvement les objectifs de votre campagne (Optionnel)</label>
                  <textarea name="objectives" rows={4} placeholder="Partagez vos objectifs, votre audience cible, ou toute information pertinente..." className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none resize-none placeholder:text-gray-300" />
                </div>

                <div className="flex gap-3 items-start pt-2">
                  <input required type="checkbox" id="rgpd" className="mt-1 h-3.5 w-3.5 rounded border-gray-300 text-it-terracotta focus:ring-it-terracotta cursor-pointer" />
                  <label htmlFor="rgpd" className="text-[10px] text-gray-500 leading-snug cursor-pointer">
                    J&apos;accepte que mes données soient utilisées pour traiter ma demande de partenariat conformément à la politique de confidentialité RGPD. Vos données ne seront jamais partagées avec des tiers.
                  </label>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-it-terracotta text-white font-bold py-3.5 rounded-md flex items-center justify-center gap-3 hover:bg-it-terracotta-dark transition-all shadow-md active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={16} fill="white" />}
                  <span className="text-xs uppercase tracking-widest">Envoyer la Demande de Partenariat</span>
                </button>

                <div className="text-center pt-2">
                  <p className="text-[10px] text-gray-400 mb-3">Ou contactez notre service Partenariats directement</p>
                  <a
                    href="https://wa.me/33123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-it-emerald text-xs font-bold hover:opacity-80 transition-opacity"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.554 4.197 1.608 6.023L0 24l6.135-1.61a11.754 11.754 0 005.91 1.586h.005c6.637 0 12.05-5.414 12.05-12.05a11.75 11.75 0 00-3.41-8.523z"/></svg>
                    Via WhatsApp
                  </a>
                </div>
              </form>
            </>
          ) : (
            <div className="py-12 text-center space-y-6 animate-in zoom-in duration-500">
              <div className="flex justify-center">
                <CheckCircle size={60} className="text-it-emerald" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-it-blue">Demande Reçue !</h2>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">
                Merci ! Un responsable des partenariats destinations reviendra vers vous sous 24h.
              </p>
              <button onClick={handleClose} className="bg-it-emerald-dark text-white px-8 py-2 rounded-full font-bold transition-all text-sm uppercase tracking-widest">
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModaleDestination;












// // src/components/shared/ModaleDestination.tsx
// "use client";

// import React, { useState } from 'react';
// import { X, Send, CheckCircle, Loader2, Handshake } from 'lucide-react';
// import api from '@/lib/api';

// interface ModaleDestinationProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const ModaleDestination = ({ isOpen, onClose }: ModaleDestinationProps) => {
//   const [step, setStep] = useState<'form' | 'success'>('form');
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData(e.currentTarget);
    
//     // Construction de l'objet de données à envoyer
//     const payload = {
//       destinations: formData.get('destinations'),
//       collabType: formData.get('collabType'),
//       officeName: formData.get('officeName'),
//       firstname: formData.get('firstname'),
//       lastname: formData.get('lastname'),
//       email: formData.get('email'),
//       objectives: formData.get('objectives'),
//     };

//     try {
//       // Appel à ton endpoint spécifique avec ton instance API centralisée
//       await api.post('/contacts/partenariat-destination', payload);
      
//       // Passage à l'état de succès en cas de 200/201
//       setStep('success');
//     } catch (error) {
//       console.error("Erreur lors de l'envoi du formulaire de partenariat:", error);
//       alert("Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer ou nous contacter par WhatsApp.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Réinitialisation de l'état du modal lors de la fermeture pour la prochaine ouverture
//   const handleClose = () => {
//     setStep('form');
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
//       <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl relative flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
        
//         {/* Bouton Fermer */}
//         <button onClick={handleClose} className="absolute top-5 right-5 p-1 text-gray-400 hover:text-gray-600 transition-colors z-20">
//           <X size={20} strokeWidth={2.5} />
//         </button>

//         <div className="overflow-y-auto p-6 md:p-10">
//           {step === 'form' ? (
//             <>
//               {/* Header Groupé */}
//               <div className="flex items-start gap-4 mb-6">
//                 <div className="w-14 h-14 bg-[#F19300] rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
//                   <Handshake size={28} />
//                 </div>
//                 <div className="pt-1">
//                   <span className="text-[10px] font-bold text-[#F19300] uppercase tracking-wider block">
//                     WAXEHO & i Tourisme TV
//                   </span>
//                   <h2 className="text-2xl font-serif font-bold text-[#2D3E50] leading-tight">
//                     Promouvoir Votre Destination
//                   </h2>
//                 </div>
//               </div>

//               {/* Texte de présentation */}
//               <div className="mb-8">
//                 <p className="text-[13px] text-gray-600 leading-relaxed mb-2">
//                   Nous aidons les territoires à gagner en visibilité auprès de notre audience professionnelle et grand public.
//                 </p>
//                 <div className="flex items-center gap-2">
//                   <span className="text-[#F19300] text-xs">★</span>
//                   <span className="text-[10px] font-bold text-[#F19300] uppercase tracking-wide">
//                     Contact Partenariat Destination
//                   </span>
//                 </div>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* Destination */}
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-800 mb-1.5">
//                     Quelle(s) Destination(s) souhaitez-vous promouvoir ? <span className="text-red-500">*</span>
//                   </label>
//                   <input required name="destinations" type="text" placeholder="Ex: Sénégal, région de Marrakech, etc." className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-[#F19300] outline-none placeholder:text-gray-300" />
//                 </div>

//                 {/* Type de collaboration */}
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-800 mb-1.5">
//                     Type de collaboration envisagée ? <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <select required name="collabType" className="w-full appearance-none bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-[#F19300] outline-none cursor-pointer text-gray-700">
//                       <option value="">Sélectionnez une option</option>
//                       <option value="campaign">Campagne Digitale</option>
//                       <option value="video">Production Vidéo</option>
//                       <option value="edito">Dossier Éditorial</option>
//                     </select>
//                     <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                       <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Nom Institution */}
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-800 mb-1.5">
//                     Nom de votre Office de Tourisme / Institution / Agence <span className="text-red-500">*</span>
//                   </label>
//                   <input required name="officeName" type="text" className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-[#F19300] outline-none" />
//                 </div>

//                 {/* Prénom et Nom */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-800 mb-1.5">Prénom <span className="text-red-500">*</span></label>
//                     <input required name="firstname" type="text" className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-[#F19300] outline-none" />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-800 mb-1.5">Nom <span className="text-red-500">*</span></label>
//                     <input required name="lastname" type="text" className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-[#F19300] outline-none" />
//                   </div>
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-800 mb-1.5">Email Professionnel <span className="text-red-500">*</span></label>
//                   <input required name="email" type="email" className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-[#F19300] outline-none" />
//                 </div>

//                 {/* Objectifs */}
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-800 mb-1.5">Décrivez brièvement les objectifs de votre campagne (Optionnel)</label>
//                   <textarea name="objectives" rows={4} placeholder="Partagez vos objectifs, votre audience cible, ou toute information pertinente..." className="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm focus:border-[#F19300] outline-none resize-none placeholder:text-gray-300" />
//                 </div>

//                 {/* Consentement RGPD */}
//                 <div className="flex gap-3 items-start pt-2">
//                   <input required type="checkbox" id="rgpd" className="mt-1 h-3.5 w-3.5 rounded border-gray-300 text-[#F19300] focus:ring-[#F19300] cursor-pointer" />
//                   <label htmlFor="rgpd" className="text-[10px] text-gray-500 leading-snug cursor-pointer">
//                     J&apos;accepte que mes données soient utilisées pour traiter ma demande de partenariat conformément à la politique de confidentialité RGPD. Vos données ne seront jamais partagées avec des tiers.
//                   </label>
//                 </div>

//                 {/* Bouton d'action */}
//                 <button 
//                   disabled={loading}
//                   type="submit" 
//                   className="w-full bg-[#F19300] text-white font-bold py-3.5 rounded-md flex items-center justify-center gap-3 hover:bg-[#d98400] transition-all shadow-md active:scale-[0.98] disabled:opacity-70"
//                 >
//                   {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={16} fill="white" />}
//                   <span className="text-xs uppercase tracking-widest">Envoyer la Demande de Partenariat</span>
//                 </button>

//                 {/* WhatsApp Footer */}
//                 <div className="text-center pt-2">
//                   <p className="text-[10px] text-gray-400 mb-3">Ou contactez notre service Partenariats directement</p>
//                   <a 
//                     href="https://wa.me/33123456789" // Remplace par ton numéro réel
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="flex items-center justify-center gap-2 w-full text-[#22C55E] text-xs font-bold hover:opacity-80 transition-opacity"
//                   >
//                     <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.554 4.197 1.608 6.023L0 24l6.135-1.61a11.754 11.754 0 005.91 1.586h.005c6.637 0 12.05-5.414 12.05-12.05a11.75 11.75 0 00-3.41-8.523z"/></svg>
//                     Via WhatsApp
//                   </a>
//                 </div>
//               </form>
//             </>
//           ) : (
//             /* Succès */
//             <div className="py-12 text-center space-y-6 animate-in zoom-in duration-500">
//               <div className="flex justify-center">
//                 <CheckCircle size={60} className="text-[#22C55E]" strokeWidth={1.5} />
//               </div>
//               <h2 className="text-2xl font-serif font-bold text-[#2D3E50]">Demande Reçue !</h2>
//               <p className="text-gray-600 text-sm max-w-xs mx-auto">
//                 Merci ! Un responsable des partenariats destinations reviendra vers vous sous 24h.
//               </p>
//               <button onClick={handleClose} className="bg-[#2D3E50] text-white px-8 py-2 rounded-full font-bold transition-all text-sm uppercase tracking-widest">
//                 Fermer
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModaleDestination;