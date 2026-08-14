'use client';
// src/components/emploi/auth/LoginForm.tsx
import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { loginEmploi, saveAuthToken, saveAuthUser } from '@/services/emploi-auth.service';
import AuthInput from './AuthInput';
import AuthSocialRow from './AuthSocialRow';

export default function LoginForm({ onSuccess }: { onSuccess: (role: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errs: typeof fieldErrors = {};
    if (!email) errs.email = 'Email requis';
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

      <AuthInput label="Email" type="email" value={email} onChange={setEmail}
        placeholder="votre@email.com" error={fieldErrors.email} required />

      <AuthInput
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

      <AuthSocialRow label="Ou continuer avec" />
    </form>
  );
}
