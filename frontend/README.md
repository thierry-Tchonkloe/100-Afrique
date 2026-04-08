This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
















////////////////// RECENTLY EDITED FILES Dashboard ==> connexion //////////////////


# iTourisme Nomade — Page de Connexion

## Structure des fichiers

```
├── app/
│   ├── (auth)/login/page.tsx    ← Copier LoginPage.tsx ici
│   └── layout.tsx               ← Ajouter <AuthProvider>
├── components/
│   └── ProtectedRoute.tsx
├── hooks/
│   └── useLogin.ts
├── lib/
│   ├── auth.ts                  ← Service d'auth + stockage token
│   └── AuthContext.tsx          ← Context global React
├── types/
│   └── auth.ts
└── middleware.ts                ← Copier middleware/middleware.ts → racine du projet
```

## 1. Variables d'environnement

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.itourisme-nomade.com/api
```

## 2. Intégration dans le layout racine

```tsx
// app/layout.tsx
import { AuthProvider } from '@/lib/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

## 3. Placer la page de login

```tsx
// app/(auth)/login/page.tsx
export { default } from '@/app/LoginPage';
```

## 4. Middleware (protection des routes)

Copier `middleware/middleware.ts` vers la **racine du projet** sous le nom `middleware.ts`.

```
projet/
├── middleware.ts   ← ici
├── app/
│   └── ...
```

## 5. Protéger une page admin

```tsx
// app/admin/dashboard/page.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <h1>Dashboard</h1>
    </ProtectedRoute>
  );
}
```

## 6. Utiliser le hook useAuth dans un composant

```tsx
'use client';
import { useAuth } from '@/lib/AuthContext';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  return (
    <header>
      <span>{user?.name}</span>
      <button onClick={logout}>Déconnexion</button>
    </header>
  );
}
```

## Sécurité implémentée

| Mesure | Détail |
|--------|--------|
| **JWT** | Token stocké en sessionStorage (ou localStorage si "Remember me") |
| **Expiration token** | Vérification automatique à l'initialisation |
| **Rate limiting client** | 5 tentatives max → blocage 15 min |
| **Validation formulaire** | Email regex + longueur mot de passe |
| **HTTPS** | Forcé en production via headers middleware |
| **Headers sécurité** | X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| **Redirection** | Unauthenticated → /login, authenticated → /admin/dashboard |
| **Roles** | EDITOR vs SUPER_ADMIN, ProtectedRoute vérifie le rôle |

## Flow de connexion

```
LoginPage → useLogin hook → lib/auth.ts (checkRateLimit) 
  → POST /api/admin/login 
  → AuthContext.setAuth (token + user stockés)
  → router.push('/admin/dashboard')
```