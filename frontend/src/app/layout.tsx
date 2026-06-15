// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from '@/lib/AuthContext';

// ── Option B : Montserrat (libre, proche de Gotham) ──────────────────────────
import { Montserrat, Coda } from 'next/font/google';

// ── Option A : Gotham auto-hébergé (décommentez si vous avez la licence) ─────
// import localFont from 'next/font/local';
// const gotham = localFont({
//   src: [
//     { path: '../../public/fonts/Gotham-Book.woff2',   weight: '400', style: 'normal' },
//     { path: '../../public/fonts/Gotham-Medium.woff2', weight: '500', style: 'normal' },
//     { path: '../../public/fonts/Gotham-Bold.woff2',   weight: '700', style: 'normal' },
//   ],
//   variable: '--font-gotham',
//   display: 'swap',
// });

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-gotham', // Même variable → swap sans toucher au CSS
  display: 'swap',
});

const coda = Coda({
  subsets: ['latin'],
  weight: ['400', '800'],      // Coda n'a que ces deux graisses
  variable: '--font-coda',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "100% Afrique | Média du Tourisme International",
  description: "Plateforme dédiée au tourisme international et africain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${montserrat.variable} ${coda.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}


















// // src/app/layout.tsx
// import "./globals.css";
// import type { Metadata } from "next";
// import { AuthProvider } from '@/lib/AuthContext';

// export const metadata: Metadata = {
//     title: "100% Afrique | Média du Tourisme International",
//     description: "Plateforme dédiée au tourisme international et africain.",
// };

// export default function RootLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     return (
//         <html>
//             <body>
//                 <AuthProvider>{children}</AuthProvider>
//             </body>
//         </html>
//     );
// }