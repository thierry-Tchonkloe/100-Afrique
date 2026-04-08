"use client";

import { Bell, HelpCircle, Search, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import LogOut from "@/components/Dashboard/logout";
import { useAuth } from "@/lib/AuthContext";

type NavbarProps = {
    toggleSidebar: () => void;
};

export default function Navbar({ toggleSidebar }: NavbarProps) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useAuth();

    return (
        <header className="fixed top-0 left-0 md:left-56 right-0 h-16 bg-[#1E293B] flex items-center px-6 gap-4 z-40">

            {/* Burger */}
            <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md hover:bg-gray-700 text-white">
                <Menu size={20} />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-9 pr-4 py-2 text-sm bg-[#334155] text-white rounded-full focus:outline-none" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-auto relative">
                <button className="p-2 rounded-full hover:bg-gray-700">
                    <Bell size={18} className="text-white" />
                </button>

                <button className="p-2 rounded-full hover:bg-gray-700">
                    <HelpCircle size={18} className="text-white" />
                </button>

                {/* User */}
                <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-white" >
                <div className="w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center">
                    {user?.name?.[0] || "A"}
                </div>

                <ChevronDown size={14} />
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 top-12 w-56 bg-white text-black rounded-lg shadow-lg py-2">
                        <div className="px-4 py-2 border-b">
                            <p className="text-sm font-semibold mb-1">{user?.name}</p>
                            <p className="text-sm font-semibold mb-1">{user?.role}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>

                        <Link href="/admin/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>

                        <Link href="/admin/setting" className="block px-4 py-2 hover:bg-gray-100">Paramètres</Link>

                        <div className="border-t my-1" />

                        <div className="px-4 py-2 hover:bg-gray-100">
                            <LogOut />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}