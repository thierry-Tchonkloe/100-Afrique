// src/hooks/useLogin.ts
'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { login, checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/auth';
import { LoginCredentials } from "@/types/auth";

interface LoginState {
    isLoading: boolean;
    error: string | null;
    rateLimitSeconds: number | null;
}

interface LoginResult {
    user?: any; // tu peux typer avec User
    error?: string;
}

export function useLogin() {
    const { setAuth } = useAuth();

    const [state, setState] = useState<LoginState>({
        isLoading: false,
        error: null,
        rateLimitSeconds: null,
    });

    const handleLogin = useCallback(
        async (credentials: LoginCredentials): Promise<LoginResult> => {
            // Vérification rate-limit
            const rateLimit = checkRateLimit();
            if (!rateLimit.allowed) {
                const message = `Trop de tentatives. Réessayez dans ${Math.ceil((rateLimit.remainingTime || 0) / 60)} min.`;
                setState({ isLoading: false, error: message, rateLimitSeconds: rateLimit.remainingTime || null });
                return { error: message };
            }

            setState({ isLoading: true, error: null, rateLimitSeconds: null });

            try {
                const response = await login(credentials);
                clearAttempts();

                const token = response.data.token;
                const user = response.data.user;

                if (!token || !user) throw new Error("Réponse serveur invalide");

                setAuth(token, user, credentials.rememberMe ?? false);

                setState({ isLoading: false, error: null, rateLimitSeconds: null });

                return { user }; // <-- succès
            } catch (err: any) {
                recordFailedAttempt();
                const newRateLimit = checkRateLimit();

                const message = newRateLimit.allowed
                    ? err.message
                    : `Compte bloqué. Réessayez dans ${Math.ceil((newRateLimit.remainingTime || 0) / 60)} min.`;

                setState({ isLoading: false, error: message, rateLimitSeconds: newRateLimit.remainingTime || null });
                return { error: message };
            }
        },
        [setAuth]
    );

    return { ...state, handleLogin };
}
