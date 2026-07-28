// src/types/emploi/auth.types.ts

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'CANDIDAT' | 'RECRUITER';
  etablissementId?: number;
  companyName?: string;
  etablissementSector?: string;
  etablissementCity?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailInput {
  email: string;
  currentPassword: string;
}

export interface AuthUserOutput {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthSessionOutput {
  user: AuthUserOutput;
  token: string;
}