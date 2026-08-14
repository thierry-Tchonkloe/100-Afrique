'use client';
// src/components/emploi/auth/RegisterForm.tsx
import { useState } from 'react';
import { Eye, EyeOff, Users, Building2, AlertCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { registerEmploi, saveAuthToken, saveAuthUser } from '@/services/emploi-auth.service';
import { getPasswordStrength } from '@/lib/passwordStrength';
import AuthInput from './AuthInput';
import AuthSocialRow from './AuthSocialRow';

export default function RegisterForm({ onSuccess }: { onSuccess: (role: string) => void }) {
  const [role, setRole] = useState<'CANDIDAT' | 'RECRUITER'>('CANDIDAT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // Nom de l'entreprise, requis uniquement pour un compte recruteur.
  // Rattaché à l'Établissement créé côté backend, affiché dans COMPANIES sur la home Emploi.
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const pwdStrength = getPasswordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'Prénom requis';
    if (!lastName.trim()) errs.lastName = 'Nom requis';
    if (role === 'RECRUITER' && !companyName.trim()) {
      errs.companyName = "Le nom de l'entreprise est requis";
    }
    if (!email) errs.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email invalide';
    if (!password) errs.password = 'Mot de passe requis';
    else if (password.length < 8) errs.password = 'Minimum 8 caractères';
    if (!accepted) errs.accepted = "Veuillez accepter les conditions d'utilisation";

    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setLoading(true);
    try {
      const res = await registerEmploi({
        email, password, firstName, lastName, role,
        ...(role === 'RECRUITER' ? { companyName: companyName.trim() } : {}),
      });
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
            { key: 'CANDIDAT', icon: <Users size={24} className="text-[#E8622A]" />, title: 'Candidat', desc: "Je cherche un emploi ou une formation" },
            { key: 'RECRUITER', icon: <Building2 size={24} className="text-[#E8622A]" />, title: 'Recruteur', desc: 'Je souhaite publier des offres et valoriser ma marque' },
          ] as const).map(({ key, icon, title, desc }) => (
            <button key={key} type="button" onClick={() => setRole(key)}
              className={clsx(
                'flex flex-col items-center text-center p-4 rounded-2xl border-2 transition',
                role === key ? 'border-[#E8622A] bg-[#FFF3EC]' : 'border-gray-200 hover:border-gray-300 bg-white'
              )}>
              {icon}
              <p className="font-semibold text-sm text-gray-800 mt-2">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Nom de l'entreprise — visible uniquement si RECRUITER */}
      {role === 'RECRUITER' && (
        <AuthInput
          label="Nom de l'entreprise"
          value={companyName}
          onChange={setCompanyName}
          placeholder="ex: Ecrin Lagune Hôtel & Spa"
          error={fieldErrors.companyName}
          required
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <AuthInput label="Prénom" value={firstName} onChange={setFirstName}
          placeholder="Sophie" error={fieldErrors.firstName} required />
        <AuthInput label="Nom" value={lastName} onChange={setLastName}
          placeholder="Martin" error={fieldErrors.lastName} required />
      </div>

      <AuthInput label="Email professionnel" type="email" value={email} onChange={setEmail}
        placeholder="votre@email.com" error={fieldErrors.email} required />

      <div>
        <AuthInput
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

      <AuthSocialRow label="Ou continuez avec" />
    </form>
  );
}
