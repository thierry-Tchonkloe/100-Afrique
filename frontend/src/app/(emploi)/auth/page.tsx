'use client';
// src/app/(emploi)/auth/page.tsx
// Page d'authentification du sous-univers Emploi — Connexion + Inscription.
// Toute la logique de formulaire vit désormais dans les composants dédiés
// sous src/components/emploi/auth/*, cette page ne gère plus que la
// disposition générale et le switch d'onglet.

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import AuthHeroPanel from '@/components/emploi/auth/AuthHeroPanel';
import LoginForm from '@/components/emploi/auth/LoginForm';
import RegisterForm from '@/components/emploi/auth/RegisterForm';

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
      <AuthHeroPanel />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-white">
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

        <div className="px-8 flex-shrink-0">
          <div className="grid grid-cols-2 bg-gray-100 rounded-2xl p-1 max-w-sm">
            {(['login', 'register'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={clsx(
                  'py-2.5 text-sm font-semibold rounded-xl transition',
                  tab === t ? 'bg-[#E8622A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                )}>
                {t === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-start px-8 py-6">
          <div className="w-full max-w-sm">
            {tab === 'login'
              ? <LoginForm onSuccess={handleSuccess} />
              : <RegisterForm onSuccess={handleSuccess} />
            }

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
