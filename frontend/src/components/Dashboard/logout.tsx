'use client';

import { useAuth } from "@/lib/AuthContext";

export default function LogOut() {
    const { logout } = useAuth();
    return (
        <header>
            {/* <span>{user?.name}</span> */}
            <button onClick={logout}>Déconnexion</button>
        </header>
    );
}