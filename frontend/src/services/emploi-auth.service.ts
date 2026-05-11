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
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/register', payload);
  return data;
}

export function saveAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('emploi_token', token);
  }
}

export function saveAuthUser(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('emploi_user', JSON.stringify(user));
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
  }
}