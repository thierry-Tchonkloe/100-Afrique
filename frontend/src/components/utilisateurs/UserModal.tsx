// src/components/utilisateurs/UserModal.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { XIcon } from './icons';
import { Role, User } from './types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User> & { password?: string }) => void;
  editingUser?: User | null;
}

const UserModal = ({ isOpen, onClose, onSave, editingUser }: UserModalProps) => {
  const [name, setName] = useState(editingUser?.name || '');
  const [email, setEmail] = useState(editingUser?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(editingUser?.role || 'EDITOR');

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setPassword('');
    } else if (!isOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setRole('EDITOR');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingUser?.id, isOpen]);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }
    if (!editingUser && !password) {
      alert('Le mot de passe est requis pour un nouvel utilisateur');
      return;
    }

    const userData: Partial<User> & { password?: string } = { name: name.trim(), email: email.trim(), role };
    if (password) userData.password = password;
    if (editingUser) userData.id = editingUser.id;

    onSave(userData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            {editingUser ? "Modifier l'Utilisateur" : 'Ajouter un Utilisateur'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Nom Complet *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
              placeholder="Ex: Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
              placeholder="jean.dupont@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Mot de Passe {!editingUser && '*'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
              placeholder={editingUser ? 'Laisser vide pour ne pas changer' : 'Minimum 6 caractères'}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Rôle *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
            >
              <option value="EDITOR">Éditeur</option>
              <option value="SUPER_ADMIN">Super Administrateur</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            Annuler
          </button>
          <button onClick={handleSubmit} className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors">
            {editingUser ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;