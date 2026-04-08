"use client";

import { useState } from "react";
import Sidebar from "@/components/Dashboard/layout/Sidebar";
import Navbar from "@/components/Dashboard/layout/Navbar";
import Footer from "@/components/Dashboard/layout/Footer";

export default function RootLayout({children,}: {children: React.ReactNode;}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <html lang="fr">
            <body className="bg-gray-50">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className={`pt-16 mb-12 min-h-screen p-6 transition-all duration-300 ${isSidebarOpen ? "ml-56" : "ml-0 md:ml-20"}`}>
                    {children}
                </main>

                <Footer isOpen={isSidebarOpen} />
            </body>
        </html>
    );
}