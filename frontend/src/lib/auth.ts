// src/lib/auth.ts
import { AuthResponse, LoginCredentials, ApiError } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const TOKEN_KEY = 'itn_auth_token';
const USER_KEY = 'itn_auth_user';
const REMEMBER_KEY = 'itn_remember';

// ─── Token Management ────────────────────────────────────────────────────────

export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    // Check sessionStorage first, then localStorage (remember me)
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, rememberMe = false): void {
    if (typeof window === 'undefined') return;
    if (rememberMe) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REMEMBER_KEY, 'true');
    } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.removeItem(TOKEN_KEY);
    }
}

export function removeToken(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    try {
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setStoredUser(user: object, rememberMe = false): void {
    if (typeof window === 'undefined') return;
    const serialized = JSON.stringify(user);
    if (rememberMe) {
        localStorage.setItem(USER_KEY, serialized);
    } else {
        sessionStorage.setItem(USER_KEY, serialized);
    }
}

// ─── Rate Limiting (client-side guard) ───────────────────────────────────────

const LOGIN_ATTEMPTS_KEY = 'itn_login_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

interface AttemptData {
    count: number;
    firstAttempt: number;
    lockedUntil?: number;
}

export function checkRateLimit(): { allowed: boolean; remainingTime?: number } {
    if (typeof window === 'undefined') return { allowed: true };

    const raw = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
    const data: AttemptData = raw ? JSON.parse(raw) : { count: 0, firstAttempt: Date.now() };

    if (data.lockedUntil && Date.now() < data.lockedUntil) {
        return {
        allowed: false,
        remainingTime: Math.ceil((data.lockedUntil - Date.now()) / 1000),
        };
    }

    // Reset if window expired
    if (Date.now() - data.firstAttempt > LOCKOUT_DURATION) {
        localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
        return { allowed: true };
    }

    return { allowed: data.count < MAX_ATTEMPTS };
}

export function recordFailedAttempt(): void {
    if (typeof window === 'undefined') return;

    const raw = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
    const data: AttemptData = raw ? JSON.parse(raw) : { count: 0, firstAttempt: Date.now() };

    data.count += 1;

    if (data.count >= MAX_ATTEMPTS) {
        data.lockedUntil = Date.now() + LOCKOUT_DURATION;
    }

    localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(data));
}

export function clearAttempts(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        }),
    });

    const data: AuthResponse | ApiError = await response.json();

    if (!response.ok || !data.success) {
        throw new Error((data as ApiError).message || 'Identifiants invalides');
    }

    return data as AuthResponse;
}

export async function fetchCurrentUser(token: string) {
    const response = await fetch(`${API_BASE_URL}/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Session expirée');
    return response.json();
}

export function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}