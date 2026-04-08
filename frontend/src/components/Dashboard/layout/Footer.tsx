"use client";

type FooterProps = {
    isOpen: boolean;
};

export default function Footer({ isOpen }: FooterProps) {
    return (
        <footer className={`fixed bottom-0 right-0 h-12 bg-white border-t border-gray-200 flex items-center px-6 z-40 transition-all duration-300 ${isOpen ? "left-56" : "left-0 md:left-20"}`}>
            <div className="flex w-full justify-between text-xs text-gray-400">
                <span>© 2024 WAXEHO – Système de Gestion de Contenu</span>
                <span>Version 2.1.0</span>
            </div>
        </footer>
    );
}