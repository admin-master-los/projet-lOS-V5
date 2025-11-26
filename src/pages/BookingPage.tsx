/**
 * Page: Booking
 * Page principale de réservation publique
 */

import React from 'react';
import { BookingProvider, useBooking } from '../contexts/BookingContext';
import ServiceSelection from '../components/booking/ServiceSelection';
import DateTimeSelection from '../components/booking/DateTimeSelection';
import ClientForm from '../components/booking/ClientForm';
import Confirmation from '../components/booking/Confirmation';
import BackgroundAnimation from '../components/BackgroundAnimation';

const BookingContent: React.FC = () => {
  const { currentStep } = useBooking();

  // Indicateur d'étapes
  const steps = [
    { id: 'service', label: 'Service', number: 1 },
    { id: 'datetime', label: 'Date & Heure', number: 2 },
    { id: 'contact', label: 'Coordonnées', number: 3 },
    { id: 'confirmation', label: 'Confirmation', number: 4 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">
      {/* Background */}
      <BackgroundAnimation />

      {/* Content */}
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 mb-4">
              Réservez votre rendez-vous
            </h1>
            <p className="text-gray-400 text-lg">
              Planifiez votre consultation en quelques clics
            </p>
          </div>

          {/* Stepper */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        index <= currentStepIndex
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white scale-110 shadow-lg shadow-cyan-500/50'
                          : 'bg-white/5 text-gray-500 border-2 border-white/10'
                      }`}
                    >
                      {step.number}
                    </div>
                    <p
                      className={`mt-2 text-sm font-medium transition-colors ${
                        index <= currentStepIndex ? 'text-white' : 'text-gray-500'
                      } hidden md:block`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                        index < currentStepIndex
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600'
                          : 'bg-white/10'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Steps Content */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            {currentStep === 'service' && <ServiceSelection />}
            {currentStep === 'datetime' && <DateTimeSelection />}
            {currentStep === 'contact' && <ClientForm />}
            {currentStep === 'confirmation' && <Confirmation />}
          </div>

          {/* Footer info */}
          <div className="text-center mt-12 text-gray-500 text-sm">
            <p>
              Une question ? Contactez-nous à{' '}
              <a href="mailto:contact@example.com" className="text-cyan-400 hover:underline">
                contact@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingPage: React.FC = () => {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  );
};

export default BookingPage;
