'use client';

import { useState, useRef } from 'react';
import { useLogin } from "@/hooks/useLogin";
import { LoginCredentials } from "@/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
// ─── Icons ───────────────────────────────────────────────────────────────────

function IconMail() {
    return (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7-5 7 5v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21V13h6v8" />
        </svg>
    );
}

function IconLock() {
    return (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="9" width="14" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 9V6a3 3 0 016 0v3" />
        </svg>
    );
}

function IconEye({ show }: { show: boolean }) {
    return show ? (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
        <circle cx="10" cy="10" r="2.5" strokeLinecap="round" />
        </svg>
    ) : (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l14 14M10 4C5 4 2 10 2 10s.9 1.7 2.5 3.2M17.5 6.8C19 8.3 18 10 18 10s-3 6-8 6c-1.5 0-2.9-.4-4-1" />
        </svg>
    );
}

function IconGoogle() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

function IconMicrosoft() {
    return (
        <svg viewBox="0 0 23 23" className="w-5 h-5">
        <rect x="1" y="1" width="10" height="10" fill="#F25022" />
        <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
        <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
        <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
        </svg>
    );
}

function IconShield() {
    return (
        <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );
}

// ─── Feature Cards ────────────────────────────────────────────────────────────

const features = [
    {
        icon: '✈️',
        title: 'Benefits Platform',
        desc: 'Accès aux meilleures opportunités d\'emploi',
        color: 'from-orange-50 to-amber-50 border-orange-100',
        iconBg: 'bg-orange-100',
    },
    {
        icon: '👥',
        title: 'Leaders & Networking',
        desc: 'Networking avec les leaders du secteur',
        color: 'from-sky-50 to-blue-50 border-sky-100',
        iconBg: 'bg-sky-100',
    },
    {
        icon: '📊',
        title: 'Advanced Analytics',
        desc: 'Real-time insights and reporting dashboards',
        color: 'from-violet-50 to-purple-50 border-violet-100',
        iconBg: 'bg-violet-100',
    },
];

const stats = [
    { value: '500+', label: 'Professionnels', color: 'text-slate-800' },
    { value: '50K+', label: 'Employés', color: 'text-orange-500' },
];

// ─── Validation ───────────────────────────────────────────────────────────────

function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string) {
    return password.length >= 6;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
    const { isLoading, error, handleLogin } = useLogin();

    const [form, setForm] = useState<LoginCredentials>({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });
    const formRef = useRef<HTMLFormElement>(null);

    const emailError = touched.email && form.email && !validateEmail(form.email)
        ? 'Email invalide'
        : null;
    const passwordError = touched.password && form.password && !validatePassword(form.password)
        ? 'Minimum 6 caractères'
        : null;

    const canSubmit =
        validateEmail(form.email) &&
        validatePassword(form.password) &&
        !isLoading;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    }

    function handleBlur(field: 'email' | 'password') {
        setTouched((t) => ({ ...t, [field]: true }));
    }

    // async function handleSubmit(e: React.FormEvent) {
    //     e.preventDefault();
    //     setTouched({ email: true, password: true });
    //     if (!canSubmit) return;
    //     await handleLogin(form);
    // }

    //const searchParams = useSearchParams();
    //const from = searchParams.get("from");


    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        const result = await handleLogin(form);
        if (result.user) {
            // Redirection basée sur rôle
            const redirectTo = result.user.role === 'SUPER_ADMIN'
                ? "/dashboard"
                : "/articles";
            router.replace(redirectTo);
        }
        // if (result?.user) {
        //     const redirectTo =
        //         result.user.role === "SUPER_ADMIN"
        //             ? "/admin/dashboard"
        //             : "/admin/articles";

        //     router.replace(redirectTo);
        // } else if (result?.error) {
        //     console.error("Login failed:", result.error);
        // }

        // if (result?.user) {

        //     const redirectTo =
        //         from ||
        //         (result.user.role === "SUPER_ADMIN"
        //             ? "/admin/dashboard"
        //             : "/admin/articles");

        //     router.replace(redirectTo);
        // }
    };

    return (
        <div className="min-h-screen bg-lineair-to-br from-slate-50 via-orange-50/30 to-amber-50/20 flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-orange-100/40 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl" />
        </div>

        <div className="relative w-full max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-400 shadow-lg shadow-orange-200 mb-4">
                <span className="text-2xl">🌍</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">iTourisme Nomade</h1>
            <p className="text-sm text-slate-500 mt-1">La plus grande communauté des professionnels du tourisme</p>
            </div>

            <div className="flex flex-wrap gap-6 items-start">
                {/* ── Login Card ── */}
                <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 min-w-80">
                    <div className="mb-7">
                    <h2 className="text-xl font-semibold text-slate-800">Welcome back</h2>
                    <p className="text-sm text-slate-400 mt-1">connectez-vous à votre compte pour continuer</p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                    <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <span className="text-red-500 text-sm shrink-0 mt-0.5">⚠️</span>
                        <p className="text-sm text-red-600 leading-snug">{error}</p>
                    </div>
                    )}

                    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Email address
                        </label>
                        <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <IconMail />
                        </span>
                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                            placeholder="Enter your email"
                            className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition-all
                            bg-slate-50 text-slate-800 placeholder:text-slate-300
                            ${emailError
                                ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                                : 'border-slate-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100'
                            }`}
                        />
                        </div>
                        {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Password
                        </label>
                        <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <IconLock />
                        </span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            autoComplete="current-password"
                            value={form.password}
                            onChange={handleChange}
                            onBlur={() => handleBlur('password')}
                            placeholder="Enter your password"
                            className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-xl outline-none transition-all
                            bg-slate-50 text-slate-800 placeholder:text-slate-300
                            ${passwordError
                                ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                                : 'border-slate-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            aria-label={showPassword ? 'Masquer' : 'Afficher'}
                        >
                            <IconEye show={showPassword} />
                        </button>
                        </div>
                        {passwordError && <p className="mt-1 text-xs text-red-500">{passwordError}</p>}
                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div className="relative">
                            <input
                            type="checkbox"
                            name="rememberMe"
                            checked={form.rememberMe}
                            onChange={handleChange}
                            className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded border transition-all ${form.rememberMe ? 'bg-orange-400 border-orange-400' : 'border-slate-300 bg-white'}`}>
                            {form.rememberMe && (
                                <svg viewBox="0 0 12 12" className="w-full h-full text-white p-0.5">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                            )}
                            </div>
                        </div>
                        <span className="text-xs text-slate-500">Remember me</span>
                        </label>
                        <a href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">
                        Forgot password?
                        </a>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                        ${canSubmit
                            ? 'bg-orange-400 hover:bg-orange-500 text-white shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Connexion…
                        </span>
                        ) : (
                        'Sign in to your account'
                        )}
                    </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-xs text-slate-400 font-medium">Or continue with</span>
                    <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* Social */}
                    <div className="flex flex-col gap-2.5">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-3 w-full py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        <IconGoogle />
                        Continue with Google
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-3 w-full py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        <IconMicrosoft />
                        Continue with Microsoft
                    </button>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-slate-400 mt-6">
                    Don&apost have an account?{' '}
                    <a href="/contact" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                        Contact your administrator
                    </a>
                    </p>

                    {/* Security badge */}
                    <div className="flex items-center justify-center gap-1.5 mt-4 text-slate-400">
                    <IconShield />
                    <span className="text-xs">Connexion sécurisée SSL · JWT</span>
                    </div>
                </div>

                {/* ── Right Panel ── */}
                <div className="min-w-72 shrink-0 flex flex-1 flex-col gap-4">
                    {features.map((f) => (
                    <div
                        key={f.title}
                        className={`bg-lineair-to-br ${f.color} border rounded-2xl p-4 flex items-start gap-3`}
                    >
                        <div className={`w-9 h-9 rounded-xl ${f.iconBg} flex items-center justify-center shrink-0 text-lg`}>
                        {f.icon}
                        </div>
                        <div>
                        <p className="text-sm font-semibold text-slate-700">{f.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{f.desc}</p>
                        </div>
                    </div>
                    ))}

                    {/* Stats */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex justify-around shadow-sm">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                        <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}