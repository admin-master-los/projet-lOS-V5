/**
 * Component: ServicesManagement
 * Gestion des services/prestations
 */

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import {
  useAllServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useToggleServiceStatus,
} from '../../hooks/useMeetingServices';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import { LoadingSpinner } from '../common/LoadingSpinner';

const ServicesManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    category: '',
    color: '#06b6d4',
    icon: 'Calendar',
  });

  const { data: services, isLoading } = useAllServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const toggleStatus = useToggleServiceStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingService) {
      await updateService.mutateAsync({ id: editingService.id, ...formData });
    } else {
      await createService.mutateAsync(formData);
    }

    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 60,
      category: '',
      color: '#06b6d4',
      icon: 'Calendar',
    });
    setEditingService(null);
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      category: service.category,
      color: service.color,
      icon: service.icon || 'Calendar',
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Services</h2>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouveau service
        </Button>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => (
            <div
              key={service.id}
              className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: service.color + '20' }}
                  >
                    <div style={{ color: service.color }}>📅</div>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{service.name}</h3>
                    <p className="text-sm text-gray-400">{service.duration} min</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    toggleStatus.mutate({
                      id: service.id,
                      isActive: !service.is_active,
                    })
                  }
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  {service.is_active ? (
                    <Eye className="w-5 h-5 text-green-400" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              <p className="text-gray-400 text-sm mb-4">{service.description}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (confirm('Supprimer ce service ?')) {
                      deleteService.mutate(service.id);
                    }
                  }}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingService ? 'Modifier le service' : 'Nouveau service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom du service"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Durée (minutes)"
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: parseInt(e.target.value) })
              }
              min={15}
              max={240}
              required
            />

            <Input
              label="Couleur"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>

          <Input
            label="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="web-development, digital-strategy..."
            required
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createService.isPending || updateService.isPending}
            >
              {editingService ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServicesManagement;
