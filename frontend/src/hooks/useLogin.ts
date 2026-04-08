// 'use client';

// import { useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/AuthContext';
// import { login, checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/auth';
// import { LoginCredentials } from "@/types/auth";

// interface LoginState {
//     isLoading: boolean;
//     error: string | null;
//     rateLimitSeconds: number | null;
// }

// export function useLogin() {
//     const router = useRouter();
//     const { setAuth } = useAuth();
//     const [state, setState] = useState<LoginState>({
//         isLoading: false,
//         error: null,
//         rateLimitSeconds: null,
//     });

//     const handleLogin = useCallback(
//         async (credentials: LoginCredentials) => {
//         setState({ isLoading: false, error: null, rateLimitSeconds: null });

//         // Client-side rate limit check
//         const rateLimit = checkRateLimit();
//         if (!rateLimit.allowed) {
//             setState({
//             isLoading: false,
//             error: `Trop de tentatives. Réessayez dans ${Math.ceil((rateLimit.remainingTime || 0) / 60)} min.`,
//             rateLimitSeconds: rateLimit.remainingTime || null,
//             });
//             return;
//         }

//         setState((s) => ({ ...s, isLoading: true, error: null }));

//         try {
//             const response = await login(credentials);
//             clearAttempts();
//             setAuth(response.data.token, response.data.user, credentials.rememberMe ?? false);

//             // Redirect based on role
//             const redirectTo =
//             response.data.user.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/admin/articles';
//             router.push(redirectTo);
//         } catch (err) {
//             recordFailedAttempt();
//             const newRateLimit = checkRateLimit();

//             setState({
//             isLoading: false,
//             error: newRateLimit.allowed
//                 ? (err as Error).message
//                 : `Compte temporairement bloqué. Réessayez dans ${Math.ceil((newRateLimit.remainingTime || 0) / 60)} min.`,
//             rateLimitSeconds: newRateLimit.remainingTime || null,
//             });
//         }
//         },
//         [router, setAuth]
//     );

//     return { ...state, handleLogin };
// }








// 'use client';

// import { useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/AuthContext';
// import { login, checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/auth';
// import { LoginCredentials } from "@/types/auth";

// interface LoginState {
//     isLoading: boolean;
//     error: string | null;
//     rateLimitSeconds: number | null;
// }

// export function useLogin() {

//     const router = useRouter();
//     const { setAuth } = useAuth();

//     const [state, setState] = useState<LoginState>({
//         isLoading: false,
//         error: null,
//         rateLimitSeconds: null,
//     });


//     const handleLogin = useCallback(async (credentials: LoginCredentials) => {

//         const rateLimit = checkRateLimit();

//         if (!rateLimit.allowed) {
//             setState({
//                 isLoading: false,
//                 error: `Trop de tentatives. Réessayez dans ${Math.ceil((rateLimit.remainingTime || 0) / 60)} min.`,
//                 rateLimitSeconds: rateLimit.remainingTime || null,
//             });
//             return;
//         }

//         setState({
//             isLoading: true,
//             error: null,
//             rateLimitSeconds: null,
//         });

//         try {

//             // const response = await login(credentials);

//             // console.log("LOGIN RESPONSE:", response); // DEBUG

//             // clearAttempts();

//             // const token = response.data?.token ?? response.token;
//             // const user = response.data?.user ?? response.user;

//             // if (!token || !user) {
//             //     throw new Error("Réponse serveur invalide");
//             // }

//             // setAuth(token, user, credentials.rememberMe ?? false);

//             // const redirectTo =
//             //     user.role === "SUPER_ADMIN"
//             //         ? "/admin/dashboard"
//             //         : "/admin/articles";

//             // router.push(redirectTo);


//             const response = await login(credentials);
//             clearAttempts();

//             const token = response.data.token;
//             const user = response.data.user;

//             setAuth(token, user, credentials.rememberMe ?? false);

//             return { user }; // <-- retourner user ici

//             // const result = await handleLogin(form);
//             // if (result?.user) router.push('/admin/dashboard');

//         } catch (err: any) {

//             console.error("LOGIN ERROR:", err);

//             recordFailedAttempt();

//             const newRateLimit = checkRateLimit();

//             setState({
//                 isLoading: false,
//                 error: newRateLimit.allowed
//                     ? err.message
//                     : `Compte bloqué. Réessayez dans ${Math.ceil((newRateLimit.remainingTime || 0) / 60)} min.`,
//                 rateLimitSeconds: newRateLimit.remainingTime || null,
//             });
//         }

//     }, [router, setAuth]);

//     return {
//         ...state,
//         handleLogin
//     };

//     const result = await handleLogin(form);
//     if (result?.user) router.push('/admin/dashboard');

// }








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