// src/constants/constants.ts

export interface Offer {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  budgetRange: string;
  tag?: string;
  details: string[];
  image: string;
}

export const OFFERS: Offer[] = [
  { 
    id: 1, 
    title: "Bannière verticale Article", 
    category: "Display (Bannières)", 
    description: "Une bannière verticale (skyscraper) placée dans la sidebar de chaque article.", 
    price: 150, 
    unit: "semaine", 
    budgetRange: "Moins de 500 €",
    image: "/images/offres/skyscraper-article.jpg",
    details: [
      "Visibilité sur toutes les lectures d'articles.",
      "Présence discrète mais constante."
    ]
  },
  { 
    id: 2, 
    title: "Bannière horizontale Article", 
    category: "Display (Bannières)", 
    description: "Une bannière horizontale (leaderboard) intégrée directement dans les articles.", 
    price: 200, 
    unit: "semaine", 
    budgetRange: "Moins de 500 €",
    image: "/images/offres/skyscraper-article.jpg",
    details: [
      "Impact fort au cœur de la lecture.",
      "Forte mémorisation de votre marque."
    ]
  },
  { 
    id: 3, 
    title: "Bannière verticale Catégorie", 
    category: "Display (Bannières)", 
    description: "Bannière verticale visible sur toutes les pages d'une rubrique spécifique (Destinations, Aérien, etc.).", 
    price: 250, 
    unit: "semaine", 
    budgetRange: "Moins de 500 €",
    image: "/images/offres/skyscraper-article.jpg",
    details: [
      "Visibilité ciblée sur un segment précis de l'audience."
    ]
  },
  { 
    id: 4, 
    title: "Bannière horizontale Catégorie", 
    category: "Display (Bannières)", 
    description: "Une bannière horizontale dans le flux des pages catégories.", 
    price: 300, 
    unit: "semaine", 
    budgetRange: "Moins de 500 €",
    image: "/images/offres/skyscraper-article.jpg",
    details: [
      "Exposition répétée auprès des professionnels consultant une thématique."
    ]
  },
  { 
    id: 5, 
    title: "Bannière verticale Homepage", 
    category: "Display (Bannières)", 
    description: "Une bannière verticale affichée sur la page d'accueil.", 
    price: 350, 
    unit: "semaine", 
    budgetRange: "Moins de 500 €",
    image: "/images/offres/skyscraper-article.jpg",
    details: [
      "Visibilité premium auprès de tous les visiteurs du site."
    ]
  },
  { 
    id: 6, 
    title: "Bannière horizontale Homepage", 
    category: "Display (Bannières)", 
    description: "Une bannière horizontale placée en haut ou au milieu de la homepage.", 
    price: 400, 
    unit: "semaine", 
    budgetRange: "Moins de 500 €", 
    image: "/images/offres/skyscraper-article.jpg",
    tag: "OFFRE SPÉCIALE",
    details: [
      "Impact maximal dès la première impression."
    ]
  },
  { 
    id: 7, 
    title: "Pack Multi-emplacements (-20%)", 
    category: "Display (Packs)", 
    description: "Combinez 3+ bannières et obtenez -20%. Le prix affiché est un exemple par semaine.", 
    price: 480, 
    unit: "semaine", 
    budgetRange: "Moins de 500 €", 
    image: "/images/offres/skyscraper-article.jpg",
    tag: "OFFRE SPÉCIALE",
    details: [
      "Remise de 20% sur le total.",
      "Le prix final dépend des emplacements choisis.",
      "Le prix affiché est un exemple pour 3 bannières de base."
    ]
  },
  { 
    id: 8, 
    title: "Partenaire Fondateur (Startup)", 
    category: "Offres Spéciales", 
    description: "Offre exclusive réservée aux références émergentes de la Travel Tech française.", 
    price: 500, 
    unit: "an", 
    budgetRange: "500 € - 1 500 €", 
    image: "/images/offres/skyscraper-article.jpg",
    tag: "OFFRE SPÉCIALE",
    details: [
      "Création d'une page entreprise dédiée (ex: Civitatis).",
      "4 articles éditoriaux dans l'année valorisant vos innovations.",
      "Statut \"Partenaire Fondateur\", avec visibilité de votre logo en homepage.",
      "Tarif symbolique : 500 € la 1ère année (au lieu de 5 000 €)."
    ]
  },
  { 
    id: 9, 
    title: "Pack Display 4 semaines (-15%)", 
    category: "Display (Packs)", 
    description: "Bénéficiez de -15% en réservant 4 semaines. Le prix affiché est un exemple.", 
    price: 510, 
    unit: "", // L'unité n'est pas claire sur la capture 3, je la laisse vide pour correspondre
    budgetRange: "500 € - 1 500 €", 
    image: "/images/offres/skyscraper-article.jpg",
    tag: "OFFRE SPÉCIALE",
    details: [
      "Remise de 15% appliquée sur le total de 4 semaines.",
      "Le prix final dépend des emplacements choisis.",
      "Le prix affiché correspond à 4 sem. de \"Bannière verticale Article\"."
    ]
  },
  { 
    id: 10, 
    title: "Mise en avant éditoriale", 
    category: "Offres Spéciales", 
    description: "Visibilité immédiate et ciblée auprès des professionnels via un contenu éditorial fort.", 
    price: 800, 
    unit: "", 
    budgetRange: "500 € - 1 500 €",
    image: "/images/offres/skyscraper-article.jpg",
    details: [
      "Rédaction et publication d'un article éditorial optimisé SEO.",
      "Intégration d'un lien vers votre site et relais sur nos réseaux sociaux.",
      "Maintien en ligne garanti pendant au moins 12 mois.",
      "Finalité : visibilité ciblée et présence pérenne sur les moteurs de recherche."
    ]
  },
  { 
    id: 11, 
    title: "Interview partenaire (Texte)", 
    category: "Contenu Sponsorisé", 
    description: "Une interview personnalisée sous format Questions/Réponses pour mettre en avant un dirigeant ou une offre.", 
    price: 900, 
    unit: "", 
    budgetRange: "500 € - 1 500 €",
    image: "/images/offres/skyscraper-article.jpg",
    details: [
      "Mise en avant de votre expertise.",
      "Publication + relais LinkedIn."
    ]
  },
  { 
    id: 12, 
    title: "Encart Promo - Page Pays", 
    category: "Sponsoring thématique", 
    description: "Affichez votre encart promotionnel annuel sur l'une de nos pages destinations (Pays).", 
    price: 1000, 
    unit: "an", 
    budgetRange: "500 € - 1 500 €",
    image: "/images/offres/skyscraper-article.jpg",
    details: [
      "Excellente visibilité sur une destination ciblée.",
      "Idéal pour cibler les agents de voyage spécialistes.",
      "Voir un exemple (Page Grèce)" // Lien simulé
    ]
  },
  { 
    id: 13, 
    title: "Encart Promo - Rapport Interactif", 
    category: "Sponsoring thématique", 
    description: "Associez votre marque à nos rapports data interactifs très consultés par l'industrie.", 
    price: 1000, 
    unit: "an", 
    budgetRange: "500 € - 1 500 €",
    image: "/images/offres/skyscraper-article.jpg",
    details: [
      "Visibilité premium au sein d'un rapport analytique.",
      "Audience très qualifiée (décideurs, data analysts).",
      "Voir un exemple (Rapport Tahiti)" // Lien simulé
    ]
  },
  { 
    id: 14, 
    title: "Pack Display 10+2 semaines", 
    category: "Display (Packs)", 
    description: "Achetez 10 semaines, nous vous en offrons 2. Le prix affiché est un exemple.", 
    price: 1500, 
    unit: "", // Pas d'unité sur la capture 4, je la laisse vide
    budgetRange: "1 500 € - 5 000 €", 
    image: "/images/offres/skyscraper-article.jpg",
    tag: "OFFRE SPÉCIALE",
    details: [
      "Soit 12 semaines au prix de 10.",
      "Le prix final dépend des emplacements choisis.",
      "Le prix affiché correspond à 10 sem. de \"Bannière verticale Article\"."
    ]
  },
  { 
    id: 15, 
    title: "Interview partenaire (Vidéo)", 
    category: "Contenu Sponsorisé", 
    description: "Format vidéo dynamique et engageant pour présenter votre vision.", 
    price: 1500, 
    unit: "", 
    budgetRange: "1 500 € - 5 000 €",
    image: "/images/offres/skyscraper-article.jpg",
    details: [
      "Interview filmée de 5-8 minutes.",
      "Publication + relais LinkedIn.",
      "Fichier vidéo HD fourni."
    ]
  },
  { 
    id: 16, 
    title: "Présence digitale annuelle", 
    category: "Offres Spéciales", 
    description: "Votre espace dédié et du contenu annuel pour vous ancrer dans l'écosystème tourisme.", 
    price: 1500, 
    unit: "an", 
    budgetRange: "1 500 € - 5 000 €",
    image: "/images/offres/skyscraper-article.jpg",
    details: [
      "Création d'une page entreprise optimisée SEO hébergée 12 mois.",
      "Rédaction et publication d'un article éditorial dans l'année avec lien.",
      "Présence dans une rubrique thématique dédiée.",
      "Finalité : visibilité continue et référencement naturel."
    ]
  },
  { 
    id: 17, 
    title: "Plan Destination (15 articles)", 
    category: "Contenu Sponsorisé", 
    description: "Un plan éditorial de 15 semaines (1 article/semaine) pour une visibilité long-terme.", 
    price: 2500, 
    unit: "", 
    budgetRange: "1 500 € - 5 000 €", 
    image: "/images/offres/skyscraper-article.jpg",
    tag: "OFFRE SPÉCIALE",
    details: [
      "15 articles sponsorisés.",
      "Relais LinkedIn hebdomadaire.",
      "Compilation finale en PDF « Dossier Destination ».",
      "Visibilité régulière pendant 4 mois."
    ]
  },
  { 
    id: 18, 
    title: "Package 360°: Plan + Bannière Catégorie", 
    category: "Packages 360°", 
    description: "Le combo parfait entre contenu de fond et visibilité ciblée.", 
    price: 3500, 
    unit: "", 
    budgetRange: "1 500 € - 5 000 €", 
    image: "/images/offres/skyscraper-article.jpg",
    tag: "OFFRE SPÉCIALE",
    details: [
      "Plan Destination (15 articles).",
      "Relais LinkedIn.",
      "PDF récapitulatif offert.",
      "Bannière verticale catégorie (15 semaines consécutives)."
    ]
  },
  { 
    id: 19, 
    title: "Package 360°: Plan + Bannière Homepage", 
    category: "Packages 360°", 
    description: "Associez crédibilité renforcée et visibilité maximale.", 
    price: 4500, 
    unit: "", 
    budgetRange: "1 500 € - 5 000 €", 
    image: "/images/offres/skyscraper-article.jpg",
    tag: "OFFRE SPÉCIALE",
    details: [
      "Plan Destination (15 articles).",
      "Relais LinkedIn.",
      "PDF récapitulatif offert.",
      "Bannière homepage (verticale ou horizontale, 15 semaines)."
    ]
  },
  { 
    id: 20, 
    title: "Partenariat média annuel", 
    category: "Offres Spéciales", 
    description: "Statut de Partenaire Fondateur : un dispositif média global sur 12 mois.", 
    price: 5000, 
    unit: "an", 
    budgetRange: "Plus de 5 000 €", 
    image: "/images/offres/skyscraper-article.jpg",
    tag: "OFFRE SPÉCIALE",
    details: [
      "Contenus : 4 articles éditoriaux optimisés SEO + relais.",
      "Visibilité : Page entreprise dédiée, logo en homepage, bannières/encarts.",
      "Outils & Pages Pratiques : Présence sur 1 à 3 pages stratégiques, radar géopolitique et observatoire.",
      "Finalité : présence continue dans l'écosystème pro et crédibilité sectorielle renforcée."
    ]
  },
  { 
    id: 21, 
    title: "Partenariat stratégique annuel", 
    category: "Offres Spéciales", 
    description: "Un accompagnement expert combinant contenu premium et visibilité stratégique renforcée.", 
    price: 10000, 
    unit: "an", 
    budgetRange: "Plus de 5 000 €", 
    image: "/images/offres/skyscraper-article.jpg",
    tag: "OFFRE SPÉCIALE",
    details: [
      "Contenus Premium : 6 articles éditoriaux + 1 interview dirigeant.",
      "Visibilité & Distribution : Page premium, bannières fortes, distribution LinkedIn renforcée.",
      "Outils & Pages Pratiques : Intégration sur 3 à 10 pages stratégiques (\"solution recommandée\"), présence accrue data/radar.",
      "Finalité : positionnement expert régulier et développement d'opportunités commerciales."
    ]
  },
  { 
    id: 22, 
    title: "Partenariat média exclusif", 
    category: "Offres Spéciales", 
    description: "Le statut de Partenaire Exclusif pour un positionnement de leader incontesté sur votre secteur.", 
    price: 50000, 
    unit: "an", 
    budgetRange: "Plus de 5 000 €",
    image: "/images/offres/skyscraper-article.jpg",
    details: [
      "Statut & Exclusivité : Partenaire principal avec exclusivité sectorielle (selon accord).",
      "Contenus Massifs : 12 articles, 2 interviews, 2 dossiers/analyses.",
      "Domination Visuelle : Affichage prioritaire partout (bannières, outils, pages pratiques élargies).",
      "Action Premium : Co-création d'un rapport sectoriel + participation/sponsoring d'un événement.",
      "Finalité : visibilité maximale et positionnement leader."
    ]
  },
];