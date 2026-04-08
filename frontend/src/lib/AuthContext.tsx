// 'use client';

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { User } from "@/types/auth";
// import { getToken, setToken, removeToken, getStoredUser, setStoredUser, isTokenExpired, } from '@/lib/auth';

// interface AuthContextValue {
//     user: User | null;
//     token: string | null;
//     isLoading: boolean;
//     isAuthenticated: boolean;
//     setAuth: (token: string, user: User, rememberMe: boolean) => void;
//     logout: () => void;
// }

// const AuthContext = createContext<AuthContextValue | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const router = useRouter();
//     const [user, setUser] = useState<User | null>(null);
//     const [token, setTokenState] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const storedToken = getToken();
//         const storedUser = getStoredUser();

//         if (storedToken && storedUser) {
//         if (isTokenExpired(storedToken)) {
//             removeToken();
//         } else {
//             setTokenState(storedToken);
//             setUser(storedUser);
//         }
//         }
//         setIsLoading(false);
//     }, []);

//     const setAuth = useCallback((newToken: string, newUser: User, rememberMe: boolean) => {
//         setToken(newToken, rememberMe);
//         setStoredUser(newUser, rememberMe);
//         setTokenState(newToken);
//         setUser(newUser);
//     }, []);

//     const logout = useCallback(() => {
//         removeToken();
//         setTokenState(null);
//         setUser(null);
//         router.push('/login');
//     }, [router]);

//     return (
//         <AuthContext.Provider
//         value={{
//             user,
//             token,
//             isLoading,
//             isAuthenticated: !!token && !!user,
//             setAuth,
//             logout,
//         }}
//         >
//         {children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     const ctx = useContext(AuthContext);
//     if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//     return ctx;
// }









// 'use client';

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { User } from "@/types/auth";
// import { getToken, setToken, removeToken, getStoredUser, setStoredUser, isTokenExpired, } from '@/lib/auth';

// interface AuthContextValue {
//     user: User | null;
//     token: string | null;
//     isLoading: boolean;
//     isAuthenticated: boolean;
//     setAuth: (token: string, user: User, rememberMe: boolean) => void;
//     logout: () => void;
// }

// const AuthContext = createContext<AuthContextValue | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const router = useRouter();

//     // ✅ Initialisation directe depuis storage
//     const [token, setTokenState] = useState<string | null>(() =>
//         typeof window !== "undefined" ? getToken() : null
//     );

//     const [user, setUser] = useState<User | null>(() =>
//         typeof window !== "undefined" ? getStoredUser() : null
//     );

//     const [isLoading, setIsLoading] = useState(true);

//     // ✅ Vérification du token après montage
//     useEffect(() => {
//         if (token && isTokenExpired(token)) {
//         removeToken();
//         setTokenState(null);
//         setUser(null);
//         }

//         setIsLoading(false);
//     }, [token]);

//     const setAuth = useCallback((newToken: string, newUser: User, rememberMe: boolean) => {
//         setToken(newToken, rememberMe);
//         setStoredUser(newUser, rememberMe);

//         setTokenState(newToken);
//         setUser(newUser);
//     }, []);

//     const logout = useCallback(() => {
//         removeToken();
//         setTokenState(null);
//         setUser(null);
//         router.push('/login');
//     }, [router]);

//     return (
//         <AuthContext.Provider
//         value={{
//             user,
//             token,
//             isLoading,
//             isAuthenticated: !!token && !!user,
//             setAuth,
//             logout,
//         }}
//         >
//         {children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     const ctx = useContext(AuthContext);
//     if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//     return ctx;
// }







// src/lib/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from "@/types/auth";
import { getToken, setToken, removeToken, getStoredUser, setStoredUser, isTokenExpired, } from '@/lib/auth';

interface AuthContextValue {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User, rememberMe: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // ✅ récupération initiale
    const storedToken =
        typeof window !== "undefined" ? getToken() : null;

    const storedUser =
        typeof window !== "undefined" ? getStoredUser() : null;

    // ✅ vérification expiration AVANT state
    const validToken =
        storedToken && !isTokenExpired(storedToken) ? storedToken : null;

    if (storedToken && !validToken) {
        removeToken();
    }

    const [token, setTokenState] = useState<string | null>(validToken);
    const [user, setUser] = useState<User | null>(validToken ? storedUser : null);
    const [isLoading] = useState(false);

    const setAuth = useCallback((newToken: string, newUser: User, rememberMe: boolean) => {
        setToken(newToken, rememberMe);
        setStoredUser(newUser, rememberMe);

        setTokenState(newToken);
        setUser(newUser);
    }, []);


    const logout = useCallback(() => {
        removeToken();
        setTokenState(null);
        setUser(null);
        router.replace('/login');
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!token && !!user, setAuth, logout, }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}