// src/components/Dashboard/UserRolesManagement.tsx
"use client";

import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Role = "Administrateur" | "Rédacteur en Chef" | "Rédacteur" | "Contributeur";
type Status = "Actif" | "Suspendu";

interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    lastLogin: string;
    status: Status;
    avatar: string;
}

interface RoleDefinition {
    name: Role;
    level: number;
    description: string;
    permissions: { label: string; allowed: boolean }[];
    color: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const INITIAL_USERS: User[] = [
    {
        id: 1,
        name: "Jean Dupont",
        email: "jean.dupont@waxeho.com",
        role: "Administrateur",
        lastLogin: "Il y a 2 heures",
        status: "Actif",
        avatar: "JD",
    },
    {
        id: 2,
        name: "Marie Laurent",
        email: "marie.laurent@waxeho.com",
        role: "Rédacteur en Chef",
        lastLogin: "Il y a 5 heures",
        status: "Actif",
        avatar: "ML",
    },
    {
        id: 3,
        name: "Pierre Martin",
        email: "pierre.martin@waxeho.com",
        role: "Rédacteur",
        lastLogin: "Hier à 14:30",
        status: "Actif",
        avatar: "PM",
    },
    {
        id: 4,
        name: "Sophie Bernard",
        email: "sophie.bernard@waxeho.com",
        role: "Contributeur",
        lastLogin: "Il y a 3 jours",
        status: "Actif",
        avatar: "SB",
    },
    {
        id: 5,
        name: "Luc Petit",
        email: "luc.petit@waxeho.com",
        role: "Rédacteur",
        lastLogin: "Il y a 1 semaine",
        status: "Suspendu",
        avatar: "LP",
    },
    ];

    const ROLE_DEFINITIONS: RoleDefinition[] = [
    {
        name: "Administrateur",
        level: 1,
        description: "Accès total au CMS",
        permissions: [
        { label: "Gestion complète des utilisateurs", allowed: true },
        { label: "Accès à tous les contenus", allowed: true },
        { label: "Configuration système", allowed: true },
        ],
        color: "bg-red-100 text-red-600",
    },
    {
        name: "Rédacteur en Chef",
        level: 2,
        description: "Publication et gestion éditoriale",
        permissions: [
        { label: "Publier tous les articles", allowed: true },
        { label: "Gérer salons et destinations", allowed: true },
        { label: "Accès limité aux réglages", allowed: false },
        ],
        color: "bg-purple-100 text-purple-600",
    },
    {
        name: "Rédacteur",
        level: 3,
        description: "Publication de ses propres contenus",
        permissions: [
        { label: "Publier ses articles", allowed: true },
        { label: "Gérer sa bibliothèque média", allowed: true },
        { label: "Pas d'accès aux réglages", allowed: false },
        ],
        color: "bg-blue-100 text-blue-600",
    },
    {
        name: "Contributeur",
        level: 4,
        description: "Création de brouillons uniquement",
        permissions: [
        { label: "Créer des brouillons", allowed: true },
        { label: "Pas de publication directe", allowed: false },
        { label: "Accès restreint", allowed: false },
        ],
        color: "bg-green-100 text-green-600",
    },
];

// ── Role Badge ─────────────────────────────────────────────────────────────────

const ROLE_BADGE: Record<Role, string> = {
    Administrateur: "bg-red-100 text-red-600",
    "Rédacteur en Chef": "bg-purple-100 text-purple-700",
    Rédacteur: "bg-blue-100 text-blue-600",
    Contributeur: "bg-green-100 text-green-600",
};

// ── Avatar colors ──────────────────────────────────────────────────────────────

const AVATAR_COLORS: Record<number, string> = {
    1: "bg-orange-400",
    2: "bg-pink-400",
    3: "bg-blue-400",
    4: "bg-teal-400",
    5: "bg-gray-300",
};

// ── Icons (inline SVG) ─────────────────────────────────────────────────────────

const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const SearchIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ChevronIcon = () => (
    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const PlusIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon = () => (
    <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const GearIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// ── Toggle Switch ──────────────────────────────────────────────────────────────

interface ToggleProps {
    enabled: boolean;
    onChange: () => void;
}

const Toggle = ({ enabled, onChange }: ToggleProps) => (
    <button
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? "bg-orange-500" : "bg-gray-300"
        }`}
    >
        <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-1"
        }`}
        />
    </button>
);

// ── Main Component ─────────────────────────────────────────────────────────────

export default function UserRolesManagement() {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("Tous les rôles");
    const [statusFilter, setStatusFilter] = useState<string>("Tous les statuts");

    const toggleStatus = (id: number) => {
        setUsers((prev) =>
        prev.map((u) =>
            u.id === id
            ? { ...u, status: u.status === "Actif" ? "Suspendu" : "Actif" }
            : u
        )
        );
    };

    const filtered = users.filter((u) => {
        const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "Tous les rôles" || u.role === roleFilter;
        const matchStatus = statusFilter === "Tous les statuts" || u.status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="max-w-5xl mx-auto space-y-6">

            {/* ── Header ── */}
            <div className="flex items-start justify-between">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Gestion des Utilisateurs et des Rôles</h1>
                <p className="text-sm text-gray-500 mt-0.5">Administrez les comptes et définissez les niveaux de permission</p>
            </div>
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 shadow-sm">
                <PlusIcon />
                Ajouter un Nouvel Utilisateur
            </button>
            </div>

            {/* ── Users Table Card ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Filters */}
            <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-gray-100">
                {/* Search */}
                <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 bg-gray-50 placeholder-gray-400"
                />
                </div>

                {/* Role filter */}
                <div className="relative">
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 text-gray-700 cursor-pointer"
                >
                    <option>Tous les rôles</option>
                    <option>Administrateur</option>
                    <option>Rédacteur en Chef</option>
                    <option>Rédacteur</option>
                    <option>Contributeur</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronIcon />
                </span>
                </div>

                {/* Status filter */}
                <div className="relative">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 text-gray-700 cursor-pointer"
                >
                    <option>Tous les statuts</option>
                    <option>Actif</option>
                    <option>Suspendu</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronIcon />
                </span>
                </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
                <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-medium">Utilisateur</th>
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">Rôle</th>
                    <th className="text-left px-4 py-3 font-medium">Dernière Connexion</th>
                    <th className="text-left px-4 py-3 font-medium">Statut</th>
                    <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/60 transition-colors duration-100">
                    {/* Avatar + Name */}
                    <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                        <div
                            className={`w-8 h-8 rounded-full ${AVATAR_COLORS[user.id]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                        >
                            {user.avatar}
                        </div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                        </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 text-gray-500">{user.email}</td>

                    {/* Role badge */}
                    <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE[user.role]}`}>
                        {user.role}
                        </span>
                    </td>

                    {/* Last login */}
                    <td className="px-4 py-3.5 text-gray-500">{user.lastLogin}</td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                        <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            user.status === "Actif"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                        >
                        {user.status}
                        </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2.5">
                        <button className="text-blue-500 hover:text-blue-700 transition-colors">
                            <EditIcon />
                        </button>
                        <Toggle
                            enabled={user.status === "Actif"}
                            onChange={() => toggleStatus(user.id)}
                        />
                        </div>
                    </td>
                    </tr>
                ))}

                {filtered.length === 0 && (
                    <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
                        Aucun utilisateur trouvé.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>

            {/* ── Role Definitions ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-5">
                <h2 className="text-base font-bold text-gray-900">Définition des Rôles</h2>
                <p className="text-sm text-gray-500 mt-0.5">Configurez les permissions pour chaque niveau d&apos;accès</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ROLE_DEFINITIONS.map((role) => (
                <div key={role.name} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{role.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${role.color}`}>
                        Niveau {role.level}
                    </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{role.description}</p>

                    {/* Permissions list */}
                    <ul className="space-y-1.5 mb-4">
                    {role.permissions.map((perm, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        {perm.allowed ? <CheckIcon /> : <CrossIcon />}
                        <span>{perm.label}</span>
                        </li>
                    ))}
                    </ul>

                    {/* Edit link */}
                    <button className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">
                    <GearIcon />
                    Modifier les permissions
                    </button>
                </div>
                ))}
            </div>

            {/* Save button */}
            <div className="flex justify-end mt-5">
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 shadow-sm">
                Enregistrer les Permissions des Rôles
                </button>
            </div>
            </div>

        </div>
        </div>
    );
}