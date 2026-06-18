// src/types/auth/ts
export interface User {
    id: number;
    email: string;
    name: string;
    role: 'EDITOR' | 'SUPER_ADMIN';
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}