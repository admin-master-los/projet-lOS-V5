/**
 * Component: DateTimeSelection
 * Étape 2 - Choix de la date et de l'heure
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { checkSlotAvailability } from '../../admin/services/meetingsService';
import { generateTimeSlots } from '../../admin/utils/meetingHelpers';
import { useAllAvailabilities, useAllBlockedDates } from '../../admin/hooks/useAvailability';
import { useSettings } from '../../admin/hooks/useMeetingSettings';

const DateTimeSelection: React.FC = () => {
  const { bookingData, setDateTime, nextStep, previousStep } = useBooking();
  const { data: availabilities } = useAllAvailabilities();
  const { data: blockedDates } = useAllBlockedDates();
  const { data: settings } = useSettings();

  const [selectedDate, setSelectedDate] = useState<string | null>(bookingData.date);
  const [selectedTime, setSelectedTime] = useState<string | null>(bookingData.time);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Générer les jours du mois
  const getDaysInMonth = () => {
    const date = new Date(currentYear, currentMonth, 1);
    const days: Date[] = [];

    while (date.getMonth() === currentMonth) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  const days = getDaysInMonth();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Vérifier si une date est disponible
  const isDateAvailable = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Passé
    if (date < today) return false;

    // Trop loin dans le futur
    const maxDays = settings?.max_advance_days || 90;
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + maxDays);
    if (date > maxDate) return false;

    // Date bloquée
    if (blockedDates?.some((bd) => bd.blocked_date === dateStr)) return false;

    // Vérifier disponibilité jour de la semaine
    const dayOfWeek = date.getDay();
    const hasAvailability = availabilities?.some(
      (av) => av.day_of_week === dayOfWeek && av.is_available
    );

    return hasAvailability || false;
  };

  // Charger les créneaux disponibles pour une date
  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedDate || !bookingData.service) return;

      setLoadingSlots(true);
      try {
        const dayOfWeek = new Date(selectedDate).getDay();
        const dayAvailability = availabilities?.find(
          (av) => av.day_of_week === dayOfWeek && av.is_available
        );

        if (!dayAvailability) {
          setAvailableSlots([]);
          return;
        }

        // Générer tous les créneaux possibles
        const bufferTime = settings?.buffer_time || 0;
        const allSlots = generateTimeSlots(
          dayAvailability.start_time,
          dayAvailability.end_time,
          bookingData.service.duration,
          bufferTime
        );

        // Vérifier disponibilité de chaque créneau
        const slotsAvailability = await Promise.all(
          allSlots.map(async (slot) => {
            const available = await checkSlotAvailability(
              selectedDate,
              slot,
              bookingData.service!.duration
            );
            return { slot, available };
          })
        );

        // Filtrer les créneaux disponibles
        const available = slotsAvailability
          .filter((s) => s.available)
          .map((s) => s.slot);

        // Filtrer les créneaux dans le futur (si aujourd'hui)
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const minHours = settings?.min_advance_hours || 24;

        const filteredSlots = available.filter((slot) => {
          if (selectedDate !== today) return true;

          const slotTime = new Date(`${selectedDate}T${slot}`);
          const minTime = new Date(now.getTime() + minHours * 60 * 60 * 1000);

          return slotTime >= minTime;
        });

        setAvailableSlots(filteredSlots);
      } catch (error) {
        console.error('Erreur chargement créneaux:', error);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [selectedDate, bookingData.service, availabilities, settings, blockedDates]);

  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setDateTime(selectedDate, selectedTime);
      nextStep();
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-3">
          Choisissez votre créneau
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Service : <span className="text-white font-semibold">{bookingData.service?.name}</span> ({bookingData.service?.duration} min)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendrier */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-cyan-400" />
              Sélectionnez une date
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <span className="text-white font-semibold min-w-[180px] text-center">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
              <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Jours du mois */}
          <div className="grid grid-cols-7 gap-2">
            {/* Espaces vides avant le premier jour */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Jours */}
            {days.map((day) => {
              const dateStr = day.toISOString().split('T')[0];
              const isAvailable = isDateAvailable(day);
              const isSelected = selectedDate === dateStr;
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <button
                  key={dateStr}
                  onClick={() => isAvailable && handleDateSelect(day)}
                  disabled={!isAvailable}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                    ${isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white scale-110 shadow-lg'
                      : isAvailable
                      ? 'bg-white/5 text-white hover:bg-white/10 hover:scale-105'
                      : 'bg-transparent text-gray-600 cursor-not-allowed'
                    }
                    ${isToday && !isSelected ? 'ring-2 ring-cyan-500' : ''}
                  `}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {/* Légende */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-start gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-cyan-500 to-purple-600" />
              <span className="text-gray-400">Sélectionné</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded ring-2 ring-cyan-500 bg-white/5" />
              <span className="text-gray-400">Aujourd'hui</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-600" />
              <span className="text-gray-400">Indisponible</span>
            </div>
          </div>
        </div>

        {/* Créneaux horaires */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Clock className="w-6 h-6 text-purple-400" />
            Choisissez une heure
          </h3>

          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-gray-400">Sélectionnez d'abord une date</p>
            </div>
          ) : loadingSlots ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
              <p className="text-gray-400">Aucun créneau disponible pour cette date</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => handleTimeSelect(slot)}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${selectedTime === slot
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white scale-105 shadow-lg'
                      : 'bg-white/5 text-white hover:bg-white/10 hover:scale-105 border border-white/10'
                    }
                  `}
                >
                  {slot.substring(0, 5)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={previousStep}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          Retour
        </button>

        {selectedDate && selectedTime && (
          <button
            onClick={handleContinue}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
          >
            <span>Continuer</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DateTimeSelection;
