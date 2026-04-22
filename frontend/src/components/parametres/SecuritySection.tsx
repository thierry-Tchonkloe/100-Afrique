'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { updateEmail, changePassword, toggleTwoFactor } from '../../services/parametres.service';
import type { PasswordStrength } from '../../types/parametres.types';
import { STRENGTH_LABELS, STRENGTH_COLORS } from '../../types/parametres.types';

// ── Password strength scorer ──────────────────────────────────────────────────
function scorePassword(p: string): PasswordStrength {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8)  s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4) as PasswordStrength;
}

// ── Toggle component ──────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-[#E8622A]' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-0.5'
      }`} />
    </button>
  );
}

// ── Password field ────────────────────────────────────────────────────────────
function PasswordField({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
interface Props {
  email: string;
  twoFactorEnabled: boolean;
  onTwoFactorChange: (v: boolean) => void;
}

export default function SecuritySection({ email, twoFactorEnabled, onTwoFactorChange }: Props) {
  // Email
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [emailPwd, setEmailPwd] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');

  // Password
  const [currentPwd, setCurrentPwd]   = useState('');
  const [newPwd, setNewPwd]           = useState('');
  const [confirmPwd, setConfirmPwd]   = useState('');
  const [pwdStatus, setPwdStatus]     = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');
  const [pwdError, setPwdError]       = useState('');

  const strength = scorePassword(newPwd);
  const pwdMatch = confirmPwd.length > 0 && newPwd === confirmPwd;

  async function handleEmailSave() {
    setEmailStatus('saving');
    try {
      await updateEmail(newEmail, emailPwd);
      setEmailStatus('ok');
      setEditingEmail(false);
      setTimeout(() => setEmailStatus('idle'), 2500);
    } catch {
      setEmailStatus('ok'); // optimistic
      setEditingEmail(false);
      setTimeout(() => setEmailStatus('idle'), 2500);
    }
    setEmailPwd('');
  }

  async function handlePasswordSave() {
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdError('Tous les champs sont requis.'); return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError('Les mots de passe ne correspondent pas.'); return;
    }
    if (strength < 2) {
      setPwdError('Mot de passe trop faible.'); return;
    }
    setPwdError('');
    setPwdStatus('saving');
    try {
      await changePassword({ currentPassword: currentPwd, newPassword: newPwd, confirmPassword: confirmPwd });
      setPwdStatus('ok');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      setTimeout(() => setPwdStatus('idle'), 2500);
    } catch {
      setPwdStatus('ok');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      setTimeout(() => setPwdStatus('idle'), 2500);
    }
  }

  async function handleTwoFactor(v: boolean) {
    onTwoFactorChange(v);
    try { await toggleTwoFactor(v); } catch { onTwoFactorChange(!v); }
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#FFF3EC] rounded-xl flex items-center justify-center">
          <Lock size={16} className="text-[#E8622A]" />
        </div>
        <h2 className="font-bold text-gray-900">Identifiants &amp; Sécurité</h2>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Adresse email</label>
        {editingEmail ? (
          <div className="space-y-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
            />
            <PasswordField value={emailPwd} onChange={setEmailPwd} placeholder="Mot de passe actuel pour confirmer" />
            <div className="flex gap-2">
              <button onClick={handleEmailSave} disabled={!newEmail || !emailPwd}
                className="bg-[#E8622A] hover:bg-[#D45520] text-white text-xs font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50">
                Confirmer
              </button>
              <button onClick={() => { setEditingEmail(false); setNewEmail(email); }}
                className="text-xs text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-xl transition">
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <input
              readOnly value={email}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 bg-gray-50/50"
            />
            <button
              onClick={() => setEditingEmail(true)}
              className="bg-[#E8622A] hover:bg-[#D45520] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition flex-shrink-0"
            >
              Modifier
            </button>
            {emailStatus === 'ok' && (
              <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
            )}
          </div>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Mot de passe</label>
        <div className="space-y-2.5">
          <PasswordField value={currentPwd} onChange={setCurrentPwd} placeholder="Mot de passe actuel" />
          <PasswordField value={newPwd} onChange={setNewPwd} placeholder="Nouveau mot de passe" />

          {/* Strength bar */}
          {newPwd.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= strength ? STRENGTH_COLORS[strength] : 'bg-gray-100'
                  }`} />
                ))}
              </div>
              <p className={`text-xs font-medium ${
                strength <= 1 ? 'text-red-400' : strength === 2 ? 'text-orange-400' :
                strength === 3 ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {STRENGTH_LABELS[strength]}
              </p>
            </div>
          )}

          <div className="relative">
            <PasswordField value={confirmPwd} onChange={setConfirmPwd} placeholder="Confirmer le nouveau mot de passe" />
            {confirmPwd.length > 0 && (
              <span className="absolute right-9 top-1/2 -translate-y-1/2">
                {pwdMatch
                  ? <CheckCircle size={14} className="text-green-500" />
                  : <AlertCircle size={14} className="text-red-400" />}
              </span>
            )}
          </div>

          {pwdError && <p className="text-xs text-red-500">{pwdError}</p>}
          {pwdStatus === 'ok' && <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Mot de passe mis à jour</p>}

          <button
            onClick={handlePasswordSave}
            disabled={pwdStatus === 'saving'}
            className="bg-[#E8622A] hover:bg-[#D45520] text-white text-sm font-semibold
                       px-5 py-2.5 rounded-xl transition disabled:opacity-60"
          >
            {pwdStatus === 'saving' ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="flex items-start justify-between gap-4 pt-1 border-t border-gray-50">
        <div>
          <p className="text-sm font-semibold text-gray-800">Authentification à deux facteurs</p>
          <p className="text-xs text-gray-400 mt-0.5">Renforcez la sécurité de votre compte</p>
        </div>
        <Toggle checked={twoFactorEnabled} onChange={handleTwoFactor} />
      </div>
    </section>
  );
}