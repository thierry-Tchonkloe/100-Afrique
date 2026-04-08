// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { LayoutDashboard, FileText, Tag, Image, Users, Bot, Globe, Mail, Megaphone, BarChart2, X,} from "lucide-react";

// type SidebarProps = {
//     isOpen: boolean;
//     setIsOpen: (value: boolean) => void;
// };

// const navItems = [
//     { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
//     { label: "Gestion des Contenus", href: "/contenus", icon: FileText },
//     { label: "Catégories et Tags", href: "/categories", icon: Tag },
//     { label: "Gestion des Médias", href: "/medias", icon: Image },
//     { label: "Rôles et Utilisateurs", href: "/utilisateurs", icon: Users },
//     { label: "Paramétrage Chatbot", href: "/chatbot", icon: Bot },
//     { label: "Gestion des Langues", href: "/langues", icon: Globe },
//     { label: "Export Newsletter", href: "/newsletter", icon: Mail },
//     { label: "Espaces Publicitaires", href: "/publicites", icon: Megaphone },
//     { label: "Statistiques", href: "/statistiques", icon: BarChart2 },
// ];

// export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
//     const pathname = usePathname();

//     return (
//         <>
//         {/* Overlay mobile */}
//         {isOpen && (
//             <div
//             className="fixed inset-0 bg-black/40 z-40 md:hidden"
//             onClick={() => setIsOpen(false)}
//             />
//         )}

//         <aside
//             className={`fixed top-0 left-0 h-screen bg-[#1E293B] text-white z-50
//             transition-all duration-300
//             ${isOpen ? "w-56 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"}
//             `}
//         >
//             {/* Header */}
//             <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-700">
//                 {isOpen && (
//                     <div className="w-7 h-7 bg-[#F59E0B] rounded flex items-center justify-center text-white font-bold text-sm">
//                         W
//                     </div>
//                 )}
//                 {isOpen && <span className="font-semibold text-sm tracking-wide">WAXEHO</span>}

//                 <button onClick={() => setIsOpen(false)} className="md:hidden">
//                     <X size={18} />
//                 </button>
//             </div>


//             {/* Navigation */}
//             <nav className="flex-1 overflow-y-auto py-3">
//                 <ul className="space-y-1">
//                     {navItems.map(({ label, href, icon: Icon }) => {
//                     const isActive = pathname === href;

//                     return (
//                         <li key={href}>
//                         <Link
//                             href={href}
//                             className={`flex items-center gap-3 px-4 py-2.5 text-sm mx-2 rounded-md transition ${
//                             isActive
//                                 ? "bg-[#F59E0B] text-white"
//                                 : "text-gray-300 hover:bg-gray-800 hover:text-white"
//                             }`}
//                         >
//                             <Icon size={18} />

//                             {isOpen && <span>{label}</span>}
//                         </Link>
//                         </li>
//                     );
//                     })}
//                 </ul>
//             </nav>
//         </aside>
//     </>
//     );
// }



//src/components/Dashboard/layout/Sidebar.tsx
"use client";
 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Tag, Image, Users, Bot, Globe, Mail, Megaphone, BarChart2, X,} from "lucide-react";
import SidebarRSSImporter from "@/components/Dashboard/SidebarRSSImporter";
 
type SidebarProps = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
};
 
const navItems = [
    { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { label: "Gestion des Contenus", href: "/contenus", icon: FileText },
    { label: "Catégories et Tags", href: "/categories", icon: Tag },
    { label: "Gestion des Médias", href: "/medias", icon: Image },
    { label: "Rôles et Utilisateurs", href: "/utilisateurs", icon: Users },
    { label: "Paramétrage Chatbot", href: "/chatbot", icon: Bot },
    { label: "Gestion des Langues", href: "/langues", icon: Globe },
    { label: "Export Newsletter", href: "/newsletter", icon: Mail },
    { label: "Espaces Publicitaires", href: "/publicites", icon: Megaphone },
    { label: "Statistiques", href: "/statistiques", icon: BarChart2 },
];
 
export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname();
 
    return (
        <>
        {/* Overlay mobile */}
        {isOpen && (
            <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            />
        )}
 
        <aside
            className={`fixed top-0 left-0 h-screen bg-[#1E293B] text-white z-50
            transition-all duration-300
            ${isOpen ? "w-56 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"}
            `}
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-700">
                {isOpen && (
                    <div className="w-7 h-7 bg-[#F59E0B] rounded flex items-center justify-center text-white font-bold text-sm">
                        W
                    </div>
                )}
                {isOpen && <span className="font-semibold text-sm tracking-wide">WAXEHO</span>}
 
                <button onClick={() => setIsOpen(false)} className="md:hidden">
                    <X size={18} />
                </button>
            </div>
 
 
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-3">
                <ul className="space-y-1">
                    {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;
 
                    return (
                        <li key={href}>
                        <Link
                            href={href}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm mx-2 rounded-md transition ${
                            isActive
                                ? "bg-[#F59E0B] text-white"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`}
                        >
                            <Icon size={18} />
 
                            {isOpen && <span>{label}</span>}
                        </Link>
                        </li>
                    );
                    })}
                </ul>
            </nav>
 
            {/* RSS Import Section */}
            <SidebarRSSImporter isOpen={isOpen} />
        </aside>
    </>
    );
}