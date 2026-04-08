import React from 'react';

const MediaExpertise = () => {
  return (
    <section 
      className="relative py-32 flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ 
        // 1. Remplacez par le chemin de votre image
        backgroundImage: "url('/images/image-expertise.png')", 
        // 2. C'est CETTE ligne qui crée l'effet de stabilité (Parallaxe)
        backgroundAttachment: 'fixed' 
      }}
    >
      {/* 3. Overlay sombre pour la lisibilité du texte */}
      <div className="absolute inset-0 bg-[#1e293b]/80 backdrop-blur-[2px]"></div>

      {/* Content Container (relative z-10 pour passer au-dessus de l'overlay) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        
        {/* Titre (Texte passé en blanc) */}
        <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-10">
          L&apos;Expertise Média au service de <br /> l&apos;Emploi
        </h2>

        {/* Paragraphe (Texte passé en blanc/gris très clair) */}
        <p className="text-slate-100 text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto">
          Parce que nous décryptons le tourisme chaque jour, nous comprenons mieux que 
          personne ses évolutions et ses besoins en compétences. iTourisme Emploi n&apos;est pas 
          une simple plateforme technique, c&apos;est le prolongement naturel de notre mission : faire 
          bouger le tourisme en connectant les idées, les lieux, et maintenant, les Hommes.
        </p>
      </div>
    </section>
  );
};

export default MediaExpertise;