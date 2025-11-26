import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateService } from '../../hooks/useServices';
import { useToast } from '../../hooks/useToast';
import ServiceForm from '../../components/forms/ServiceForm';
import Button from '../../components/common/Button';
import { ServiceFormData } from '../../utils/serviceValidation';
import { ArrowLeft } from 'lucide-react';

const ServiceCreate: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const createMutation = useCreateService();

  const handleSubmit = async (data: ServiceFormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Service créé avec succès !');
      navigate('/admin/services');
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/admin/services')}
          className="mb-4"
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-white">Créer un service</h1>
        <p className="text-gray-400 mt-1">Ajouter un nouveau service</p>
      </div>

      <div className="bg-white/5 border border-gray-700/50 rounded-xl p-6">
        <ServiceForm onSubmit={handleSubmit} isLoading={createMutation.isPending} submitLabel="Créer le service" />
      </div>
    </div>
  );
};

export default ServiceCreate;
