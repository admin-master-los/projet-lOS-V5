import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices, useDeleteService } from '../../hooks/useServices';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import { LoadingSpinner, ErrorMessage } from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
import * as Icons from 'lucide-react';

const ServiceList: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: services, isLoading, error, refetch } = useServices();
  const deleteMutation = useDeleteService();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Service supprimé !');
      setDeleteId(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconKey = iconName.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    return (Icons as any)[iconKey];
  };

  if (isLoading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" text="Chargement..." /></div>;
  if (error) return <ErrorMessage title="Erreur" message="Impossible de charger les services." onRetry={refetch} />;

  if (!services || services.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Services</h1>
            <p className="text-gray-400 mt-1">Gérer les services</p>
          </div>
          <Button variant="primary" icon={<Plus size={20} />} onClick={() => navigate('/admin/services/create')}>Créer</Button>
        </div>
        <div className="bg-white/5 border border-gray-700/50 rounded-xl p-12 text-center">
          <Briefcase size={32} className="text-cyan-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Aucun service</h3>
          <Button variant="primary" icon={<Plus size={20} />} onClick={() => navigate('/admin/services/create')}>Créer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-gray-400 mt-1">{services.length} service{services.length > 1 ? 's' : ''}</p>
        </div>
        <Button variant="primary" icon={<Plus size={20} />} onClick={() => navigate('/admin/services/create')}>Créer</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComponent = getIconComponent(service.icon);
          return (
            <div key={service.id} className="bg-white/5 border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                {IconComponent && <IconComponent size={24} className="text-cyan-400" />}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">{service.features.length} fonctionnalités</p>
                <ul className="space-y-1">
                  {service.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="text-sm text-gray-400 truncate">• {f}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" icon={<Edit2 size={16} />} onClick={() => navigate(`/admin/services/${service.id}/edit`)} fullWidth>Modifier</Button>
                <Button variant="danger" size="sm" icon={<Trash2 size={16} />} onClick={() => setDeleteId(service.id)}>Suppr.</Button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Supprimer ?" message="Action irréversible." confirmText="Supprimer" variant="danger" isLoading={deleteMutation.isPending} />
    </div>
  );
};

export default ServiceList;
