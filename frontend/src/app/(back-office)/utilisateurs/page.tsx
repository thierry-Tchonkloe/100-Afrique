// src/app/(back-office)/utilisateurs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "SUPER_ADMIN" | "EDITOR";
type Status = "ACTIVE" | "SUSPENDED";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  status: Status;
}

interface RoleDefinition {
  name: Role;
  level: number;
  description: string;
  permissions: { label: string; allowed: boolean }[];
  color: string;
}

interface Permission {
  id: string;
  label: string;
  description: string;
  category: string;
}

interface RolePermissions {
  role: Role;
  permissions: string[]; // IDs des permissions
}

interface ApiError {
  response?: {
    data?: {
      success?: boolean;
      message?: string;
      error?: string;
      errors?: { field: string; message: string }[]; // ✅ AJOUT
    };
    status?: number;
  };
  message?: string;
}

// ─── Role Configuration ───────────────────────────────────────────────────────

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Administrateur",
  EDITOR: "Éditeur",
};

const ROLE_BADGE: Record<Role, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-600",
  EDITOR: "bg-blue-100 text-blue-600",
};

const AVATAR_COLORS = [
  "bg-orange-400",
  "bg-pink-400",
  "bg-blue-400",
  "bg-teal-400",
  "bg-purple-400",
  "bg-indigo-400",
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ─── Toggle Switch ────────────────────────────────────────────────────────────

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const Toggle = ({ enabled, onChange, disabled }: ToggleProps) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
      enabled ? "bg-orange-500" : "bg-gray-300"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
        enabled ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

// ─── User Modal ───────────────────────────────────────────────────────────────

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  editingUser?: User | null;
}

const UserModal = ({ isOpen, onClose, onSave, editingUser }: UserModalProps) => {
  // ✅ CORRECTION: Initialiser directement avec les valeurs de editingUser
  const [name, setName] = useState(editingUser?.name || "");
  const [email, setEmail] = useState(editingUser?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(editingUser?.role || "EDITOR");

  // ✅ CORRECTION: Reset basé sur editingUser?.id et isOpen pour éviter setState dans effect
  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setPassword("");
    } else if (!isOpen) {
      // Reset uniquement quand le modal se ferme
      setName("");
      setEmail("");
      setPassword("");
      setRole("EDITOR");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingUser?.id, isOpen]); // ✅ Dépendre de l'ID plutôt que de l'objet complet

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      alert("Veuillez remplir tous les champs requis");
      return;
    }

    if (!editingUser && !password) {
      alert("Le mot de passe est requis pour un nouvel utilisateur");
      return;
    }

    const userData: Partial<User> & { password?: string } = {
      name: name.trim(),
      email: email.trim(),
      role,
    };

    if (password) {
      userData.password = password;
    }

    if (editingUser) {
      userData.id = editingUser.id;
    }

    onSave(userData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            {editingUser ? "Modifier l'Utilisateur" : "Ajouter un Utilisateur"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon />
          </button>
        </div>

        {/* Body */}
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
              Mot de Passe {!editingUser && "*"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
              placeholder={editingUser ? "Laisser vide pour ne pas changer" : "Minimum 6 caractères"}
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

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
          >
            {editingUser ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Permissions Modal ────────────────────────────────────────────────────────

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rolePermissions: RolePermissions) => void;
  role: RoleDefinition;
  allPermissions: Permission[];
  currentPermissions: string[];
}

const PermissionsModal = ({
  isOpen,
  onClose,
  onSave,
  role,
  allPermissions,
  currentPermissions,
}: PermissionsModalProps) => {
  // ✅ CORRECTION: Initialiser directement avec currentPermissions
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(currentPermissions);

  // ✅ CORRECTION: Reset basé sur isOpen et currentPermissions stringifiés
  useEffect(() => {
    if (isOpen) {
      setSelectedPermissions(currentPermissions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentPermissions.join(',')]); // ✅ Utiliser join(',') pour détecter les changements

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    onSave({
      role: role.name,
      permissions: selectedPermissions,
    });
    onClose();
  };

  if (!isOpen) return null;

  // Grouper les permissions par catégorie
  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Permissions - {ROLE_LABELS[role.name]}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {Object.entries(groupedPermissions).map(([category, permissions]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-gray-800 mb-3">{category}</h4>
              <div className="space-y-2">
                {permissions.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      className="mt-0.5 accent-orange-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{perm.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {selectedPermissions.length} permission(s) sélectionnée(s)
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors flex items-center gap-2"
            >
              <SaveIcon />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UserRolesManagement() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<User[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<Role, string[]>>({
    SUPER_ADMIN: [],
    EDITOR: [],
  });
  const [roleDefinitions, setRoleDefinitions] = useState<RoleDefinition[]>([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ── Fetch Data ─────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
    fetchRoleDefinitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      if (response.data.data) {
        setUsers(response.data.data);
      }
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Erreur chargement utilisateurs:", apiError);
      setError(apiError.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await api.get("/admin/permissions");
      if (response.data.data) {
        setAllPermissions(response.data.data);
      }
    } catch (err) {
      console.error("Erreur chargement permissions:", err);
    }
  };

  const fetchRoleDefinitions = async () => {
  try {
    const response = await api.get("/admin/roles");
    if (response.data.data) {
      const roles = response.data.data;
      setRoleDefinitions(roles);

      // ✅ CORRECTION: Extraire les IDs des permissions depuis allPermissions
      const permissions: Record<Role, string[]> = {
        SUPER_ADMIN: [],
        EDITOR: [],
      };

      // Récupérer d'abord toutes les permissions pour avoir les IDs
      const allPerms = await api.get("/admin/permissions");
      const allPermissionsData: Permission[] = allPerms.data.data || [];

      roles.forEach((role: RoleDefinition) => {
        // Pour chaque rôle, extraire les IDs des permissions "allowed"
        const allowedPermissionIds = allPermissionsData
          .filter((perm) => {
            // Trouver si cette permission est "allowed" dans ce rôle
            const rolePermission = role.permissions.find((p) => p.label === perm.label);
            return rolePermission?.allowed === true;
          })
          .map((perm) => perm.id);

        permissions[role.name] = allowedPermissionIds;
      });

      setRolePermissions(permissions);
    }
  } catch (err) {
    console.error("Erreur chargement rôles:", err);
  }
};

  // ── User Actions ───────────────────────────────────────────────────────────

  const handleCreateUser = async (userData: Partial<User> & { password?: string }) => {
    try {
      setSaving(true);
      const response = await api.post("/admin/register", userData);
      if (response.data.data) {
        setUsers([...users, response.data.data]);
        setIsUserModalOpen(false);
        setEditingUser(null);
      }
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Erreur création utilisateur:", apiError);
      alert(apiError.response?.data?.message || "Erreur lors de la création");
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
        setUsers(users.map((u) => (u.id === userData.id ? response.data.data : u)));
        setIsUserModalOpen(false);
        setEditingUser(null);
      }
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Erreur mise à jour utilisateur:", apiError);
      alert(apiError.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUser = (userData: Partial<User> & { password?: string }) => {
    if (editingUser) {
      handleUpdateUser(userData);
    } else {
      handleCreateUser(userData);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

    try {
      setSaving(true);
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Erreur suppression utilisateur:", apiError);
      alert(apiError.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: Status) => {
    const newStatus: Status = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    try {
      setSaving(true);
      const response = await api.patch(`/admin/users/${id}/status`, { status: newStatus });
      if (response.data.data) {
        setUsers(users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
      }
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Erreur changement statut:", apiError);
      alert(apiError.response?.data?.message || "Erreur lors du changement de statut");
    } finally {
      setSaving(false);
    }
  };

  // ── Role Permissions Actions ───────────────────────────────────────────────

  const handleSaveRolePermissions = async (data: RolePermissions) => {
    console.log('📤 Données à envoyer:', {
    role: data.role,
    permissions: data.permissions,
    permissionsType: typeof data.permissions,
    isArray: Array.isArray(data.permissions),
    length: data.permissions.length,
    sample: data.permissions.slice(0, 3),
  }); // ✅ DEBUG
  try {
    setSaving(true);
    console.log('📤 Envoi des permissions:', data); // ✅ DEBUG

    const response = await api.put(`/admin/roles/${data.role}/permissions`, {
      permissions: data.permissions,
    });

    console.log('✅ Réponse reçue:', response.data); // ✅ DEBUG

    if (response.data.success) {
      // Mettre à jour l'état local
      setRolePermissions((prev) => ({
        ...prev,
        [data.role]: data.permissions,
      }));

      // Recharger les définitions de rôles
      await fetchRoleDefinitions();

      setIsPermissionsModalOpen(false);
      setEditingRole(null);
    }
  } catch (err) {
    const apiError = err as ApiError;
    console.error("Erreur sauvegarde permissions:", apiError);
    
    // ✅ AMÉLIORATION: Afficher les erreurs de validation détaillées
    const errorMessage = apiError.response?.data?.errors
      ? apiError.response.data.errors.map((e) => `${e.field}: ${e.message}`).join('\n')
      : apiError.response?.data?.message || "Erreur lors de la sauvegarde";
    
    alert(errorMessage);
  } finally {
    setSaving(false);
  }
};

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (index: number) => {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? "s" : ""}`;
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString("fr-FR");
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* ── Header ── */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gestion des Utilisateurs et des Rôles</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Administrez les comptes et définissez les niveaux de permission
              </p>
            </div>
            <button
              onClick={() => {
                setEditingUser(null);
                setIsUserModalOpen(true);
              }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 shadow-sm"
            >
              <PlusIcon />
              Ajouter un Utilisateur
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <div className="text-red-600">⚠️</div>
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">
                <XIcon />
              </button>
            </div>
          )}

          {/* ── Users Table ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Filters */}
            <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-gray-100">
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
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronIcon />
                </span>
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
                  <th className="text-left px-4 py-3 font-medium">Créé le</th>
                  <th className="text-left px-4 py-3 font-medium">Statut</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50/60 transition-colors duration-100">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                        >
                          {getInitials(user.name)}
                        </div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-gray-500">{user.email}</td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ROLE_BADGE[user.role]
                        }`}
                      >
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-gray-500">{formatDate(user.createdAt)}</td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {user.status === "ACTIVE" ? "Actif" : "Suspendu"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setIsUserModalOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Modifier"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={saving}
                          className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          <TrashIcon />
                        </button>
                        <Toggle
                          enabled={user.status === "ACTIVE"}
                          onChange={() => handleToggleStatus(user.id, user.status)}
                          disabled={saving}
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
              <p className="text-sm text-gray-500 mt-0.5">
                Configurez les permissions pour chaque niveau d&apos;accès
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roleDefinitions.map((role) => (
                <div
                  key={role.name}
                  className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{ROLE_LABELS[role.name]}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${role.color}`}>
                      Niveau {role.level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{role.description}</p>

                  <ul className="space-y-1.5 mb-4">
                    {role.permissions.map((perm, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        {perm.allowed ? <CheckIcon /> : <CrossIcon />}
                        <span>{perm.label}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setEditingRole(role);
                      setIsPermissionsModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
                  >
                    <GearIcon />
                    Modifier les permissions
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />

      {editingRole && (
        <PermissionsModal
          isOpen={isPermissionsModalOpen}
          onClose={() => {
            setIsPermissionsModalOpen(false);
            setEditingRole(null);
          }}
          onSave={handleSaveRolePermissions}
          role={editingRole}
          allPermissions={allPermissions}
          currentPermissions={rolePermissions[editingRole.name] || []}
        />
      )}
    </ProtectedRoute>
  );
}