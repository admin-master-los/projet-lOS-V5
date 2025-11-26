import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Key,
} from 'lucide-react';
import {
  useAdminUsers,
  useCreateAdminUser,
  useUpdateAdminUser,
  useDeleteAdminUser,
  useToggleAdminUserActive,
  useAdminUsersStats,
} from '../../hooks/useSettings';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import { useToast } from '../../hooks/useToast';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

interface UserFormData {
  full_name: string;
  email: string;
  password?: string;
  phone: string;
  role: AdminRole;
  title: string;
  department: string;
  bio: string;
  is_active: boolean;
}

const ROLES = [
  { value: 'super_admin', label: 'Super Admin', description: 'Accès complet' },
  { value: 'admin', label: 'Admin', description: 'Gestion du contenu' },
  { value: 'editor', label: 'Éditeur', description: 'Édition du contenu' },
  { value: 'viewer', label: 'Lecteur', description: 'Lecture seule' },
];

const UsersTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { showToast } = useToast();

  // Hooks
  const { data: users, isLoading } = useAdminUsers();
  const { data: stats } = useAdminUsersStats();
  const createMutation = useCreateAdminUser();
  const updateMutation = useUpdateAdminUser();
  const deleteMutation = useDeleteAdminUser();
  const toggleActiveMutation = useToggleAdminUserActive();

  const [formData, setFormData] = useState<UserFormData>({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'viewer',
    title: '',
    department: '',
    bio: '',
    is_active: true,
  });

  // Filtrer les utilisateurs
  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'viewer',
        title: user.title || '',
        department: user.department || '',
        bio: user.bio || '',
        is_active: user.is_active !== false,
      });
    } else {
      setEditingUser(null);
      setFormData({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        role: 'viewer',
        title: '',
        department: '',
        bio: '',
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Mise à jour - ne pas inclure le password
        const { password, ...updateData } = formData;
        await updateMutation.mutateAsync({
          id: editingUser.id,
          data: updateData as any,
        });
        showToast('Utilisateur mis à jour avec succès', 'success');
      } else {
        // Création - password obligatoire
        if (!formData.password || formData.password.length < 8) {
          showToast('Le mot de passe doit contenir au moins 8 caractères', 'error');
          return;
        }
        await createMutation.mutateAsync(formData);
        showToast('Utilisateur créé avec succès', 'success');
      }
      handleCloseModal();
    } catch (error: any) {
      showToast(
        error?.message || 'Erreur lors de la sauvegarde',
        'error'
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      showToast('Utilisateur supprimé avec succès', 'success');
      setDeleteId(null);
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      await toggleActiveMutation.mutateAsync({ id, isActive: !currentState });
      showToast(
        `Utilisateur ${!currentState ? 'activé' : 'désactivé'}`,
        'success'
      );
    } catch (error) {
      showToast('Erreur lors du changement de statut', 'error');
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      super_admin: 'bg-red-100 text-red-800',
      admin: 'bg-blue-100 text-blue-800',
      editor: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800',
    };
    return badges[role] || badges.viewer;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Utilisateurs Administrateurs
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredUsers?.length || 0} utilisateur(s) au total
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Statistiques rapides */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Super Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.by_role?.super_admin || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.by_role?.admin || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">Tous les rôles</option>
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`bg-white rounded-lg border p-6 hover:shadow-md transition-shadow ${
                !user.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.full_name || 'Sans nom'}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {ROLES.find((r) => r.value === user.role)?.label ||
                          user.role}
                      </span>
                      {!user.is_active && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Inactif
                        </span>
                      )}
                    </div>

                    {user.title && (
                      <p className="text-sm text-gray-600">{user.title}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      {user.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {user.phone}
                        </div>
                      )}
                      {user.department && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {user.department}
                        </div>
                      )}
                    </div>

                    {user.last_login_at && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        Dernière connexion:{' '}
                        {new Date(user.last_login_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(user.id, user.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      user.is_active
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={user.is_active ? 'Désactiver' : 'Activer'}
                  >
                    {user.is_active ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenModal(user)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(user.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || roleFilter !== 'all'
                ? 'Aucun résultat ne correspond à vos critères'
                : 'Commencez par ajouter des utilisateurs administrateurs'}
            </p>
            {!searchQuery && roleFilter === 'all' && (
              <Button onClick={() => handleOpenModal()} icon={Plus}>
                Ajouter un utilisateur
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal de création/édition */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom complet"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {!editingUser && (
            <Input
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              placeholder="Min. 8 caractères"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Téléphone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <Select
              label="Rôle"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as AdminRole })
              }
              options={ROLES.map((r) => ({ value: r.value, label: r.label }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Titre"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ex: Développeur Senior"
            />

            <Input
              label="Département"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              placeholder="Ex: Technique"
            />
          </div>

          <Textarea
            label="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
            placeholder="Description courte de l'utilisateur..."
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Compte actif
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingUser ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer cet utilisateur ?"
        message="Cette action est irréversible. L'utilisateur et toutes ses données seront supprimés."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default UsersTab;
