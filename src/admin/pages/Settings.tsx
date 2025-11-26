import React, { useState } from 'react';
import { Users, Settings as SettingsIcon, Activity, Shield } from 'lucide-react';
import UsersTab from '../components/settings/UsersTab';
import SystemSettingsTab from '../components/settings/SystemSettingsTab';
import ActivityLogsTab from '../components/settings/ActivityLogsTab';

type TabType = 'users' | 'system' | 'activity' | 'security';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');

  const tabs = [
    { id: 'users' as TabType, label: 'Utilisateurs', icon: Users },
    { id: 'system' as TabType, label: 'Système', icon: SettingsIcon },
    { id: 'activity' as TabType, label: 'Activité', icon: Activity },
    { id: 'security' as TabType, label: 'Sécurité', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-gray-400 mt-1">Configuration système et gestion des utilisateurs</p>
      </div>

      <div className="border-b border-gray-700/50">
        <div className="flex gap-2 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'system' && <SystemSettingsTab />}
        {activeTab === 'activity' && <ActivityLogsTab />}
        {activeTab === 'security' && (
          <div className="bg-white/5 border border-gray-700/50 rounded-xl p-8 text-center">
            <Shield size={48} className="mx-auto mb-4 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white mb-2">Sécurité</h3>
            <p className="text-gray-400 mb-4">Paramètres de sécurité et authentification</p>
            <p className="text-sm text-gray-500">Composant SecurityTab à implémenter (optionnel)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
