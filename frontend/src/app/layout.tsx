// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from '@/lib/AuthContext';
import { Montserrat, Coda } from 'next/font/google';

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
