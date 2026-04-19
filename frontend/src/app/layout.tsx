// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from '@/lib/AuthContext';

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
        <html>
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}