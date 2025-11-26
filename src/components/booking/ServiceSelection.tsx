/**
 * Component: ServiceSelection
 * Étape 1 - Sélection du service
 */

import React from 'react';
import { Clock, Check, ChevronRight } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { useActiveServices } from '../../admin/hooks/useMeetingServices';

const ServiceSelection: React.FC = () => {
  const { bookingData, setService, nextStep } = useBooking();
  const { data: services, isLoading } = useActiveServices();

  const handleServiceSelect = (service: any) => {
    setService({
      id: service.id,
      name: service.name,
      duration: service.duration,
      color: service.color,
      description: service.description,
    });
  };

  const handleContinue = () => {
    if (bookingData.service) {
      nextStep();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-3">
          Choisissez votre service
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Sélectionnez le type de consultation qui correspond à vos besoins
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <button
            key={service.id}
            onClick={() => handleServiceSelect(service)}
            className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
              bookingData.service?.id === service.id
                ? 'border-cyan-500 bg-cyan-500/10 scale-105'
                : 'border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-white/10'
            }`}
          >
            {/* Checkmark si sélectionné */}
            {bookingData.service?.id === service.id && (
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}

            {/* Icon avec couleur du service */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{
                backgroundColor: `${service.color}20`,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg"
                style={{
                  backgroundColor: service.color,
                }}
              />
            </div>

            {/* Contenu */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              {service.name}
            </h3>

            {service.description && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>
            )}

            {/* Durée */}
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{service.duration} minutes</span>
            </div>

            {/* Hover effect */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${service.color}10, transparent)`,
              }}
            />
          </button>
        ))}
      </div>

      {/* Services vides */}
      {services && services.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
            <Clock className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-400">Aucun service disponible pour le moment</p>
        </div>
      )}

      {/* Bouton Continuer */}
      {bookingData.service && (
        <div className="flex justify-center pt-6">
          <button
            onClick={handleContinue}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 flex items-center gap-3 hover:scale-105"
          >
            <span>Continuer</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
