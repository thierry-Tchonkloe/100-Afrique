'use client';
// src/app/(emploi)/auth/page.tsx
// Page d'authentification du sous-univers Emploi
// Connexion + Inscription avec appels API réels

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Users, Building2, AlertCircle, Loader2 } from 'lucide-react';
import { loginEmploi, registerEmploi, saveAuthToken, saveAuthUser } from '@/services/emploi-auth.service';
import clsx from 'clsx';

// ── Constantes ────────────────────────────────────────────────────────────────

const FEATURES = [
  "Accès aux meilleures opportunités d'emploi",
  'Networking avec les leaders du secteur',
  'Conseils carrière personnalisés',
];

// ── Password strength ─────────────────────────────────────────────────────────

function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)           score++;
  if (/[A-Z]/.test(pwd))         score++;
  if (/[0-9]/.test(pwd))         score++;
  if (/[^A-Za-z0-9]/.test(pwd))  score++;
  const map = [
    { score: 1, label: 'Faible',    color: 'bg-red-500'    },
    { score: 2, label: 'Moyen',     color: 'bg-orange-400' },
    { score: 3, label: 'Bon',       color: 'bg-yellow-400' },
    { score: 4, label: 'Excellent', color: 'bg-green-500'  },
  ];
  return map[score - 1] ?? { score: 0, label: '', color: '' };
}

// ── Input ─────────────────────────────────────────────────────────────────────
function Input({
  label, type = 'text', value, onChange, placeholder, error, required,
  rightElement,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; required?: boolean;
  rightElement?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={clsx(
            'w-full border rounded-xl px-4 py-3 text-sm text-gray-900 bg-white outline-none transition',
            'focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A]',
            error ? 'border-red-400 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'
          )}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

// ── Social Button ─────────────────────────────────────────────────────────────
function SocialBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      type="button" onClick={onClick}
      className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl
                 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition w-full">
      {icon} {label}
    </button>
  );
}

// ── FORM: Connexion ───────────────────────────────────────────────────────────
function LoginForm({ onSuccess }: { onSuccess: (role: string) => void }) {
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPwd,    setShowPwd]    = useState(false);
  const [remember,   setRemember]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validation
    const errs: typeof fieldErrors = {};
    if (!email)    errs.email    = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email invalide';
    if (!password) errs.password = 'Mot de passe requis';
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setLoading(true);
    try {
      const res = await loginEmploi(email, password);
      saveAuthToken(res.data.token);
      saveAuthUser(res.data.user);
      onSuccess(res.data.user.role);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Identifiants incorrects';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bon retour !</h1>
        <p className="text-sm text-gray-500 mt-1">
          Connectez-vous à votre compte pour accéder à toutes vos données.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          <AlertCircle size={15} className="flex-shrink-0" /> {error}
        </div>
      )}

      <Input label="Email" type="email" value={email} onChange={setEmail}
        placeholder="votre@email.com" error={fieldErrors.email} required />

      <Input
        label="Mot de passe" type={showPwd ? 'text' : 'password'}
        value={password} onChange={setPassword}
        placeholder="••••••••" error={fieldErrors.password} required
        rightElement={
          <button type="button" onClick={() => setShowPwd(!showPwd)}
            className="text-gray-400 hover:text-gray-600 transition">
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-[#E8622A]" />
          Se souvenir de moi
        </label>
        <button type="button" className="text-sm text-[#E8622A] font-medium hover:underline">
          Mot de passe oublié ?
        </button>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-[#E8622A] hover:bg-[#D45520] text-white font-semibold py-3 rounded-xl
                   transition disabled:opacity-70 flex items-center justify-center gap-2">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Connexion…</> : 'Se connecter'}
      </button>

      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center text-xs text-gray-400 bg-white px-3">
          Ou continuer avec
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialBtn
          label="LinkedIn"
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
        />
        <SocialBtn
          label="Google"
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
        />
      </div>
    </form>
  );
}

// ── FORM: Inscription ─────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }: { onSuccess: (role: string) => void }) {
  const [role,       setRole]       = useState<'CANDIDAT' | 'RECRUITER'>('CANDIDAT');
  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPwd,    setShowPwd]    = useState(false);
  const [accepted,   setAccepted]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const pwdStrength = getPasswordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'Prénom requis';
    if (!lastName.trim())  errs.lastName  = 'Nom requis';
    if (!email)            errs.email     = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email invalide';
    if (!password)         errs.password  = 'Mot de passe requis';
    else if (password.length < 8) errs.password = 'Minimum 8 caractères';
    if (!accepted)         errs.accepted  = "Veuillez accepter les conditions d'utilisation";

    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setLoading(true);
    try {
      const res = await registerEmploi({ email, password, firstName, lastName, role });
      saveAuthToken(res.data.token);
      saveAuthUser(res.data.user);
      onSuccess(res.data.user.role);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Erreur lors de la création du compte";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Créer votre compte</h1>
        <p className="text-sm text-gray-500 mt-1">Choisissez votre profil pour commencer</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          <AlertCircle size={15} className="flex-shrink-0" /> {error}
        </div>
      )}

      {/* Role selector */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Je suis :</p>
        <div className="grid grid-cols-2 gap-3">
          {([
            { key: 'CANDIDAT',  icon: <Users size={24} className="text-[#E8622A]" />,    title: 'Candidat',   desc: "Je cherche un emploi ou une formation" },
            { key: 'RECRUITER', icon: <Building2 size={24} className="text-[#E8622A]" />, title: 'Recruteur', desc: 'Je souhaite publier des offres et valoriser ma marque' },
          ] as const).map(({ key, icon, title, desc }) => (
            <button key={key} type="button" onClick={() => setRole(key)}
              className={clsx(
                'flex flex-col items-center text-center p-4 rounded-2xl border-2 transition',
                role === key
                  ? 'border-[#E8622A] bg-[#FFF3EC]'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              )}>
              {icon}
              <p className="font-semibold text-sm text-gray-800 mt-2">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-3">
        <Input label="Prénom" value={firstName} onChange={setFirstName}
          placeholder="Sophie" error={fieldErrors.firstName} required />
        <Input label="Nom" value={lastName} onChange={setLastName}
          placeholder="Martin" error={fieldErrors.lastName} required />
      </div>

      <Input label="Email professionnel" type="email" value={email} onChange={setEmail}
        placeholder="votre@email.com" error={fieldErrors.email} required />

      <div>
        <Input
          label="Mot de passe" type={showPwd ? 'text' : 'password'}
          value={password} onChange={setPassword}
          placeholder="Minimum 8 caractères" error={fieldErrors.password} required
          rightElement={
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="text-gray-400 hover:text-gray-600 transition">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        {/* Password strength bar */}
        {password && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={clsx('h-full rounded-full transition-all duration-500', pwdStrength.color)}
                style={{ width: `${(pwdStrength.score / 4) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{pwdStrength.label}</span>
          </div>
        )}
      </div>

      {/* Terms */}
      <div>
        <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-[#E8622A] flex-shrink-0" />
          <span>
            J'accepte les{' '}
            <button type="button" className="text-[#E8622A] font-medium hover:underline">
              conditions d'utilisation
            </button>
            {' '}et la politique de confidentialité
          </span>
        </label>
        {fieldErrors.accepted && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
            <AlertCircle size={11} /> {fieldErrors.accepted}
          </p>
        )}
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-[#E8622A] hover:bg-[#D45520] text-white font-semibold py-3 rounded-xl
                   transition disabled:opacity-70 flex items-center justify-center gap-2">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Création…</> : 'Créer mon compte'}
      </button>

      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center text-xs text-gray-400 bg-white px-3">
          Ou continuez avec
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialBtn
          label="LinkedIn"
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
        />
        <SocialBtn
          label="Google"
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
        />
      </div>
    </form>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function EmploiAuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const handleSuccess = useCallback((role: string) => {
    if (role === 'RECRUITER') {
      router.push('/recruteur/dashboard');
    } else {
      router.push('/candidat/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex">

      {/* ── Panneau gauche — hero ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-10">
        {/* Background image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80')" }} />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E2A3A]/80 via-[#1E2A3A]/60 to-[#E8622A]/30" />

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Rejoignez la plus grande communauté des professionnels du tourisme
          </h2>
          <ul className="mt-8 space-y-4">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-white/90 text-sm">
                <CheckCircle2 size={18} className="text-[#E8622A] flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Users size={16} />
            <span>Déjà +15,000 professionnels nous font confiance</span>
          </div>
        </div>
      </div>

      {/* ── Panneau droit — formulaire ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-white">

        {/* Top nav */}
        <div className="flex items-center justify-between px-8 py-5 flex-shrink-0">
          <Link href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft size={15} />
            Retour au Mag | Tourisme Nomade
          </Link>
          <span className="font-bold text-[#E8622A] text-base tracking-tight">
            i Tourisme Emploi
          </span>
        </div>

        {/* Tab switcher */}
        <div className="px-8 flex-shrink-0">
          <div className="grid grid-cols-2 bg-gray-100 rounded-2xl p-1 max-w-sm">
            {(['login', 'register'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={clsx(
                  'py-2.5 text-sm font-semibold rounded-xl transition',
                  tab === t
                    ? t === 'login'
                      ? 'bg-[#E8622A] text-white shadow-sm'
                      : 'bg-[#E8622A] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}>
                {t === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-start px-8 py-6">
          <div className="w-full max-w-sm">
            {tab === 'login'
              ? <LoginForm    onSuccess={handleSuccess} />
              : <RegisterForm onSuccess={handleSuccess} />
            }

            {/* Footer link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              {tab === 'login' ? (
                <>Pas encore de compte ?{' '}
                  <button onClick={() => setTab('register')}
                    className="text-[#E8622A] font-semibold hover:underline">
                    Créer un compte
                  </button>
                </>
              ) : (
                <>Déjà un compte ?{' '}
                  <button onClick={() => setTab('login')}
                    className="text-[#E8622A] font-semibold hover:underline">
                    Se connecter
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}