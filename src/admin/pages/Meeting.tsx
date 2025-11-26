/**
 * Page Admin: Meeting Management
 * Dashboard complet de gestion des rendez-vous
 */

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Settings as SettingsIcon,
  List,
  BarChart3,
} from 'lucide-react';
import { useMeetingsStats, useUpcomingMeetings } from '../hooks/useMeetings';
import { useActiveServices } from '../hooks/useMeetingServices';
import MeetingsList from '../components/meetings/MeetingsList';
import MeetingsCalendar from '../components/meetings/MeetingsCalendar';
import ServicesManagement from '../components/meetings/ServicesManagement';
import AvailabilitySettings from '../components/meetings/AvailabilitySettings';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

type TabType = 'dashboard' | 'list' | 'calendar' | 'services' | 'settings';

const Meeting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const { data: stats, isLoading: statsLoading } = useMeetingsStats();
  const { data: upcomingMeetings, isLoading: upcomingLoading } = useUpcomingMeetings(5);
  const { data: services } = useActiveServices();

  // Tabs configuration
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'list' as TabType, label: 'Liste', icon: List },
    { id: 'calendar' as TabType, label: 'Calendrier', icon: Calendar },
    { id: 'services' as TabType, label: 'Services', icon: Users },
    { id: 'settings' as TabType, label: 'Configuration', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-2">
          Gestion des Rendez-vous
        </h1>
        <p className="text-gray-400">
          Gérez vos consultations et configurez votre système de réservation
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-8 border-b border-white/10">
        <nav className="flex space-x-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsLoading ? (
                <div className="col-span-full">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  <StatCard
                    title="Total"
                    value={stats?.total || 0}
                    icon={Calendar}
                    color="from-blue-500 to-cyan-500"
                  />
                  <StatCard
                    title="En attente"
                    value={stats?.pending || 0}
                    icon={Clock}
                    color="from-yellow-500 to-orange-500"
                  />
                  <StatCard
                    title="Confirmés"
                    value={stats?.confirmed || 0}
                    icon={CheckCircle}
                    color="from-green-500 to-emerald-500"
                  />
                  <StatCard
                    title="Complétés"
                    value={stats?.completed || 0}
                    icon={TrendingUp}
                    color="from-purple-500 to-pink-500"
                  />
                </>
              )}
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Annulés</p>
                    <p className="text-2xl font-bold text-white">{stats?.cancelled || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-gray-500/20 to-gray-600/20">
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Absences</p>
                    <p className="text-2xl font-bold text-white">{stats?.no_show || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Meetings */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-cyan-400" />
                Rendez-vous à venir
              </h2>

              {upcomingLoading ? (
                <LoadingSpinner />
              ) : upcomingMeetings && upcomingMeetings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingMeetings.map((meeting) => (
                    <UpcomingMeetingCard key={meeting.id} meeting={meeting} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  Aucun rendez-vous à venir
                </p>
              )}
            </div>

            {/* Active Services */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-400" />
                Services actifs
              </h2>

              {services && services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">Aucun service actif</p>
              )}
            </div>
          </div>
        )}

        {/* List Tab */}
        {activeTab === 'list' && <MeetingsList />}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && <MeetingsCalendar />}

        {/* Services Tab */}
        {activeTab === 'services' && <ServicesManagement />}

        {/* Settings Tab */}
        {activeTab === 'settings' && <AvailabilitySettings />}
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color} bg-opacity-20`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
};

interface UpcomingMeetingCardProps {
  meeting: any;
}

const UpcomingMeetingCard: React.FC<UpcomingMeetingCardProps> = ({ meeting }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'confirmed':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmé';
      default:
        return status;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <div className="text-center min-w-[50px]">
          <p className="text-2xl font-bold text-white">
            {new Date(meeting.meeting_date).getDate()}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(meeting.meeting_date).toLocaleDateString('fr-FR', { month: 'short' })}
          </p>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{meeting.client_name}</p>
          <p className="text-sm text-gray-400 truncate">
            {meeting.meeting_services?.name || 'Service non défini'}
          </p>
        </div>
      </div>

      <div className="text-right ml-4">
        <p className="text-white font-medium whitespace-nowrap">
          {meeting.meeting_time.substring(0, 5)}
        </p>
        <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusColor(meeting.status)}`}>
          {getStatusLabel(meeting.status)}
        </span>
      </div>
    </div>
  );
};

interface ServiceCardProps {
  service: any;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div
      className="p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
      style={{ borderColor: service.color + '40' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: service.color + '20' }}
        >
          <Clock className="w-5 h-5" style={{ color: service.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">{service.name}</p>
          <p className="text-xs text-gray-400">{service.duration} min</p>
        </div>
      </div>
    </div>
  );
};

export default Meeting;
