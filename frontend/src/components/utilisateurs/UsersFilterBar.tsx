// src/components/utilisateurs/UsersFilterBar.tsx
"use client";
import React from 'react';
import { SearchIcon, ChevronIcon } from './icons';

interface UsersFilterBarProps {
  search: string; setSearch: (v: string) => void;
  roleFilter: string; setRoleFilter: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
}

const UsersFilterBar = ({ search, setSearch, roleFilter, setRoleFilter, statusFilter, setStatusFilter }: UsersFilterBarProps) => (
  <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-gray-100">
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2"><SearchIcon /></span>
      <input
        type="text"
        placeholder="Rechercher par nom ou email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 bg-gray-50 placeholder-gray-400"
      />
    </div>

    <div className="relative">
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 text-gray-700 cursor-pointer"
      >
        <option value="all">Tous les rôles</option>
        <option value="SUPER_ADMIN">Super Administrateur</option>
        <option value="EDITOR">Éditeur</option>
      </select>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronIcon /></span>
    </div>

    <div className="relative">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 text-gray-700 cursor-pointer"
      >
        <option value="all">Tous les statuts</option>
        <option value="ACTIVE">Actif</option>
        <option value="SUSPENDED">Suspendu</option>
      </select>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronIcon /></span>
    </div>
  </div>
);

export default UsersFilterBar;