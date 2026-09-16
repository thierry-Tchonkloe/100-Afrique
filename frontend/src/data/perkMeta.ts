// src/data/perkMeta.ts
export const PERK_META: Record<string, { emoji: string; description: string }> = {
  'Télétravail': { emoji: '💻', description: 'Travail à distance selon les modalités de l’entreprise.' },
  'Mutuelle': { emoji: '🏥', description: 'Complémentaire santé prise en charge par l’employeur.' },
  'Tickets Restaurant': { emoji: '🍽️', description: 'Titres-restaurant pour les jours travaillés.' },
  'Salle de sport': { emoji: '🏋️', description: 'Accès à une salle de sport ou abonnement pris en charge.' },
  'Formation continue': { emoji: '🎓', description: 'Programmes de formation pour développer vos compétences.' },
  'Prime annuelle': { emoji: '💰', description: 'Prime versée selon la performance de l’entreprise.' },
  'Horaires flexibles': { emoji: '🕒', description: 'Organisation du temps de travail flexible.' },
  'RTT': { emoji: '🌴', description: 'Jours de repos supplémentaires.' },
  'Crèche entreprise': { emoji: '🧸', description: 'Solution de garde d’enfants proposée par l’entreprise.' },
  'Véhicule de fonction': { emoji: '🚗', description: 'Véhicule mis à disposition pour vos déplacements.' },
  'Stock options': { emoji: '📈', description: 'Participation à la croissance de l’entreprise.' },
  'Intéressement': { emoji: '🤝', description: 'Part des bénéfices reversée aux collaborateurs.' },
};

export const VALUE_STYLES = [
  { icon: '💡', color: 'bg-amber-50 text-amber-600' },
  { icon: '🤝', color: 'bg-blue-50 text-blue-600' },
  { icon: '🌿', color: 'bg-green-50 text-green-600' },
  { icon: '⭐', color: 'bg-purple-50 text-purple-600' },
];

export const CONTRACT_COLOR: Record<string, string> = {
  CDI: 'bg-blue-50 text-blue-700', CDD: 'bg-purple-50 text-purple-700',
  Stage: 'bg-teal-50 text-teal-700', Alternance: 'bg-orange-50 text-orange-700',
  'CDD Saisonnier': 'bg-orange-50 text-orange-700',
};
