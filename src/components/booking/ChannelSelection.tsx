/**
 * Component: ChannelSelection
 * Sélection du canal de communication
 */

import React from 'react';
import { Video, Phone, Users, MessageCircle, Check } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import { MeetingChannel, ChannelOption } from '../../types/booking.types';

const CHANNEL_OPTIONS: ChannelOption[] = [
  {
    value: 'zoom',
    label: 'Zoom',
    icon: 'video',
    description: 'Visioconférence via Zoom',
  },
  {
    value: 'google_meet',
    label: 'Google Meet',
    icon: 'video',
    description: 'Visioconférence Google Meet',
  },
  {
    value: 'microsoft_teams',
    label: 'Microsoft Teams',
    icon: 'users',
    description: 'Réunion Microsoft Teams',
  },
  {
    value: 'whatsapp_video',
    label: 'WhatsApp Video',
    icon: 'message',
    description: 'Appel vidéo WhatsApp',
  },
  {
    value: 'phone',
    label: 'Téléphone',
    icon: 'phone',
    description: 'Appel téléphonique classique',
  },
];

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'video':
      return Video;
    case 'phone':
      return Phone;
    case 'users':
      return Users;
    case 'message':
      return MessageCircle;
    default:
      return Video;
  }
};

interface ChannelSelectionProps {
  selectedChannel: MeetingChannel | null;
  onSelect: (channel: MeetingChannel) => void;
}

const ChannelSelection: React.FC<ChannelSelectionProps> = ({
  selectedChannel,
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Canal de communication *
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHANNEL_OPTIONS.map((option) => {
          const IconComponent = getIcon(option.icon);
          const isSelected = selectedChannel === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-500/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-white/10'
              }`}
            >
              {/* Checkmark si sélectionné */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-transform ${
                  isSelected ? 'scale-110' : ''
                }`}
                style={{
                  backgroundColor: isSelected ? '#06b6d420' : '#ffffff10',
                }}
              >
                <IconComponent
                  className={`w-6 h-6 ${
                    isSelected ? 'text-cyan-400' : 'text-gray-400'
                  }`}
                />
              </div>

              {/* Label */}
              <h4
                className={`font-semibold mb-1 ${
                  isSelected ? 'text-cyan-400' : 'text-white'
                }`}
              >
                {option.label}
              </h4>

              {/* Description */}
              <p className="text-sm text-gray-400">{option.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChannelSelection;
