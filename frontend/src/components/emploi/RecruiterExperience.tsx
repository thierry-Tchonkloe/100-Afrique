import React from 'react';
import { Building2, Filter, Handshake } from 'lucide-react';

const recruiterFeatures = [
  {
    title: "Marque Employeur Puissante",
    description: "Éditez une vitrine entreprise immersive. Séduisez les candidats en partageant votre culture, vos valeurs et vos coulisses en photos et vidéos.",
    icon: <Building2 className="w-6 h-6 text-white" />,
    image: "/images/employer-branding.png", // Remplacez par vos visuels
  },
  {
    title: "ATS Intégré Performant",
    description: "Gérez vos offres et filtrez les flux de candidatures avec une précision chirurgicale. Un outil tout-en-un pour optimiser votre temps de recrutement.",
    icon: <Filter className="w-6 h-6 text-white" />,
    image: "/images/ats-dashboard.png",
  },
  {
    title: "Accès Direct aux Talents",
    description: "Sourcez parmi une base de profils qualifiés et passionnés, issus de la communauté engagée d'iTourisme Nomade.",
    icon: <Handshake className="w-6 h-6 text-white" />,
    image: "/images/talent-access.png",
  }
];

const RecruiterExperience = () => {
  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Titre de la section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] text-center leading-tight">
            Recruteurs : Identifiez les talents qui feront bouger votre entreprise
          </h2>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {recruiterFeatures.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              
              {/* Conteneur Image + Icône flottante */}
              <div className="relative w-full mb-12">
                <div className="overflow-hidden rounded-xl shadow-md border border-gray-100 bg-white">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-auto object-cover aspect-[16/10] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Icône Verte (Émeraude) flottante */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#10b981] rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
              </div>

              {/* Texte descriptif */}
              <h3 className="text-xl font-bold text-[#1e293b] mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base px-2">
                {feature.description}
              </p>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecruiterExperience;