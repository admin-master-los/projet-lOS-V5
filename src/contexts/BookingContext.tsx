/**
 * Context: Booking
 * Gestion de l'état du processus de réservation
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookingData, BookingStep } from '../types/booking.types';

interface BookingContextType {
  bookingData: BookingData;
  currentStep: BookingStep;
  setService: (service: BookingData['service']) => void;
  setDateTime: (date: string, time: string) => void;
  setClient: (client: BookingData['client']) => void;
  setChannel: (channel: BookingData['channel']) => void;
  setAcceptTerms: (accept: boolean) => void;
  goToStep: (step: BookingStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialBookingData: BookingData = {
  service: null,
  date: null,
  time: null,
  client: null,
  channel: null,
  acceptTerms: false,
};

const steps: BookingStep[] = ['service', 'datetime', 'contact', 'confirmation'];

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
  const [currentStep, setCurrentStep] = useState<BookingStep>('service');

  const setService = (service: BookingData['service']) => {
    setBookingData((prev) => ({ ...prev, service }));
  };

  const setDateTime = (date: string, time: string) => {
    setBookingData((prev) => ({ ...prev, date, time }));
  };

  const setClient = (client: BookingData['client']) => {
    setBookingData((prev) => ({ ...prev, client }));
  };

  const setChannel = (channel: BookingData['channel']) => {
    setBookingData((prev) => ({ ...prev, channel }));
  };

  const setAcceptTerms = (accept: boolean) => {
    setBookingData((prev) => ({ ...prev, acceptTerms: accept }));
  };

  const goToStep = (step: BookingStep) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const previousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const resetBooking = () => {
    setBookingData(initialBookingData);
    setCurrentStep('service');
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        currentStep,
        setService,
        setDateTime,
        setClient,
        setChannel,
        setAcceptTerms,
        goToStep,
        nextStep,
        previousStep,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
