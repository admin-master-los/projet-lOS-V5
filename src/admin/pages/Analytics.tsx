/**
 * Page: Analytics
 * Dashboard complet des statistiques
 */

import React, { useState } from 'react';
import {
  Calendar,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Award,
} from 'lucide-react';
import MetricCard from '../components/analytics/MetricCard';
import ChartCard from '../components/analytics/ChartCard';
import StatusBadge from '../components/analytics/StatusBadge';
import SimpleBarChart from '../components/analytics/SimpleBarChart';
import SimplePieChart from '../components/analytics/SimplePieChart';
import SimpleLineChart from '../components/analytics/SimpleLineChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import ExportButton from '../components/common/ExportButton';
import { useAllMeetings } from '../hooks/useMeetings';
import {
  useAnalyticsOverview,
  useMeetingsByStatus,
  useMeetingsByService,
  useMeetingsByChannel,
  useMeetingsByDay,
  useMeetingsByHour,
  useMeetingsByMonth,
  useTopClients,
} from '../hooks/useAnalytics';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<30 | 60 | 90>(30);

  const { data: meetings } = useAllMeetings();
  const { data: overview, isLoading: loadingOverview } = useAnalyticsOverview();
  const { data: byStatus, isLoading: loadingStatus } = useMeetingsByStatus();
  const { data: byService, isLoading: loadingService } = useMeetingsByService();
  const { data: byChannel, isLoading: loadingChannel } = useMeetingsByChannel();
  const { data: byDay, isLoading: loadingDay } = useMeetingsByDay(timeRange);
  const { data: byHour, isLoading: loadingHour } = useMeetingsByHour();
  const { data: byMonth, isLoading: loadingMonth } = useMeetingsByMonth();
  const { data: topClients, isLoading: loadingClients } = useTopClients(5);

  if (loadingOverview) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  // Préparer données pour graphiques
  const channelColors: Record<string, string> = {
    zoom: '#06b6d4',
    'google-meet': '#10b981',
    'microsoft-teams': '#8b5cf6',
    'whatsapp-video': '#22c55e',
    phone: '#f59e0b',
  };

  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    confirmed: '#10b981',
    completed: '#06b6d4',
    cancelled: '#ef4444',
    no_show: '#6b7280',
  };

  const channelData = byChannel?.map(item => ({
    label: item.channel,
    value: item.count,
    color: channelColors[item.channel] || '#6b7280',
  })) || [];

  const serviceData = byService?.map(item => ({
    label: item.service_name,
    value: item.count,
    color: item.color,
  })) || [];

  const statusData = byStatus?.map(item => ({
    label: item.status,
    value: item.count,
    color: statusColors[item.status] || '#6b7280',
  })) || [];

  const hourData = byHour?.map(item => ({
    label: item.hour,
    value: item.count,
    color: '#06b6d4',
  })) || [];

  const dayData = byDay?.map(item => ({
    label: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    value: item.count,
  })) || [];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            Analytics
          </h1>
          <p className="text-gray-400 mt-1">
            Vue d'ensemble complète de vos rendez-vous
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            {[30, 60, 90].map(days => (
              <button
                key={days}
                onClick={() => setTimeRange(days as 30 | 60 | 90)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === days
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {days}j
              </button>
          ))}
          </div>

          <ExportButton
            data={meetings || []}
            filename={`analytics-${new Date().toISOString().split('T')[0]}`}
            title="Analytics - Rendez-vous"
            disabled={!meetings || meetings.length === 0}
          />
        </div>
      </div>

      {/* Metrics principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Rendez-vous"
          value={overview?.totalMeetings || 0}
          icon={<Calendar className="w-6 h-6" />}
          color="#06b6d4"
          subtitle="Tous les temps"
        />
        <MetricCard
          title="Ce mois-ci"
          value={overview?.totalThisMonth || 0}
          change={overview?.growthRate}
          icon={<TrendingUp className="w-6 h-6" />}
          color="#10b981"
          subtitle={`${overview?.totalLastMonth || 0} le mois dernier`}
        />
        <MetricCard
          title="Taux de conversion"
          value={`${overview?.conversionRate || 0}%`}
          icon={<Users className="w-6 h-6" />}
          color="#8b5cf6"
          subtitle={`${overview?.confirmedMeetings || 0} confirmés`}
        />
        <MetricCard
          title="Durée moyenne"
          value={`${overview?.averageDuration || 0} min`}
          icon={<Clock className="w-6 h-6" />}
          color="#f59e0b"
          subtitle="Par rendez-vous"
        />
      </div>

      {/* Statuts */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Répartition par statut
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatusBadge status="pending" count={overview?.pendingMeetings || 0} />
          <StatusBadge status="confirmed" count={overview?.confirmedMeetings || 0} />
          <StatusBadge status="completed" count={overview?.completedMeetings || 0} />
          <StatusBadge status="cancelled" count={overview?.cancelledMeetings || 0} />
          <StatusBadge status="no_show" count={0} />
        </div>
      </div>

      {/* Évolution temporelle */}
      <ChartCard
        title="Évolution des rendez-vous"
        subtitle={`${timeRange} derniers jours`}
      >
        {loadingDay ? (
          <LoadingSpinner />
        ) : (
          <SimpleLineChart data={dayData} color="#06b6d4" />
        )}
      </ChartCard>

      {/* Graphiques 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Par service */}
        <ChartCard title="Par service" subtitle="Répartition des rendez-vous">
          {loadingService ? (
            <LoadingSpinner />
          ) : (
            <SimplePieChart data={serviceData} />
          )}
        </ChartCard>

        {/* Par canal */}
        <ChartCard title="Par canal de communication" subtitle="Préférences clients">
          {loadingChannel ? (
            <LoadingSpinner />
          ) : (
            <SimpleBarChart data={channelData} />
          )}
        </ChartCard>
      </div>

      {/* Autres graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Par heure */}
        <ChartCard title="Heures de pointe" subtitle="Rendez-vous par heure">
          {loadingHour ? (
            <LoadingSpinner />
          ) : (
            <SimpleBarChart data={hourData} />
          )}
        </ChartCard>

        {/* Top clients */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Top Clients
            </h3>
            <p className="text-sm text-gray-400 mt-1">Clients les plus actifs</p>
          </div>
          {loadingClients ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-3">
              {topClients?.map((client, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">{client.client_name}</div>
                      <div className="text-xs text-gray-400">{client.client_email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-400 font-bold">{client.count}</div>
                    <div className="text-xs text-gray-400">RDV</div>
                  </div>
                </div>
              ))}
              {(!topClients || topClients.length === 0) && (
                <div className="text-center text-gray-400 py-8">
                  Aucun client pour le moment
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tendance mensuelle */}
      {!loadingMonth && byMonth && byMonth.length > 0 && (
        <ChartCard title="Tendance annuelle" subtitle="12 derniers mois">
          <SimpleLineChart
            data={byMonth.map(m => ({
              label: m.month,
              value: m.count,
            }))}
            color="#8b5cf6"
          />
        </ChartCard>
      )}
    </div>
  );
};

export default Analytics;
