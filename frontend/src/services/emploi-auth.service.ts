// src/services/emploi-auth.service.ts
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({ baseURL: `${BASE_URL}/emploi/auth` });

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CANDIDAT' | 'RECRUITER';
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
    token: string;
  };
}

export async function loginEmploi(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/login', { email, password });
  return data;
}

export async function registerEmploi(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'CANDIDAT' | 'RECRUITER';
  // ── NOUVEAU : nom de l'entreprise, requis côté backend si role === 'RECRUITER'
  // Sert à créer l'Établissement (et donc la Vitrine) rattaché au recruteur.
  companyName?: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/register', payload);
  return data;
}

export function saveAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('emploi_token', token);
    document.cookie = `emploi_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
}

export function saveAuthUser(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('emploi_user', JSON.stringify(user));
    // Nécessaire pour que le middleware puisse lire le rôle côté serveur
    document.cookie = `emploi_role=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('emploi_token');
  }
  return null;
}

export function getAuthUser(): AuthUser | null {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('emploi_user');
    if (raw) return JSON.parse(raw);
  }
  return null;
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('emploi_token');
    localStorage.removeItem('emploi_user');
    document.cookie = 'emploi_token=; path=/; max-age=0';
    document.cookie = 'emploi_role=;  path=/; max-age=0';
  }
}













// // src/services/emploi-auth.service.ts
// import axios from 'axios';

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

// const api = axios.create({ baseURL: `${BASE_URL}/emploi/auth` });

// export interface AuthUser {
//   id: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: 'CANDIDAT' | 'RECRUITER';
//   avatar?: string;
// }

// export interface AuthResponse {
//   success: boolean;
//   data: {
//     user: AuthUser;
//     token: string;
//   };
// }

// export async function loginEmploi(email: string, password: string): Promise<AuthResponse> {
//   const { data } = await api.post<AuthResponse>('/login', { email, password });
//   return data;
// }

// export async function registerEmploi(payload: {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   role: 'CANDIDAT' | 'RECRUITER';
// }): Promise<AuthResponse> {
//   const { data } = await api.post<AuthResponse>('/register', payload);
//   return data;
// }

// export function saveAuthToken(token: string): void {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('emploi_token', token);
//     document.cookie = `emploi_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
//   }
// }

// export function saveAuthUser(user: AuthUser): void {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('emploi_user', JSON.stringify(user));
//     // Nécessaire pour que le middleware puisse lire le rôle côté serveur
//     document.cookie = `emploi_role=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
//   }
// }

// export function getAuthToken(): string | null {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('emploi_token');
//   }
//   return null;
// }

// export function getAuthUser(): AuthUser | null {
//   if (typeof window !== 'undefined') {
//     const raw = localStorage.getItem('emploi_user');
//     if (raw) return JSON.parse(raw);
//   }
//   return null;
// }

// export function clearAuth(): void {
//   if (typeof window !== 'undefined') {
//     localStorage.removeItem('emploi_token');
//     localStorage.removeItem('emploi_user');
//     document.cookie = 'emploi_token=; path=/; max-age=0';
//     document.cookie = 'emploi_role=;  path=/; max-age=0';
//   }
// }