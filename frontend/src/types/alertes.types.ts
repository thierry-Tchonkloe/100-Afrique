// src/types/alertes.types.ts
// ─── Alerte Job ───────────────────────────────────────────────────────────────

export type AlertFrequency = 'realtime' | 'daily' | 'weekly';

export const FREQUENCY_LABELS: Record<AlertFrequency, string> = {
  realtime: 'Temps réel',
  daily:    'Quotidien',
  weekly:   'Hebdomadaire',
};

export const FREQUENCY_ICONS: Record<AlertFrequency, string> = {
  realtime: '⚡',
  daily:    '📅',
  weekly:   '🗓️',
};

export type ContractType = 'CDI' | 'CDD' | 'Saisonnier' | 'Stage' | 'Alternance' | 'Freelance';

export const CONTRACT_TYPES: ContractType[] = ['CDI', 'CDD', 'Saisonnier', 'Stage', 'Alternance', 'Freelance'];

export const SECTORS = [
  'Hôtellerie',
  'Restauration',
  'Agence de voyage',
  'Transport',
  'Événementiel',
  'Tourisme durable',
  'Divertissement',
  'Spa & Bien-être',
];

export interface AlerteJob {
  id: string;
  name: string;
  keywords: string[];
  location: string;
  radius?: number;
  contractTypes: ContractType[];
  sector: string;
  frequency: AlertFrequency;
  isActive: boolean;
  lastSentAt?: string; // ISO
  createdAt: string;
}

// ─── Form state ───────────────────────────────────────────────────────────────

export type AlerteFormData = Omit<AlerteJob, 'id' | 'createdAt' | 'lastSentAt'>;

export const EMPTY_FORM: AlerteFormData = {
  name: '',
  keywords: [],
  location: '',
  radius: undefined,
  contractTypes: [],
  sector: '',
  frequency: 'daily',
  isActive: true,
};