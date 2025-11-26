/**
 * Component: AvailabilitySettings
 * Configuration disponibilités et paramètres
 */

import React, { useState } from 'react';
import { Clock, Calendar, Settings, Save } from 'lucide-react';
import {
  useAllAvailabilities,
  useAllBlockedDates,
  useCreateBlockedDate,
  useDeleteBlockedDate,
} from '../../hooks/useAvailability';
import {
  useSettings,
  useUpdateSettings,
} from '../../hooks/useMeetingSettings';
import Button from '../common/Button';
import Input from '../common/Input';
import { LoadingSpinner } from '../common/LoadingSpinner';

const AvailabilitySettings: React.FC = () => {
  const { data: availabilities } = useAllAvailabilities();
  const { data: blockedDates } = useAllBlockedDates();
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const createBlockedDate = useCreateBlockedDate();
  const deleteBlockedDate = useDeleteBlockedDate();

  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [settingsForm, setSettingsForm] = useState({
    buffer_time: settings?.buffer_time || 15,
    max_advance_days: settings?.max_advance_days || 90,
    min_advance_hours: settings?.min_advance_hours || 24,
    slot_duration: settings?.slot_duration || 45,
  });

  const handleSaveSettings = async () => {
    await updateSettings.mutateAsync({
      buffer_time: settingsForm.buffer_time.toString(),
      max_advance_days: settingsForm.max_advance_days.toString(),
      min_advance_hours: settingsForm.min_advance_hours.toString(),
      slot_duration: settingsForm.slot_duration.toString(),
    });
  };

  const handleAddBlockedDate = async () => {
    if (newBlockedDate) {
      await createBlockedDate.mutateAsync({
        blocked_date: newBlockedDate,
        reason: 'Date bloquée manuellement',
      });
      setNewBlockedDate('');
    }
  };

  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  return (
    <div className="space-y-6">
      {/* Disponibilités */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-cyan-400" />
          Horaires de disponibilité
        </h2>

        <div className="space-y-3">
          {availabilities?.map((availability) => (
            <div
              key={availability.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
            >
              <span className="text-white font-medium">
                {dayNames[availability.day_of_week]}
              </span>
              <span className="text-gray-400">
                {availability.start_time.substring(0, 5)} -{' '}
                {availability.end_time.substring(0, 5)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dates bloquées */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-red-400" />
          Dates bloquées
        </h2>

        <div className="flex gap-3 mb-4">
          <Input
            type="date"
            value={newBlockedDate}
            onChange={(e) => setNewBlockedDate(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddBlockedDate}>Bloquer</Button>
        </div>

        <div className="space-y-2">
          {blockedDates?.map((blocked) => (
            <div
              key={blocked.id}
              className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/30"
            >
              <span className="text-white">
                {new Date(blocked.blocked_date).toLocaleDateString('fr-FR')}
              </span>
              <button
                onClick={() => deleteBlockedDate.mutate(blocked.id)}
                className="text-red-400 hover:text-red-300"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Paramètres système */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-400" />
          Paramètres système
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Temps de battement (minutes)"
            type="number"
            value={settingsForm.buffer_time}
            onChange={(e) =>
              setSettingsForm({
                ...settingsForm,
                buffer_time: parseInt(e.target.value),
              })
            }
            min={0}
            max={60}
          />

          <Input
            label="Durée des créneaux (minutes)"
            type="number"
            value={settingsForm.slot_duration}
            onChange={(e) =>
              setSettingsForm({
                ...settingsForm,
                slot_duration: parseInt(e.target.value),
              })
            }
            min={15}
            max={240}
          />

          <Input
            label="Réservation max (jours)"
            type="number"
            value={settingsForm.max_advance_days}
            onChange={(e) =>
              setSettingsForm({
                ...settingsForm,
                max_advance_days: parseInt(e.target.value),
              })
            }
            min={1}
            max={365}
          />

          <Input
            label="Délai minimum (heures)"
            type="number"
            value={settingsForm.min_advance_hours}
            onChange={(e) =>
              setSettingsForm({
                ...settingsForm,
                min_advance_hours: parseInt(e.target.value),
              })
            }
            min={1}
            max={168}
          />
        </div>

        <Button
          onClick={handleSaveSettings}
          className="mt-4 flex items-center gap-2"
          disabled={updateSettings.isPending}
        >
          <Save className="w-5 h-5" />
          {updateSettings.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  );
};

export default AvailabilitySettings;
