// src/types/emploi/alerte.types.ts

export interface CreateAlerteInput {
  name: string;
  keywords?: string[];
  location?: string;
  radius?: number;
  contractTypes?: string[];
  sector?: string;
  frequency?: 'realtime' | 'daily' | 'weekly';
  isActive?: boolean;
}

export type UpdateAlerteInput = Partial<CreateAlerteInput>;

export interface ToggleAlerteInput {
  isActive: boolean;
}

export interface AlerteOutput {
  id: string;
  name: string;
  keywords: string[];
  location: string;
  radius?: number;
  contractTypes: string[];
  sector: string;
  frequency: string;
  isActive: boolean;
  lastSentAt?: string;
  createdAt: string;
}