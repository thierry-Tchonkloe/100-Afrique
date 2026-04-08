// src/components/magazine/SubscriptionPlans.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '@/lib/api';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  issuesPerYear: number;
  features: string[];
  isPopular: boolean;
}

// Plans par défaut (utilisés comme fallback)
const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'digital',
    name: 'Numérique',
    description: 'Version digitale',
    price: 49,
    currency: 'EUR',
    duration: 'an',
    issuesPerYear: 12,
    features: [
      'Accès illimité aux 12 numéros annuels',
      'Archives complètes en ligne',
      'Newsletter exclusive hebdomadaire',
      'Format PDF haute qualité'
    ],
    isPopular: false
  },
  {
    id: 'print',
    name: 'Papier',
    description: 'Version imprimée',
    price: 89,
    currency: 'EUR',
    duration: 'an',
    issuesPerYear: 12,
    features: [
      '12 numéros papier livrés chez vous',
      'Accès digital inclus',
      'Newsletter exclusive',
      'Invitations aux événements WAXEHO'
    ],
    isPopular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Papier + Digital + Avantages',
    price: 129,
    currency: 'EUR',
    duration: 'an',
    issuesPerYear: 12,
    features: [
      'Tout le contenu Papier + Digital',
      'Accès prioritaire aux événements',
      'Réseau professionnel exclusif',
      'Annuaire des acteurs du tourisme',
      'Consultation téléphonique mensuelle'
    ],
    isPopular: false
  }
];

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Tentative de récupération depuis l'API
        const response = await api.get('/magazine/subscription-plans');
        setPlans(response.data.data || response.data);
      } catch (error) {
        // Si erreur 404 ou autre, utiliser les plans par défaut
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            console.info("Endpoint /magazine/subscription-plans non disponible, utilisation des plans par défaut");
          } else {
            console.error("Erreur lors de la récupération des plans:", error.message);
          }
        }
        
        // Utiliser les plans par défaut en cas d'erreur
        setPlans(DEFAULT_PLANS);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: string) => {
    try {
      // Redirection vers la page de paiement
      window.location.href = `/magazine/checkout?plan=${planId}`;
      
      // OU appel API pour créer une session de paiement (à implémenter)
      // const response = await api.post('/magazine/create-checkout-session', {
      //   planId
      // });
      // window.location.href = response.data.checkoutUrl;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Erreur abonnement:", error.response?.data);
      }
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  if (loading) return (
    <div className="py-20 flex justify-center">
      <Loader2 className="animate-spin text-it-blue" size={40} />
    </div>
  );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        {/* En-tête de section */}
        <div className="mb-16 space-y-2">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-it-blue uppercase tracking-tight">
            Ne manquez plus aucun numéro
          </h2>
          <p className="text-gray-500 font-medium tracking-[0.2em] uppercase text-sm">
            Abonnez-vous
          </p>
        </div>

        {/* Grille des Forfaits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-2xl transition-all duration-300 ${
                plan.isPopular 
                ? 'border-2 border-it-orange shadow-2xl scale-105 z-10' 
                : 'border border-gray-100 shadow-xl hover:shadow-2xl'
              } bg-white`}
            >
              {/* Badge Populaire */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-it-orange text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                  Populaire
                </div>
              )}

              <h3 className="text-2xl font-serif font-bold text-it-blue mb-2">
                {plan.name}
              </h3>
              
              {plan.description && (
                <p className="text-gray-500 text-xs mb-4">{plan.description}</p>
              )}

              <div className="mb-6">
                <span className="text-5xl font-bold text-it-orange">{plan.price}€</span>
                <p className="text-gray-400 text-xs mt-2 uppercase font-bold tracking-tighter">
                  par {plan.duration} ({plan.issuesPerYear} numéros)
                </p>
              </div>

              {/* Liste des avantages */}
              <ul className="space-y-4 mb-10 flex-1 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check size={16} className="text-it-orange mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Bouton d'action */}
              <button 
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full font-black py-4 rounded-xl text-[11px] uppercase tracking-widest transition-all shadow-lg ${
                  plan.isPopular
                    ? 'bg-it-orange hover:bg-[#d98400] text-white shadow-it-orange/10'
                    : 'bg-it-blue hover:bg-it-blue/90 text-white'
                }`}
              >
                Choisir cet abonnement
              </button>
            </div>
          ))}
        </div>

        {/* Note en bas */}
        <p className="text-gray-400 text-sm mt-12 italic">
          Tous nos abonnements sont sans engagement et résiliables à tout moment.
        </p>
      </div>
    </section>
  );
};

export default SubscriptionPlans;