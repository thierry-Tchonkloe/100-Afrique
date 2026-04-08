import React from 'react';
import { User, LineChart, Bell } from 'lucide-react'; // Utilisation de lucide-react pour les icônes

const features = [
  {
    title: "Profil Numérique Haute Fidélité",
    description: "Valorisez vos expériences, vos compétences linguistiques et votre esprit nomade. Votre CV devient une vitrine interactive consultée par les meilleurs recruteurs du tourisme.",
    icon: <User className="w-6 h-6 text-white" />,
    image: "/images/dashboard-profile.png", // Remplacez par vos assets
  },
  {
    title: "Suivi en Temps Réel",
    description: "Pilotez toutes vos candidatures depuis un tableau de bord unique. Ne perdez plus jamais la trace d'une postulation et recevez des feedbacks clairs.",
    icon: <LineChart className="w-6 h-6 text-white" />,
    image: "/images/dashboard-analytics.png",
  },
  {
    title: "Alertes Matching Intelligentes",
    description: "Soyez le premier averti. Notre algorithme vous connecte instantanément aux offres qui correspondent à votre profil et à vos aspirations de mobilité.",
    icon: <Bell className="w-6 h-6 text-white" />,
    image: "/images/smart-alerts.png",
  }
];

const CandidateExperience = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Titre de la section */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] text-center mb-16">
          Candidats : Plus qu&apos;un Job Board, votre boussole de carrière
        </h2>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              
              {/* Conteneur Image + Icône flottante */}
              <div className="relative w-full mb-12">
                <div className="overflow-hidden rounded-xl shadow-lg border border-gray-100">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-auto object-cover aspect-[16/10]"
                  />
                </div>
                
                {/* Icône Orange flottante */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#eb5e14] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  {feature.icon}
                </div>
              </div>

              {/* Texte descriptif */}
              <h3 className="text-xl font-bold text-[#1e293b] mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base px-4">
                {feature.description}
              </p>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CandidateExperience;