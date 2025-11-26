import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useService, useUpdateService } from '../../hooks/useServices';
import { useToast } from '../../hooks/useToast';
import ServiceForm from '../../components/forms/ServiceForm';
import Button from '../../components/common/Button';
import { LoadingSpinner, ErrorMessage } from '../../components/common/LoadingSpinner';
import { ServiceFormData } from '../../utils/serviceValidation';
import { ArrowLeft } from 'lucide-react';

const ServiceEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: service, isLoading, error } = useService(id);
  const updateMutation = useUpdateService();

  const handleSubmit = async (data: ServiceFormData) => {
    if (!id) return;
    try {
      await updateMutation.mutateAsync({ id, input: data });
      toast.success('Service modifié !');
      navigate('/admin/services');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" text="Chargement..." /></div>;
  if (error || !service) {
    return (
      <div className="max-w-4xl">
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/admin/services')} className="mb-4">Retour</Button>
        <ErrorMessage title="Service introuvable" message="Ce service n'existe pas." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/admin/services')} className="mb-4">Retour</Button>
        <h1 className="text-2xl font-bold text-white">Modifier le service</h1>
        <p className="text-gray-400 mt-1">"{service.title}"</p>
      </div>

      <div className="bg-white/5 border border-gray-700/50 rounded-xl p-6">
        <ServiceForm
          initialData={{
            icon: service.icon,
            title: service.title,
            description: service.description,
            features: service.features,
          }}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          submitLabel="Enregistrer"
        />
      </div>
    </div>
  );
};

export default ServiceEdit;
