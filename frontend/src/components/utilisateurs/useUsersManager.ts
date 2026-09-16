// src/components/utilisateurs/useUsersManager.ts
"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User, Status, getApiErrorMessage } from './types';

export function useUsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      if (response.data.data) setUsers(response.data.data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors du chargement'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreateModal = () => { setEditingUser(null); setIsUserModalOpen(true); };
  const openEditModal = (user: User) => { setEditingUser(user); setIsUserModalOpen(true); };
  const closeUserModal = () => { setIsUserModalOpen(false); setEditingUser(null); };

  const handleCreateUser = async (userData: Partial<User> & { password?: string }) => {
    try {
      setSaving(true);
      const response = await api.post('/admin/register', userData);
      if (response.data.data) {
        setUsers((prev) => [...prev, response.data.data]);
        closeUserModal();
      }
    } catch (err) {
      alert(getApiErrorMessage(err, 'Erreur lors de la création'));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateUser = async (userData: Partial<User> & { password?: string }) => {
    if (!userData.id) return;
    try {
      setSaving(true);
      const response = await api.put(`/admin/users/${userData.id}`, userData);
      if (response.data.data) {
        setUsers((prev) => prev.map((u) => (u.id === userData.id ? response.data.data : u)));
        closeUserModal();
      }
    } catch (err) {
      alert(getApiErrorMessage(err, 'Erreur lors de la mise à jour'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUser = (userData: Partial<User> & { password?: string }) => {
    if (editingUser) handleUpdateUser(userData);
    else handleCreateUser(userData);
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      setSaving(true);
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(getApiErrorMessage(err, 'Erreur lors de la suppression'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: Status) => {
    const newStatus: Status = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      setSaving(true);
      const response = await api.patch(`/admin/users/${id}/status`, { status: newStatus });
      if (response.data.data) {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
      }
    } catch (err) {
      alert(getApiErrorMessage(err, 'Erreur lors du changement de statut'));
    } finally {
      setSaving(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return {
    users, filtered, loading, saving, error, setError,
    search, setSearch, roleFilter, setRoleFilter, statusFilter, setStatusFilter,
    isUserModalOpen, editingUser, openCreateModal, openEditModal, closeUserModal,
    handleSaveUser, handleDeleteUser, handleToggleStatus,
  };
}